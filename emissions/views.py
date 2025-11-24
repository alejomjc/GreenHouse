from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from .models import Emission
from .serializers import EmissionSerializer


class EmissionListView(generics.ListAPIView):
    """List all emissions with optional filtering by country, activity, emission_type and year."""
    queryset = Emission.objects.all()
    serializer_class = EmissionSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        country = self.request.query_params.get('country')
        activity = self.request.query_params.get('activity')
        emission_type = self.request.query_params.get('emission_type')
        year = self.request.query_params.get('year')
        if country:
            qs = qs.filter(country__iexact=country)
        if activity:
            qs = qs.filter(activity__iexact=activity)
        if emission_type:
            qs = qs.filter(emission_type__iexact=emission_type)
        if year:
            try:
                y = int(year)
                qs = qs.filter(year=y)
            except ValueError:
                return qs.none()
        return qs.order_by('year')


class EmissionAggregateView(APIView):
    """Return total emissions aggregated by year. Supports same query params as list."""

    def get(self, request, format=None):
        qs = Emission.objects.all()
        country = request.query_params.get('country')
        activity = request.query_params.get('activity')
        emission_type = request.query_params.get('emission_type')
        year = request.query_params.get('year')
        if country:
            qs = qs.filter(country__iexact=country)
        if activity:
            qs = qs.filter(activity__iexact=activity)
        if emission_type:
            qs = qs.filter(emission_type__iexact=emission_type)
        if year:
            try:
                y = int(year)
                qs = qs.filter(year=y)
            except ValueError:
                return Response([], status=status.HTTP_200_OK)

        agg = (
            qs.values('year')
            .annotate(total_emissions=Sum('emissions'))
            .order_by('year')
        )
        # normalize to simple list
        data = [{'year': item['year'], 'total': float(item['total_emissions'] or 0)} for item in agg]
        return Response(data)


class EmissionFiltersView(APIView):
    """Return available filter options (distinct countries, activities, emission_types)."""

    def get(self, request, format=None):
        countries = Emission.objects.values_list('country', flat=True).distinct().order_by('country')
        activities = Emission.objects.values_list('activity', flat=True).distinct().order_by('activity')
        emission_types = Emission.objects.values_list('emission_type', flat=True).distinct().order_by('emission_type')

        return Response({
            'countries': list(countries),
            'activities': list(activities),
            'emission_types': list(emission_types)
        })
