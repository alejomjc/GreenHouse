from django.contrib import admin
from .models import Emission


@admin.register(Emission)
class EmissionAdmin(admin.ModelAdmin):
    list_display = ('country', 'activity', 'year', 'emissions', 'emission_type')
    list_filter = ('country', 'emission_type', 'activity', 'year')
    search_fields = ('country', 'activity')

