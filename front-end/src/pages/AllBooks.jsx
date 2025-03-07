import React, { useEffect, useState } from 'react';
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
  const [sortOption, setSortOption] = useState(''); // For sorting

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getallbooks`);
      setData(response.data.data);
      setFilteredData(response.data.data); // Set initial filtered data to all books
    };
    fetchBooks();
  }, []);

  const genresList = ["Fiction", "Adventure", "Fantasy", "Action", "Science Fiction", "Romance", "Thriller", "Mystery", "Horror", "Detective"];
  const languagesList = ["English", "Hindi", "Spanish", "French", "German", "Italian", "Chinese", "Japanese"];

  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: '0 - 500', value: '0-500' },
    { label: '500 - 1000', value: '500-1000' },
    { label: '1000 - 5000', value: '1000-5000' },
    { label: '5000+', value: '5000+' }
  ];

  // Apply filters and sorting
  // Sorting logic
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

  // Sorting logic
  if (sortOption === 'priceDesc') {
    filteredBooks.sort((a, b) => b.price - a.price); // Expensive First
  } else if (sortOption === 'priceAsc') {
    filteredBooks.sort((a, b) => a.price - b.price); // Cheaper First
  } else if (sortOption === 'alphabetical') {
    filteredBooks.sort((a, b) => {
      const titleA = a.title ? a.title.trim().toLowerCase() : '';
      const titleB = b.title ? b.title.trim().toLowerCase() : '';
    
      return titleA.localeCompare(titleB);
    });
  } else if (sortOption === 'recentlyAdded') {
    // Assuming 'createdAt' is the timestamp field for when the book was added
    filteredBooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Most Recent First
  }

  setFilteredData(filteredBooks); // Update filtered data state
}, [search, genre, priceRange, language, sortOption, data]);




  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="bg-gradient-to-r from-blue-200 to-green-300 min-h-screen text-black px-6 sm:px-12 py-8">
      <h4 className="text-gray-900 text-4xl font-extrabold mb-8 text-center">All Books</h4>
      
      <div className="my-8 flex flex-wrap gap-6 justify-center">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none w-1/3 sm:w-1/4"
        />

        {/* Genre Filter */}
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">All Genres</option>
          {genresList.map((genre, index) => (
            <option key={index} value={genre}>{genre}</option>
          ))}
        </select>

        {/* Price Range Filter */}
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          {priceRanges.map((range, index) => (
            <option key={index} value={range.value}>{range.label}</option>
          ))}
        </select>

        {/* Language Filter */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">All Languages</option>
          {languagesList.map((language, index) => (
            <option key={index} value={language}>{language}</option>
          ))}
        </select>

        {/* Sort Filter */}
        <select
  value={sortOption}
  onChange={handleSort}
  className="p-3 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
>
  <option value="">Sort by</option>
  <option value="priceDesc">Price Low to High</option>
  <option value="priceAsc">Price High to Low</option>
  
  <option value="recentlyAdded">Recently Added</option> {/* New sort option */}
</select>
      </div>

      {/* Loading State */}
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
