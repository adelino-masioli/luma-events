from django.db import migrations
from django.utils import timezone
from datetime import datetime, timedelta

def seed_portuguese_events_and_tickets(apps, schema_editor):
    Event = apps.get_model('events', 'Event')
    Ticket = apps.get_model('events', 'Ticket')
    Category = apps.get_model('events', 'Category')
    Organizer = apps.get_model('events', 'Organizer')
    State = apps.get_model('events', 'State')
    City = apps.get_model('events', 'City')

    # Obter categorias
    shows = Category.objects.get(name='Shows')
    teatro = Category.objects.get(name='Teatro')
    workshops = Category.objects.get(name='Workshops')
    gastronomia = Category.objects.get(name='Gastronomia')
    tecnologia = Category.objects.get(name='Tecnologia')
    esportes = Category.objects.get(name='Esportes')
    educacao = Category.objects.get(name='Educação')
    festas = Category.objects.get(name='Festas')

    # Obter organizadores
    eventos_culturais = Organizer.objects.get(company_name='Eventos Culturais Brasil Ltda')
    show_producoes = Organizer.objects.get(company_name='Show Produções e Eventos Ltda')
    festa_express = Organizer.objects.get(company_name='Festa Express Eventos Ltda')
    arte_eventos = Organizer.objects.get(company_name='Arte & Eventos Produções Ltda')
    prime_eventos = Organizer.objects.get(company_name='Prime Eventos e Produções Ltda')

    # Obter estados e cidades
    sp_state = State.objects.get(uf='SP')
    sp_city = City.objects.get(name='São Paulo', state=sp_state)
    campinas_city = City.objects.get(name='Campinas', state=sp_state)
    
    rj_state = State.objects.get(uf='RJ')
    rj_city = City.objects.get(name='Rio de Janeiro', state=rj_state)
    
    mg_state = State.objects.get(uf='MG')
    bh_city = City.objects.get(name='Belo Horizonte', state=mg_state)
    
    rs_state = State.objects.get(uf='RS')
    poa_city = City.objects.get(name='Porto Alegre', state=rs_state)

    events_data = [
        {
            'organizer': show_producoes,
            'title': 'Festival de Música Sertaneja',
            'description': 'O maior festival de música sertaneja do Brasil, com os principais artistas do gênero reunidos em um só lugar.',
            'category': shows,
            'date': timezone.now() + timedelta(days=45),
            'location': 'Allianz Parque',
            'state': sp_state,
            'city': sp_city,
            'price': 180.00,
            'tickets': [
                {'price': 180.00, 'quantity': 2000, 'name': 'Pista'},
                {'price': 350.00, 'quantity': 500, 'name': 'Área VIP'},
                {'price': 550.00, 'quantity': 100, 'name': 'Camarote Premium'}
            ]
        },
        {
            'organizer': eventos_culturais,
            'title': 'Espetáculo: Dona Flor e Seus Dois Maridos',
            'description': 'Adaptação teatral da obra de Jorge Amado, com direção de renomado diretor brasileiro e elenco de primeira linha.',
            'category': teatro,
            'date': timezone.now() + timedelta(days=20),
            'location': 'Teatro Riachuelo',
            'state': rj_state,
            'city': rj_city,
            'price': 90.00,
            'tickets': [
                {'price': 90.00, 'quantity': 400, 'name': 'Plateia'},
                {'price': 140.00, 'quantity': 150, 'name': 'Mezanino'}
            ]
        },
        {
            'organizer': prime_eventos,
            'title': 'Workshop de Culinária Mineira',
            'description': 'Aprenda a preparar os pratos mais tradicionais da culinária mineira com chefs especializados.',
            'category': workshops,
            'date': timezone.now() + timedelta(days=30),
            'location': 'Mercado Central',
            'state': mg_state,
            'city': bh_city,
            'price': 200.00,
            'tickets': [
                {'price': 200.00, 'quantity': 40, 'name': 'Ingresso Único'}
            ]
        },
        {
            'organizer': festa_express,
            'title': 'Festival de Cerveja Artesanal',
            'description': 'Degustação das melhores cervejas artesanais do Brasil, com música ao vivo e gastronomia especial.',
            'category': gastronomia,
            'date': timezone.now() + timedelta(days=50),
            'location': 'Parque da Redenção',
            'state': rs_state,
            'city': poa_city,
            'price': 100.00,
            'tickets': [
                {'price': 100.00, 'quantity': 800, 'name': 'Entrada Simples'},
                {'price': 180.00, 'quantity': 400, 'name': 'Entrada + Kit Degustação'}
            ]
        },
        {
            'organizer': arte_eventos,
            'title': 'Hackathon: Soluções para Cidades Inteligentes',
            'description': 'Maratona de programação para desenvolver soluções tecnológicas para problemas urbanos.',
            'category': tecnologia,
            'date': timezone.now() + timedelta(days=75),
            'location': 'Campus da Unicamp',
            'state': sp_state,
            'city': campinas_city,
            'price': 50.00,
            'tickets': [
                {'price': 50.00, 'quantity': 300, 'name': 'Participante Individual'},
                {'price': 200.00, 'quantity': 50, 'name': 'Equipe (até 4 pessoas)'}
            ]
        },
        {
            'organizer': show_producoes,
            'title': 'Campeonato de Futevôlei',
            'description': 'Competição de futevôlei com a participação de atletas profissionais e amadores.',
            'category': esportes,
            'date': timezone.now() + timedelta(days=40),
            'location': 'Praia de Copacabana',
            'state': rj_state,
            'city': rj_city,
            'price': 25.00,
            'tickets': [
                {'price': 25.00, 'quantity': 1000, 'name': 'Arquibancada'},
                {'price': 80.00, 'quantity': 200, 'name': 'Área Coberta'}
            ]
        },
        {
            'organizer': eventos_culturais,
            'title': 'Curso de Oratória e Comunicação Eficaz',
            'description': 'Aprenda técnicas de comunicação e oratória para melhorar seu desempenho profissional.',
            'category': educacao,
            'date': timezone.now() + timedelta(days=35),
            'location': 'Centro Empresarial',
            'state': sp_state,
            'city': sp_city,
            'price': 280.00,
            'tickets': [
                {'price': 280.00, 'quantity': 60, 'name': 'Inscrição Completa'}
            ]
        },
        {
            'organizer': festa_express,
            'title': 'Baile de Carnaval Fora de Época',
            'description': 'O melhor do carnaval carioca em uma festa especial fora de época, com as principais escolas de samba.',
            'category': festas,
            'date': timezone.now() + timedelta(days=55),
            'location': 'Sambódromo da Marquês de Sapucaí',
            'state': rj_state,
            'city': rj_city,
            'price': 150.00,
            'tickets': [
                {'price': 150.00, 'quantity': 3000, 'name': 'Arquibancada'},
                {'price': 300.00, 'quantity': 500, 'name': 'Setor Especial'},
                {'price': 800.00, 'quantity': 100, 'name': 'Camarote Open Bar'}
            ]
        }
    ]

    for event_data in events_data:
        tickets_data = event_data.pop('tickets')
        event = Event.objects.create(**event_data)
        
        for ticket_data in tickets_data:
            name = ticket_data.pop('name', None)  # Remove name as it's not in the model
            Ticket.objects.create(
                event=event,
                price=ticket_data['price'],
                quantity_available=ticket_data['quantity']
            )

class Migration(migrations.Migration):
    dependencies = [
        ('events', '0010_seed_events_and_tickets_data'),
    ]

    operations = [
        migrations.RunPython(seed_portuguese_events_and_tickets),
    ]