import React, { useEffect, useState } from 'react';
import BookCard from '../components/BookCard.jsx';
import axios from 'axios';
import Loader from '../components/Loader.jsx';

const Allbooks = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getallbooks`);
      setData(response.data.data);
    };
    fetch();
  }, []);

  return (
    <div className=' bg-green-100 min-h-screen text-yellow-100 px-4 sm:px-12 py-8'>
      <h4 className='text-gray-900 text-4xl font-bold'>All Books</h4>
      {!data ? (
        <div className='flex items-center justify-center mt-12'>
          <Loader />
        </div>
      ) : (
        <div className='my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-8'>
          {data.map((item, index) => (
            <div key={index}>
              <BookCard data={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Allbooks;
