from rest_framework.test import APITestCase
from .models import Emission


class EmissionAPITest(APITestCase):
    def setUp(self):
        Emission.objects.create(year=2015, emissions=5.2, emission_type="CO2", country="United Kingdom", activity="Air travel")
        Emission.objects.create(year=2016, emissions=2.9, emission_type="N2O", country="United Kingdom", activity="Waste")

    def _extract_results(self, data):
        # support both paginated and non-paginated responses
        if isinstance(data, dict) and 'results' in data:
            return data['results']
        return data

    def test_list_emissions(self):
        url = '/api/emissions/'
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        results = self._extract_results(data)
        self.assertIsInstance(results, list)
        self.assertEqual(len(results), 2)
        keys = {"id", "year", "emissions", "emission_type", "country", "activity"}
        self.assertTrue(keys.issubset(set(results[0].keys())))

    def test_filter_by_country(self):
        resp = self.client.get('/api/emissions/?country=United%20Kingdom')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        results = self._extract_results(data)
        self.assertEqual(len(results), 2)

    def test_invalid_year_query_returns_empty(self):
        resp = self.client.get('/api/emissions/?year=notanint')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        results = self._extract_results(data)
        self.assertEqual(len(results), 0)

    def test_aggregate_returns_totals_per_year(self):
        resp = self.client.get('/api/emissions/aggregate/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIsInstance(data, list)
        # should have two years aggregated
        self.assertEqual(len(data), 2)
        # check structure and totals
        expected = {2015: 5.2, 2016: 2.9}
        for item in data:
            self.assertIn('year', item)
            self.assertIn('total', item)
            self.assertAlmostEqual(item['total'], expected[item['year']])
