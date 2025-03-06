import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const AddBook = () => {
    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const navigate = useNavigate();
    const [Values, setValues] = useState({
        url: "",
        price: "",
        desc: "",
        title: "",
        author: "",
        language: ""
    });

    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({ imageUrls: [] });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);

    const change = (e) => {
        const { name, value } = e.target;
        
        // Validate numeric input for price
        if (name === "price" && value !== "" && isNaN(value)) {
            toast.error("Price must be a valid number.");
            return;
        }

        setValues({ ...Values, [name]: value });
    };

    const submit = async (event) => {
        event.preventDefault();
    
        if (!Values.title || !Values.author || !Values.price || !Values.desc || !Values.language) {
            toast.error("All fields are required");
            return;
        }

        if (isNaN(Values.price)) {
            toast.error("Price must be a number.");
            return;
        }
    
        if (formData.imageUrls.length === 0) {
            toast.error("Please upload at least one image.");
            return;
        }
    
        const bookData = { ...Values, url: formData.imageUrls[0], imageUrls: formData.imageUrls };
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/addbook`, bookData, { headers });
            console.log(response.data);
            toast.success("Book added successfully!");
            navigate('/allbooks');
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + (formData.imageUrls?.length || 0) < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = files.map(file => storeImage(file));

            Promise.all(promises)
                .then((urls) => {
                    setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...urls] }));
                    setUploading(false);
                    toast.success("Images uploaded successfully!");
                })
                .catch(() => {
                    setImageUploadError("Image upload failed (2 MB max per image)");
                    setUploading(false);
                    toast.error("Image upload failed. Please try again.");
                });
        } else {
            setImageUploadError("You can only upload 6 images per listing");
            toast.error("You can only upload up to 6 images.");
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = `${new Date().getTime()}_${file.name}`;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                reject,
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(resolve);
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index),
        }));
        toast.info("Image removed");
    };

    return (
        <div className="bg-green-200 min-h-screen flex flex-col items-center py-8">
            <ToastContainer />
            <p className="text-3xl font-bold text-green-900 mb-6">Add Book</p>

            <form onSubmit={submit} className="bg-white w-[90%] md:w-[50%] p-6 rounded-lg shadow-lg flex flex-col gap-4">

            <label htmlFor="title" className="text-green-900 font-semibold">Title:</label>
            <input type="text" id="title" name="title" value={Values.title} onChange={change} className="bg-green-100 rounded mb-2 p-2 border border-green-500 text-black" />

            <label htmlFor="author" className="text-green-900 font-semibold">Author:</label>
                <input type="text" id="author" name="author" value={Values.author} onChange={change} className="bg-green-100 rounded mb-2 p-2 border border-green-500 text-black" />

                <label htmlFor="price" className="text-green-900 font-semibold">Price:</label>
                <input type="text" id="price" name="price" value={Values.price} onChange={change} className="bg-green-100 rounded mb-2 p-2 border border-green-500 text-black" />

                <label htmlFor="language" className="text-green-900 font-semibold">Language:</label>
                <input type="text" id="language" name="language" value={Values.language} onChange={change} className="bg-green-100 rounded mb-2 p-2 border border-green-500 text-black" />


                <label htmlFor="desc" className="text-green-900 font-semibold">Description:</label>
                <textarea id="desc" name="desc" value={Values.desc} onChange={change} className="bg-green-100 rounded mb-2 p-2 border border-green-500 text-black" />

               
                

                

                <label className="text-green-900 font-semibold">Upload Images:</label>
                <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} className="bg-green-100 rounded mb-2 p-2 border border-green-500 text-black" />
                <button type="button" onClick={handleImageSubmit} className="py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition">Upload</button>
                
                {formData.imageUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <img src={url} alt="Uploaded" className="w-16 h-16 object-cover" />
                        <button type="button" onClick={() => handleRemoveImage(index)} className="text-red-600">Remove</button>
                    </div>
                ))}

                <button type="submit" className="mt-4 py-2 bg-green-700 text-white w-full rounded-lg hover:bg-green-800 transition">
                    Add Book
                </button>
            </form>
        </div>
    );
};

export default AddBook;
