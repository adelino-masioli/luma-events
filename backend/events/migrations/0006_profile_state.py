# Generated by Django 5.1.7 on 2025-03-07 15:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0005_alter_attendee_user_alter_organizer_user_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='state',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='events.state'),
        ),
    ]
