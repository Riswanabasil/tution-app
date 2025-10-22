import { useCallback, useEffect, useState } from 'react';
import {
  User,
  Pencil,
  Lock,
  BookOpen,
  CreditCard,
  Check,
  AlertTriangle,
  X,
  UploadCloud,
  Camera,
} from 'lucide-react';
import Swal from 'sweetalert2';
import {
  getProfile,
  getAvatarUploadUrl,
  updateProfile,
  getStats,
  getPaymentHistory,
  changePassword,
} from '../services/StudentApi';
import type { ProfileDTO, StatsDTO, PaymentHistoryDTO } from '../services/StudentApi';

import { PaymentButton } from '../components/PaymentButton';
import type { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [editing, setEditing] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<StatsDTO | null>(null);
  const [history, setHistory] = useState<PaymentHistoryDTO[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  function getUserMessage(err: any): string {
  // server might return structured { message, enrollmentId }
  if (!err) return 'Something went wrong. Please try again.';
  if (err.userMessage) return err.userMessage; // if you rethrow structured object from helper
  if (err.response?.data?.message) return err.response.data.message; // axios response body
  if (typeof err === 'string') return err;
  if (err.message) return err.message;
  return 'Something went wrong. Please try again.';
}

function getEnrollmentIdFromError(err: any): string | undefined {
  return err?.response?.data?.enrollmentId || err?.existingEnrollmentId || err?.enrollmentId;
}

  const loadData = useCallback(async () => {
    try {
      const [p, s, h] = await Promise.all([getProfile(), getStats(), getPaymentHistory()]);
      setProfile(p);
      setPhoneInput(p.phone ?? '');
      setStats(s);
      setHistory(h);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.error(err);
      Swal.fire('Error', axiosError.message || 'Failed to load profile', 'error');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveProfile = async () => {
    if (!profile) return;

    let profilePicKey: string | undefined = undefined;

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

    const updated = await updateProfile({
      phone: phoneInput,
      ...(profilePicKey && { profilePicKey }),
    });

    setProfile(updated);
    setEditing(false);
    setFile(null);
  };

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Change Password',
      html:
        `<input id="swal-cur" type="password" class="swal2-input" placeholder="Current Password">` +
        `<input id="swal-new" type="password" class="swal2-input" placeholder="New Password">` +
        `<input id="swal-conf" type="password" class="swal2-input" placeholder="Confirm Password">`,
      preConfirm: () => {
        const current = (document.getElementById('swal-cur') as HTMLInputElement).value;
        const next = (document.getElementById('swal-new') as HTMLInputElement).value;
        const conf = (document.getElementById('swal-conf') as HTMLInputElement).value;
        if (!current || !next || next !== conf) {
          Swal.showValidationMessage('Passwords must match');
          return;
        }
        return { current, next };
      },
      showCancelButton: true,
      confirmButtonText: 'Change',
    });
    if (formValues) {
      await changePassword(formValues.current, formValues.next);
      Swal.fire('Success', 'Password changed', 'success');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check />;
      case 'failed':
        return <AlertTriangle />;
      default:
        return null;
    }
  };

  if (!profile || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-lg text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Tab Navigation */}
        <div className="mb-8 rounded-xl bg-white p-2 shadow-sm">
          <nav className="flex space-x-2">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'stats', label: 'My Stats', icon: Pencil },
              { id: 'payments', label: 'Payment History', icon: CreditCard },
              { id: 'security', label: 'Security', icon: Lock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl bg-white shadow-lg">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={
                        profile.profilePic ||
                        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
                      }
                      alt={profile.name}
                      className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
                    />
                    {editing && (
                      <button className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-lg transition-shadow hover:shadow-xl">
                        <Camera />
                      </button>
                    )}
                  </div>
                  <div className="text-white">
                    <h2 className="text-3xl font-bold">{profile.name}</h2>
                    <p className="text-lg text-blue-100">{profile.email}</p>
                    <p className="text-blue-100">{profile.phone}</p>
                  </div>
                  <div className="ml-auto">
                    {!editing ? (
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center space-x-2 rounded-full bg-white px-6 py-2 font-medium text-blue-600 transition-colors hover:bg-blue-50"
                      >
                        <Pencil />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={saveProfile}
                          disabled={uploading}
                          className="flex items-center space-x-2 rounded-full bg-green-500 px-6 py-2 font-medium text-white transition-colors hover:bg-green-600 disabled:opacity-50"
                        >
                          <Check />
                          <span>{uploading ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                          onClick={() => setEditing(false)}
                          className="flex items-center space-x-2 rounded-full bg-gray-500 px-6 py-2 font-medium text-white transition-colors hover:bg-gray-600"
                        >
                          <X />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {editing && (
                <div className="space-y-6 p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Profile Picture
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="flex cursor-pointer items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200"
                        >
                          <UploadCloud />
                          <span>Choose File</span>
                        </label>
                        {file && (
                          <span className="flex items-center space-x-1 text-sm text-green-600">
                            <Check />
                            <span>{file.name}</span>
                          </span>
                        )}
                      </div>
                      {uploading && (
                        <div className="mt-2 flex items-center space-x-2 text-blue-600">
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                          <span className="text-sm">Uploading avatar...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalEnrolled}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <BookOpen />
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {history.filter((h) => h.status === 'completed').length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Check />
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed Payments</p>
                  <p className="text-3xl font-bold text-red-600">
                    {history.filter((h) => h.status === 'failed').length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="border-b bg-gray-50 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
            </div>
            {history.length === 0 ? (
              <div className="p-12 text-center">
                <CreditCard />
                <p className="mt-4 text-lg text-gray-500">No payments yet</p>
                <p className="text-gray-400">Your payment history will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {history.map((h) => (
                      <tr key={h.courseId} className="transition-colors hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{h.title}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">₹{h.amount}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {new Date(h.paidAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {h.status === 'failed' ? (
                            <PaymentButton
                              enrollmentId={h.enrollmentId}
                              amount={h.amount}
                              onSuccess={() => {
                                Swal.fire('Success', 'Payment retried!', 'success');
                                loadData();
                              }}
                              onError={(err:any) => {
                                 const userMessage = getUserMessage(err);
        const status = err?.response?.status || err?.status || null;

        if (status === 409) {
          // Already paid — give user a friendly message and an action to view the enrollment
          Swal.fire({
            title: 'Payment already completed',
            text: userMessage || 'Payment already completed for this course.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'View enrollment',
            cancelButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              const existingEnrollmentId = getEnrollmentIdFromError(err);
              if (existingEnrollmentId) {
                navigate(`/student/mycourse`);
              } else {
                // fallback: go to payments/history or course page
                navigate('/student/mycourse');
              }
            }
          });
        } else {
          // generic failure
          Swal.fire('Error', userMessage, 'error');
        }
                              }
                                // Swal.fire('Error', `${err}`, 'error')
                              }
                            />
                          ) : (
                            <span
                              className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(h.status)}`}
                            >
                              {getStatusIcon(h.status)}
                              <span className="capitalize">{h.status}</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                  Keep your account secure by updating your password regularly
                </p>
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              className="flex transform items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700"
            >
              <Lock />
              <span>Change Password</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
