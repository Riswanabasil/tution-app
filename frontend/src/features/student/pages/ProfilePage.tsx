
// import { useCallback, useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import {
//   getProfile,
//   getAvatarUploadUrl,
//   updateProfile,
//   getStats,
//   getPaymentHistory,
//   changePassword,
// } from "../services/StudentApi";
// import type { ProfileDTO,
//    StatsDTO,
//   PaymentHistoryDTO,} from "../services/StudentApi"
// import { ProfileCard } from "../components/ProfileCard";
// import {PaymentButton }from "../components/PaymentButton"
// import type { AxiosError } from "axios";

// export default function ProfilePage() {
//   const [profile,   setProfile]   = useState<ProfileDTO | null>(null);
//   const [editing,   setEditing]   = useState(false);
//   const [phoneInput,setPhoneInput]= useState("");
//   const [file,      setFile]      = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);

//   const [stats,     setStats]     = useState<StatsDTO | null>(null);
//   const [history,   setHistory]   = useState<PaymentHistoryDTO[]>([]);

//   const loadData = useCallback(async () => {
//     try {
//       const [p, s, h] = await Promise.all([
//         getProfile(),
//         getStats(),
//         getPaymentHistory(),
//       ]);
//       setProfile(p);
//       setPhoneInput(p.phone ?? "");
//       setStats(s);
//       setHistory(h);
//     } catch (err:unknown) 
//     {
//       const axiosError = err as AxiosError<{ message: string }>;
//       console.error(err);
//       Swal.fire("Error", axiosError.message || "Failed to load profile", "error");
//     }
//   }, []);
 

//     useEffect(() => { loadData() }, [loadData]);
//   const saveProfile = async () => {
//     if (!profile) return;

//     let profilePicKey: string | undefined = undefined;

  
//     if (file) {
//       setUploading(true);
//       const { uploadUrl, key } = await getAvatarUploadUrl(
//         file.name,
//         file.type
//       );
//       await fetch(uploadUrl, {
//         method: "PUT",
//         headers: { "Content-Type": file.type },
//         body: file,
//       });
//       profilePicKey = key;
//       setUploading(false);
//     }

    
//     const updated = await updateProfile({
//       phone:          phoneInput,
//       ...(profilePicKey && { profilePicKey }),
//     });

  
//     setProfile(updated);
//     setEditing(false);
//     setFile(null);
//   };

//   const handleChangePassword = async () => {
//       const { value: formValues } = await Swal.fire({
//         title: "Change Password",
//         html:
//           `<input id="swal-cur" type="password" class="swal2-input" placeholder="Current">` +
//           `<input id="swal-new" type="password" class="swal2-input" placeholder="New">` +
//           `<input id="swal-conf" type="password" class="swal2-input" placeholder="Confirm">`,
//         preConfirm: () => {
//           const current = (document.getElementById("swal-cur") as HTMLInputElement).value;
//           const next    = (document.getElementById("swal-new") as HTMLInputElement).value;
//           const conf    = (document.getElementById("swal-conf") as HTMLInputElement).value;
//           if (!current || !next || next !== conf) {
//             Swal.showValidationMessage("Passwords must match");
//             return;
//           }
//           return { current, next };
//         },
//         showCancelButton: true,
//         confirmButtonText: "Change",
//       });
//       if (formValues) {
//         await changePassword(formValues.current, formValues.next);
//         Swal.fire("Success", "Password changed", "success");
//       }
//     };

//   if (!profile || !stats) {
//     return <p className="p-6 text-center">Loading profile…</p>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-8">
//       {/* Profile card */}
//       <ProfileCard profile={profile} onEdit={() => setEditing(true)} />

//       {/* Edit form */}
//       {editing && (
//         <div className="bg-white p-6 rounded-lg shadow space-y-4">
//           <h3 className="text-xl font-semibold">Edit Profile</h3>

//           {/* Phone */}
//           <label className="block">
//             Phone
//             <input
//               type="text"
//               value={phoneInput}
//               onChange={(e) => setPhoneInput(e.target.value)}
//               className="w-full mt-1 border px-2 py-1 rounded"
//             />
//           </label>

//           {/* Avatar upload */}
//           <label className="block">
//             Profile Picture
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//               className="mt-1"
//             />
//           </label>
//           {file && (
//             <p className="text-sm text-gray-600">
//               Selected: {file.name}
//             </p>
//           )}
//           {uploading && (
//             <p className="text-sm text-blue-600">
//               Uploading avatar…
//             </p>
//           )}

//           {/* Save/Cancel */}
//           <div className="flex space-x-4">
//             <button
//               onClick={saveProfile}
//               disabled={uploading}
//               className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
//             >
//               Save
//             </button>
//             <button
//               onClick={() => setEditing(false)}
//               className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Change password */}
      

//        <div className="bg-white p-6 rounded-lg shadow">
//         <h3 className="text-xl font-semibold mb-4">Account Security</h3>
//         <button
//           onClick={handleChangePassword}
//           className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
//         >
//           Change Password
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h3 className="text-xl font-semibold mb-2">My Stats</h3>
//         <p>Total Courses Enrolled: {stats.totalEnrolled}</p>
//       </div>

//       {/* Payment history */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h3 className="text-xl font-semibold mb-4">Payment History</h3>
//         {history.length === 0 ? (
//           <p>No payments yet.</p>
//         ) : (
//           <table className="w-full text-left">
//             <thead className="border-b">
//               <tr>
//                 <th className="pb-2">Course</th>
//                 <th className="pb-2">Amount</th>
//                 <th className="pb-2">Date</th>
//                 <th className="pb-2">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {history.map((h) => (
//                 <tr key={h.courseId} className="border-b">
//                   <td className="py-2">{h.title}</td>
//                   <td className="py-2">₹{h.amount}</td>
//                   <td className="py-2">
//                     {new Date(h.paidAt).toLocaleDateString()}
//                   </td>
//                   {/* <td className="py-2">{h.status}</td> */}
//                    <td className="py-2">
//                    {h.status === "failed" ? (
//   <PaymentButton
//     enrollmentId={h.enrollmentId}
//     amount={h.amount}
//     onSuccess={() => {
//       Swal.fire("Success", "Payment retried!", "success");
//       loadData();
//     }}
//     onError={(err) => Swal.fire("Error", `${err}`, "error")}
//   />
// ) : (
//   <span>{h.status}</span>
// )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }


import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getProfile,
  getAvatarUploadUrl,
  updateProfile,
  getStats,
  getPaymentHistory,
  changePassword,
} from "../services/StudentApi";
import type { ProfileDTO, StatsDTO, PaymentHistoryDTO } from "../services/StudentApi";
// import { ProfileCard } from "../components/ProfileCard";
import { PaymentButton } from "../components/PaymentButton";
import type { AxiosError } from "axios";

// Simple icons as SVG components (to replace Lucide)
const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const CameraIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [editing, setEditing] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<StatsDTO | null>(null);
  const [history, setHistory] = useState<PaymentHistoryDTO[]>([]);
  const [activeTab, setActiveTab] = useState("profile");

  const loadData = useCallback(async () => {
    try {
      const [p, s, h] = await Promise.all([
        getProfile(),
        getStats(),
        getPaymentHistory(),
      ]);
      setProfile(p);
      setPhoneInput(p.phone ?? "");
      setStats(s);
      setHistory(h);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.error(err);
      Swal.fire("Error", axiosError.message || "Failed to load profile", "error");
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
        method: "PUT",
        headers: { "Content-Type": file.type },
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
      await changePassword(formValues.current, formValues.next);
      Swal.fire("Success", "Password changed", "success");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckIcon />;
      case "failed":
        return <AlertIcon />;
      default:
        return null;
    }
  };

  if (!profile || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <UserIcon />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Dashboard</h1>
              <p className="text-gray-600">Manage your account and view your progress</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8 p-2">
          <nav className="flex space-x-2">
            {[
              { id: "profile", label: "Profile", icon: UserIcon },
              { id: "stats", label: "My Stats", icon: BookIcon },
              { id: "payments", label: "Payment History", icon: CreditCardIcon },
              { id: "security", label: "Security", icon: LockIcon }
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
                <tab.icon />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={profile.profilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                      alt={profile.name}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    {editing && (
                      <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                        <CameraIcon />
                      </button>
                    )}
                  </div>
                  <div className="text-white">
                    <h2 className="text-3xl font-bold">{profile.name}</h2>
                    <p className="text-blue-100 text-lg">{profile.email}</p>
                    <p className="text-blue-100">{profile.phone}</p>
                  </div>
                  <div className="ml-auto">
                    {!editing ? (
                      <button
                        onClick={() => setEditing(true)}
                        className="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
                      >
                        <EditIcon />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={saveProfile}
                          disabled={uploading}
                          className="bg-green-500 text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        >
                          <CheckIcon />
                          <span>{uploading ? "Saving..." : "Save"}</span>
                        </button>
                        <button
                          onClick={() => setEditing(false)}
                          className="bg-gray-500 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-600 transition-colors flex items-center space-x-2"
                        >
                          <XIcon />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {editing && (
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                        >
                          <UploadIcon />
                          <span>Choose File</span>
                        </label>
                        {file && (
                          <span className="text-sm text-green-600 flex items-center space-x-1">
                            <CheckIcon />
                            <span>{file.name}</span>
                          </span>
                        )}
                      </div>
                      {uploading && (
                        <div className="mt-2 flex items-center space-x-2 text-blue-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
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
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalEnrolled}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookIcon />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{history.filter(h => h.status === 'completed').length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckIcon />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed Payments</p>
                  <p className="text-3xl font-bold text-red-600">{history.filter(h => h.status === 'failed').length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertIcon />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
            </div>
            {history.length === 0 ? (
              <div className="p-12 text-center">
                <CreditCardIcon />
                <p className="text-gray-500 text-lg mt-4">No payments yet</p>
                <p className="text-gray-400">Your payment history will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {history.map((h) => (
                      <tr key={h.courseId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{h.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-semibold">₹{h.amount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(h.paidAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {h.status === "failed" ? (
                            <PaymentButton
                              enrollmentId={h.enrollmentId}
                              amount={h.amount}
                              onSuccess={() => {
                                Swal.fire("Success", "Payment retried!", "success");
                                loadData();
                              }}
                              onError={(err) => Swal.fire("Error", `${err}`, "error")}
                            />
                          ) : (
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(h.status)}`}>
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
       {activeTab === "security" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <LockIcon />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Account Security</h3>
                <p className="text-gray-600">Keep your account secure by updating your password regularly</p>
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <LockIcon />
              <span>Change Password</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}