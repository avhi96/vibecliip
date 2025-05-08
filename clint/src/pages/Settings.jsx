import React, { useContext, useState } from 'react';
import ProfileEdit from '../components/ProfileEdit';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [activeTab, setActiveTab] = useState('editProfile');
  const navigate = useNavigate();

  const handleProfileUpdated = (user) => {
    setUpdatedUser(user);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg mt-8 bg-white dark:bg-gray-900 text-black dark:text-yellow-400 min-h-screen shadow-lg">
      <button
        onClick={handleGoBack}
        className="mb-6 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-semibold transition"
        aria-label="Go back"
      >
        Go Back
      </button>
      <h1 className="text-4xl font-bold mb-8">Settings</h1>

      <div className="flex space-x-4 mb-6 border-b border-gray-300 dark:border-yellow-400">
        <button
          className={`px-4 py-2 font-semibold rounded-t-lg ${
            activeTab === 'editProfile'
              ? 'bg-yellow-400 text-gray-900'
              : 'text-gray-600 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-600'
          }`}
          onClick={() => setActiveTab('editProfile')}
        >
          Edit Profile
        </button>
        <button
          className={`px-4 py-2 font-semibold rounded-t-lg ${
            activeTab === 'appearance'
              ? 'bg-yellow-400 text-gray-900'
              : 'text-gray-600 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-600'
          }`}
          onClick={() => setActiveTab('appearance')}
        >
          Appearance
        </button>
      </div>

      {activeTab === 'editProfile' && (
        <section>
          <ProfileEdit user={updatedUser} onProfileUpdated={handleProfileUpdated} />
        </section>
      )}

{activeTab === 'appearance' && (
  <section>
    <h2 className="text-2xl font-semibold mb-4">Appearance</h2>
    <div className="flex items-center space-x-4">
      <label htmlFor="darkModeToggle" className="font-medium">
        Dark Mode
      </label>
      <button
        id="darkModeToggle"
        onClick={toggleTheme}
        style={{
          width: '50px',
          height: '25px',
          backgroundColor: darkMode ? '#fbbf24' : '#ccc',
          borderRadius: '15px',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          outline: 'none',
        }}
        aria-pressed={darkMode}
        aria-label="Toggle dark mode"
      >
        <span
          style={{
            position: 'absolute',
            top: '2px',
            left: darkMode ? '26px' : '2px',
            width: '21px',
            height: '21px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            transition: 'left 0.2s ease',
          }}
        />
      </button>
      <span className="text-lg font-semibold">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
    </div>
  </section>
)}

    </div>
  );
};

export default Settings;
