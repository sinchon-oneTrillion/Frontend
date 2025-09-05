import React from 'react';

const DonutProgress = ({ percentage, size = 24, strokeWidth = 2 }) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(156, 163, 175, 0.3)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* 진행률 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={
            percentage >= 80
              ? '#10B981'
              : percentage >= 50
                ? '#F59E0B'
                : '#EF4444'
          }
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center"></div>
    </div>
  );
};

export default DonutProgress;
