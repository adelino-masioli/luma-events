from django.db import migrations
from django.utils.text import slugify
from django.db import models

def populate_category_slugs(apps, schema_editor):
    Category = apps.get_model('events', 'Category')
    
    for category in Category.objects.all():
        # Generate a slug from the name
        original_slug = slugify(category.name)
        slug = original_slug
        counter = 1
        
        # Ensure slug uniqueness
        while Category.objects.filter(slug=slug).exists():
            slug = f"{original_slug}-{counter}"
            counter += 1
            
        category.slug = slug
        category.save()

class Migration(migrations.Migration):
    dependencies = [
        ('events', '0011_seed_portuguese_events_and_tickets_data'),
    ]

    operations = [
        # First add the slug field allowing null values
        migrations.AddField(
            model_name='category',
            name='slug',
            field=models.SlugField(blank=True, max_length=120, null=True),
        ),
        # Then populate the slugs
        migrations.RunPython(populate_category_slugs),
        # Finally, make the field unique and non-null
        migrations.AlterField(
            model_name='category',
            name='slug',
            field=models.SlugField(blank=True, max_length=120, unique=True),
        ),
    ]