# Generated by Django 5.1.7 on 2025-03-29 10:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0017_herosection'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdvertisementSection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='Title')),
                ('description', models.TextField(verbose_name='Description')),
                ('button_text', models.CharField(max_length=100, verbose_name='Button text')),
                ('button_link', models.CharField(max_length=255, verbose_name='Button link')),
                ('image', models.ImageField(help_text='Image for advertisement section', upload_to='advertisements/', verbose_name='Image')),
                ('is_active', models.BooleanField(default=True, verbose_name='Is active')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
            ],
            options={
                'verbose_name': 'Advertisement Section',
                'verbose_name_plural': 'Advertisement Sections',
            },
        ),
    ]
