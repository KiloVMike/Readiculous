import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 border-4 border-t-transparent border-green-500 rounded-full animate-spin-slow"></div>
      </div>
    </div>
  );
};

export default Loader;
