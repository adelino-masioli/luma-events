from django.contrib import admin
from .models import State, City, Category, Profile, Organizer, Event, Ticket, Order, Attendee, Payout, PlatformFee, HeroSection, AdvertisementSection
from django import forms
from django.utils.html import format_html
from django.urls import reverse
# Let Django handle the language activation based on settings.py
# and user preferences instead of forcing a specific language

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
    
    def get_model_perms(self, request):
        perms = super().get_model_perms(request)
        return perms
    
    # The translations are already defined in the model's Meta class

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'state', 'city_id')
    list_filter = ('state',)
    search_fields = ('name', 'state__name')
    ordering = ('state', 'name')
    
    # The translations are already defined in the model's Meta class

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)
    
    # The translations are already defined in the model's Meta class

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    form = ProfileAdminForm
    list_display = ('user', 'city', 'state', 'cpf', 'created_at', 'updated_at')
    list_filter = ('city__state', 'created_at')
    search_fields = ('user__username', 'user__email', 'cpf')
    ordering = ('-created_at',)
    
    # The translations are already defined in the model's Meta class

@admin.register(Organizer)
class OrganizerAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'user', 'cnpj', 'created_at')
    search_fields = ('company_name', 'cnpj', 'user__username')
    ordering = ('-created_at',)
    
    # The translations are already defined in the model's Meta class

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    form = EventAdminForm
    list_display = ('thumbnail_preview_list', 'title_link', 'organizer', 'category', 'date', 'state', 'city', 'price')
    list_filter = ('category', 'city__state', 'date')
    search_fields = ('title', 'description', 'organizer__company_name')
    ordering = ('-date',)
    readonly_fields = ('thumbnail_preview', 'banner_preview')
    
    def title_link(self, obj):
        # Gera o link para editar o objeto Event
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html('<a href="{}">{}</a>', edit_url, obj.title)
    
    title_link.admin_order_field = 'title'  # Adicione esta linha
    title_link.short_description = 'Título'  # Define o nome do campo na listagem
    
    def thumbnail_preview_list(self, obj):
        if obj.thumbnail:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.thumbnail.url)
        return "-"

    def thumbnail_preview(self, obj):
        if obj.thumbnail:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover;" />', obj.thumbnail.url)
        return "-"
   
    def banner_preview(self, obj):
        if obj.banner:
            return format_html('<img src="{}" width="300" height="100" style="object-fit: cover;" />', obj.banner.url)
        return "-"
    
    thumbnail_preview_list.short_description = 'Miniatura'
    
    # For list display
    thumbnail_preview.short_description = 'Visualização da miniatura'
    # For detail view
    thumbnail_preview.admin_order_field = 'thumbnail'
    
    # For banner preview
    banner_preview.short_description = 'Visualização do banner'
    
    # The translations are already defined in the model's Meta class

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('event', 'price', 'quantity_available', 'created_at')
    list_filter = ('event__category', 'created_at')
    search_fields = ('event__title',)
    ordering = ('-created_at',)
    
    # The translations are already defined in the model's Meta class

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'platform_fee', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'user__email')
    ordering = ('-created_at',)
    
    # The translations are already defined in the model's Meta class

@admin.register(Attendee)
class AttendeeAdmin(admin.ModelAdmin):
    list_display = ('user', 'ticket', 'order', 'checked_in', 'check_in_time', 'created_at')
    list_filter = ('ticket__event__category', 'checked_in', 'created_at')
    search_fields = ('user__username', 'ticket__event__title')
    ordering = ('-created_at',)
    
    # The translations are already defined in the model's Meta class

@admin.register(Payout)
class PayoutAdmin(admin.ModelAdmin):
    list_display = ('organizer', 'amount', 'status', 'processed_at', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('organizer__company_name', 'stripe_payout_id')
    ordering = ('-created_at',)
    
    # The translations are already defined in the model's Meta class

@admin.register(PlatformFee)
class PlatformFeeAdmin(admin.ModelAdmin):
    list_display = ('order', 'percentage', 'fixed_amount', 'total_fee')
    search_fields = ('order__user__username',)
    ordering = ('-order__created_at',)
    
    # The translations are already defined in the model's Meta class

@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'created_at', 'updated_at']
    list_filter = ['is_active']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'is_active')
        }),
        ('Botões', {
            'fields': (
                'primary_button_text', 'primary_button_link',
                'secondary_button_text', 'secondary_button_link'
            )
        }),
        ('Imagem', {
            'fields': ('image',)
        }),
        ('Informações', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

    def save_model(self, request, obj, form, change):
        if obj.is_active:
            # Desativa todos os outros banners
            HeroSection.objects.exclude(pk=obj.pk).update(is_active=False)
        super().save_model(request, obj, form, change)

@admin.register(AdvertisementSection)
class AdvertisementSectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'created_at', 'updated_at')
    list_filter = ('is_active',)
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'is_active')
        }),
        ('Button', {
            'fields': ('button_text', 'button_link')
        }),
        ('Image', {
            'fields': ('image',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

    def save_model(self, request, obj, form, change):
        if obj.is_active:
            # Ensure only one section is active at a time
            AdvertisementSection.objects.exclude(pk=obj.pk).update(is_active=False)
        super().save_model(request, obj, form, change)
