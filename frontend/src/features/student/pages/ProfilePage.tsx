
import { useEffect, useState } from "react";
import {
  getProfile,
  getAvatarUploadUrl,
  updateProfile,
  getStats,
  getPaymentHistory,
} from "../services/StudentApi";
import type { ProfileDTO,
   StatsDTO,
  PaymentHistoryDTO,} from "../services/StudentApi"
import { ProfileCard } from "../components/ProfileCard";
import ChangePasswordForm from "../components/ChangePasswordForm";

export default function ProfilePage() {
  const [profile,   setProfile]   = useState<ProfileDTO | null>(null);
  const [editing,   setEditing]   = useState(false);
  const [phoneInput,setPhoneInput]= useState("");
  const [file,      setFile]      = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [stats,     setStats]     = useState<StatsDTO | null>(null);
  const [history,   setHistory]   = useState<PaymentHistoryDTO[]>([]);
  useEffect(() => {
    (async () => {
      const [p, s, h] = await Promise.all([
        getProfile(),
        getStats(),
        getPaymentHistory(),
      ]);
      setProfile(p);
      setPhoneInput(p.phone ?? "");
      setStats(s);
      setHistory(h);
    })();
  }, []);

  
  const saveProfile = async () => {
    if (!profile) return;

    let profilePicKey: string | undefined = undefined;

  
    if (file) {
      setUploading(true);
      const { uploadUrl, key } = await getAvatarUploadUrl(
        file.name,
        file.type
      );
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      profilePicKey = key;
      setUploading(false);
    }

    
    const updated = await updateProfile({
      phone:          phoneInput,
      ...(profilePicKey && { profilePicKey }),
    });

  
    setProfile(updated);
    setEditing(false);
    setFile(null);
  };

  if (!profile || !stats) {
    return <p className="p-6 text-center">Loading profile…</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Profile card */}
      <ProfileCard profile={profile} onEdit={() => setEditing(true)} />

      {/* Edit form */}
      {editing && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h3 className="text-xl font-semibold">Edit Profile</h3>

          {/* Phone */}
          <label className="block">
            Phone
            <input
              type="text"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full mt-1 border px-2 py-1 rounded"
            />
          </label>

          {/* Avatar upload */}
          <label className="block">
            Profile Picture
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1"
            />
          </label>
          {file && (
            <p className="text-sm text-gray-600">
              Selected: {file.name}
            </p>
          )}
          {uploading && (
            <p className="text-sm text-blue-600">
              Uploading avatar…
            </p>
          )}

          {/* Save/Cancel */}
          <div className="flex space-x-4">
            <button
              onClick={saveProfile}
              disabled={uploading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Change password */}
      <ChangePasswordForm />

      {/* Stats */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">My Stats</h3>
        <p>Total Courses Enrolled: {stats.totalEnrolled}</p>
      </div>

      {/* Payment history */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Payment History</h3>
        {history.length === 0 ? (
          <p>No payments yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="pb-2">Course</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.courseId} className="border-b">
                  <td className="py-2">{h.title}</td>
                  <td className="py-2">₹{h.amount}</td>
                  <td className="py-2">
                    {new Date(h.paidAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
