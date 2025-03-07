import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BookCard from './BookCard';
import axios from 'axios';
import Loader from './Loader';

const Recently = () => {
  const [data, setData] = useState();
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getrecentbooks`);
      setData(response.data.data);
    };
    fetch();
  }, []);

  return (
    <div className='px-4 py-2  w-full border-green-700 border-4 rounded-2xl'>
      <h4 className='relative text-5xl font-bold text-gray-900 tracking-wide mb-10 text-center'>Recently Added</h4>
      {!data && (
        <div className='flex items-center justify-center'>
          <Loader />
        </div>
      )}
      <div className='relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 p-8 justify-center w-full'>
        {data &&
          data.map((item, index) => (
            <Link to={`/getdetails/${item._id}`} key={item._id} className='block'>
              <div className='relative group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition w-80 h-auto mx-auto border border-gray-300 transform hover:-translate-y-2 duration-300 flex flex-col items-center backdrop-blur-md'>
                <img src={item.url} alt={item.title} className='w-full h-auto max-h-80 object-contain rounded-lg shadow-md' />
                <div className='mt-5 text-center w-full'>
                  <p className='text-gray-900 text-xl font-semibold truncate'>{item.title}</p>
                  <p className='text-gray-600 text-lg italic'>By: <span className='font-medium'>{item.author}</span></p>
                  <p className='text-blue-700 text-xl font-semibold uppercase'>{item.genre}</p>
                  <p className='text-green-700 text-2xl font-bold mt-2'>₹{item.price}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Recently;
