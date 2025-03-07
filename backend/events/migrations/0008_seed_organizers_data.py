from django.db import migrations
from django.contrib.auth.hashers import make_password
from django.utils import timezone

def seed_organizers(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Organizer = apps.get_model('events', 'Organizer')
    
    organizers_data = [
        {
            'username': 'eventos_culturais',
            'email': 'contato@eventosculturais.com.br',
            'password': make_password('password123'),
            'first_name': 'Eventos',
            'last_name': 'Culturais',
            'company_name': 'Eventos Culturais Brasil Ltda',
            'cnpj': '12345678000190'
        },
        {
            'username': 'show_producoes',
            'email': 'contato@showproducoes.com.br',
            'password': make_password('password123'),
            'first_name': 'Show',
            'last_name': 'Produções',
            'company_name': 'Show Produções e Eventos Ltda',
            'cnpj': '98765432000110'
        },
        {
            'username': 'festa_express',
            'email': 'contato@festaexpress.com.br',
            'password': make_password('password123'),
            'first_name': 'Festa',
            'last_name': 'Express',
            'company_name': 'Festa Express Eventos Ltda',
            'cnpj': '45678912000134'
        },
        {
            'username': 'arte_eventos',
            'email': 'contato@arteeventos.com.br',
            'password': make_password('password123'),
            'first_name': 'Arte',
            'last_name': 'Eventos',
            'company_name': 'Arte & Eventos Produções Ltda',
            'cnpj': '78912345000156'
        },
        {
            'username': 'prime_eventos',
            'email': 'contato@primeeventos.com.br',
            'password': make_password('password123'),
            'first_name': 'Prime',
            'last_name': 'Eventos',
            'company_name': 'Prime Eventos e Produções Ltda',
            'cnpj': '32165498000178'
        }
    ]
    
    for data in organizers_data:
        # Create user first
        user = User.objects.create(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            is_active=True,
            date_joined=timezone.now()
        )
        
        # Create organizer profile
        Organizer.objects.create(
            user=user,
            company_name=data['company_name'],
            cnpj=data['cnpj']
        )

def remove_organizers(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Organizer = apps.get_model('events', 'Organizer')
    
    # Get all users associated with organizers
    organizer_users = User.objects.filter(
        id__in=Organizer.objects.values_list('user_id', flat=True)
    )
    
    # Delete organizers and their associated users
    Organizer.objects.all().delete()
    organizer_users.delete()

class Migration(migrations.Migration):
    dependencies = [
        ('events', '0007_seed_categories_data'),
    ]

    operations = [
        migrations.RunPython(seed_organizers, remove_organizers),
    ]