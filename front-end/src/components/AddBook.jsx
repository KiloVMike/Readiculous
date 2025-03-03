import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

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
        setValues({ ...Values, [name]: value });
    };

    const submit = async (event) => {
        event.preventDefault();
    
        if (!Values.title || !Values.author || !Values.price || !Values.desc || !Values.language) {
            alert("All fields are required");
            return;
        }
    
        if (formData.imageUrls.length === 0) {
            alert("Please upload at least one image.");
            return;
        }
    
        // Ensure the first image URL is stored in `url` field
        const bookData = { ...Values, url: formData.imageUrls[0], imageUrls: formData.imageUrls };
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/addbook`, bookData, { headers });
            console.log(response.data);
            alert("Book added!");
            navigate('/allbooks');
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "An error occurred");
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
                })
                .catch(() => {
                    setImageUploadError("Image upload failed (2 MB max per image)");
                    setUploading(false);
                });
        } else {
            setImageUploadError("You can only upload 6 images per listing");
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
    };

    return (
        <div className='grid gap-4'>
            <p className='text-2xl font-semibold mx-2 my-4 '>Add Book</p>
            <form onSubmit={submit} className='flex flex-col bg-zinc-800 mx-4 p-6 rounded'>

                {/* Image Upload Section */}
                <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />
                <button type="button" onClick={handleImageSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Upload Images
                </button>
                {imageUploadError && <p className="text-red-500">{imageUploadError}</p>}
                {uploading && <p>Uploading...</p>}

                {formData.imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                        <img src={url} alt={`img-${index}`} className="w-24 h-24 object-cover rounded-lg" />
                        <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">X</button>
                    </div>
                ))}

                {/* Book Details Form Fields */}
                <label htmlFor="title" className='text-zinc-400 font-semibold'>Title :</label>
                <input type="text" id='title' name='title' value={Values.title} onChange={change} className='bg-zinc-900 rounded mb-2 ms-1 mt-1 p-2' />

                <label htmlFor="author" className='text-zinc-400 font-semibold'>Author :</label>
                <input type="text" id='author' name='author' value={Values.author} onChange={change} className='bg-zinc-900 rounded mb-2 ms-1 mt-1 p-2' />

                <label htmlFor="price" className='text-zinc-400 font-semibold'>Price :</label>
                <input type="text" id='price' name='price' value={Values.price} onChange={change} className='bg-zinc-900 rounded mb-2 ms-1 mt-1 p-2' />

                <label htmlFor="desc" className='text-zinc-400 font-semibold'>Description :</label>
                <textarea id='desc' name='desc' value={Values.desc} onChange={change} className='bg-zinc-900 rounded mb-2 ms-1 mt-1 p-2'></textarea>

                <label htmlFor="language" className='text-zinc-400 font-semibold'>Language :</label>
                <input type="text" id='language' name='language' value={Values.language} onChange={change} className='bg-zinc-900 rounded mb-2 ms-1 mt-1 p-2' />

                <button type='submit' className='mt-4 py-2 bg-blue-700 hover:bg-blue-800 w-[12%] mx-auto'>Add Book</button>
            </form>
        </div>
    );
};

export default AddBook;
