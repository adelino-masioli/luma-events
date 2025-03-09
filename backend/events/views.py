from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from .models import Event, Category, City
from rest_framework import serializers
from django.http import JsonResponse


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'category', 'date', 'location', 'price']

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
