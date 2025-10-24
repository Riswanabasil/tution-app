import { useEffect, useState } from 'react';
import { User, Pencil, Lock, BookOpen, Check, X, Camera } from 'lucide-react';
import Swal from 'sweetalert2';
import {
  getTutorProfile,
  updateTutorProfile,
  changeTutorPassword,
  getTutorStats,
  getTutorCourses,
  getAvatarUploadUrl,
} from '../services/TutorApi';
import type {
  TutorProfileDTO,
  TutorStatsDTO,
  TutorCourseDTO,
  VerificationDetails,
} from '../services/TutorApi';
import type { AxiosError } from 'axios';
import * as yup from 'yup';
const defaultVerif: VerificationDetails = {
  summary: '',
  education: '',
  experience: '',
  idProof: '',
  resume: '',
};

export default function TutorProfilePage() {
  const [profile, setProfile] = useState<TutorProfileDTO | null>(null);
  const [stats, setStats] = useState<TutorStatsDTO | null>(null);
  const [courses, setCourses] = useState<TutorCourseDTO[]>([]);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingVerif, setEditingVerif] = useState(false);
  const [verif, setVerif] = useState<VerificationDetails>(defaultVerif);
  const [activeTab, setActiveTab] = useState('profile');
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);


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
        setPhoneInput(p.phone ?? '');
        setVerif(p.verificationDetails ?? defaultVerif);
        setStats(s);
        setCourses(c);
      } catch (err: unknown) {
        const axiosError = err as AxiosError<{ message: string }>;
        Swal.fire('Error', axiosError.message || 'Failed to load data', 'error');
      }
    })();
  }, []);

  const hasChanges =
  nameInput.trim() !== (profile?.name ?? '').trim() ||
  phoneInput.trim() !== (profile?.phone ?? '').trim() ||
  !!file;

const formValid = !validateName(nameInput) && !validatePhone(phoneInput);


  const saveBasic = async () => {
    if (!profile) return;
    
  const nameErr = validateName(nameInput);
  const phoneErr = validatePhone(phoneInput);
  setNameError(nameErr);
  setPhoneError(phoneErr);
  if (nameErr || phoneErr) return;
    let profilePicKey: string | undefined;
    if (file) {
      setUploading(true);
      const { uploadUrl, key } = await getAvatarUploadUrl(file.name, file.type);
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      profilePicKey = key;
      setUploading(false);
    }
    const updated = await updateTutorProfile({
      name: nameInput.trim(),
  phone: phoneInput.trim() || undefined,
      ...(profilePicKey && { profilePicKey }),
    });
    setProfile(updated);
    setEditing(false);
    setFile(null);
    Swal.fire('Saved!', 'Profile updated', 'success');
  };

  function validateName(name: string): string | null {
    const t = name.trim();
    if (!t) return 'Name is required';
    if (t.length < 2) return 'Name must be at least 2 characters';
    if (t.length > 15) return 'Name is too long';
    if (!/^[\p{L} .'-]+$/u.test(t)) return 'Name contains invalid characters';
    return null;
  }

  function validatePhone(phone: string): string | null {
    const p = phone.trim();
    if (!p) return null; // optional: make required if you prefer
    if (!/^\d{10}$/.test(p)) return 'Enter a valid 10 digit phone number';
    return null;
  }


  const saveVerif = async () => {
    const updated = await updateTutorProfile({ verificationDetails: verif });
    setProfile(updated);
    setEditingVerif(false);
    Swal.fire('Saved!', 'Verification details updated', 'success');
  };
const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
      'Password must be at least 8 characters and include uppercase, lowercase, number and special character'
    ),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});
  // const handleChangePassword = async () => {
  //   const { value: formValues } = await Swal.fire({
  //     title: 'Change Password',
  //     html:
  //       `<input id="swal-cur" type="password" class="swal2-input" placeholder="Current Password">` +
  //       `<input id="swal-new" type="password" class="swal2-input" placeholder="New Password">` +
  //       `<input id="swal-conf" type="password" class="swal2-input" placeholder="Confirm Password">`,
  //     preConfirm: () => {
  //       const current = (document.getElementById('swal-cur') as HTMLInputElement).value;
  //       const next = (document.getElementById('swal-new') as HTMLInputElement).value;
  //       const conf = (document.getElementById('swal-conf') as HTMLInputElement).value;
  //       if (!current || !next || next !== conf) {
  //         Swal.showValidationMessage('Passwords must match');
  //         return;
  //       }
  //       return { current, next };
  //     },
  //     showCancelButton: true,
  //     confirmButtonText: 'Change',
  //   });
  //   if (formValues) {
  //     await changeTutorPassword(formValues.current, formValues.next);
  //     Swal.fire('Success', 'Password changed', 'success');
  //   }
  // };

  const handleChangePassword = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'Change Password',
    html:
      `<input id="swal-cur" type="password" class="swal2-input" placeholder="Current Password">` +
      `<input id="swal-new" type="password" class="swal2-input" placeholder="New Password">` +
      `<input id="swal-conf" type="password" class="swal2-input" placeholder="Confirm Password">`,
    preConfirm: async () => {
      const current = (document.getElementById('swal-cur') as HTMLInputElement).value;
      const next = (document.getElementById('swal-new') as HTMLInputElement).value;
      const conf = (document.getElementById('swal-conf') as HTMLInputElement).value;

      try {
        // validate with yup
        await passwordSchema.validate({
          currentPassword: current,
          newPassword: next,
          confirmPassword: conf,
        }, { abortEarly: false });

        // return the validated values
        return { current, next };
      } catch (validationError: any) {
        // collect messages and show the first one (or all)
        const msgs = validationError.inner?.map((e: any) => e.message) || [validationError.message];
        Swal.showValidationMessage(msgs.join('<br/>'));
        return false;
      }
    },
    showCancelButton: true,
    confirmButtonText: 'Change',
  });

  if (formValues) {
    try {
      await changeTutorPassword(formValues.current, formValues.next);
      Swal.fire('Success', 'Password changed', 'success');
    } catch (err: unknown) {
      const ae = err as AxiosError<{ message?: string }>;
      Swal.fire('Error', ae.response?.data?.message || ae.message || 'Unable to change password', 'error');
    }
  }
};

  if (!profile || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <p className="text-lg text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Tabs */}
        <div className="mb-8 rounded-xl bg-white p-2 shadow-sm">
          <nav className="flex space-x-2">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'stats', label: 'My Stats', icon: BookOpen },
              { id: 'courses', label: 'My Courses', icon: Pencil },
              { id: 'security', label: 'Security', icon: Lock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-all duration-200 ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="rounded-xl bg-white shadow-lg">
            <div className="flex items-center space-x-6 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
              <div className="relative">
                <img
                  src={profile.profilePic}
                  alt={profile.name}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
                />
                {editing && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-white p-2 shadow-md"
                  >
                    <Camera className="h-5 w-5 text-gray-700" />
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
                <p className="text-blue-100">{profile.phone || '—'}</p>
              </div>
              <div className="ml-auto">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center space-x-2 rounded-full bg-white px-6 py-2 text-blue-600 hover:bg-blue-50"
                  >
                    <Pencil />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={saveBasic}
                      disabled={uploading || !hasChanges}

                      className="flex items-center space-x-2 rounded-full bg-green-600 px-6 py-2 text-white"
                    >
                      <Check />
                      <span>{uploading ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center space-x-2 rounded-full bg-gray-500 px-6 py-2 text-white"
                    >
                      <X />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {editing && (
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={nameInput}
                      // onChange={(e) => setNameInput(e.target.value)}
                      onChange={(e) => {
                        const v = e.target.value;
                        setNameInput(v);
                        setNameError(validateName(v));
                      }}
                      onBlur={() => setNameError(validateName(nameInput))}

                      className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    />
                    { nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p> }
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      value={phoneInput}
                      // onChange={(e) => setPhoneInput(e.target.value)}
                      onChange={(e) => {
                        const v = e.target.value;
                        setPhoneInput(v);
                        setPhoneError(validatePhone(v));
                      }}
                      onBlur={() => setPhoneError(validatePhone(phoneInput))}

                      className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    />
                    { phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p> }
                  </div>
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="mb-4 flex justify-between">
                <h3 className="text-xl font-semibold">Verification Details</h3>
                {/* <button
                  onClick={() => setEditingVerif(!editingVerif)}
                  className="text-blue-600 hover:underline"
                >
                  {editingVerif ? 'Cancel' : 'Edit'}
                </button> */}
              </div>
              {editingVerif ? (
                <div className="space-y-4">
                  {(['summary', 'education', 'experience'] as const).map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium capitalize text-gray-700">
                        {field}
                      </label>
                      <input
                        type="text"
                        value={verif[field]}
                        onChange={(e) => setVerif((v) => ({ ...v, [field]: e.target.value }))}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                      />
                    </div>
                  ))}
                  <button
                    onClick={saveVerif}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white"
                  >
                    Save Details
                  </button>
                </div>
              ) : (
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Summary:</strong> {profile.verificationDetails?.summary || '—'}
                  </li>
                  <li>
                    <strong>Education:</strong> {profile.verificationDetails?.education || '—'}
                  </li>
                  <li>
                    <strong>Experience:</strong> {profile.verificationDetails?.experience || '—'}
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <p className="mb-1 text-sm text-gray-500">Courses Created</p>
              <p className="text-3xl font-bold text-blue-600">{stats.courseCount}</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <p className="mb-1 text-sm text-gray-500">Total Students</p>
              <p className="text-3xl font-bold text-green-600">{stats.studentCount}</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <p className="mb-1 text-sm text-gray-500">Wallet Balance</p>
              <p className="text-3xl font-bold text-purple-600">₹ {profile.walletBalance}</p>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold">My Courses</h3>
            {courses.length === 0 ? (
              <p className="text-gray-500">No courses yet.</p>
            ) : (
              <table className="w-full border-t text-left">
                <thead>
                  <tr className="border-b text-sm uppercase tracking-wider text-gray-500">
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
        {activeTab === 'security' && (
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Lock />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Account Security</h3>
                <p className="text-gray-600">
                  Update your password regularly to keep your account safe.
                </p>
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white hover:from-blue-700 hover:to-purple-700"
            >
              Change Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
