# Generated by Django 5.1.7 on 2025-03-18 16:46

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0013_event_banner_event_slug_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='attendee',
            options={'verbose_name': 'Attendee', 'verbose_name_plural': 'Attendees'},
        ),
        migrations.AlterModelOptions(
            name='category',
            options={'verbose_name': 'Category', 'verbose_name_plural': 'Categories'},
        ),
        migrations.AlterModelOptions(
            name='event',
            options={'verbose_name': 'Event', 'verbose_name_plural': 'Events'},
        ),
        migrations.AlterModelOptions(
            name='order',
            options={'verbose_name': 'Order', 'verbose_name_plural': 'Orders'},
        ),
        migrations.AlterModelOptions(
            name='organizer',
            options={'verbose_name': 'Organizer', 'verbose_name_plural': 'Organizers'},
        ),
        migrations.AlterModelOptions(
            name='payment',
            options={'verbose_name': 'Payment', 'verbose_name_plural': 'Payments'},
        ),
        migrations.AlterModelOptions(
            name='payout',
            options={'verbose_name': 'Payout', 'verbose_name_plural': 'Payouts'},
        ),
        migrations.AlterModelOptions(
            name='platformfee',
            options={'verbose_name': 'Platform Fee', 'verbose_name_plural': 'Platform Fees'},
        ),
        migrations.AlterModelOptions(
            name='profile',
            options={'verbose_name': 'Profile', 'verbose_name_plural': 'Profiles'},
        ),
        migrations.AlterModelOptions(
            name='state',
            options={'verbose_name': 'State', 'verbose_name_plural': 'States'},
        ),
        migrations.AlterModelOptions(
            name='ticket',
            options={'verbose_name': 'Ticket', 'verbose_name_plural': 'Tickets'},
        ),
        migrations.AlterField(
            model_name='attendee',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Created at'),
        ),
        migrations.AlterField(
            model_name='attendee',
            name='order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.order', verbose_name='Order'),
        ),
        migrations.AlterField(
            model_name='attendee',
            name='ticket',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.ticket', verbose_name='Ticket'),
        ),
        migrations.AlterField(
            model_name='attendee',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='Updated at'),
        ),
        migrations.AlterField(
            model_name='attendee',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User'),
        ),
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(max_length=100, unique=True, verbose_name='Name'),
        ),
        migrations.AlterField(
            model_name='category',
            name='slug',
            field=models.SlugField(blank=True, max_length=120, unique=True, verbose_name='Slug'),
        ),
        migrations.AlterField(
            model_name='city',
            name='city_id',
            field=models.IntegerField(null=True, verbose_name='City ID'),
        ),
        migrations.AlterField(
            model_name='city',
            name='name',
            field=models.CharField(max_length=100, verbose_name='Name'),
        ),
        migrations.AlterField(
            model_name='city',
            name='state',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.state', verbose_name='State'),
        ),
        migrations.AlterField(
            model_name='event',
            name='banner',
            field=models.ImageField(blank=True, help_text='Landscape image for event banner', null=True, upload_to='events/banners/', verbose_name='Banner'),
        ),
        migrations.AlterField(
            model_name='event',
            name='category',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='events.category', verbose_name='Category'),
        ),
        migrations.AlterField(
            model_name='event',
            name='city',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='events.city', verbose_name='City'),
        ),
        migrations.AlterField(
            model_name='event',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Created at'),
        ),
        migrations.AlterField(
            model_name='event',
            name='date',
            field=models.DateTimeField(verbose_name='Date'),
        ),
        migrations.AlterField(
            model_name='event',
            name='description',
            field=models.TextField(verbose_name='Description'),
        ),
        migrations.AlterField(
            model_name='event',
            name='location',
            field=models.CharField(max_length=255, verbose_name='Location'),
        ),
        migrations.AlterField(
            model_name='event',
            name='organizer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.organizer', verbose_name='Organizer'),
        ),
        migrations.AlterField(
            model_name='event',
            name='price',
            field=models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Price'),
        ),
        migrations.AlterField(
            model_name='event',
            name='slug',
            field=models.SlugField(blank=True, max_length=255, unique=True, verbose_name='Slug'),
        ),
        migrations.AlterField(
            model_name='event',
            name='state',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='events.state', verbose_name='State'),
        ),
        migrations.AlterField(
            model_name='event',
            name='thumbnail',
            field=models.ImageField(blank=True, help_text='Square image for event thumbnail', null=True, upload_to='events/thumbnails/', verbose_name='Thumbnail'),
        ),
        migrations.AlterField(
            model_name='event',
            name='title',
            field=models.CharField(max_length=255, verbose_name='Title'),
        ),
        migrations.AlterField(
            model_name='event',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='Updated at'),
        ),
        migrations.AlterField(
            model_name='order',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Created at'),
        ),
        migrations.AlterField(
            model_name='order',
            name='event',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='events.event', verbose_name='Event'),
        ),
        migrations.AlterField(
            model_name='order',
            name='platform_fee',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10, verbose_name='Platform fee'),
        ),
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('paid', 'Paid'), ('canceled', 'Canceled'), ('refunded', 'Refunded')], max_length=20, verbose_name='Status'),
        ),
        migrations.AlterField(
            model_name='order',
            name='total_price',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10, verbose_name='Total price'),
        ),
        migrations.AlterField(
            model_name='order',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='Updated at'),
        ),
        migrations.AlterField(
            model_name='order',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User'),
        ),
        migrations.AlterField(
            model_name='organizer',
            name='cnpj',
            field=models.CharField(max_length=14, unique=True, verbose_name='CNPJ'),
        ),
        migrations.AlterField(
            model_name='organizer',
            name='company_name',
            field=models.CharField(max_length=255, verbose_name='Company name'),
        ),
        migrations.AlterField(
            model_name='organizer',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Created at'),
        ),
        migrations.AlterField(
            model_name='organizer',
            name='slug',
            field=models.SlugField(blank=True, max_length=255, unique=True, verbose_name='Slug'),
        ),
        migrations.AlterField(
            model_name='organizer',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='Updated at'),
        ),
        migrations.AlterField(
            model_name='organizer',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User'),
        ),
        migrations.AlterField(
            model_name='payment',
            name='amount',
            field=models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Amount'),
        ),
        migrations.AlterField(
            model_name='payment',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Created at'),
        ),
        migrations.AlterField(
            model_name='payment',
            name='order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.order', verbose_name='Order'),
        ),
        migrations.AlterField(
            model_name='payment',
            name='payment_method',
            field=models.CharField(choices=[('card', 'Card'), ('pix', 'Pix'), ('boleto', 'Boleto')], max_length=50, verbose_name='Payment method'),
        ),
        migrations.AlterField(
            model_name='payment',
            name='payment_status',
            field=models.CharField(choices=[('pending', 'Pending'), ('successful', 'Successful'), ('failed', 'Failed'), ('refunded', 'Refunded')], max_length=20, verbose_name='Payment status'),
        ),
        migrations.AlterField(
            model_name='payment',
            name='stripe_payment_id',
            field=models.CharField(max_length=255, verbose_name='Stripe payment ID'),
        ),
        migrations.AlterField(
            model_name='payment',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='Updated at'),
        ),
        migrations.AlterField(
            model_name='payout',
            name='amount',
            field=models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Amount'),
        ),
        migrations.AlterField(
            model_name='payout',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Created at'),
        ),
        migrations.AlterField(
            model_name='payout',
            name='organizer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.organizer', verbose_name='Organizer'),
        ),
        migrations.AlterField(
            model_name='payout',
            name='processed_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Processed at'),
        ),
        migrations.AlterField(
            model_name='payout',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('processing', 'Processing'), ('completed', 'Completed'), ('failed', 'Failed')], max_length=20, verbose_name='Status'),
        ),
        migrations.AlterField(
            model_name='payout',
            name='stripe_payout_id',
            field=models.CharField(max_length=255, verbose_name='Stripe payout ID'),
        ),
        migrations.AlterField(
            model_name='payout',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='Updated at'),
        ),
        migrations.AlterField(
            model_name='platformfee',
            name='fixed_amount',
            field=models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Fixed amount'),
        ),
        migrations.AlterField(
            model_name='platformfee',
            name='order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.order', verbose_name='Order'),
        ),
        migrations.AlterField(
            model_name='platformfee',
            name='percentage',
            field=models.DecimalField(decimal_places=2, max_digits=5, verbose_name='Percentage'),
        ),
        migrations.AlterField(
            model_name='platformfee',
            name='total_fee',
            field=models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Total fee'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='city',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='events.city', verbose_name='City'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='cpf',
            field=models.CharField(max_length=11, verbose_name='CPF'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Created at'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='state',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='events.state', verbose_name='State'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='Updated at'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User'),
        ),
        migrations.AlterField(
            model_name='state',
            name='name',
            field=models.CharField(max_length=100, verbose_name='Name'),
        ),
        migrations.AlterField(
            model_name='state',
            name='uf',
            field=models.CharField(max_length=2, verbose_name='UF'),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Created at'),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.event', verbose_name='Event'),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='price',
            field=models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Price'),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='quantity_available',
            field=models.IntegerField(verbose_name='Quantity available'),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='Updated at'),
        ),
        migrations.AddConstraint(
            model_name='profile',
            constraint=models.UniqueConstraint(condition=models.Q(('cpf__isnull', False)), fields=('cpf',), name='unique_cpf_if_not_null'),
        ),
    ]
