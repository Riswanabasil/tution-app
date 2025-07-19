

import { useEffect, useState } from "react";
import {
  User,
  Pencil,
  Lock,
  BookOpen,
  
  Check,
  
  X,
 
  Camera,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  getTutorProfile,
  updateTutorProfile,
  changeTutorPassword,
  getTutorStats,
  getTutorCourses,
  getAvatarUploadUrl,
} from "../services/TutorApi";
import type {
  TutorProfileDTO,
  TutorStatsDTO,
  TutorCourseDTO,
  VerificationDetails,
} from "../services/TutorApi";
import type { AxiosError } from "axios";

const defaultVerif: VerificationDetails = {
  summary: "",
  education: "",
  experience: "",
  idProof: "",
  resume: "",
};

export default function TutorProfilePage() {
  const [profile, setProfile] = useState<TutorProfileDTO | null>(null);
  const [stats, setStats] = useState<TutorStatsDTO | null>(null);
  const [courses, setCourses] = useState<TutorCourseDTO[]>([]);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingVerif, setEditingVerif] = useState(false);
  const [verif, setVerif] = useState<VerificationDetails>(defaultVerif);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    (async () => {
      try {
        const [p, s, c] = await Promise.all([
          getTutorProfile(),
          getTutorStats(),
          getTutorCourses(),
        ]);
        setProfile(p);
        setNameInput(p.name);
        setPhoneInput(p.phone ?? "");
        setVerif(p.verificationDetails ?? defaultVerif);
        setStats(s);
        setCourses(c);
      } catch (err: unknown) {
        const axiosError = err as AxiosError<{ message: string }>;
        Swal.fire("Error", axiosError.message || "Failed to load data", "error");
      }
    })();
  }, []);

  const saveBasic = async () => {
    if (!profile) return;
    let profilePicKey: string | undefined;
    if (file) {
      setUploading(true);
      const { uploadUrl, key } = await getAvatarUploadUrl(file.name, file.type);
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      profilePicKey = key;
      setUploading(false);
    }
    const updated = await updateTutorProfile({
      name: nameInput,
      phone: phoneInput,
      ...(profilePicKey && { profilePicKey }),
    });
    setProfile(updated);
    setEditing(false);
    setFile(null);
    Swal.fire("Saved!", "Profile updated", "success");
  };

  const saveVerif = async () => {
    const updated = await updateTutorProfile({ verificationDetails: verif });
    setProfile(updated);
    setEditingVerif(false);
    Swal.fire("Saved!", "Verification details updated", "success");
  };

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Change Password",
      html:
        `<input id="swal-cur" type="password" class="swal2-input" placeholder="Current Password">` +
        `<input id="swal-new" type="password" class="swal2-input" placeholder="New Password">` +
        `<input id="swal-conf" type="password" class="swal2-input" placeholder="Confirm Password">`,
      preConfirm: () => {
        const current = (document.getElementById("swal-cur") as HTMLInputElement).value;
        const next = (document.getElementById("swal-new") as HTMLInputElement).value;
        const conf = (document.getElementById("swal-conf") as HTMLInputElement).value;
        if (!current || !next || next !== conf) {
          Swal.showValidationMessage("Passwords must match");
          return;
        }
        return { current, next };
      },
      showCancelButton: true,
      confirmButtonText: "Change",
    });
    if (formValues) {
      await changeTutorPassword(formValues.current, formValues.next);
      Swal.fire("Success", "Password changed", "success");
    }
  };

  if (!profile || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <p className="text-gray-600 text-lg">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8 p-2">
          <nav className="flex space-x-2">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "stats", label: "My Stats", icon: BookOpen },
              { id: "courses", label: "My Courses", icon: Pencil },
              { id: "security", label: "Security", icon: Lock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white flex items-center space-x-6">
              <div className="relative">
                <img
                  src={profile.profilePic}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {editing && (
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
                    <Camera className="w-5 h-5 text-gray-700" />
                  </label>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                  id="avatar-upload"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{profile.name}</h2>
                <p className="text-blue-100">{profile.email}</p>
                <p className="text-blue-100">{profile.phone || "—"}</p>
              </div>
              <div className="ml-auto">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 flex items-center space-x-2"
                  >
                    <Pencil />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={saveBasic}
                      disabled={uploading}
                      className="bg-green-600 text-white px-6 py-2 rounded-full flex items-center space-x-2"
                    >
                      <Check />
                      <span>{uploading ? "Saving..." : "Save"}</span>
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="bg-gray-500 text-white px-6 py-2 rounded-full flex items-center space-x-2"
                    >
                      <X />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {editing && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold">Verification Details</h3>
                <button
                  onClick={() => setEditingVerif(!editingVerif)}
                  className="text-blue-600 hover:underline"
                >
                  {editingVerif ? "Cancel" : "Edit"}
                </button>
              </div>
              {editingVerif ? (
                <div className="space-y-4">
                  {(["summary", "education", "experience"] as const).map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {field}
                      </label>
                      <input
                        type="text"
                        value={verif[field]}
                        onChange={(e) =>
                          setVerif((v) => ({ ...v, [field]: e.target.value }))
                        }
                        className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                      />
                    </div>
                  ))}
                  <button
                    onClick={saveVerif}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Save Details
                  </button>
                </div>
              ) : (
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Summary:</strong> {profile.verificationDetails?.summary || "—"}</li>
                  <li><strong>Education:</strong> {profile.verificationDetails?.education || "—"}</li>
                  <li><strong>Experience:</strong> {profile.verificationDetails?.experience || "—"}</li>
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-sm text-gray-500 mb-1">Courses Created</p>
              <p className="text-3xl font-bold text-blue-600">{stats.courseCount}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-sm text-gray-500 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-green-600">{stats.studentCount}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-sm text-gray-500 mb-1">Wallet Balance</p>
              <p className="text-3xl font-bold text-purple-600">₹ {profile.walletBalance}</p>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">My Courses</h3>
            {courses.length === 0 ? (
              <p className="text-gray-500">No courses yet.</p>
            ) : (
              <table className="w-full text-left border-t">
                <thead>
                  <tr className="text-sm text-gray-500 uppercase tracking-wider border-b">
                    <th className="py-2">Title</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Students</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c._id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{c.title}</td>
                      <td className="py-3">{c.status}</td>
                      <td className="py-3">{c.studentCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Lock />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Account Security</h3>
                <p className="text-gray-600">Update your password regularly to keep your account safe.</p>
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700"
            >
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
