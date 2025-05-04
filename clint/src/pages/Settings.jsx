import React, { useContext, useState } from 'react';
import ProfileEdit from '../components/ProfileEdit';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [updatedUser, setUpdatedUser] = useState(user);
  const navigate = useNavigate();

  const handleProfileUpdated = (user) => {
    setUpdatedUser(user);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg mt-8 bg-white dark:bg-gray-800 text-black dark:text-yellow-400 min-h-screen shadow-lg">
      <button
        onClick={handleGoBack}
        className="mb-6 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-semibold transition"
        aria-label="Go back"
      >
        Go Back
      </button>
      <h1 className="text-4xl font-bold mb-8">Settings</h1>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
        <ProfileEdit user={updatedUser} onProfileUpdated={handleProfileUpdated} />
      </section>
      {/* Additional settings sections like Password change can be added here */}
    </div>
  );
};

export default Settings;
