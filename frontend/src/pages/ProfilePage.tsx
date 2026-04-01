import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import api from '../services/api';
import { FiUser, FiMail, FiPhone, FiCalendar, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  avatar_url?: string;
}

interface HealthStats {
  totalMetrics: number;
  avgHeartRate: number;
  avgSleep: number;
  totalSteps: number;
}

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    gender: ''
  });
  const [loading, setLoading] = useState(false);
  const [healthStats, setHealthStats] = useState<HealthStats>({
    totalMetrics: 0,
    avgHeartRate: 0,
    avgSleep: 0,
    totalSteps: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
    fetchHealthStats();
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data.user;
      setProfile(userData);
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone || '',
        date_of_birth: userData.date_of_birth || '',
        gender: userData.gender || ''
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchHealthStats = async () => {
    try {
      const response = await api.get('/health/metrics');
      const metrics = response.data.metrics || [];
      
      const heartRates = metrics.filter((m: any) => m.metric_type === 'heart_rate');
      const sleepHours = metrics.filter((m: any) => m.metric_type === 'sleep_hours');
      const steps = metrics.filter((m: any) => m.metric_type === 'steps');
      
      const avgHeartRate = heartRates.length > 0 
        ? heartRates.reduce((sum: number, m: any) => sum + m.value, 0) / heartRates.length 
        : 0;
      
      const avgSleep = sleepHours.length > 0 
        ? sleepHours.reduce((sum: number, m: any) => sum + m.value, 0) / sleepHours.length 
        : 0;
      
      const totalSteps = steps.length > 0 
        ? steps.reduce((sum: number, m: any) => sum + m.value, 0) 
        : 0;
      
      setHealthStats({
        totalMetrics: metrics.length,
        avgHeartRate: Math.round(avgHeartRate),
        avgSleep: Number(avgSleep.toFixed(1)),
        totalSteps: totalSteps
      });
    } catch (error) {
      console.error('Error fetching health stats:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/auth/profile', formData);
      setProfile({
        ...profile!,
        ...formData
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and health preferences</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6">
        <div className="flex items-start space-x-6">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-full w-24 h-24 flex items-center justify-center">
            <FiUser className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.first_name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.last_name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="flex items-center space-x-2">
                  <FiMail className="text-gray-400" />
                  <p className="text-gray-900">{profile.email}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {isEditing ? (
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <FiPhone className="text-gray-400" />
                    <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                {isEditing ? (
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="text-gray-400" />
                    <p className="text-gray-900">{profile.date_of_birth || 'Not provided'}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{profile.gender || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 text-center">
          <FiActivity className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{healthStats.totalMetrics}</p>
          <p className="text-sm text-gray-600">Total Metrics</p>
        </div>
        <div className="glass-card p-6 text-center">
          <FiActivity className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{healthStats.avgHeartRate}</p>
          <p className="text-sm text-gray-600">Avg Heart Rate (bpm)</p>
        </div>
        <div className="glass-card p-6 text-center">
          <FiActivity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{healthStats.avgSleep}</p>
          <p className="text-sm text-gray-600">Avg Sleep (hours)</p>
        </div>
        <div className="glass-card p-6 text-center">
          <FiActivity className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{healthStats.totalSteps.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Steps</p>
        </div>
      </div>

      {/* Account Information */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Account Type</span>
            <span className="font-medium text-gray-900 capitalize">{profile.role}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Member Since</span>
            <span className="font-medium text-gray-900">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Account Status</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;