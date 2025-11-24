import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmissionsService } from './emissions.service';

describe('EmissionsService', () => {
  let service: EmissionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmissionsService]
    });
    service = TestBed.inject(EmissionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should normalize paginated response for getEmissions()', (done) => {
    const mockResp = {
      count: 2,
      next: null,
      previous: null,
      results: [
        { id: 1, year: 2015, emissions: 5.2, emission_type: 'CO2', country: 'UK', activity: 'Air' },
        { id: 2, year: 2016, emissions: 2.9, emission_type: 'N2O', country: 'UK', activity: 'Waste' }
      ]
    };

    service.getEmissions().subscribe(data => {
      expect(Array.isArray(data)).toBeTrue();
      expect(data.length).toBe(2);
      expect((data as any)[0].id).toBe(1);
      done();
    });

    const req = httpMock.expectOne('/api/emissions/');
    expect(req.request.method).toBe('GET');
    req.flush(mockResp);
  });

  it('should return aggregated data for getAggregatedByYear()', (done) => {
    const agg = [ { year: 2015, total: 5.2 }, { year: 2016, total: 2.9 } ];

    service.getAggregatedByYear().subscribe(data => {
      expect(Array.isArray(data)).toBeTrue();
      expect(data.length).toBe(2);
      expect((data as any)[0].year).toBe(2015);
      done();
    });

    const req = httpMock.expectOne('/api/emissions/aggregate/');
    expect(req.request.method).toBe('GET');
    req.flush(agg);
  });
});

