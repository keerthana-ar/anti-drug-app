import React from 'react';
import Svg, { Circle, Path, G } from 'react-native-svg';

interface AppIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const AppIcon: React.FC<AppIconProps> = ({ 
  width = 1024, 
  height = 1024, 
  color = '#4CAF50' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 1024 1024">
      {/* Background Circle */}
      <Circle cx={512} cy={512} r={512} fill={color} />
      
      {/* No Drug Symbol */}
      <G transform="translate(256, 256) scale(0.5)">
        <Circle cx={512} cy={512} r={400} fill="white" />
        <Path
          d="M512 912c-220.91 0-400-179.09-400-400s179.09-400 400-400 400 179.09 400 400-179.09 400-400 400zM296.92 296.92c-118.8 118.8-118.8 311.36 0 430.16 118.8 118.8 311.36 118.8 430.16 0 118.8-118.8 118.8-311.36 0-430.16-118.8-118.8-311.36-118.8-430.16 0z"
          fill={color}
        />
        <Path
          d="M782.74 241.26L241.26 782.74"
          stroke={color}
          strokeWidth="80"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
};

export default AppIcon; 