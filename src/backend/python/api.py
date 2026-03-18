import sqlite3
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), '../../data/database.sqlite')
JSON_PATH = os.path.join(os.path.dirname(__file__), '../../data/scam_database.json')

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create reports table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            severity TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            status TEXT NOT NULL,
            provider TEXT NOT NULL,
            details TEXT
        )
    ''')
    
    # Create stats table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS statistics (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    ''')
    
    # Check if table is empty before initializing
    cursor.execute('SELECT COUNT(*) FROM statistics')
    if cursor.fetchone()[0] == 0:
        # Try to import from JSON if available
        initial_stats = [
            ('total_reports', '0'),
            ('blocked_threats', '0'),
            ('verified_partners', '0'),
            ('active_scams', '0')
        ]
        
        if os.path.exists(JSON_PATH):
            try:
                with open(JSON_PATH, 'r') as f:
                    data = json.load(f)
                    stats = data.get('statistics', {})
                    initial_stats = [
                        ('total_reports', str(stats.get('total_reports', 0))),
                        ('blocked_threats', str(stats.get('threats_blocked', 0))),
                        ('verified_partners', str(stats.get('active_users', 0))), # Mapping for context
                        ('active_scams', '0')
                    ]
                    
                    # Import reports from JSON if any
                    for scam in data.get('scams', []):
                        cursor.execute('''
                            INSERT INTO reports (title, category, severity, timestamp, status, provider, details)
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                        ''', (
                            scam.get('title'),
                            scam.get('category'),
                            scam.get('severity'),
                            scam.get('timestamp'),
                            scam.get('status'),
                            'System/Legacy',
                            scam.get('details', 'Imported from JSON')
                        ))
            except Exception as e:
                print(f"Error importing JSON data: {e}")
        
        cursor.executemany('INSERT OR IGNORE INTO statistics (key, value) VALUES (?, ?)', initial_stats)
    
    conn.commit()
    conn.close()

@app.route('/api/data', methods=['GET'])
def get_all_data():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Fetch reports
    cursor.execute('SELECT * FROM reports ORDER BY id DESC')
    columns = [column[0] for column in cursor.description]
    reports = []
    for row in cursor.fetchall():
        reports.append(dict(zip(columns, row)))
    
    # Fetch stats
    cursor.execute('SELECT * FROM statistics')
    stats = {row[0]: row[1] for row in cursor.fetchall()}
    
    conn.close()
    
    return jsonify({
        "scams": reports,
        "stats": stats
    })

@app.route('/api/report', methods=['POST'])
def add_report():
    data = request.json
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO reports (title, category, severity, timestamp, status, provider, details)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('title'),
        data.get('category'),
        data.get('severity'),
        data.get('timestamp'),
        data.get('status'),
        data.get('provider'),
        data.get('details')
    ))
    
    # Increment total reports
    cursor.execute("UPDATE statistics SET value = CAST(value AS INTEGER) + 1 WHERE key = 'total_reports'")
    
    conn.commit()
    conn.close()
    
    return jsonify({"status": "success", "message": "Report logged to database."})

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get("PORT", 5000))
    print(f"[*] Database initialized and listening on port {port}")
    app.run(host='0.0.0.0', port=port)
