import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const [Values, setValues] = useState({
        url: "",
        price: "",
        desc: "",
        title: "",
        author: "",
        language: "",
        genre: "", // Store selected genre
    });

    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({ imageUrls: [] });
    const [uploading, setUploading] = useState(false);

    const genresList = ["Fiction", "Adventure", "Fantasy", "Action", "Science Fiction", "Romance", "Thriller", "Mythology", "Historical", "Mystery", "Horror", "Detective", "Crime", "Drama", "Comedy"]; // Example genres
    const languagesList = ["English", "Hindi", "Spanish", "French", "German", "Italian", "Chinese", "Japanese"]; // Example languages

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getbook/${id}`, { headers });
                setValues(response.data.data);
                setFormData({ imageUrls: response.data.data.url || [] });
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load book details");
            }
        };
        fetchBook();
    }, [id]);

    const change = (e) => {
        const { name, value } = e.target;
        if (name === "price" && value !== "" && isNaN(value)) {
            toast.error("Price must be a valid number.");
            return;
        }
        setValues({ ...Values, [name]: value });
    };

    const handleGenreChange = (e) => {
        setValues({ ...Values, genre: e.target.value });
    };

    const handleLanguageChange = (e) => {
        setValues({ ...Values, language: e.target.value });
    };

    const submit = async (event) => {
        event.preventDefault();

        if (!Values.title || !Values.author || !Values.price || !Values.desc || !Values.language || !Values.genre) {
            toast.error("All fields are required.");
            return;
        }

        if (isNaN(Values.price)) {
            toast.error("Price must be a number.");
            return;
        }

        if (formData.imageUrls.length === 0) {
            toast.error("Please upload an image.");
            return;
        }

        const updatedBookData = { ...Values, url: formData.imageUrls[0], imageUrls: formData.imageUrls };

        try {
            await axios.put(`${process.env.REACT_APP_BASE_URL}/updatebook/${id}`, updatedBookData, { headers });
            toast.success("Book updated successfully!");
            navigate('/allbooks');
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const handleImageSubmit = () => {
        if (formData.imageUrls.length >= 1) {
            toast.error("Only one image can be uploaded.");
            return;
        }

        if (!file) {
            toast.error("Please select an image to upload.");
            return;
        }

        setUploading(true);
        storeImage(file)
            .then((url) => {
                setFormData({ imageUrls: [url] });
                setUploading(false);
                toast.success("Image uploaded successfully!");
            })
            .catch(() => {
                setUploading(false);
                toast.error("Image upload failed. Please try again.");
            });
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = `${new Date().getTime()}_${file.name}`;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                null,
                reject,
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(resolve);
                }
            );
        });
    };

    return (
        <div className="bg-green-200 min-h-screen flex flex-col items-center py-8">
            <ToastContainer />
            <p className="text-3xl font-bold text-green-900 mb-6">Update Book</p>

            <form onSubmit={submit} className="bg-white w-[90%] md:w-[50%] p-6 rounded-lg shadow-lg flex flex-col gap-4">
                <label className="text-green-900 font-semibold">Title:</label>
                <input
                    type="text"
                    name="title"
                    value={Values.title}
                    onChange={change}
                    className="bg-green-100 rounded p-2 border border-green-500 text-black"
                />

                <label className="text-green-900 font-semibold">Author:</label>
                <input
                    type="text"
                    name="author"
                    value={Values.author}
                    onChange={change}
                    className="bg-green-100 rounded p-2 border border-green-500 text-black"
                />

                <label className="text-green-900 font-semibold">Select Genre:</label>
                <div className="flex flex-wrap gap-4">
                    {genresList.map((genre) => (
                        <label key={genre} className="inline-flex items-center gap-2 text-black">
                            <input
                                type="radio"
                                name="genre"
                                value={genre}
                                checked={Values.genre === genre}
                                onChange={handleGenreChange}
                                className="form-radio"
                            />
                            {genre}
                        </label>
                    ))}
                </div>

                <label className="text-green-900 font-semibold">Price:</label>
                <input
                    type="text"
                    name="price"
                    value={Values.price}
                    onChange={change}
                    className="bg-green-100 rounded p-2 border border-green-500 text-black"
                />

                <label className="text-green-900 font-semibold">Select Language:</label>
                <div className="flex flex-wrap gap-4">
                    {languagesList.map((language) => (
                        <label key={language} className="inline-flex items-center gap-2 text-black">
                            <input
                                type="radio"
                                name="language"
                                value={language}
                                checked={Values.language === language}
                                onChange={handleLanguageChange}
                                className="form-radio"
                            />
                            {language}
                        </label>
                    ))}
                </div>

                <label className="text-green-900 font-semibold">Description:</label>
                <textarea
                    name="desc"
                    value={Values.desc}
                    onChange={change}
                    className="bg-green-100 rounded p-2 border border-green-500 text-black"
                />

                <label className="text-green-900 font-semibold">Upload Image:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="bg-green-100 rounded p-2 border border-green-500 text-black"
                />
                <button
                    type="button"
                    onClick={handleImageSubmit}
                    className="py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                >
                    Upload
                </button>

                {formData.imageUrls.length > 0 && (
                    <div className="flex items-center gap-2">
                        <img src={formData.imageUrls[0]} alt="Uploaded" className="w-16 h-16 object-cover" />
                        <button
                            type="button"
                            onClick={() => setFormData({ imageUrls: [] })}
                            className="text-red-600"
                        >
                            Remove
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    className="mt-4 py-2 bg-green-700 text-white w-full rounded-lg hover:bg-green-800 transition"
                >
                    Update Book
                </button>
            </form>
        </div>
    );
};

export default UpdateBook;
