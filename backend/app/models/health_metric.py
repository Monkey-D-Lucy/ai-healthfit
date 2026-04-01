from .. import db
from datetime import datetime

class HealthMetric(db.Model):
    __tablename__ = 'health_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    metric_type = db.Column(db.String(50), nullable=False)
    value = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(20))
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)
    source = db.Column(db.String(20), default='manual')
    notes = db.Column(db.Text)
    
    __table_args__ = (
        db.Index('idx_user_metric_time', 'user_id', 'metric_type', 'recorded_at'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'metric_type': self.metric_type,
            'value': float(self.value),
            'unit': self.unit,
            'recorded_at': self.recorded_at.isoformat() if self.recorded_at else None,
            'source': self.source,
            'notes': self.notes
        }