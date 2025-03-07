from django.db import migrations

def seed_categories(apps, schema_editor):
    Category = apps.get_model('events', 'Category')
    categories = [
        'Música',
        'Esportes',
        'Teatro',
        'Conferências',
        'Workshops',
        'Gastronomia',
        'Arte e Cultura',
        'Negócios',
        'Tecnologia',
        'Educação',
        'Festas',
        'Shows',
        'Cinema',
        'Dança',
        'Exposições',
        'Feiras',
        'Literatura',
        'Moda',
        'Saúde e Bem-estar',
        'Religião e Espiritualidade'
    ]
    
    for category_name in categories:
        Category.objects.create(name=category_name)

def remove_categories(apps, schema_editor):
    Category = apps.get_model('events', 'Category')
    Category.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('events', '0006_profile_state'),
    ]

    operations = [
        migrations.RunPython(seed_categories, remove_categories),
    ]