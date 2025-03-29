from rest_framework import serializers
from .models import HeroSection, AdvertisementSection
from django.conf import settings

class HeroSectionSerializer(serializers.ModelSerializer):
    primaryButton = serializers.SerializerMethodField()
    secondaryButton = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = HeroSection
        fields = ['title', 'description', 'primaryButton', 'secondaryButton', 'image']

    def get_primaryButton(self, obj):
        return {
            'text': obj.primary_button_text,
            'link': obj.primary_button_link
        }

    def get_secondaryButton(self, obj):
        return {
            'text': obj.secondary_button_text,
            'link': obj.secondary_button_link
        }

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            image_url = obj.image.url
            if request is not None:
                image_url = request.build_absolute_uri(image_url)
            return {
                'url': image_url,
                'alt': obj.title
            }
        # Return default image
        default_image_url = f"{settings.STATIC_URL}images/hero-default.jpg"
        if request is not None:
            default_image_url = request.build_absolute_uri(default_image_url)
        return {
            'url': default_image_url,
            'alt': 'Eventos em destaque'
        }

    def to_representation(self, instance):
        return {
            'title': instance.title,
            'description': instance.description,
            'primaryButton': self.get_primaryButton(instance),
            'secondaryButton': self.get_secondaryButton(instance),
            'image': self.get_image(instance)
        }

class AdvertisementSectionSerializer(serializers.ModelSerializer):
    button = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = AdvertisementSection
        fields = ['title', 'description', 'button', 'image']

    def get_button(self, obj):
        return {
            'text': obj.button_text,
            'link': obj.button_link
        }

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            image_url = obj.image.url
            if request is not None:
                image_url = request.build_absolute_uri(image_url)
            return {
                'url': image_url,
                'alt': obj.title
            }
        # Return default image
        default_image_url = f"{settings.STATIC_URL}images/advertisement-default.jpg"
        if request is not None:
            default_image_url = request.build_absolute_uri(default_image_url)
        return {
            'url': default_image_url,
            'alt': 'Anúncio em destaque'
        }

    def to_representation(self, instance):
        return {
            'title': instance.title,
            'description': instance.description,
            'button': self.get_button(instance),
            'image': self.get_image(instance)
        } 