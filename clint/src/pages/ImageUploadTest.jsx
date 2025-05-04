import React from 'react';
import PostUpload from '../components/PostUpload';

const ImageUploadTest = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 text-yellow-400 rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Image Upload Test</h1>
      <PostUpload />
    </div>
  );
};

export default ImageUploadTest;
