import React, { useState, useEffect } from 'react';
import { FiHeart, FiActivity, FiMoon } from 'react-icons/fi';

interface HealthData {
  heartRate: number;
  steps: number;
  sleep: number;
}

const VirtualSmartWatch: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: 72,
    steps: 8432,
    sleep: 7.5
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthData(prev => ({
        heartRate: Math.floor(Math.random() * (85 - 65 + 1) + 65),
        steps: prev.steps + Math.floor(Math.random() * 50),
        sleep: Number((prev.sleep + (Math.random() - 0.5) * 0.1).toFixed(1))
      }));
      
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className={`
        bg-gradient-to-br from-primary-500 to-primary-700 
        rounded-2xl p-4 shadow-lg cursor-pointer
        transition-all duration-300 hover:scale-105
        ${isAnimating ? 'animate-pulse' : ''}
      `}>
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="flex items-center space-x-1 text-white">
              <FiHeart className="animate-pulse" />
              <span className="text-2xl font-bold">{healthData.heartRate}</span>
              <span className="text-sm">bpm</span>
            </div>
            <p className="text-primary-100 text-xs">Heart Rate</p>
          </div>

          <div className="w-px h-8 bg-primary-400" />

          <div className="text-center">
            <div className="flex items-center space-x-1 text-white">
              <FiActivity />
              <span className="text-2xl font-bold">{healthData.steps.toLocaleString()}</span>
            </div>
            <p className="text-primary-100 text-xs">Steps</p>
          </div>

          <div className="w-px h-8 bg-primary-400" />

          <div className="text-center">
            <div className="flex items-center space-x-1 text-white">
              <FiMoon />
              <span className="text-2xl font-bold">{healthData.sleep}</span>
              <span className="text-sm">hrs</span>
            </div>
            <p className="text-primary-100 text-xs">Sleep</p>
          </div>
        </div>
      </div>

      {isAnimating && (
        <div className="absolute inset-0 rounded-2xl border-2 border-primary-400 animate-ping" />
      )}
    </div>
  );
};

export default VirtualSmartWatch;