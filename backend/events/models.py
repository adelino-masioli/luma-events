from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

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
    cpf = models.CharField(_('CPF'), max_length=11, unique=True)
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Profile')
        verbose_name_plural = _('Profiles')

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
    event = models.ForeignKey(Event, on_delete=models.CASCADE, verbose_name=_('Event'))
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
        self.platform_fee = self.total_price * 0.10
        self.save()

    def calculate_order(self):
        self.update_order_total()
        self.update_platform_fee()

# Payment Model
class Payment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, verbose_name=_('Order'))
    amount = models.DecimalField(_('Amount'), max_digits=10, decimal_places=2)
    stripe_payment_id = models.CharField(_('Stripe payment ID'), max_length=255)
    payment_method = models.CharField(_('Payment method'), max_length=50, choices=[
        ('card', _('Card')),
        ('pix', _('Pix')),
        ('boleto', _('Boleto'))
    ])
    payment_status = models.CharField(_('Payment status'), max_length=20, choices=[
        ('pending', _('Pending')),
        ('successful', _('Successful')),
        ('failed', _('Failed')),
        ('refunded', _('Refunded'))
    ])
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('Payment')
        verbose_name_plural = _('Payments')

    def __str__(self):
        return f"Payment {self.id}"

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
