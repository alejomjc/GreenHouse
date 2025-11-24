from django.db import models


class Emission(models.Model):
    year = models.IntegerField()
    emissions = models.FloatField(help_text="Emission value (e.g., tonnes CO2e)")
    emission_type = models.CharField(max_length=50)
    country = models.CharField(max_length=100)
    activity = models.CharField(max_length=100)

    class Meta:
        ordering = ['year']

    def __str__(self):
        return f"{self.country} {self.activity} {self.year}: {self.emissions}"
