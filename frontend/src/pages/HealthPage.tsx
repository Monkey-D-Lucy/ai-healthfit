import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiActivity, FiPlus, FiTrendingUp, FiHeart, FiMoon, FiDroplet } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HealthMetric {
  id: number;
  metric_type: string;
  value: number;
  unit: string;
  recorded_at: string;
}

const HealthPage: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newMetric, setNewMetric] = useState({
    metric_type: 'heart_rate',
    value: '',
    unit: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);

  const metricTypes = [
    { value: 'heart_rate', label: 'Heart Rate', unit: 'bpm', icon: FiHeart },
    { value: 'blood_pressure_systolic', label: 'Blood Pressure (Systolic)', unit: 'mmHg', icon: FiActivity },
    { value: 'blood_pressure_diastolic', label: 'Blood Pressure (Diastolic)', unit: 'mmHg', icon: FiActivity },
    { value: 'weight', label: 'Weight', unit: 'kg', icon: FiActivity },
    { value: 'height', label: 'Height', unit: 'cm', icon: FiActivity },
    { value: 'sleep_hours', label: 'Sleep Hours', unit: 'hours', icon: FiMoon },
    { value: 'steps', label: 'Steps', unit: 'steps', icon: FiActivity },
    { value: 'calories_burned', label: 'Calories Burned', unit: 'kcal', icon: FiActivity },
    { value: 'water_intake', label: 'Water Intake', unit: 'ml', icon: FiDroplet },
  ];

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await api.get('/health/metrics');
      setMetrics(response.data.metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedMetric = metricTypes.find(m => m.value === newMetric.metric_type);
      await api.post('/health/metrics', {
        ...newMetric,
        value: parseFloat(newMetric.value),
        unit: selectedMetric?.unit
      });
      toast.success('Health metric added successfully!');
      setShowForm(false);
      setNewMetric({ metric_type: 'heart_rate', value: '', unit: '', notes: '' });
      fetchMetrics();
    } catch (error) {
      toast.error('Failed to add metric');
    }
  };

  const getMetricIcon = (type: string) => {
    const metric = metricTypes.find(m => m.value === type);
    if (metric) {
      const Icon = metric.icon;
      return <Icon className="w-5 h-5 text-primary-600" />;
    }
    return <FiActivity className="w-5 h-5 text-primary-600" />;
  };

  const heartRateData = metrics
    .filter(m => m.metric_type === 'heart_rate')
    .slice(-7)
    .map(m => m.value);
  
  const chartData = {
    labels: heartRateData.map((_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Heart Rate (bpm)',
        data: heartRateData,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Metrics</h1>
          <p className="text-gray-600 mt-1">Track and monitor your health data</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Metric</span>
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Health Metric</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metric Type</label>
              <select
                value={newMetric.metric_type}
                onChange={(e) => setNewMetric({ ...newMetric, metric_type: e.target.value })}
                className="input-field"
                required
              >
                {metricTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <input
                type="number"
                step="any"
                value={newMetric.value}
                onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <textarea
                value={newMetric.notes}
                onChange={(e) => setNewMetric({ ...newMetric, notes: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">Save Metric</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {heartRateData.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Heart Rate Trend</h3>
          <Line 
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
            }}
          />
        </div>
      )}

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Metrics</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : metrics.length > 0 ? (
          <div className="space-y-3">
            {metrics.slice(0, 10).map((metric) => (
              <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getMetricIcon(metric.metric_type)}
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {metric.metric_type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(metric.recorded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {metric.value} {metric.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No health metrics recorded yet</p>
        )}
      </div>
    </div>
  );
};

export default HealthPage;