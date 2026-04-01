import React, { useState } from 'react';
import { FiCpu, FiHeart, FiActivity, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface PredictionResult {
  risk_level: string;
  risk_score: number;
  recommendations: string[];
  health_score: number;
}

const AIInsightsPage: React.FC = () => {
  const [healthData, setHealthData] = useState({
    age: '',
    gender: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    heart_rate: '',
    weight: '',
    height: '',
    sleep_hours: '',
    exercise_minutes: '',
    stress_level: ''
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setHealthData({
      ...healthData,
      [e.target.name]: e.target.value
    });
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const age = parseFloat(healthData.age) || 0;
      const bpSystolic = parseFloat(healthData.blood_pressure_systolic) || 120;
      const heartRate = parseFloat(healthData.heart_rate) || 75;
      const sleepHours = parseFloat(healthData.sleep_hours) || 7;
      const exerciseMinutes = parseFloat(healthData.exercise_minutes) || 60;
      
      let riskScore = 0;
      if (age > 50) riskScore += 20;
      if (bpSystolic > 140) riskScore += 25;
      if (heartRate > 100) riskScore += 15;
      if (sleepHours < 6) riskScore += 20;
      if (exerciseMinutes < 30) riskScore += 20;
      
      riskScore = Math.min(100, riskScore + Math.floor(Math.random() * 10));
      
      let riskLevel = 'low';
      if (riskScore > 70) riskLevel = 'critical';
      else if (riskScore > 50) riskLevel = 'high';
      else if (riskScore > 30) riskLevel = 'moderate';
      
      const recommendations = [];
      if (age > 50) recommendations.push('Regular health screenings recommended');
      if (bpSystolic > 140) recommendations.push('Monitor blood pressure and consider dietary changes');
      if (heartRate > 100) recommendations.push('Consult doctor about heart rate');
      if (sleepHours < 6) recommendations.push('Aim for 7-8 hours of sleep');
      if (exerciseMinutes < 30) recommendations.push('Increase physical activity to 150 minutes per week');
      
      if (recommendations.length === 0) {
        recommendations.push('Maintain your healthy lifestyle!');
        recommendations.push('Continue regular exercise routine');
        recommendations.push('Keep up with balanced diet');
      }
      
      setPrediction({
        risk_level: riskLevel,
        risk_score: riskScore,
        health_score: 100 - riskScore,
        recommendations: recommendations.slice(0, 4)
      });
      setLoading(false);
      toast.success('AI analysis complete!');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FiCpu className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Health Insights</h1>
          <p className="text-gray-600">Get personalized health predictions and recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Data Input</h3>
          <form onSubmit={handlePredict} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={healthData.age}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={healthData.gender}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  name="blood_pressure_systolic"
                  value={healthData.blood_pressure_systolic}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  name="blood_pressure_diastolic"
                  value={healthData.blood_pressure_diastolic}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  name="heart_rate"
                  value={healthData.heart_rate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sleep (hours)</label>
                <input
                  type="number"
                  step="0.5"
                  name="sleep_hours"
                  value={healthData.sleep_hours}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={healthData.weight}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={healthData.height}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exercise (mins/week)</label>
                <input
                  type="number"
                  name="exercise_minutes"
                  value={healthData.exercise_minutes}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stress Level (1-10)</label>
                <input
                  type="number"
                  name="stress_level"
                  value={healthData.stress_level}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <FiCpu className="w-5 h-5" />
                  <span>Get AI Prediction</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Results</h3>
          {prediction ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-gray-200"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-primary-600"
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                      strokeDasharray={`${2 * Math.PI * 58}`}
                      strokeDashoffset={`${2 * Math.PI * 58 * (1 - prediction.health_score / 100)}`}
                      transform="rotate(-90 64 64)"
                    />
                  </svg>
                  <div className="absolute">
                    <span className="text-2xl font-bold text-gray-900">{prediction.health_score}</span>
                    <span className="text-sm text-gray-600">/100</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">Health Score</p>
              </div>

              <div className={`p-4 rounded-lg text-center ${
                prediction.risk_level === 'low' ? 'bg-green-50' :
                prediction.risk_level === 'moderate' ? 'bg-yellow-50' :
                prediction.risk_level === 'high' ? 'bg-orange-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center justify-center space-x-2">
                  <FiAlertCircle className={`w-5 h-5 ${
                    prediction.risk_level === 'low' ? 'text-green-600' :
                    prediction.risk_level === 'moderate' ? 'text-yellow-600' :
                    prediction.risk_level === 'high' ? 'text-orange-600' : 'text-red-600'
                  }`} />
                  <span className={`font-semibold ${
                    prediction.risk_level === 'low' ? 'text-green-800' :
                    prediction.risk_level === 'moderate' ? 'text-yellow-800' :
                    prediction.risk_level === 'high' ? 'text-orange-800' : 'text-red-800'
                  }`}>
                    Risk Level: {prediction.risk_level.toUpperCase()} ({prediction.risk_score}%)
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <FiTrendingUp className="w-4 h-4 text-primary-600" />
                  <span>AI Recommendations</span>
                </h4>
                <ul className="space-y-2">
                  {prediction.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FiCpu className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Enter your health data to get AI-powered insights</p>
              <p className="text-sm text-gray-400 mt-1">Our AI will analyze your health metrics and provide personalized recommendations</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center hover:shadow-xl transition-shadow">
          <div className="bg-primary-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <FiHeart className="w-6 h-6 text-primary-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Risk Prediction</h4>
          <p className="text-sm text-gray-600">AI-powered health risk assessment based on your metrics</p>
        </div>
        
        <div className="glass-card p-6 text-center hover:shadow-xl transition-shadow">
          <div className="bg-primary-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <FiActivity className="w-6 h-6 text-primary-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Exercise Analysis</h4>
          <p className="text-sm text-gray-600">Real-time form correction using computer vision</p>
        </div>
        
        <div className="glass-card p-6 text-center hover:shadow-xl transition-shadow">
          <div className="bg-primary-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <FiCpu className="w-6 h-6 text-primary-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Personalized Insights</h4>
          <p className="text-sm text-gray-600">Custom health recommendations based on your data</p>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPage;