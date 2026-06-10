import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/usercontext';

const FALLBACK_AVATAR =
  'https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg';

// Resolve a stored profile-picture path (which may be relative) to a full URL.
const resolveAvatar = (pic) => {
  if (!pic) return FALLBACK_AVATAR;
  if (pic.startsWith('http') || pic.startsWith('blob:')) return pic;
  return `${import.meta.env.VITE_BASE}${pic}`;
};

function UserProfile() {
  const { user, setUser } = useContext(UserDataContext);
  const [userDetails, setUserDetails] = useState({
    firstname: user?.fullname?.firstname || '',
    lastname: user?.fullname?.lastname || '',
    email: user?.email || '',
  });
  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(resolveAvatar(user?.profilePicture));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.profilePicture) {
      setPreview(resolveAvatar(user.profilePicture));
    }
  }, [user]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleUserChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordDetails({ ...passwordDetails, [e.target.name]: e.target.value });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch('/users/details', userDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUser(response.data.user);
      setMessage('Details updated successfully!');
      setError('');
    } catch (err) {
      setError('Failed to update details.');
      setMessage('');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/users/change-password', passwordDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessage('Password changed successfully!');
      setError('');
      setPasswordDetails({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
      setMessage('');
    }
  };

  const handlePictureSubmit = async (e) => {
    e.preventDefault();
    if (!profilePicture) {
      setError('Please select a picture to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
      const response = await axios.post('/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUser(response.data.user);
      setProfilePicture(null);
      setMessage('Profile picture updated!');
      setError('');
    } catch (err) {
      setError('Failed to upload picture.');
      setMessage('');
    }
  };

  const fullName = `${userDetails.firstname} ${userDetails.lastname}`.trim();

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* Floating toast */}
      {(message || error) && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg text-center text-sm font-medium ${
              message
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {message || error}
          </div>
        </div>
      )}

      {/* Gradient header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-700 h-44 relative">
        <Link
          to="/start"
          className="absolute top-5 left-5 flex items-center gap-1 text-white/90 hover:text-white transition-colors"
        >
          <i className="ri-arrow-left-s-line text-2xl"></i>
          <span className="text-sm font-medium">Back to Map</span>
        </Link>
        <h2 className="absolute top-6 left-1/2 -translate-x-1/2 text-xl font-semibold text-white">
          Your Profile
        </h2>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16">
        {/* Avatar card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={preview}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-md"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:bg-gray-800 transition-colors"
              title="Change photo"
            >
              <i className="ri-camera-line"></i>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePictureChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            {fullName || 'Your Name'}
          </h3>
          <p className="text-gray-500 text-sm">{userDetails.email}</p>

          {profilePicture && (
            <button
              onClick={handlePictureSubmit}
              className="mt-4 bg-black text-white font-medium rounded-xl px-6 py-2 text-sm hover:bg-gray-800 transition-colors"
            >
              Save new photo
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Personal details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <i className="ri-user-line text-xl text-gray-700"></i>
              <h3 className="text-lg font-semibold text-gray-800">Personal Details</h3>
            </div>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={userDetails.firstname}
                  onChange={handleUserChange}
                  className="mt-1 bg-gray-100 rounded-xl px-4 py-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={userDetails.lastname}
                  onChange={handleUserChange}
                  className="mt-1 bg-gray-100 rounded-xl px-4 py-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleUserChange}
                  className="mt-1 bg-gray-100 rounded-xl px-4 py-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white font-semibold rounded-xl px-4 py-3 text-base hover:bg-gray-800 transition-colors"
              >
                Update Details
              </button>
            </form>
          </div>

          {/* Change password */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <i className="ri-lock-2-line text-xl text-gray-700"></i>
              <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Old Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordDetails.oldPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 bg-gray-100 rounded-xl px-4 py-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordDetails.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 bg-gray-100 rounded-xl px-4 py-3 w-full text-base focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                />
              </div>
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-black hover:underline">
                  Forgot Old Password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white font-semibold rounded-xl px-4 py-3 text-base hover:bg-red-700 transition-colors"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
