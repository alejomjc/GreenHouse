import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { EmissionsService, FilterOptions } from './emissions.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-emissions-chart',
  template: `
    <div class="container">
      <div class="filters-section">
        <h2>Filter Emissions Data</h2>
        <div class="filters-grid">
          <div class="filter-group">
            <label for="country">Country:</label>
            <select id="country" [(ngModel)]="selectedCountry" (change)="onFilterChange()">
              <option value="">All Countries</option>
              <option *ngFor="let country of filterOptions.countries" [value]="country">{{ country }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="activity">Activity:</label>
            <select id="activity" [(ngModel)]="selectedActivity" (change)="onFilterChange()">
              <option value="">All Activities</option>
              <option *ngFor="let activity of filterOptions.activities" [value]="activity">{{ activity }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="emissionType">Emission Type:</label>
            <select id="emissionType" [(ngModel)]="selectedEmissionType" (change)="onFilterChange()">
              <option value="">All Types</option>
              <option *ngFor="let type of filterOptions.emission_types" [value]="type">{{ type }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <button class="reset-btn" (click)="resetFilters()">Reset Filters</button>
          </div>
        </div>
      </div>

      <div class="chart-wrapper">
        <div class="chart-container" *ngIf="!loading && !error && hasData">
          <canvas #chartCanvas></canvas>
        </div>

        <div *ngIf="loading" class="loading">Loading emissions data...</div>
        <div *ngIf="!loading && !hasData && !error" class="no-data">No emissions data available for the selected filters.</div>
        <div *ngIf="error" class="error">{{ error }}</div>
      </div>
    </div>
  `,
  styles: [
    `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .filters-section {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .filters-section h2 {
      margin-top: 0;
      margin-bottom: 20px;
      color: #333;
      font-size: 1.5rem;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
    }

    .filter-group label {
      font-weight: 600;
      margin-bottom: 5px;
      color: #555;
      font-size: 0.9rem;
    }

    .filter-group select {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      font-size: 1rem;
      cursor: pointer;
      transition: border-color 0.3s;
    }

    .filter-group select:hover {
      border-color: #4a90e2;
    }

    .filter-group select:focus {
      outline: none;
      border-color: #4a90e2;
      box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }

    .reset-btn {
      padding: 10px 20px;
      background: #4a90e2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
      font-weight: 600;
    }

    .reset-btn:hover {
      background: #357abd;
    }

    .reset-btn:active {
      transform: translateY(1px);
    }

    .chart-wrapper {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .chart-container {
      width: 100%;
      height: 400px;
      position: relative;
    }

    .error {
      color: #d32f2f;
      text-align: center;
      padding: 20px;
      background: #ffebee;
      border-radius: 4px;
      font-weight: 500;
    }

    .loading, .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
      font-size: 1.1rem;
    }

    .loading::after {
      content: '...';
      animation: dots 1.5s infinite;
    }

    @keyframes dots {
      0%, 20% { content: '.'; }
      40% { content: '..'; }
      60%, 100% { content: '...'; }
    }

    @media (max-width: 768px) {
      .container {
        padding: 10px;
      }

      .filters-section {
        padding: 15px;
      }

      .filters-section h2 {
        font-size: 1.2rem;
      }

      .filters-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .chart-container {
        height: 300px;
      }

      .chart-wrapper {
        padding: 15px;
      }
    }

    @media (max-width: 480px) {
      .filters-section h2 {
        font-size: 1rem;
      }

      .filter-group label {
        font-size: 0.85rem;
      }

      .filter-group select,
      .reset-btn {
        font-size: 0.9rem;
        padding: 8px;
      }

      .chart-container {
        height: 250px;
      }
    }
    `
  ]
})
export class EmissionsChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: any = null;
  error: string | null = null;
  loading = false;
  hasData = false;

  filterOptions: FilterOptions = {
    countries: [],
    activities: [],
    emission_types: []
  };

  selectedCountry = '';
  selectedActivity = '';
  selectedEmissionType = '';

  constructor(private emissionsService: EmissionsService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadFilterOptions();
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  loadFilterOptions(): void {
    this.emissionsService.getFilterOptions().subscribe({
      next: (options) => {
        this.filterOptions = options;
      },
      error: (err) => {
        console.error('Failed to load filter options', err);
      }
    });
  }

  onFilterChange(): void {
    this.loadData();
  }

  resetFilters(): void {
    this.selectedCountry = '';
    this.selectedActivity = '';
    this.selectedEmissionType = '';
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;
    this.hasData = false;

    const filters: any = {};
    if (this.selectedCountry) filters.country = this.selectedCountry;
    if (this.selectedActivity) filters.activity = this.selectedActivity;
    if (this.selectedEmissionType) filters.emission_type = this.selectedEmissionType;

    this.emissionsService.getAggregatedByYear(filters).subscribe({
      next: (data: any[]) => {
        this.loading = false;
        if (!Array.isArray(data) || data.length === 0) {
          this.hasData = false;
          return;
        }
        const sanitized = data.map(d => ({ year: d.year, total: Number(d.total) }));
        this.hasData = true;
        this.cd.detectChanges();
        requestAnimationFrame(() => {
          const labels = sanitized.map(d => d.year);
          const values = sanitized.map(d => d.total);
          this.renderChart(labels, values);
        });
      },
      error: (err) => {
        console.error('Failed to load emissions data', err);
        this.loading = false;
        this.error = 'Failed to load emissions data from API';
      }
    });
  }

  renderChart(labels: number[], values: number[]): void {
    if (this.chart) {
      this.chart.destroy();
    }
    const ctx = this.chartCanvas?.nativeElement?.getContext('2d');
    if (!ctx) return;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Total emissions',
            data: values,
            fill: true,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Year' } },
          y: { title: { display: true, text: 'Emissions' } }
        }
      }
    });
  }
}
