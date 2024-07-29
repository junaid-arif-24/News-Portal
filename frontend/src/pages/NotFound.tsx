import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl font-medium text-gray-600">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
};

export default NotFound;
