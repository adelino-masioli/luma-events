from django.contrib import admin
from .models import State, City, Category, Profile, Organizer, Event, Ticket, Order, Payment, Attendee, Payout, PlatformFee
from django import forms

# Custom form for Profile with dynamic city filtering
class ProfileAdminForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = '__all__'

    class Media:
        js = (
            '//ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js',  # jQuery from CDN
            'admin/js/dynamic_cities.js',
        )

# Custom form for Event with dynamic city filtering
class EventAdminForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = '__all__'

    class Media:
        js = (
            '//ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js',  # jQuery from CDN
            'admin/js/dynamic_cities.js',
        )

@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ('name', 'uf')
    search_fields = ('name', 'uf')
    ordering = ('name',)

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'state', 'city_id')
    list_filter = ('state',)
    search_fields = ('name', 'state__name')
    ordering = ('state', 'name')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    form = ProfileAdminForm
    list_display = ('user', 'city', 'state', 'cpf', 'created_at', 'updated_at')
    list_filter = ('city__state', 'created_at')
    search_fields = ('user__username', 'user__email', 'cpf')
    ordering = ('-created_at',)

@admin.register(Organizer)
class OrganizerAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'user', 'cnpj', 'created_at')
    search_fields = ('company_name', 'cnpj', 'user__username')
    ordering = ('-created_at',)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    form = EventAdminForm
    list_display = ('title', 'organizer', 'category', 'date', 'state', 'city', 'price')
    list_filter = ('category', 'city__state', 'date')
    search_fields = ('title', 'description', 'organizer__company_name')
    ordering = ('-date',)

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('event', 'price', 'quantity_available', 'created_at')
    list_filter = ('event__category', 'created_at')
    search_fields = ('event__title',)
    ordering = ('-created_at',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'platform_fee', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'user__email')
    ordering = ('-created_at',)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('order', 'amount', 'payment_method', 'payment_status', 'created_at')
    list_filter = ('payment_method', 'payment_status', 'created_at')
    search_fields = ('order__user__username', 'stripe_payment_id')
    ordering = ('-created_at',)

@admin.register(Attendee)
class AttendeeAdmin(admin.ModelAdmin):
    list_display = ('user', 'ticket', 'order', 'created_at')
    list_filter = ('ticket__event__category', 'created_at')
    search_fields = ('user__username', 'ticket__event__title')
    ordering = ('-created_at',)

@admin.register(Payout)
class PayoutAdmin(admin.ModelAdmin):
    list_display = ('organizer', 'amount', 'status', 'processed_at', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('organizer__company_name', 'stripe_payout_id')
    ordering = ('-created_at',)

@admin.register(PlatformFee)
class PlatformFeeAdmin(admin.ModelAdmin):
    list_display = ('order', 'percentage', 'fixed_amount', 'total_fee')
    search_fields = ('order__user__username',)
    ordering = ('-order__created_at',)
