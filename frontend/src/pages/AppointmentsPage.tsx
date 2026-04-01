import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiCalendar, FiClock, FiUser, FiVideo, FiMapPin, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  duration_minutes: number;
  status: string;
  type: string;
  reason: string;
  doctor?: any;
  patient?: any;
}

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  specialization: string;
}

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    doctor_id: '',
    appointment_date: '',
    type: 'in_person',
    reason: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/');
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/users/doctors');
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([
        { id: 1, first_name: 'Sarah', last_name: 'Johnson', specialization: 'Cardiology' },
        { id: 2, first_name: 'Michael', last_name: 'Chen', specialization: 'General Medicine' },
      ]);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/appointments/book', bookingData);
      toast.success('Appointment booked successfully!');
      setShowBookingForm(false);
      setBookingData({ doctor_id: '', appointment_date: '', type: 'in_person', reason: '' });
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to book appointment');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your medical appointments</p>
        </div>
        <button
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus className="w-5 h-5" />
          <span>Book Appointment</span>
        </button>
      </div>

      {showBookingForm && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Book New Appointment</h3>
          <form onSubmit={handleBookAppointment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <select
                value={bookingData.doctor_id}
                onChange={(e) => setBookingData({ ...bookingData, doctor_id: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select a doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
              <input
                type="datetime-local"
                value={bookingData.appointment_date}
                onChange={(e) => setBookingData({ ...bookingData, appointment_date: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
              <select
                value={bookingData.type}
                onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                className="input-field"
              >
                <option value="in_person">In Person</option>
                <option value="video">Video Call</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
              <textarea
                value={bookingData.reason}
                onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                className="input-field"
                rows={3}
                required
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">Book Appointment</button>
              <button
                type="button"
                onClick={() => setShowBookingForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Appointments</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FiUser className="text-primary-600" />
                      <h4 className="font-semibold text-gray-900">
                        Dr. {apt.doctor?.first_name} {apt.doctor?.last_name}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <FiCalendar className="w-4 h-4" />
                        <span>{new Date(apt.appointment_date).toLocaleDateString()}</span>
                        <FiClock className="w-4 h-4 ml-2" />
                        <span>{new Date(apt.appointment_date).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {apt.type === 'video' ? (
                          <FiVideo className="w-4 h-4" />
                        ) : (
                          <FiMapPin className="w-4 h-4" />
                        )}
                        <span>{apt.type === 'video' ? 'Video Consultation' : 'In-Person Visit'}</span>
                      </div>
                      {apt.reason && (
                        <p className="mt-2 text-gray-500">
                          <span className="font-medium">Reason:</span> {apt.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  {apt.status === 'pending' && (
                    <button className="text-sm text-primary-600 hover:text-primary-700">
                      Reschedule
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No appointments found</p>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;