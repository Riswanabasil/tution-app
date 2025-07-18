import  { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getTutorProfile,
  updateTutorProfile,
  changeTutorPassword,
  getTutorStats,
  getTutorCourses,
  getAvatarUploadUrl,
} from "../services/TutorApi";
import type{TutorProfileDTO,
  TutorStatsDTO,
  TutorCourseDTO,
  VerificationDetails,} from "../services/TutorApi"
import type { AxiosError } from "axios";

const defaultVerif: VerificationDetails = {
  summary:    "",
  education:  "",
  experience: "",
  idProof:    "",
  resume:     "",
}

export default function TutorProfilePage() {
  // Data state
  const [profile, setProfile] = useState<TutorProfileDTO | null>(null);
  const [stats,   setStats]   = useState<TutorStatsDTO | null>(null);
  const [courses, setCourses] = useState<TutorCourseDTO[]>([]);

  // Edit state
  const [editingBasic, setEditingBasic] = useState(false);
  const [nameInput,  setNameInput]      = useState("");
  const [phoneInput, setPhoneInput]     = useState("");
  const [file,       setFile]           = useState<File | null>(null);
  const [uploading,  setUploading]      = useState(false);

  const [editingVerif, setEditingVerif] = useState(false);
 const [verif, setVerif] = useState<VerificationDetails>(defaultVerif)

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
        setVerif(p.verificationDetails ?? verif);
        setStats(s);
        setCourses(c);
      } catch (err: unknown) {
        const axiosError = err as AxiosError<{ message: string }>;
        console.error(err);
        Swal.fire("Error", axiosError.message || "Failed to load data", "error");
      }
    })();
  }, []);

  const saveBasic = async () => {
    if (!profile) return;
    let profilePicKey: string | undefined;
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
    const updated = await updateTutorProfile({
      name: profile.name !== nameInput ? nameInput : undefined,
      phone: phoneInput,
      ...(profilePicKey && { profilePicKey }),
    });
    setProfile(updated);
    setEditingBasic(false);
    Swal.fire("Saved!", "Profile updated", "success");
  };

  
  const saveVerif = async () => {
    const updated = await updateTutorProfile({
      verificationDetails: verif,
    });
    setProfile(updated);
    setEditingVerif(false);
    Swal.fire("Saved!", "Verification details updated", "success");
  };

  
  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Change Password",
      html:
        `<input id="swal-cur" type="password" class="swal2-input" placeholder="Current">` +
        `<input id="swal-new" type="password" class="swal2-input" placeholder="New">` +
        `<input id="swal-conf" type="password" class="swal2-input" placeholder="Confirm">`,
      preConfirm: () => {
        const current = (document.getElementById("swal-cur") as HTMLInputElement).value;
        const next    = (document.getElementById("swal-new") as HTMLInputElement).value;
        const conf    = (document.getElementById("swal-conf") as HTMLInputElement).value;
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
    return <div className="p-6 text-center">Loading tutor profile…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* ── Basic Info ── */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center space-x-6">
          <img
            src={profile.profilePic}
            alt={profile.name}
            className="h-24 w-24 rounded-full object-cover border"
          />
          {editingBasic ? (
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="mt-1 w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="mt-1 w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={saveBasic}
                  disabled={uploading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingBasic(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-600">{profile.phone || "—"}</p>
              <p className="text-sm text-gray-500">
                Joined {new Date(profile.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => setEditingBasic(true)}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Verification Details ── */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between">
          <h3 className="text-xl font-semibold">Verification Details</h3>
          <button
            onClick={() => setEditingVerif(!editingVerif)}
            className="text-indigo-600 hover:underline"
          >
            {editingVerif ? "Cancel" : "Edit"}
          </button>
        </div>
        {editingVerif ? (
          <div className="space-y-4 mt-4">
            {(["summary","education","experience","idProof","resume"] as const).map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  value={verif[field]}
                  onChange={(e) =>
                    setVerif((v) => ({ ...v, [field]: e.target.value }))
                  }
                  className="mt-1 w-full border px-2 py-1 rounded"
                />
              </div>
            ))}
            <button
              onClick={saveVerif}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Save Details
            </button>
          </div>
        ) : (
          <ul className="mt-4 space-y-2 text-gray-700">
            <li>
              <strong>Summary:</strong> {profile.verificationDetails?.summary || "—"}
            </li>
            <li>
              <strong>Education:</strong> {profile.verificationDetails?.education || "—"}
            </li>
            <li>
              <strong>Experience:</strong> {profile.verificationDetails?.experience || "—"}
            </li>
            <li>
              {/* <strong>ID Proof:</strong> {profile.verificationDetails?.idProof || "—"} */}
              <a
                    href={`http://localhost:5000/uploads/tutorDocs/${profile.verificationDetails?.idProof}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View ID
                  </a>
            </li>
            <li>
              {/* <strong>Resume:</strong> {profile.verificationDetails?.resume || "—"} */}
               <a
                    href={`http://localhost:5000/uploads/tutorDocs/${profile.verificationDetails?.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Resume
                  </a>
            </li>
          </ul>
        )}
      </div>

      {/* ── My Stats ── */}
      <div className="bg-white p-6 rounded-lg shadow flex space-x-8">
        <div>
          <h4 className="text-lg font-medium">Courses Created</h4>
          <p className="text-2xl">{stats.courseCount}</p>
        </div>
        <div>
          <h4 className="text-lg font-medium">Total Students</h4>
          <p className="text-2xl">{stats.studentCount}</p>
        </div>
      </div>

      {/* ── My Courses ── */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">My Courses</h3>
        {courses.length === 0 ? (
          <p>No courses yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="pb-2">Title</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Students</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id} className="border-b">
                  <td className="py-2">{c.title}</td>
                  <td className="py-2">{c.status}</td>
                  <td className="py-2">{c.studentCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Change Password ── */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Account Security</h3>
        <button
          onClick={handleChangePassword}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
