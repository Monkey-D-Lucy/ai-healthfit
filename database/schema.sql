DROP DATABASE IF EXISTS healthfit_db;
CREATE DATABASE healthfit_db;
USE healthfit_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'patient',
    date_of_birth DATE,
    gender VARCHAR(10),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Health metrics table
CREATE TABLE health_metrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(20) DEFAULT 'manual',
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_metric_time (user_id, metric_type, recorded_at)
);

-- Appointments table
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    duration_minutes INT DEFAULT 30,
    status VARCHAR(20) DEFAULT 'pending',
    type VARCHAR(20) DEFAULT 'in_person',
    reason TEXT,
    notes TEXT,
    diagnosis TEXT,
    prescription TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_doctor_date (doctor_id, appointment_date),
    INDEX idx_patient_date (patient_id, appointment_date),
    INDEX idx_status (status)
);

-- Insert sample data (password for both is 'password123')
INSERT INTO users (email, password_hash, first_name, last_name, role, date_of_birth, gender, phone) VALUES
('patient@healthfit.com', 'pbkdf2:sha256:260000$9f7yXp2L$8e3d2a1b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2', 'John', 'Doe', 'patient', '1990-05-15', 'male', '+1234567890'),
('doctor@healthfit.com', 'pbkdf2:sha256:260000$9f7yXp2L$8e3d2a1b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2', 'Sarah', 'Johnson', 'doctor', '1985-08-20', 'female', '+1987654321');

-- Insert sample health metrics
INSERT INTO health_metrics (user_id, metric_type, value, unit, source) VALUES
(1, 'heart_rate', 72, 'bpm', 'wearable'),
(1, 'blood_pressure_systolic', 118, 'mmHg', 'manual'),
(1, 'blood_pressure_diastolic', 78, 'mmHg', 'manual'),
(1, 'weight', 75.5, 'kg', 'manual'),
(1, 'height', 175, 'cm', 'manual'),
(1, 'sleep_hours', 7.5, 'hours', 'wearable'),
(1, 'steps', 8432, 'steps', 'wearable');

-- Insert sample appointment
INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, type, reason) VALUES
(1, 2, DATE_ADD(NOW(), INTERVAL 2 DAY), 'confirmed', 'video', 'Annual checkup');