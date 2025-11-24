# GreenHouse — Emissions demo

This repository contains a Django REST API backend and an Angular frontend that displays aggregated greenhouse gas emissions by year.

Quick overview
- Backend: Django + Django REST Framework. App: `emissions`.
  - Endpoints:
    - `GET /api/emissions/` — list/filter emission records (supports DRF pagination)
    - `GET /api/emissions/aggregate/` — aggregated total emissions by year
  - Fixtures: `emissions/fixtures/emissions.json`
  - Management command: `python manage.py seed_emissions` (loads fixtures if DB empty)
- Frontend: Angular app in `frontend/`
  - Service: `src/app/emissions.service.ts`
  - Chart component: `src/app/emissions-chart.component.ts` (uses chart.js)

Run backend (local)
1. Create virtualenv and install requirements:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Apply migrations and load fixtures (optional):

```bash
python manage.py migrate
python manage.py loaddata emissions    # or python manage.py seed_emissions
```

3. Run the Django dev server:

```bash
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/emissions/`.

Run frontend (local)
1. Install Node.js and npm (if you don't have them). On macOS you can use Homebrew:

```bash
brew install node
```

2. Install dependencies and start Angular dev server (proxy is configured to forward `/api` to the backend):

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200` in your browser.

Notes about development/CI
- CORS: `CORS_ALLOW_ALL_ORIGINS = True` is set in `GreenHouse/settings.py` for development convenience.
- The frontend uses a dev proxy: `frontend/proxy.conf.json` points `/api` to `http://web:8000` (suitable for Docker). The `npm start` script uses that proxy file.

Tests
- Django tests (backend):

```bash
python manage.py test
```

- Angular tests (frontend):
  - A unit test for the Angular `EmissionsService` was added at `frontend/src/app/emissions.service.spec.ts`.
  - To run Angular tests locally (requires Node/npm):

```bash
cd frontend
npm install
npm test
```

What I changed/added
- Frontend:
  - `src/app/emissions.service.ts` — normalize paginated responses and normalize aggregated endpoint response.
  - `src/app/emissions-chart.component.ts` — added loading state, no-data state, and improved error handling.
  - `src/app/emissions.service.spec.ts` — new unit test for the service (uses HttpClientTestingModule).
- Repo root: `README.md` (this file).

If you want, I can also:
- Add an Angular `loading` spinner or nicer UX for the chart.
- Switch the frontend to use `ng2-charts` module (uncommented in `AppModule`).
- Add CI config (GitHub Actions) to run Django and Angular tests.

If you'd like me to run the Angular tests here, I can attempt it if you allow installing Node/npm in this environment; otherwise you can run the commands above locally.

