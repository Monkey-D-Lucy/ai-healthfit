from .. import db
from datetime import datetime

class Appointment(db.Model):
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    duration_minutes = db.Column(db.Integer, default=30)
    status = db.Column(db.String(20), default='pending')
    type = db.Column(db.String(20), default='in_person')
    reason = db.Column(db.Text)
    notes = db.Column(db.Text)
    diagnosis = db.Column(db.Text)
    prescription = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        db.Index('idx_doctor_date', 'doctor_id', 'appointment_date'),
        db.Index('idx_patient_date', 'patient_id', 'appointment_date'),
        db.Index('idx_status', 'status'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'doctor_id': self.doctor_id,
            'appointment_date': self.appointment_date.isoformat() if self.appointment_date else None,
            'duration_minutes': self.duration_minutes,
            'status': self.status,
            'type': self.type,
            'reason': self.reason,
            'notes': self.notes,
            'diagnosis': self.diagnosis,
            'prescription': self.prescription
        }