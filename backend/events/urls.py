from django.urls import path, include
from rest_framework import routers
from . import views
from rest_framework.routers import DefaultRouter

# Router URLs are already included in the main urls.py
# Don't include router URLs here to avoid duplicates
router = DefaultRouter()
router.register(r'events', views.EventViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'states', views.StateViewSet)
router.register(r'cities', views.CityViewSet, basename='city')

# Only include non-router URL patterns
urlpatterns = [
    # Remove the router.urls include to avoid duplication
    # path('', include(router.urls)),
    path('user/profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('user/orders/', views.UserOrdersView.as_view(), name='user-orders'),
    path('user/tickets/', views.UserTicketsView.as_view(), name='user-tickets'),
    path('hero-section/', views.hero_section, name='hero-section'),
    path('advertisement-section/', views.advertisement_section, name='advertisement-section'),
    path('attendee/check-in/', views.AttendeeCheckInView.as_view(), name='attendee-check-in'),
    path('events/<int:event_id>/attendees/', views.EventAttendeesView.as_view(), name='event-attendees'),
]
