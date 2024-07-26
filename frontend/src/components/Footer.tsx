import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-10 border-t mt-10">
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
        <div className="text-white mb-8 lg:mb-0">
          <h2 className="text-3xl font-bold mb-4">Shot News</h2>
          <p className="text-gray-400 mb-4">
            Craft narratives that ignite inspiration, knowledge, and entertainment.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-red-500 hover:text-red-700"><FaFacebookF /></a>
            <a href="#" className="text-red-500 hover:text-red-700"><FaLinkedinIn /></a>
            <a href="#" className="text-red-500 hover:text-red-700"><FaTwitter /></a>
            <a href="#" className="text-red-500 hover:text-red-700"><FaInstagram /></a>
          </div>
        </div>
        <div className="flex flex-wrap justify-between text-white space-x-10">
          <div>
            <h3 className="text-lg font-semibold mb-4">Business</h3>
            <ul className="text-gray-400">
              <li className="mb-2"><a href="#">Startup</a></li>
              <li className="mb-2"><a href="#">Employee</a></li>
              <li className="mb-2"><a href="#">Success</a></li>
              <li className="mb-2"><a href="#">Videos</a></li>
              <li className="mb-2"><a href="#">Markets</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Technology</h3>
            <ul className="text-gray-400">
              <li className="mb-2"><a href="#">Innovate</a></li>
              <li className="mb-2"><a href="#">Gadget</a></li>
              <li className="mb-2"><a href="#">Innovative Cities</a></li>
              <li className="mb-2"><a href="#">Upstarts</a></li>
              <li className="mb-2"><a href="#">Future Tech</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Travel</h3>
            <ul className="text-gray-400">
              <li className="mb-2"><a href="#">Destinations</a></li>
              <li className="mb-2"><a href="#">Food & Drink</a></li>
              <li className="mb-2"><a href="#">Stay</a></li>
              <li className="mb-2"><a href="#">News</a></li>
              <li className="mb-2"><a href="#">Videos</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Sports</h3>
            <ul className="text-gray-400">
              <li className="mb-2"><a href="#">Football</a></li>
              <li className="mb-2"><a href="#">Tennis</a></li>
              <li className="mb-2"><a href="#">Golf</a></li>
              <li className="mb-2"><a href="#">Motorsports</a></li>
              <li className="mb-2"><a href="#">Esports</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-10 text-gray-400 text-center">
        <p>&copy; 2024 Shot News. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
