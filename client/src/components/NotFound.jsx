import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#020918] text-white text-center px-4">
      <h1 className="text-5xl font-bold mb-4 text-[#FFA500]">404 - Page Not Found</h1>
      <p className="text-lg mb-6">Oops! The page you are looking for doesn't exist.</p>
      <Link
        to="/"
        className="bg-[#FFA500] text-[#020918] px-6 py-3 rounded-lg font-bold hover:bg-[#ff8c00] transition duration-300"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
