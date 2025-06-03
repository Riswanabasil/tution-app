import { useEffect, useState } from "react";
import adminAxios from "../../../api/AxiosAdmin";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    adminAxios.get("/admin/students").then((res) => {
      setUsers(res.data);
      console.log("userList",res)
    }).catch(err => {
      console.error("Error fetching users", err);
    });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Registered Students</h2>
      <table className="w-full table-auto border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Verified</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.phone}</td>
              <td className="border p-2">{user.isVerified ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
