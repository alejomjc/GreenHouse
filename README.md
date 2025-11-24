# GreenHouse Emissions Tracker

Full-stack application for tracking and visualizing greenhouse gas emissions data.

## Tech Stack

**Backend:**
- Django + Django REST Framework
- SQLite database
- Python 3.11

**Frontend:**
- Angular 15
- Chart.js for data visualization
- TypeScript

## Features

- ✅ Emissions data visualization with interactive charts
- ✅ Filter by country, activity, and emission type
- ✅ Responsive design for mobile and desktop
- ✅ REST API with filtering and aggregation
- ✅ Dockerized for easy deployment

## API Endpoints

- `GET /api/emissions/` - List/filter emission records
- `GET /api/emissions/aggregate/` - Aggregated emissions by year
- `GET /api/emissions/filters/` - Available filter options

## Quick Start with Docker

**Prerequisites:** Docker and Docker Compose installed

1. Clone the repository:
```bash
git clone https://github.com/alejomjc/GreenHouse.git
cd GreenHouse
```

2. Start the application:
```bash
docker compose up --build
```

3. Access the application:
- Frontend: http://localhost:4200
- Backend API: http://localhost:8000/api/emissions/

The database will be automatically created and populated with sample data on first run.

## Development

### Stop the application:
```bash
docker compose down
```

### View logs:
```bash
docker compose logs -f
```

### Rebuild containers:
```bash
docker compose up --build
```

### Reset database:
```bash
docker compose down -v
docker compose up --build
```

## Testing

### Backend Tests (Django)

Run all backend tests:
```bash
docker compose exec web python manage.py test
```

Run tests for a specific app:
```bash
docker compose exec web python manage.py test emissions
```

Run tests with verbose output:
```bash
docker compose exec web python manage.py test --verbosity=2
```

### Frontend Tests (Angular)

Run all frontend tests (single run):
```bash
docker compose exec frontend npm test
```

Run tests in watch mode for development:
```bash
docker compose exec frontend npm run test -- --watch
```

Run tests with code coverage:
```bash
docker compose exec frontend npm run test -- --code-coverage
```

**Note:** Tests are not executed automatically when starting containers. They should be run manually during development or as part of a CI/CD pipeline.

## Project Structure

```
GreenHouse/
├── emissions/          # Django app
│   ├── models.py      # Emission data model
│   ├── views.py       # API views
│   ├── serializers.py # DRF serializers
│   └── migrations/    # Database migrations (includes initial data)
├── frontend/          # Angular application
│   └── src/app/
│       ├── emission.model.ts           # TypeScript interface
│       ├── emissions.service.ts        # API service
│       └── emissions-chart.component.ts # Chart component with filters
├── docker-compose.yml # Docker orchestration
└── Dockerfile        # Backend container
```

## Sample Data

The application includes sample emissions data for:
- **Countries:** United Kingdom, France, Germany, Spain, Italy
- **Activities:** Air travel, Waste, Agriculture, Transport, Industry, Energy Production
- **Emission Types:** CO2, N2O, CH4
- **Years:** 2015-2020

Data is automatically loaded via Django migrations on first run.
