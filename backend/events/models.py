from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from decimal import Decimal
from django.core.exceptions import ValidationError

# State Model
class State(models.Model):
    name = models.CharField(_('Name'), max_length=100)
    uf = models.CharField(_('UF'), max_length=2)
    
    class Meta:
        verbose_name = _('State')
        verbose_name_plural = _('States')

    def __str__(self):
        return self.name

# City Model
class City(models.Model):
    city_id = models.IntegerField(_('City ID'), null=True)
    name = models.CharField(_('Name'), max_length=100)
    state = models.ForeignKey(State, on_delete=models.CASCADE, verbose_name=_('State'))
    
    class Meta:
        verbose_name = _('City')
        verbose_name_plural = _('Cities')

    class Meta:
        indexes = [
            models.Index(fields=['city_id']),
            models.Index(fields=['state']),
        ]

    def __str__(self):
        return self.name

# Category Model
class Category(models.Model):
    name = models.CharField(_('Name'), max_length=100, unique=True)
    slug = models.SlugField(_('Slug'), max_length=120, unique=True, blank=True)
    
    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            # Ensure slug uniqueness
            original_slug = self.slug
            counter = 1
            while Category.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

# Profile Model (associado ao User)
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name=_('User'))
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True, verbose_name=_('State'))
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, verbose_name=_('City'))
    cpf = models.CharField(_('CPF'), max_length=11)
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Profile')
        verbose_name_plural = _('Profiles')
        constraints = [
            models.UniqueConstraint(
                fields=['cpf'],
                name='unique_cpf_if_not_null',
                condition=models.Q(cpf__isnull=False)
            )
        ]

    def __str__(self):
        return self.user.username

# Organizer Model
class Organizer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name=_('User'))
    company_name = models.CharField(_('Company name'), max_length=255)
    cnpj = models.CharField(_('CNPJ'), max_length=14, unique=True)
    slug = models.SlugField(_('Slug'), max_length=255, unique=True, blank=True)
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Organizer')
        verbose_name_plural = _('Organizers')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.company_name)
            # Ensure slug uniqueness
            original_slug = self.slug
            counter = 1
            while Organizer.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.company_name

# Event Model
class Event(models.Model):
    organizer = models.ForeignKey(Organizer, on_delete=models.CASCADE, verbose_name=_('Organizer'))
    title = models.CharField(_('Title'), max_length=255)
    slug = models.SlugField(_('Slug'), max_length=255, unique=True, blank=True)
    description = models.TextField(_('Description'))
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, verbose_name=_('Category'))
    date = models.DateTimeField(_('Date'))
    location = models.CharField(_('Location'), max_length=255)
    state = models.ForeignKey(State, on_delete=models.CASCADE, null=True, verbose_name=_('State'))
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True, verbose_name=_('City'))
    price = models.DecimalField(_('Price'), max_digits=10, decimal_places=2)
    thumbnail = models.ImageField(_('Thumbnail'), upload_to='events/thumbnails/', null=True, blank=True, help_text=_('Square image for event thumbnail'))
    banner = models.ImageField(_('Banner'), upload_to='events/banners/', null=True, blank=True, help_text=_('Landscape image for event banner'))
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Event')
        verbose_name_plural = _('Events')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            # Ensure slug uniqueness
            original_slug = self.slug
            counter = 1
            while Event.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

# Ticket Model
class Ticket(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, verbose_name=_('Event'), related_name='tickets')
    name = models.CharField(_('Name'), max_length=255, default='Ingresso Regular')
    description = models.TextField(_('Description'), blank=True, default='Entrada para o evento')
    price = models.DecimalField(_('Price'), max_digits=10, decimal_places=2)
    quantity_available = models.IntegerField(_('Quantity available'))
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Ticket')
        verbose_name_plural = _('Tickets')

    def __str__(self):
        return f"{self.event.title} - {self.price}"

# Order Model with Direct Event Association
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=_('User'))
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True, verbose_name=_('Event'))  # Direct association with Event
    total_price = models.DecimalField(_('Total price'), max_digits=10, decimal_places=2, default=0.00)
    platform_fee = models.DecimalField(_('Platform fee'), max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(_('Status'), max_length=20, choices=[
        ('pending', _('Pending')),
        ('paid', _('Paid')),
        ('canceled', _('Canceled')),
        ('refunded', _('Refunded'))
    ])
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Order')
        verbose_name_plural = _('Orders')

    def __str__(self):
        return f"Order {self.id}"

    def update_order_total(self):
        # Calculate the total price based on the associated event's tickets
        total = sum(attendee.ticket.price for attendee in self.attendees.all())
        self.total_price = total
        self.save()

    def update_platform_fee(self):
        # Setting a platform fee of 10% of the total price
        self.platform_fee = self.total_price * Decimal('0.10')
        self.save()

    def calculate_order(self):
        self.update_order_total()
        self.update_platform_fee()

# Attendee Model
class Attendee(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=_('User'))
    order = models.ForeignKey(Order, on_delete=models.CASCADE, verbose_name=_('Order'))
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, verbose_name=_('Ticket'))
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Attendee')
        verbose_name_plural = _('Attendees')

    def __str__(self):
        return f"{self.user.username} - {self.ticket.event.title}"

# Payout Model
class Payout(models.Model):
    organizer = models.ForeignKey(Organizer, on_delete=models.CASCADE, verbose_name=_('Organizer'))
    amount = models.DecimalField(_('Amount'), max_digits=10, decimal_places=2)
    stripe_payout_id = models.CharField(_('Stripe payout ID'), max_length=255)
    status = models.CharField(_('Status'), max_length=20, choices=[
        ('pending', _('Pending')),
        ('processing', _('Processing')),
        ('completed', _('Completed')),
        ('failed', _('Failed'))
    ])
    processed_at = models.DateTimeField(_('Processed at'), null=True, blank=True)
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Payout')
        verbose_name_plural = _('Payouts')

    def __str__(self):
        return f"Payout {self.id}"

# PlatformFee Model
class PlatformFee(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, verbose_name=_('Order'))
    percentage = models.DecimalField(_('Percentage'), max_digits=5, decimal_places=2)
    fixed_amount = models.DecimalField(_('Fixed amount'), max_digits=10, decimal_places=2)
    total_fee = models.DecimalField(_('Total fee'), max_digits=10, decimal_places=2)
    
    class Meta:
        verbose_name = _('Platform Fee')
        verbose_name_plural = _('Platform Fees')

    def __str__(self):
        return f"Platform Fee for Order {self.order.id}"

class HeroSection(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(
        help_text="Você pode usar {cities} e {categories} como placeholders que serão substituídos automaticamente"
    )
    primary_button_text = models.CharField(max_length=50)
    primary_button_link = models.CharField(max_length=200)
    secondary_button_text = models.CharField(max_length=50)
    secondary_button_link = models.CharField(max_length=200)
    image = models.ImageField(upload_to='hero/')
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Hero Section"
        verbose_name_plural = "Hero Sections"

    def __str__(self):
        return f"{self.title} ({'Ativo' if self.is_active else 'Inativo'})"

    def save(self, *args, **kwargs):
        if self.is_active:
            # Desativa todos os outros banners
            HeroSection.objects.exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)

    def clean(self):
        # Validar os placeholders na descrição
        valid_placeholders = ['{cities}', '{categories}']
        for placeholder in valid_placeholders:
            if placeholder in self.description:
                continue
        
        if not any(placeholder in self.description for placeholder in valid_placeholders):
            raise ValidationError({
                'description': 'A descrição deve conter pelo menos um dos placeholders: {cities} ou {categories}'
            })

class AdvertisementSection(models.Model):
    title = models.CharField(_('Title'), max_length=255)
    description = models.TextField(_('Description'))
    button_text = models.CharField(_('Button text'), max_length=100)
    button_link = models.CharField(_('Button link'), max_length=255)
    image = models.ImageField(_('Image'), upload_to='advertisements/', help_text=_('Image for advertisement section'))
    is_active = models.BooleanField(_('Is active'), default=True)
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)

    class Meta:
        verbose_name = _('Advertisement Section')
        verbose_name_plural = _('Advertisement Sections')

    def save(self, *args, **kwargs):
        if self.is_active:
            # Desativa todas as outras seções antes de salvar esta
            AdvertisementSection.objects.exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
