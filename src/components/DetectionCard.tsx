import React from 'react';

interface DetectionCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

const DetectionCard: React.FC<DetectionCardProps> = ({ title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        p-6 rounded-xl backdrop-blur-sm 
        transform transition-all duration-300 ease-in-out hover:scale-105 text-left
        border cursor-pointer group
        bg-gradient-to-br from-emerald-500/5 via-blue-500/10 to-emerald-500/5 
        border-emerald-100/50 shadow-lg hover:shadow-xl 
        hover:bg-gradient-to-br hover:from-emerald-500/10 hover:via-blue-500/15 hover:to-emerald-500/10
      `}
    >
      <div 
        className="text-2xl mb-3 bg-gradient-to-r from-emerald-600 to-blue-500 
          bg-clip-text text-transparent font-semibold
          group-hover:scale-105 transition-transform duration-300"
      >
        {title}
      </div>
      <p className="text-gray-600 group-hover:text-gray-700">
        {description}
      </p>
    </button>
  );
};

export default DetectionCard;