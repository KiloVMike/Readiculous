import React from 'react';
import img1 from '../asset/img2.png';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const Hero = () => {
    const navigate = useNavigate();  // Initialize navigate

    const handleExploreNowClick = () => {
        navigate('/allbooks');  // Navigate to All Books page
    };

    return (
        <div className='relative flex flex-col sm:flex-row px-4 sm:space-y-0 sm:space-x-4 items-center justify-between'>
            {/* Background Decoration */}
            <div className='absolute -top-10 -left-10 w-40 h-40 bg-blue-300 rounded-full opacity-30 blur-2xl'></div>
            <div className='absolute -bottom-10 -right-10 w-40 h-40 bg-pink-300 rounded-full opacity-30 blur-2xl'></div>

            {/* Left Content */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className='relative flex flex-col justify-center w-full sm:w-3/6 px-6 space-y-6 text-center sm:text-left'>
                <h1 className='text-6xl lg:text-7xl font-extrabold text-white-900 leading-tight drop-shadow-lg '>Discover Your Next Great Read</h1>
                <p className='text-lg sm:text-xl text-white-900 leading-relaxed'>Explore books that spark curiosity, knowledge, and adventure. Discover your next great read with Readiculous today.</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExploreNowClick}  // Add onClick handler
                    className='relative px-8 py-3 sm:px-10 sm:py-4 text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg transition-all transform hover:scale-105 hover:shadow-xl overflow-hidden'>
                    <span className='absolute inset-0 bg-white opacity-10 rounded-full'></span>
                    <span className='relative'>Explore Now</span>
                </motion.button>
            </motion.div>

            {/* Right Image */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className='relative top-0  w-full sm:w-3/6 flex justify-center'>
                <div className=' p-4 rounded-3xl shadow-xl relative overflow-hidden'>
                    <img src={img1} alt="Hero" className='relative z-0' />
                </div>
            </motion.div>
        </div>
    );
};

export default Hero;
