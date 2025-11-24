from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.apps import apps


class Command(BaseCommand):
    help = 'Load example emissions fixture into the database (idempotent)'

    def handle(self, *args, **options):
        Emission = apps.get_model('emissions', 'Emission')
        existing = Emission.objects.count()
        if existing > 0:
            self.stdout.write(self.style.WARNING(f'Found {existing} Emission(s) in DB. Skipping fixture load.'))
            return
        # Load the fixture named 'emissions' (emissions/fixtures/emissions.json)
        call_command('loaddata', 'emissions')
        total = Emission.objects.count()
        self.stdout.write(self.style.SUCCESS(f'Loaded fixtures. Total Emission records: {total}'))

