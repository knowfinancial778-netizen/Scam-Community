# ScamGuard Pro

High-performance scam detection and reporting platform with a Python-based AI Engine Cluster and SQLite Database.

## Prerequisites
- Python 3.x
- Flask
- Flask-CORS

## Setup
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the application:
   ```bash
   python main.py
   ```

## Architecture
- **Master Controller**: `main.py` - Orchestrates the front-end and back-end services.
- **Backend API**: `src/backend/python/api.py` - Flask server managing SQLite database operations.
- **Database**: `src/data/database.sqlite` - Stores persistent scam reports and statistics.
- **Frontend**: `index.html` + `src/web/js/app.js` - Dynamic UI with real-time reporting capabilities.

## Multi-Language Support
ScamGuard Pro supports:
- English
- Hindi (हिन्दी)
- Marathi (मराठी)
