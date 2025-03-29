from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('events', views.EventViewSet, basename='event')
router.register('categories', views.CategoryViewSet, basename='category')
router.register('states', views.StateViewSet, basename='state')
router.register('cities', views.CityViewSet, basename='city')

urlpatterns = [
    path('', include(router.urls)),
    path('user/profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('user/orders/', views.UserOrdersView.as_view(), name='user-orders'),
    path('hero-section/', views.hero_section, name='hero-section'),
]
