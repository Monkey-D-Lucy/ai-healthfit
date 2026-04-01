from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'http://localhost:5000'])

@app.route('/api/predict-risk', methods=['POST', 'OPTIONS'])
def predict_risk():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        
        age = data.get('age', 30)
        bp_systolic = data.get('blood_pressure_systolic', 120)
        heart_rate = data.get('heart_rate', 75)
        sleep_hours = data.get('sleep_hours', 7)
        exercise_minutes = data.get('exercise_minutes', 60)
        
        risk_score = 0
        if age > 50:
            risk_score += 20
        if bp_systolic > 140:
            risk_score += 25
        if heart_rate > 100:
            risk_score += 15
        if sleep_hours < 6:
            risk_score += 20
        if exercise_minutes < 30:
            risk_score += 20
        
        risk_score = min(100, risk_score + random.randint(-5, 5))
        
        if risk_score < 30:
            risk_level = 'low'
        elif risk_score < 60:
            risk_level = 'moderate'
        elif risk_score < 80:
            risk_level = 'high'
        else:
            risk_level = 'critical'
        
        recommendations = []
        if age > 50:
            recommendations.append('Regular health screenings recommended')
        if bp_systolic > 140:
            recommendations.append('Monitor blood pressure and consider dietary changes')
        if heart_rate > 100:
            recommendations.append('Consult doctor about heart rate')
        if sleep_hours < 6:
            recommendations.append('Aim for 7-8 hours of sleep')
        if exercise_minutes < 30:
            recommendations.append('Increase physical activity to 150 minutes per week')
        
        if not recommendations:
            recommendations = [
                'Maintain your healthy lifestyle!',
                'Continue regular exercise routine',
                'Keep up with balanced diet'
            ]
        
        return jsonify({
            'risk_level': risk_level,
            'risk_score': risk_score,
            'recommendations': recommendations[:4],
            'health_score': 100 - risk_score
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-exercise', methods=['POST', 'OPTIONS'])
def analyze_exercise():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        return jsonify({
            'form_score': random.randint(70, 95),
            'feedback': [
                'Keep back straight during movement',
                'Maintain steady breathing rhythm',
                'Control descent speed',
                'Engage core muscles throughout'
            ],
            'reps_completed': random.randint(8, 12),
            'recommended_reps': 12,
            'exercise_form': 'good' if random.random() > 0.3 else 'needs_improvement'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health-check', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'ai-service', 'version': '1.0'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)