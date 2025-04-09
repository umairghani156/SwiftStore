import React, { useState, useRef } from 'react';
import { Camera, Edit, Trash2 } from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    username: '@johndoe',
    bio: 'Software Engineer | Tech Enthusiast | Traveler',
    location: 'San Francisco, CA',
    email: 'john.doe@example.com'
  });

  // State for profile and cover images
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // Refs for file inputs
  const profileImageInputRef = useRef(null);
  const coverImageInputRef = useRef(null);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile image upload
  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile image
  const handleRemoveProfileImage = () => {
    setProfileImage(null);
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = '';
    }
  };

  // Remove cover image
  const handleRemoveCoverImage = () => {
    setCoverImage(null);
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover Photo Section */}
      <div className="relative h-64 bg-gray-200 group">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: coverImage 
              ? `url(${coverImage})` 
              : 'url("https://via.placeholder.com/1200x300")'
          }}
        >
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </div>
        
        {isEditing && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {/* Cover Image Upload */}
            <input 
              type="file" 
              accept="image/*"
              ref={coverImageInputRef}
              onChange={handleCoverImageUpload}
              className="hidden"
              id="cover-image-upload"
            />
            <label 
              htmlFor="cover-image-upload" 
              className="bg-white/70 p-2 rounded-full cursor-pointer hover:bg-white/90 transition-colors"
              aria-label="Upload cover photo"
            >
              <Camera className="text-gray-700" size={24} />
            </label>

            {/* Remove Cover Image */}
            {coverImage && (
              <button 
                onClick={handleRemoveCoverImage}
                className="bg-white/70 p-2 rounded-full hover:bg-white/90 transition-colors"
                aria-label="Remove cover photo"
              >
                <Trash2 className="text-red-600" size={24} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Profile Content */}
      <div className="relative -mt-16 mx-4 z-10 bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between">
          {/* Profile Avatar */}
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                <img 
                  src={profileImage || "https://via.placeholder.com/300"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center space-x-2">
                    {/* Profile Image Upload */}
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={profileImageInputRef}
                      onChange={handleProfileImageUpload}
                      className="hidden"
                      id="profile-image-upload"
                    />
                    <label 
                      htmlFor="profile-image-upload" 
                      className="bg-white/70 p-2 rounded-full cursor-pointer hover:bg-white/90 transition-colors"
                      aria-label="Upload profile picture"
                    >
                      <Camera className="text-gray-700" size={20} />
                    </label>

                    {/* Remove Profile Image */}
                    {profileImage && (
                      <button 
                        onClick={handleRemoveProfileImage}
                        className="bg-white/70 p-2 rounded-full hover:bg-white/90 transition-colors"
                        aria-label="Remove profile picture"
                      >
                        <Trash2 className="text-red-600" size={20} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Rest of the profile content remains the same as previous example */}
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input 
                    type="text" 
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="text-2xl font-bold w-full border rounded px-2 py-1"
                  />
                  <input 
                    type="text" 
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    className="text-gray-600 w-full border rounded px-2 py-1"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{profileData.name}</h1>
                  <p className="text-gray-600">{profileData.username}</p>
                </>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <button 
            onClick={handleEditToggle}
            className="flex items-center space-x-2 px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
          >
            <Edit size={16} />
            <span>{isEditing ? 'Save' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Rest of the component remains the same */}
        <div className="mt-6">
          {isEditing ? (
            <textarea 
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1 mb-4"
              rows={3}
            />
          ) : (
            <p className="text-gray-700 mb-4">{profileData.bio}</p>
          )}

          <div className="grid grid-cols-2 gap-4 text-gray-600">
            {isEditing ? (
              <>
                <input 
                  type="text" 
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  placeholder="Location"
                  className="border rounded px-2 py-1"
                />
                <input 
                  type="email" 
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="border rounded px-2 py-1"
                />
              </>
            ) : (
              <>
                <p>📍 {profileData.location}</p>
                <p>✉️ {profileData.email}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage