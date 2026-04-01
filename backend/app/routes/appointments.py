from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.appointment import Appointment
from ..models.user import User
from .. import db
from datetime import datetime

appointments_bp = Blueprint('appointments', __name__)

@appointments_bp.route('', methods=['GET'])
@jwt_required()
def get_appointments():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'appointments': []}), 200
        
        status = request.args.get('status')
        
        if user.role == 'patient':
            query = Appointment.query.filter_by(patient_id=user_id)
        elif user.role == 'doctor':
            query = Appointment.query.filter_by(doctor_id=user_id)
        else:
            query = Appointment.query
        
        if status:
            status_list = status.split(',')
            query = query.filter(Appointment.status.in_(status_list))
        
        appointments = query.order_by(Appointment.appointment_date.desc()).limit(10).all()
        
        result = []
        for appt in appointments:
            appt_dict = appt.to_dict()
            
            if user.role == 'patient':
                doctor = User.query.get(appt.doctor_id)
                if doctor:
                    appt_dict['doctor'] = doctor.to_dict()
            elif user.role == 'doctor':
                patient = User.query.get(appt.patient_id)
                if patient:
                    appt_dict['patient'] = patient.to_dict()
            
            result.append(appt_dict)
        
        return jsonify({'appointments': result})
        
    except Exception as e:
        print(f"Error in get_appointments: {str(e)}")
        return jsonify({'appointments': []}), 200

@appointments_bp.route('/book', methods=['POST'])
@jwt_required()
def book_appointment():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        doctor = User.query.filter_by(id=data['doctor_id'], role='doctor').first()
        if not doctor:
            return jsonify({'error': 'Doctor not found'}), 404
        
        existing = Appointment.query.filter_by(
            doctor_id=data['doctor_id'],
            appointment_date=datetime.fromisoformat(data['appointment_date'])
        ).first()
        
        if existing:
            return jsonify({'error': 'Time slot already booked'}), 400
        
        appointment = Appointment(
            patient_id=user_id,
            doctor_id=data['doctor_id'],
            appointment_date=datetime.fromisoformat(data['appointment_date']),
            duration_minutes=data.get('duration_minutes', 30),
            type=data.get('type', 'in_person'),
            reason=data.get('reason')
        )
        
        db.session.add(appointment)
        db.session.commit()
        
        return jsonify({'appointment': appointment.to_dict()}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/<int:appointment_id>/confirm', methods=['PUT'])
@jwt_required()
def confirm_appointment(appointment_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404
        
        if user.role != 'admin' and appointment.doctor_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        appointment.status = 'confirmed'
        db.session.commit()
        
        return jsonify({'appointment': appointment.to_dict()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/<int:appointment_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_appointment(appointment_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404
        
        if user.role != 'admin' and appointment.patient_id != user_id and appointment.doctor_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        appointment.status = 'cancelled'
        db.session.commit()
        
        return jsonify({'appointment': appointment.to_dict()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500