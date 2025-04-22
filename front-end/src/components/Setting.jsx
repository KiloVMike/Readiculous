import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

const storage = getStorage(app);

const Settings = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getuserinfo`, { headers });
      setUserData(response.data || {});
    } catch (error) {
      console.error('Error fetching user data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    address: Yup.string().required('Address is required'),
  });

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    const storageRef = ref(storage, `avatars/${Date.now()}-${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    setUploading(true);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload error:", error);
          setUploading(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploading(false);
          resolve(downloadURL);
        }
      );
    });
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      let avatarURL = userData.avatar || "/default-avatar.png";
      if (imageFile) {
        avatarURL = await handleImageUpload();
      }
  
      const updatedData = {
        username: values.username.trim(),
        email: values.email.trim(),
        address: values.address.trim(),
        avatar: avatarURL,
      };
  
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/userinfo`,
        updatedData,
        { headers }
      );

      // Update the user data in the state
      setUserData(response.data); // Updates userData with the response (includes _id, username, etc.)

      alert("Profile updated successfully!");

      // Re-fetch the user data to reflect the changes
      await fetchUserData();  // <-- This will re-fetch the updated user info

    } catch (error) {
      console.error("Error updating user", error.response?.data || error);
      alert("Failed to update profile. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-700 mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center p-6">
      {/* Profile Info */}
      <div className="bg-white py-6 px-6 rounded-xl shadow-lg flex flex-col items-center w-full max-w-sm mb-6">
        <img
          src={imagePreview || userData?.avatar || "/default-avatar.png"}
          alt="User Avatar"
          className="h-20 w-20 rounded-full border-4 border-gray-300 shadow-md object-cover"
        />
        <p className="mt-4 text-2xl text-gray-900 font-bold">{userData?.username || "Unknown User"}</p>
        <p className="mt-1 text-lg text-gray-600">{userData?.email || "No Email Provided"}</p>
        <hr className="mt-4 w-full border-gray-300" />
      </div>

      {/* Settings Form */}
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">Update Your Info</h2>
      <Formik
        enableReinitialize
        initialValues={{
          username: userData?.username || '',
          email: userData?.email || '',
          address: userData?.address || '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
            <div>
              <label htmlFor="username" className="block text-gray-700 font-medium">Username</label>
              <Field type="text" id="username" name="username" className="mt-1 p-2 border border-black rounded w-full bg-gray-50 text-black" />
              <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
              <Field type="email" id="email" name="email" className="mt-1 p-2 border border-black rounded w-full bg-gray-50 text-black" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-700 font-medium">Address</label>
              <Field type="text" id="address" name="address" className="mt-1 p-2 border border-black rounded w-full bg-gray-50 text-black" />
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="avatar" className="block text-gray-700 font-medium">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 w-full"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              {uploading ? "Uploading..." : isSubmitting ? "Saving..." : "Update Info"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Settings;
