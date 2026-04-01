from .. import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), default='patient')
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(10))
    phone = db.Column(db.String(20))
    avatar_url = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    health_metrics = db.relationship('HealthMetric', backref='user', lazy=True, cascade='all, delete-orphan')
    appointments_as_patient = db.relationship('Appointment', foreign_keys='Appointment.patient_id', backref='patient', lazy=True)
    appointments_as_doctor = db.relationship('Appointment', foreign_keys='Appointment.doctor_id', backref='doctor', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'avatar_url': self.avatar_url,
            'full_name': f"{self.first_name} {self.last_name}"
        }