from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from .models import Event, Category, City, Order, Profile, State, Ticket, HeroSection, AdvertisementSection
from rest_framework import serializers
from django.http import JsonResponse
from .serializers import HeroSectionSerializer, AdvertisementSectionSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.serializers import Serializer, CharField

from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view



class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['id', 'name', 'description', 'price', 'quantity_available']

class EventSerializer(serializers.ModelSerializer):
    city = serializers.StringRelatedField()
    state = serializers.StringRelatedField()
    category = serializers.StringRelatedField()
    organizer = serializers.StringRelatedField(source='organizer.company_name')
    tickets = TicketSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'title', 'slug', 'description', 'state', 'city', 'thumbnail', 'category', 'date', 'location', 'price', 'organizer', 'tickets']

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

# View to handle AJAX request for filtering cities by state
def get_cities_by_state(request):
    state_id = request.GET.get('state')

    if state_id:
        cities = City.objects.filter(state_id=state_id).order_by('name')
        data = list(cities.values("id", "name"))  # Converte QuerySet para lista de dicionários
        return JsonResponse(data, safe=False)

    return JsonResponse([], safe=False)

# Custom Login Serializer
class LoginSerializer(Serializer):
    username = CharField()
    password = CharField()

# View for Login
class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


# Serializer user
class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['id', 'name', 'uf']

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'state']

class ProfileSerializer(serializers.ModelSerializer):
    state = StateSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    state_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    city_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    cpf = serializers.CharField(read_only=True)

    def validate(self, data):
        state_id = data.get('state_id')
        city_id = data.get('city_id')

        if state_id is not None:
            try:
                state = State.objects.get(id=state_id)
                data['state'] = state
            except State.DoesNotExist:
                raise serializers.ValidationError({'state': 'Estado inválido.'})

        if city_id is not None:
            try:
                city = City.objects.get(id=city_id)
                if state_id and city.state_id != state_id:
                    raise serializers.ValidationError({'city': 'Cidade não pertence ao estado selecionado.'})
                data['city'] = city
            except City.DoesNotExist:
                raise serializers.ValidationError({'city': 'Cidade inválida.'})

        return data

    class Meta:
        model = Profile
        fields = ['cpf', 'state', 'city', 'state_id', 'city_id']

class UserProfileSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    profile = ProfileSerializer()

    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]

    def update(self, instance, validated_data):
        try:
            profile_data = validated_data.pop('profile', {})
            
            # Update User fields
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            # Update Profile
            profile = instance.profile
            if profile_data:
                # Validate profile data using ProfileSerializer
                profile_serializer = ProfileSerializer(profile, data=profile_data, partial=True)
                if profile_serializer.is_valid(raise_exception=True):
                    profile_serializer.save()

            return instance
        except serializers.ValidationError:
            raise
        except Exception as e:
            raise serializers.ValidationError({'detail': str(e)})

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'groups', 'profile']

class StateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = State.objects.all().order_by('name')
    serializer_class = StateSerializer
    permission_classes = [permissions.AllowAny]

class CityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CitySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = City.objects.all().order_by('name')
        state = self.request.query_params.get('state', None)
        if state is not None:
            queryset = queryset.filter(state_id=state)
        return queryset

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can access

    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user, context={'request': request})
        return Response(serializer.data)
    
    def patch(self, request):
        user = request.user
        serializer = UserProfileSerializer(user, data=request.data, context={'request': request}, partial=True)

        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data)
            except Exception as e:
                return Response(
                    {'detail': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class OrderSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title')
    event_date = serializers.DateTimeField(source='event.date')

    class Meta:
        model = Order
        fields = ['id', 'event_title', 'event_date', 'total_price', 'platform_fee', 'status']

class UserOrdersView(APIView):
    permission_classes = [IsAuthenticated]  # Apenas usuários autenticados podem acessar

    def get(self, request):
        # Obtém as ordens do usuário logado
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def hero_section(request):
    try:
        hero = HeroSection.objects.filter(is_active=True).first()
        if hero:
            serializer = HeroSectionSerializer(hero, context={'request': request})
            return Response(serializer.data)
        else:
            # Return default data if no active hero section exists
            default_data = {
                "title": "Descubra Eventos Incríveis",
                "description": "Explore {categories} categorias diferentes de eventos em {cities} cidades por todo o Brasil. Encontre o evento perfeito para você!",
                "primaryButton": {
                    "text": "Explorar Eventos",
                    "link": "/eventos"
                },
                "secondaryButton": {
                    "text": "Criar Evento",
                    "link": "/eventos/criar"
                },
                "image": {
                    "url": request.build_absolute_uri(f"/static/images/placeholder.png"),
                    "alt": "Eventos em destaque"
                }
            }
            return Response(default_data)
    except Exception as e:
        print(f"Error fetching hero section: {str(e)}")
        return Response({
            "error": "Failed to fetch hero section"
        }, status=500)

@api_view(['GET'])
def advertisement_section(request):
    try:
        advertisement = AdvertisementSection.objects.filter(is_active=True).first()
        if advertisement:
            serializer = AdvertisementSectionSerializer(advertisement, context={'request': request})
            return Response(serializer.data)
        else:
            # Return default data if no active advertisement section exists
            default_data = {
                "title": "Crie Seu Próprio Evento",
                "description": "Organize eventos incríveis e alcance um público maior. Nossa plataforma oferece todas as ferramentas necessárias para o sucesso do seu evento.",
                "button": {
                    "text": "Começar Agora",
                    "link": "/eventos/criar"
                },
                "image": {
                    "url": request.build_absolute_uri(f"/static/images/placeholder.png"),
                    "alt": "Crie seu evento"
                }
            }
            return Response(default_data)
    except Exception as e:
        print(f"Error fetching advertisement section: {str(e)}")
        return Response({
            "error": "Failed to fetch advertisement section"
        }, status=500)
