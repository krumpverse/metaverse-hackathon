import React from 'react';

interface SubcriterionSliderProps {
  name: string;
  maxPoints: number;
  value: number;
  onChange: (value: number) => void;
}

export const SubcriterionSlider: React.FC<SubcriterionSliderProps> = ({ name, maxPoints, value, onChange }) => {
  const percentage = (value / maxPoints) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm">{name}</label>
        <span className="text-sm font-semibold">{value} / {maxPoints}</span>
      </div>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <div 
            style={{ width: `${percentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
          ></div>
        </div>
        <div 
          className="absolute left-0 top-0 h-2 flex items-center justify-center"
          style={{ left: `${percentage}%` }}
        >
          <div className="w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow"></div>
        </div>
        <input
          type="range"
          min={0}
          max={maxPoints}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute top-0 left-0 w-full h-2 -mt-1 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};