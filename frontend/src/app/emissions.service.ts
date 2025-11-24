import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Emission } from './emission.model';

export interface FilterOptions {
  countries: string[];
  activities: string[];
  emission_types: string[];
}

@Injectable({ providedIn: 'root' })
export class EmissionsService {
  private baseUrl = '/api/emissions/';

  constructor(private http: HttpClient) {}

  getEmissions(filters?: { country?: string; activity?: string; emission_type?: string; year?: number }): Observable<Emission[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const val = (filters as any)[key];
        if (val !== undefined && val !== null) {
          params = params.set(key, String(val));
        }
      });
    }
    return this.http.get<Emission[] | { results: Emission[] }>(this.baseUrl, { params }).pipe(
      map((resp: any) => {
        if (resp && typeof resp === 'object' && Array.isArray(resp.results)) {
          return resp.results as Emission[];
        }
        return resp as Emission[];
      })
    );
  }

  getAggregatedByYear(filters?: { country?: string; activity?: string; emission_type?: string }): Observable<{ year: number; total: number }[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const val = (filters as any)[key];
        if (val !== undefined && val !== null) {
          params = params.set(key, String(val));
        }
      });
    }
    return this.http.get<{ year: number; total: number }[]>(this.baseUrl + 'aggregate/', { params }).pipe(
      map((resp: any) => {
        if (resp && typeof resp === 'object' && Array.isArray(resp.results)) {
          return resp.results as { year: number; total: number }[];
        }
        return resp as { year: number; total: number }[];
      })
    );
  }

  getFilterOptions(): Observable<FilterOptions> {
    return this.http.get<FilterOptions>(this.baseUrl + 'filters/');
  }
}
