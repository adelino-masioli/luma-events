# Generated by Django 5.1.7 on 2025-03-29 09:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0016_delete_payment'),
    ]

    operations = [
        migrations.CreateModel(
            name='HeroSection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(help_text='Você pode usar {cities} e {categories} como placeholders que serão substituídos automaticamente')),
                ('primary_button_text', models.CharField(max_length=50)),
                ('primary_button_link', models.CharField(max_length=200)),
                ('secondary_button_text', models.CharField(max_length=50)),
                ('secondary_button_link', models.CharField(max_length=200)),
                ('image', models.ImageField(upload_to='hero/')),
                ('is_active', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Hero Section',
                'verbose_name_plural': 'Hero Sections',
            },
        ),
    ]
