import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from './BookCard';
import Loader from './Loader';

const Favourites = () => {
  const [Fav, setFav] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetch = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getfavbooks`, { headers });
      setFav(response.data.data);
    } catch (error) {
      console.error("Error fetching favorite books", error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-green-200">
      {/* Main Content */}
      <div className="flex-grow py-6">
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-6">My Favourites</h1>
  
        {!Fav ? (
          <div className="w-full flex items-center justify-center">
            <Loader />
          </div>
        ) : Fav.length === 0 ? (
          <div className="w-full flex items-center justify-center mt-10">
            <p className="text-lg text-gray-700">No Favourite Books Yet 📚</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
            {Fav.map((item, index) => (
              <div key={index} className="transition-transform duration-300 hover:scale-105">
                <BookCard data={item} fav={true} update={fetch} />
              </div>
            ))}
          </div>
        )}
      </div>
  
      {/* Footer */}
      <footer className="bg-green-300 text-gray-900 text-center p-4 mt-6">
        <p>© 2025 Readiculous. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Favourites;
