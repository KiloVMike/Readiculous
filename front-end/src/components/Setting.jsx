import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase"; // Import existing Firebase config

const storage = getStorage(app); // Initialize Firebase Storage

const Settings = () => {
  const [userData, setUserData] = useState({}); // Default empty object
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser
  ] = useState(null);

useEffect(() => {
    // Fetch user data from localStorage or API
    const user = JSON.parse(localStorage.getItem("  id"));
    if (user) {
        setCurrentUser(user);
    }
}, []);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getuserinfo`, { headers });
        setUserData(response.data || {}); // Ensure default object
      } catch (error) {
        console.error('Error fetching user data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    address: Yup.string().required('Address is required'),
  });

  // Function to handle image upload to Firebase
  const handleImageUpload = async () => {
    if (!imageFile) return null;

    const storageRef = ref(storage, `avatars/${imageFile.name}`);
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
      if (!currentUser || !currentUser._id) {
        console.error("User ID not found");
        alert("Error: User ID is missing. Please re-login.");
        return;
      }
  
      let avatarURL = userData.avatar || "/default-avatar.png";
      if (imageFile) {
        avatarURL = await handleImageUpload();
      }
  
      const updatedData = {
        userId: currentUser._id,
        username: values.username.trim(),
        email: values.email.trim(),
        address: values.address.trim(),
        avatar: avatarURL,
      };
  
      console.log("Sending Data:", updatedData);
  
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/userinfo`,
        updatedData,
        { headers }
      );
  
      console.log("Response:", response.data);
      setUserData(updatedData);
    } catch (error) {
      console.error("Error updating user", error.response?.data || error);
    } finally {
      setSubmitting(false);
    }
  };
  
  

  if (loading) {
    return <div className="text-center text-xl text-gray-700 mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center p-6">
      {/* User Info Display */}
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
              <label htmlFor="avatar" className="block text-gray-700 font-medium">Upload Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files[0];
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }}
                className="mt-1 p-2 border border-black rounded w-full bg-gray-50"
              />
              {imageFile && (
                <button
                  type="button"
                  onClick={async () => {
                    setUploading(true);
                    try {
                      const uploadedURL = await handleImageUpload();
                      setUserData((prev) => ({ ...prev, avatar: uploadedURL }));
                      console.log("Image uploaded:", uploadedURL);
                    } catch (error) {
                      console.error("Error uploading image:", error);
                    }
                    setUploading(false);
                  }}
                  className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors w-full"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors w-full"
            >
              {isSubmitting ? 'Updating...' : uploading ? 'Uploading Image...' : 'Update'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Settings;
