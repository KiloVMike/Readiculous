import React from 'react';
import Hero from '../components/Hero';
import Recently from '../components/Recently';
import Trending from '../components/Trending';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import home from '../asset/home.jpg'


const Home = () => {
    return (
        <div 
            className="relative space-y-8 p-8  bg-green-200 bg-cover bg-center" 
            
        >
            <div className="absolute inset-0 "></div>
            <div className="relative">
                <Hero />
                <Trending />
                <Recently />
            </div>
        </div>
    );
};

export default Home;

