from django.db import migrations
from django.utils import timezone
from datetime import datetime, timedelta

def seed_events_and_tickets(apps, schema_editor):
    Event = apps.get_model('events', 'Event')
    Ticket = apps.get_model('events', 'Ticket')
    Category = apps.get_model('events', 'Category')
    Organizer = apps.get_model('events', 'Organizer')
    State = apps.get_model('events', 'State')
    City = apps.get_model('events', 'City')

    # Get categories
    shows = Category.objects.get(name='Shows')
    teatro = Category.objects.get(name='Teatro')
    workshops = Category.objects.get(name='Workshops')
    gastronomia = Category.objects.get(name='Gastronomia')
    tecnologia = Category.objects.get(name='Tecnologia')

    # Get organizers
    eventos_culturais = Organizer.objects.get(company_name='Eventos Culturais Brasil Ltda')
    show_producoes = Organizer.objects.get(company_name='Show Produções e Eventos Ltda')
    festa_express = Organizer.objects.get(company_name='Festa Express Eventos Ltda')
    arte_eventos = Organizer.objects.get(company_name='Arte & Eventos Produções Ltda')
    prime_eventos = Organizer.objects.get(company_name='Prime Eventos e Produções Ltda')

    # Get São Paulo state and city
    sp_state = State.objects.get(uf='SP')
    sp_city = City.objects.get(name='São Paulo', state=sp_state)

    # Get Rio de Janeiro state and city
    rj_state = State.objects.get(uf='RJ')
    rj_city = City.objects.get(name='Rio de Janeiro', state=rj_state)

    events_data = [
        {
            'organizer': show_producoes,
            'title': 'Festival de Música Brasileira 2024',
            'description': 'Um dia inteiro celebrando o melhor da música brasileira com shows de grandes artistas nacionais.',
            'category': shows,
            'date': timezone.now() + timedelta(days=30),
            'location': 'Parque Ibirapuera',
            'state': sp_state,
            'city': sp_city,
            'price': 150.00,
            'tickets': [
                {'price': 150.00, 'quantity': 1000},  # Regular
                {'price': 300.00, 'quantity': 200},   # VIP
                {'price': 500.00, 'quantity': 50}     # Premium
            ]
        },
        {
            'organizer': eventos_culturais,
            'title': 'Peça: O Auto da Compadecida',
            'description': 'A clássica obra de Ariano Suassuna em uma montagem especial com elenco renomado.',
            'category': teatro,
            'date': timezone.now() + timedelta(days=15),
            'location': 'Teatro Municipal',
            'state': rj_state,
            'city': rj_city,
            'price': 80.00,
            'tickets': [
                {'price': 80.00, 'quantity': 300},    # Plateia
                {'price': 120.00, 'quantity': 100}    # Camarote
            ]
        },
        {
            'organizer': prime_eventos,
            'title': 'Workshop de Fotografia Profissional',
            'description': 'Aprenda técnicas avançadas de fotografia com profissionais renomados do mercado.',
            'category': workshops,
            'date': timezone.now() + timedelta(days=45),
            'location': 'Centro de Convenções',
            'state': sp_state,
            'city': sp_city,
            'price': 250.00,
            'tickets': [
                {'price': 250.00, 'quantity': 50}     # Único
            ]
        },
        {
            'organizer': festa_express,
            'title': 'Festival Gastronômico: Sabores do Brasil',
            'description': 'Uma experiência única com os melhores chefs do país apresentando pratos típicos de cada região.',
            'category': gastronomia,
            'date': timezone.now() + timedelta(days=60),
            'location': 'Expo Center Norte',
            'state': sp_state,
            'city': sp_city,
            'price': 120.00,
            'tickets': [
                {'price': 120.00, 'quantity': 500},   # Dia Único
                {'price': 200.00, 'quantity': 300}    # Passaporte 2 dias
            ]
        },
        {
            'organizer': arte_eventos,
            'title': 'Conferência: Futuro da Inteligência Artificial',
            'description': 'Palestrantes internacionais discutem as últimas tendências e inovações em IA.',
            'category': tecnologia,
            'date': timezone.now() + timedelta(days=90),
            'location': 'Centro de Convenções SulAmérica',
            'state': rj_state,
            'city': rj_city,
            'price': 350.00,
            'tickets': [
                {'price': 350.00, 'quantity': 200},   # Regular
                {'price': 600.00, 'quantity': 50}     # VIP
            ]
        }
    ]

    for event_data in events_data:
        tickets_data = event_data.pop('tickets')
        event = Event.objects.create(**event_data)
        
        for ticket_data in tickets_data:
            Ticket.objects.create(
                event=event,
                price=ticket_data['price'],
                quantity_available=ticket_data['quantity']
            )

class Migration(migrations.Migration):
    dependencies = [
        ('events', '0009_event_state_alter_event_city'),
    ]

    operations = [
        migrations.RunPython(seed_events_and_tickets),
    ]