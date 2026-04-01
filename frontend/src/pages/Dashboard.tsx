import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import api from '../services/api';
import { FiActivity, FiCalendar, FiTrendingUp, FiHeart, FiMoon, FiUsers } from 'react-icons/fi';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface DashboardData {
  latest: any;
  trends: any;
  risk_prediction: any;
  upcoming_appointments: any[];
}

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, appointmentsRes] = await Promise.all([
        api.get('/health/summary'),
        api.get('/appointments/?status=pending,confirmed')
      ]);
      
      setData({
        ...summaryRes.data,
        upcoming_appointments: appointmentsRes.data.appointments.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = [
    { name: 'Heart Rate', value: data?.latest?.heart_rate || '--', unit: 'bpm', icon: FiHeart, color: 'text-red-500' },
    { name: 'Blood Pressure', value: data?.latest?.blood_pressure_systolic ? `${data.latest.blood_pressure_systolic}/${data.latest.blood_pressure_diastolic}` : '--', unit: 'mmHg', icon: FiActivity, color: 'text-blue-500' },
    { name: 'Sleep', value: data?.latest?.sleep_hours || '--', unit: 'hours', icon: FiMoon, color: 'text-purple-500' },
    { name: 'Weight', value: data?.latest?.weight || '--', unit: 'kg', icon: FiUsers, color: 'text-green-500' },
  ];

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Heart Rate',
        data: [72, 74, 71, 75, 73, 72, 70],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Sleep Hours',
        data: [7.2, 6.8, 7.5, 7.0, 6.5, 8.0, 7.8],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const riskData = {
    labels: data?.risk_prediction?.factors?.map((f: any) => f.name) || ['Cardiovascular', 'Metabolic', 'Respiratory'],
    datasets: [
      {
        data: data?.risk_prediction?.factors?.map((f: any) => {
          const riskMap: any = { low: 33, moderate: 66, high: 100 };
          return riskMap[f.risk] || 50;
        }) || [33, 50, 66],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.first_name}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Here's your health summary for today. Keep up the great work!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="glass-card p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <span className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{stat.name}</p>
              <p className="text-gray-400 text-xs mt-1">{stat.unit}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Trends</h3>
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

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Risk Assessment</h3>
          <div className="flex items-center justify-center">
            <div className="w-64">
              <Doughnut 
                data={riskData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Overall Risk: <span className={`font-semibold ${
                data?.risk_prediction?.overall_risk === 'low' ? 'text-green-600' :
                data?.risk_prediction?.overall_risk === 'moderate' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {data?.risk_prediction?.overall_risk?.toUpperCase()}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Health Score: {data?.risk_prediction?.score}/100
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 bg-gradient-to-r from-primary-50 to-emerald-50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Health Insights</h3>
            <p className="text-gray-600 mt-2">
              Based on your recent health data, here are some personalized recommendations:
            </p>
            <ul className="mt-4 space-y-2">
              {data?.risk_prediction?.recommendations?.map((rec: string, idx: number) => (
                <li key={idx} className="flex items-center text-sm text-gray-700">
                  <FiTrendingUp className="w-4 h-4 text-primary-600 mr-2" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-primary-600 rounded-full p-3">
            <FiTrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
          <FiCalendar className="w-5 h-5 text-gray-400" />
        </div>
        {data && data.upcoming_appointments && data.upcoming_appointments.length > 0 ? (
          <div className="space-y-3">
            {data.upcoming_appointments.map((apt: any) => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {apt.doctor?.full_name || 'Doctor Appointment'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(apt.appointment_date).toLocaleDateString()} at {new Date(apt.appointment_date).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;