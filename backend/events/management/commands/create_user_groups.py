from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from django.db.utils import IntegrityError

class Command(BaseCommand):
    help = 'Create default user groups for the application'

    def handle(self, *args, **options):
        try:
            # Create hostess group if it doesn't exist
            hostess_group, created = Group.objects.get_or_create(name='hostess')
            
            if created:
                self.stdout.write(self.style.SUCCESS('Successfully created "hostess" group'))
            else:
                self.stdout.write(self.style.WARNING('The "hostess" group already exists'))
            
        except IntegrityError as e:
            self.stdout.write(self.style.ERROR(f'Error creating groups: {str(e)}'))
            
        self.stdout.write(self.style.SUCCESS('User groups setup completed')) 