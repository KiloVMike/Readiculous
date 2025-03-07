import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment"; // Import moment.js for time formatting
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null); // Track confirmation

    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/allusers`, { headers });
            console.log("API Response:", response.data);
            setUsers(response.data?.data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (userId) => {
        if (confirmDeleteId === userId) {
            try {
                await axios.delete(`${process.env.REACT_APP_BASE_URL}/deleteuser/${userId}`, { headers });
                toast.success("User deleted successfully");
                setUsers(users.filter((user) => user._id !== userId));
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user");
            }
            setConfirmDeleteId(null);
        } else {
            setConfirmDeleteId(userId);
            toast.warn("Click again to confirm deletion", {
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                All Users
            </h2>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm uppercase">
                        <tr className="text-left">
                            <th className="p-4 text-center">Sr.</th>
                            <th className="p-4">Username</th>
                            <th className="p-4">Email</th>
                            <th className="p-4 text-center">Role</th>
                            <th className="p-4 text-center">User Since</th> {/* New column for timestamps */}
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!users.length && (
                            <tr>
                                <td colSpan="6" className="p-6 text-center">
                                    <Loader />
                                </td>
                            </tr>
                        )}

                        {users.map((user, index) => (
                            <tr key={user._id} className="border-b last:border-none hover:bg-gray-100 transition">
                                <td className="p-4 text-center font-medium text-gray-900">{index + 1}</td>
                                <td className="p-4 text-gray-800">{user.username}</td>
                                <td className="p-4 text-gray-700">{user.email}</td>
                                <td className="p-4 text-center font-semibold text-gray-900">{user.role}</td>
                                <td className="p-4 text-center text-gray-600 italic">
                                    {user.createdAt
                                        ? ` ${moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss")}`
                                        : "N/A"}
                                </td>
                                <td className="p-4 text-center">
                                    <button 
                                        onClick={() => deleteUser(user._id)} 
                                        className={`px-4 py-2 rounded-md transition-all duration-200 shadow-md
                                            ${confirmDeleteId === user._id ? "bg-red-700" : "bg-red-500"}
                                            text-white hover:bg-red-600`}>
                                        {confirmDeleteId === user._id ? "Confirm?" : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllUsers;
