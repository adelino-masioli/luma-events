"""
URL configuration for eventapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from events.views import (
    EventViewSet, CategoryViewSet, get_cities_by_state, 
    UserProfileView, UserOrdersView, StateViewSet, hero_section,
    advertisement_section, EventAttendeesView, AttendeeCheckInView, UserTicketsView
)
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import RedirectView
from rest_framework_simplejwt.views import TokenObtainPairView



router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'states', StateViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('favicon.ico', RedirectView.as_view(url='/static/favicon.ico')),
    path('api/', include(router.urls)),
    path('api/login/', TokenObtainPairView.as_view(), name='login'),
    path('api/user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/user/orders/', UserOrdersView.as_view(), name='user-orders'),
    path('api/user/tickets/', UserTicketsView.as_view(), name='user-tickets'),
    path('api/cities/', get_cities_by_state, name='get_cities_by_state'),
    path('api/payments/', include('payments.urls')),
    path('api/hero-section/', hero_section, name='hero-section'),
    path('api/advertisement-section/', advertisement_section, name='advertisement-section'),
    path('api/attendee/check-in/', AttendeeCheckInView.as_view(), name='attendee-check-in'),
    path('api/events/<int:event_id>/attendees/', EventAttendeesView.as_view(), name='event-attendees'),
]

# Serve static and media files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
