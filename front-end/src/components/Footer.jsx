import React from "react";
import logo from "../asset/logo.png";

const Footer = () => (
    <footer className="w-full text-gray-700 bg-amber-200 py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between mx-auto px-6">
            
            {/* LOGO SECTION */}
            <div className="flex flex-col items-center md:items-start">
                <figure className="mb-4">
                    <img src={logo} alt="logo" className="h-20 w-20" />
                </figure>
                
                {/* SOCIAL MEDIA ICONS */}
                <div className="flex space-x-4 mt-4">
                    <a className="text-gray-700 cursor-pointer hover:text-blue-500">
                        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                        </svg>
                    </a>
                    <a className="text-gray-700 cursor-pointer hover:text-gray-500">
                        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                        </svg>
                    </a>
                    <a className="text-gray-700 cursor-pointer hover:text-gray-500">
                        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                        </svg>
                    </a>
                    <a className="text-gray-700 cursor-pointer hover:text-pink-500">
                        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                            <path d="M12 2.2c-5.42 0-9.8 4.38-9.8 9.8 0 4.9 3.55 8.94 8.15 9.75v-6.91h-2.45v-2.84h2.45V9.54c0-2.42 1.48-3.76 3.66-3.76 1.07 0 2.18.19 2.18.19v2.39h-1.22c-1.2 0-1.57.75-1.57 1.52v1.82h2.68l-.43 2.84h-2.25v6.91c4.6-.81 8.15-4.85 8.15-9.75 0-5.42-4.38-9.8-9.8-9.8z"></path>
                        </svg>
                    </a>
                </div>
            </div>

            {/* FOOTER LINKS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10 md:mt-0 text-center md:text-left">
                {[
                    { title: "About", links: ["Company", "Careers", "Blog"] },
                    { title: "Support", links: ["Contact Support", "Help Resources", "Release Updates"] },
                    { title: "Platform", links: ["Terms & Privacy", "Pricing", "FAQ"] },
                    { title: "Contact", links: ["Send a Message", "Request a Quote", "1860-200-9898"] }
                ].map((section, index) => (
                    <div key={index} className="w-full px-4">
                        <h2 className="mb-3 text-xl font-bold tracking-widest text-gray-800 uppercase">{section.title}</h2>
                        <nav className="list-none text-lg">
                            {section.links.map((link, idx) => (
                                <li key={idx} className="mt-2">
                                    <a className="cursor-pointer hover:underline">{link}</a>
                                </li>
                            ))}
                        </nav>
                    </div>
                ))}
            </div>
        </div>
    </footer>
);

export default Footer;
