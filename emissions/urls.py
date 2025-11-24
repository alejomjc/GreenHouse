from django.urls import path
from .views import EmissionListView, EmissionAggregateView, EmissionFiltersView

urlpatterns = [
    path('', EmissionListView.as_view(), name='emission-list'),
    path('aggregate/', EmissionAggregateView.as_view(), name='emission-aggregate'),
    path('filters/', EmissionFiltersView.as_view(), name='emission-filters'),
]
