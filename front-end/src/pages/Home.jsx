import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Recently from '../components/Recently';
import Trending from '../components/Trending';
import Footer from '../components/Footer';

// Genre Icons
import FictionIcon from '../asset/fiction.webp';
import AdventureIcon from '../asset/adventure.webp';
import FantasyIcon from '../asset/fantasy.webp';
import ActionIcon from '../asset/action.webp';
import SciFiIcon from '../asset/scifi.webp';
import RomanceIcon from '../asset/romance.webp';
import ThrillerIcon from '../asset/thriller.webp';
import MythologyIcon from '../asset/mythology.webp';
import HistoryIcon from '../asset/history.webp';
import MysteryIcon from '../asset/mystery.webp';
import HorrorIcon from '../asset/horror.webp';
import DetectiveIcon from '../asset/detective.webp';
import CrimeIcon from '../asset/crime.webp';
import DramaIcon from '../asset/drama.webp';
import ComedyIcon from '../asset/comedy.webp';

// Genre Data
const genresList = [
    { name: "Fiction", icon: FictionIcon, bg: "bg-gradient-to-r from-purple-500 to-blue-500" },
    { name: "Adventure", icon: AdventureIcon, bg: "bg-gradient-to-r from-orange-400 to-red-500" },
    { name: "Fantasy", icon: FantasyIcon, bg: "bg-gradient-to-r from-indigo-500 to-green-400" },
    { name: "Action", icon: ActionIcon, bg: "bg-gradient-to-r from-yellow-500 to-red-600" },
    { name: "Science Fiction", icon: SciFiIcon, bg: "bg-gradient-to-r from-cyan-500 to-blue-500" },
    { name: "Romance", icon: RomanceIcon, bg: "bg-gradient-to-r from-pink-500 to-red-400" },
    { name: "Thriller", icon: ThrillerIcon, bg: "bg-gradient-to-r from-gray-800 to-black" },
    { name: "Mythology", icon: MythologyIcon, bg: "bg-gradient-to-r from-yellow-500 to-orange-400" },
    { name: "Historical", icon: HistoryIcon, bg: "bg-gradient-to-r from-purple-500 to-blue-500" },
    { name: "Mystery", icon: MysteryIcon, bg: "bg-gradient-to-r from-blue-500 to-indigo-600" },
    { name: "Horror", icon: HorrorIcon, bg: "bg-gradient-to-r from-black to-red-700" },
    { name: "Detective", icon: DetectiveIcon, bg: "bg-gradient-to-r from-gray-700 to-blue-900" },
    { name: "Crime", icon: CrimeIcon, bg: "bg-gradient-to-r from-red-700 to-black" },
    { name: "Drama", icon: DramaIcon, bg: "bg-gradient-to-r from-purple-600 to-pink-500" },
    { name: "Comedy", icon: ComedyIcon, bg: "bg-gradient-to-r from-yellow-400 to-orange-500" },
];

const Home = () => {
    return (
        <div className="relative space-y-16 p-12 bg-green-200 bg-cover bg-center">
      
      <div className="relative top-0   ">      {/* Hero Section */}
            <Hero />
</div>

 {/* Trending Section */}
 <Trending />

 
            {/* Genre Section */}
            <div className="mt-16 mb-16">
                <h2 className="text-5xl font-extrabold text-gray-800 text-center mb-10 tracking-wide">🔥 Explore Genres</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-center">
                    {genresList.map((genre, index) => (
                        <Link 
                            key={index} 
                            to={`/allbooks?genre=${encodeURIComponent(genre.name)}`} 
                            className={`group relative p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center text-center 
                            ${genre.bg} transition-all duration-300 hover:scale-110 hover:shadow-2xl transform`}
                        >
                            <div className="absolute inset-0 border-4 border-transparent rounded-3xl group-hover:border-white transition-all duration-500"></div>
                            <div className="relative z-10">
                                <img 
                                    src={genre.icon} 
                                    alt={genre.name} 
                                    className="w-28 h-28 max-w-full max-h-full scale-110 drop-shadow-lg transition-transform duration-300 group-hover:scale-125"
                                />
                            </div>
                            <p className="relative z-10 mt-4 text-2xl font-bold text-white group-hover:text-yellow-300 transition-all duration-300">
                                {genre.name}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

           

            {/* Recently Section */}
            <Recently />
           
        </div>
       
    );
     
};

export default Home;
