import React from 'react';
import type { ProfileDTO } from '../services/StudentApi';

interface ProfileCardProps {
  profile: ProfileDTO;
  onEdit: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEdit }) => {
  return (
    <div className="flex items-center space-x-6 rounded-lg bg-white p-6 shadow">
      {/* Avatar */}
      <img
        src={profile.profilePic}
        alt={profile.name}
        className="h-24 w-24 rounded-full border object-cover"
      />

      {/* Info */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold">{profile.name}</h2>
        <p className="text-gray-600">{profile.email}</p>
        <p className="text-gray-600">{profile.phone || 'No phone number set'}</p>
        <p className="text-sm text-gray-500">
          Joined {new Date(profile.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Edit button */}
      <button
        onClick={onEdit}
        className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Edit Profile
      </button>
    </div>
  );
};
