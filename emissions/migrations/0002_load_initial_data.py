from django.db import migrations
import sys


def load_initial_emissions(apps, schema_editor):
    """Load initial emissions data."""
    if 'test' in sys.argv:
        return

    Emission = apps.get_model('emissions', 'Emission')

    # Only load if database is empty
    if Emission.objects.exists():
        return

    initial_data = [
        {
            'year': 2015,
            'emissions': 5.2,
            'emission_type': 'CO2',
            'country': 'United Kingdom',
            'activity': 'Air travel'
        },
        {
            'year': 2016,
            'emissions': 2.9,
            'emission_type': 'N2O',
            'country': 'United Kingdom',
            'activity': 'Waste'
        },
        {
            'year': 2015,
            'emissions': 1.1,
            'emission_type': 'CH4',
            'country': 'France',
            'activity': 'Agriculture'
        },
        {
            'year': 2016,
            'emissions': 3.4,
            'emission_type': 'CO2',
            'country': 'France',
            'activity': 'Transport'
        },
        {
            'year': 2017,
            'emissions': 7.8,
            'emission_type': 'CO2',
            'country': 'Germany',
            'activity': 'Industry'
        },
        {
            'year': 2017,
            'emissions': 4.5,
            'emission_type': 'CH4',
            'country': 'Spain',
            'activity': 'Agriculture'
        },
        {
            'year': 2018,
            'emissions': 6.1,
            'emission_type': 'CO2',
            'country': 'Italy',
            'activity': 'Transport'
        },
        {
            'year': 2018,
            'emissions': 3.2,
            'emission_type': 'N2O',
            'country': 'United Kingdom',
            'activity': 'Agriculture'
        },
        {
            'year': 2019,
            'emissions': 8.9,
            'emission_type': 'CO2',
            'country': 'France',
            'activity': 'Energy Production'
        },
        {
            'year': 2019,
            'emissions': 5.4,
            'emission_type': 'CH4',
            'country': 'Germany',
            'activity': 'Waste'
        },
        {
            'year': 2020,
            'emissions': 4.7,
            'emission_type': 'CO2',
            'country': 'Spain',
            'activity': 'Transport'
        },
        {
            'year': 2020,
            'emissions': 2.1,
            'emission_type': 'N2O',
            'country': 'Italy',
            'activity': 'Industry'
        },
    ]

    for data in initial_data:
        Emission.objects.create(**data)


def reverse_load_initial_emissions(apps, schema_editor):
    """Remove initial emissions data."""
    Emission = apps.get_model('emissions', 'Emission')
    # Only delete the initial records we created
    Emission.objects.filter(
        country__in=['United Kingdom', 'France', 'Germany', 'Spain', 'Italy']
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('emissions', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(load_initial_emissions, reverse_load_initial_emissions),
    ]
