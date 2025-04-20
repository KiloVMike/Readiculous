import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from './BookCard';
import Loader from './Loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Favourites = () => {
  const [favourites, setFavourites] = useState(null);

  const headers = {
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  const fetchFavourites = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getfavbooks`, {
        headers,
      });
      setFavourites(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch favourite books 📚', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-green-100">
      {/* Header */}
      <header className="py-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 tracking-wide">My Favourites</h1>
        <p className="text-sm text-gray-600 mt-2">Curated with care 💚</p>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-8 md:px-16 lg:px-24 pb-10">
        {!favourites ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : favourites.length === 0 ? (
          <div className="flex justify-center mt-10">
            <p className="text-xl text-gray-700">No Favourite Books Yet 📚</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {favourites.map((book, idx) => (
              <div key={idx} className="transition-transform duration-300 hover:scale-105">
                <BookCard data={book} fav={true} update={fetchFavourites} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-green-200 text-gray-800 text-center py-4 border-t border-green-300">
        <p className="text-sm">&copy; 2025 <span className="font-semibold">Readiculous</span>. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Favourites;
