import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BookCard from '../components/BookCard.jsx';
import axios from 'axios';
import Loader from '../components/Loader.jsx';

const Allbooks = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [language, setLanguage] = useState('');
  const [sortOption, setSortOption] = useState('');
  
  const location = useLocation();

  // Extract genre from URL when page loads
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genreFromURL = params.get('genre');
    if (genreFromURL) {
      setGenre(genreFromURL);
    }
  }, [location]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getallbooks`);
      setData(response.data.data);
      setFilteredData(response.data.data);
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    let filteredBooks = data;

    if (search) {
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) || 
        book.author.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (genre) {
      filteredBooks = filteredBooks.filter(book => book.genre === genre);
    }

    if (priceRange) {
      if (priceRange === '0-500') {
        filteredBooks = filteredBooks.filter(book => book.price >= 0 && book.price <= 500);
      } else if (priceRange === '500-1000') {
        filteredBooks = filteredBooks.filter(book => book.price > 500 && book.price <= 1000);
      } else if (priceRange === '1000-5000') {
        filteredBooks = filteredBooks.filter(book => book.price > 1000 && book.price <= 5000);
      } else if (priceRange === '5000+') {
        filteredBooks = filteredBooks.filter(book => book.price > 5000);
      }
    }

    if (language) {
      filteredBooks = filteredBooks.filter(book => book.language === language);
    }

    if (sortOption === 'priceDesc') {
      filteredBooks.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'priceAsc') {
      filteredBooks.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'alphabetical') {
      filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'recentlyAdded') {
      filteredBooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredData(filteredBooks);
  }, [search, genre, priceRange, language, sortOption, data]);

  return (
    <div className="bg-gradient-to-r from-blue-200 to-green-300 min-h-screen text-black px-6 sm:px-12 py-8">
      <h4 className="text-gray-900 text-4xl font-extrabold mb-8 text-center">All Books</h4>
      
      <div className="my-8 flex flex-wrap gap-6 justify-center">
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none w-1/3 sm:w-1/4"
        />

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">All Genres</option>
          {["Fiction", "Adventure", "Fantasy", "Action", "Science Fiction", "Romance", "Thriller", "Mystery", "Horror", "Detective"].map((g, index) => (
            <option key={index} value={g}>{g}</option>
          ))}
        </select>

        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          {[
            { label: 'All Prices', value: '' },
            { label: '0 - 500', value: '0-500' },
            { label: '500 - 1000', value: '500-1000' },
            { label: '1000 - 5000', value: '1000-5000' },
            { label: '5000+', value: '5000+' }
          ].map((range, index) => (
            <option key={index} value={range.value}>{range.label}</option>
          ))}
        </select>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">All Languages</option>
          {["English", "Hindi", "Spanish", "French", "German", "Italian", "Chinese", "Japanese"].map((lang, index) => (
            <option key={index} value={lang}>{lang}</option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">Sort by</option>
          <option value="priceDesc">Price Low to High</option>
          <option value="priceAsc">Price High to Low</option>
          <option value="recentlyAdded">Recently Added</option>
        </select>
      </div>

      {!filteredData.length ? (
        <div className="flex items-center justify-center mt-12">
          <Loader />
        </div>
      ) : (
        <div className="my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 lg:gap-8">
          {filteredData.map((item, index) => (
            <div key={index} className="transition-all duration-300 hover:scale-105 transform">
              <BookCard data={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Allbooks;
