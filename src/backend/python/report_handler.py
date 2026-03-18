import json
import random

def handler(event, context):
    """
    Netlify Python Function for AI-based Scam Analysis (25% of Logic)
    """
    if event['httpMethod'] != 'POST':
        return {
            'statusCode': 405,
            'body': json.dumps({'error': 'Method Not Allowed'})
        }

    try:
        data = json.loads(event['body'])
        description = data.get('description', '')
        
        # Mock AI Analysis Logic
        risk_score = random.randint(1, 100)
        scam_keywords = ['crypto', 'urgency', 'password', 'verify', 'link', 'bank']
        
        detected_keywords = [word for word in scam_keywords if word in description.lower()]
        
        analysis_result = {
            'engine': 'Python AI Analyzer',
            'risk_score': risk_score,
            'severity': 'High' if risk_score > 70 else 'Medium' if risk_score > 30 else 'Low',
            'detected_patterns': detected_keywords,
            'status': 'Processed'
        }

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps(analysis_result)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
