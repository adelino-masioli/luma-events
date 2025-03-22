import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from events.models import Order, Event, Ticket, Attendee
from decimal import Decimal
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db import transaction

# Configure logging
logger = logging.getLogger(__name__)

# Create your views here.
stripe.api_key = settings.STRIPE_SECRET_KEY

class CreatePaymentIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            logger.info(f"Received payment request with data: {data}")
            
            # Validate items data
            if not data.get('items'):
                raise ValueError("No items provided")

            # Calculate total amount from cart items including platform fee
            amount = Decimal('0')
            for item in data['items']:
                price = Decimal(str(item['price']))
                quantity = Decimal(str(item['quantity']))
                subtotal = price * quantity
                # Add 10% platform fee
                platform_fee = subtotal * Decimal('0.10')
                amount += subtotal + platform_fee
            
            # Create payment intent with total amount including platform fee
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Convert to cents
                currency='brl',
                metadata={'user_id': request.user.id}
            )
            logger.info(f"Created Stripe payment intent: {intent.id}")

            try:
                with transaction.atomic():
                    # Create or update orders for each event
                    for item in data['items']:
                        event = Event.objects.get(id=item['event_id'])
                        price = Decimal(str(item['price']))
                        quantity = Decimal(str(item['quantity']))
                        subtotal = price * quantity
                        platform_fee = subtotal * Decimal('0.10')
                        total_with_fee = subtotal + platform_fee
                        
                        # Create order
                        order = Order.objects.create(
                            user=request.user,
                            event=event,
                            total_price=total_with_fee,  # Total including platform fee
                            platform_fee=platform_fee,  # Store platform fee separately
                            status='pending'
                        )
                        
                        # Create payment record
                        payment = Payment.objects.create(
                            user=request.user,
                            order=order,
                            stripe_payment_intent_id=intent.id,
                            amount=total_with_fee,  # Total including platform fee
                            status='pending'
                        )
                        
                        # Create attendees
                        for _ in range(int(quantity)):
                            Attendee.objects.create(
                                user=request.user,
                                order=order,
                                ticket=event.tickets.first()  # Using the correct related_name
                            )
                        
                        logger.info(f"Created order {order.id} and payment {payment.id} for event {event.id}")

                return Response({
                    'clientSecret': intent.client_secret,
                    'payment_id': payment.id
                })

            except Exception as e:
                # If there's an error saving to database, cancel the payment intent
                logger.error(f"Error creating payment records: {str(e)}")
                stripe.PaymentIntent.cancel(intent.id)
                raise

        except Exception as e:
            logger.error(f"Payment creation error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

@method_decorator(csrf_exempt, name='dispatch')
class PaymentWebhookView(APIView):
    permission_classes = []  # No authentication required for webhooks

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        logger.info("Received Stripe webhook")
        logger.info(f"Request path: {request.path}")
        logger.info(f"Request method: {request.method}")
        logger.info(f"Request headers: {request.headers}")
        
        try:
            # Log the raw payload for debugging
            logger.debug(f"Webhook payload: {payload.decode('utf-8')}")
            logger.debug(f"Stripe signature: {sig_header}")
            
            if not sig_header:
                logger.error("No Stripe signature found in request headers")
                return Response(
                    {'error': 'No Stripe signature found'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
                )
            except stripe.error.SignatureVerificationError as e:
                logger.error(f"Invalid signature: {str(e)}")
                return Response(
                    {'error': 'Invalid signature'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                logger.error(f"Error constructing webhook event: {str(e)}")
                return Response(
                    {'error': 'Invalid payload'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            logger.info(f"Received webhook event: {event['type']}")
            logger.info(f"Event data: {event['data']}")
            
            # Handle the event
            if event['type'] == 'payment_intent.succeeded':
                payment_intent = event['data']['object']
                logger.info(f"Processing successful payment for intent: {payment_intent['id']}")
                
                try:
                    with transaction.atomic():
                        payment = Payment.objects.get(
                            stripe_payment_intent_id=payment_intent['id']
                        )
                        payment.status = 'completed'
                        payment.save()
                        
                        # Update order status
                        order = payment.order
                        order.status = 'paid'
                        order.save()
                        
                        logger.info(f"Payment {payment.id} and Order {order.id} marked as completed/paid")
                    
                except Payment.DoesNotExist:
                    logger.error(f"Payment not found for intent: {payment_intent['id']}")
                    return Response(
                        {'error': 'Payment not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                except Exception as e:
                    logger.error(f"Error updating payment status: {str(e)}")
                    return Response(
                        {'error': 'Error updating payment'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
                
            elif event['type'] == 'payment_intent.payment_failed':
                payment_intent = event['data']['object']
                logger.info(f"Processing failed payment for intent: {payment_intent['id']}")
                
                try:
                    with transaction.atomic():
                        payment = Payment.objects.get(
                            stripe_payment_intent_id=payment_intent['id']
                        )
                        payment.status = 'failed'
                        payment.save()
                        
                        # Update order status
                        order = payment.order
                        order.status = 'canceled'
                        order.save()
                        
                        logger.error(f"Payment {payment.id} and Order {order.id} marked as failed/canceled")
                    
                except Payment.DoesNotExist:
                    logger.error(f"Payment not found for intent: {payment_intent['id']}")
                    return Response(
                        {'error': 'Payment not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                except Exception as e:
                    logger.error(f"Error updating payment status: {str(e)}")
                    return Response(
                        {'error': 'Error updating payment'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

            return Response({'status': 'success'})

        except Exception as e:
            logger.error(f"Webhook error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
