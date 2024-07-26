import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
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
            <Link to="/" className="text-red-500 hover:text-red-700"><FaFacebookF /></Link>
            <Link to="/" className="text-red-500 hover:text-red-700"><FaLinkedinIn /></Link>
            <Link to="/" className="text-red-500 hover:text-red-700"><FaTwitter /></Link>
            <Link to="/" className="text-red-500 hover:text-red-700"><FaInstagram /></Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-between text-white space-x-10">
          <div>
            <h3 className="text-lg font-semibold mb-4">Business</h3>
            <ul className="text-gray-400">
              <li className="mb-2"><Link to="/">Startup</Link></li>
              <li className="mb-2"><Link to="/">Employee</Link></li>
              <li className="mb-2"><Link to="/">Success</Link></li>
              <li className="mb-2"><Link to="/">Videos</Link></li>
              <li className="mb-2"><Link to="/">Markets</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Technology</h3>
            <ul className="text-gray-400">
            <li className="mb-2"><Link to="/">Innovate</Link></li>
              <li className="mb-2"><Link to="/">Gadget</Link></li>
              <li className="mb-2"><Link to="/">Innovative Cities</Link></li>
              <li className="mb-2"><Link to="/">Upstarts</Link></li>
              <li className="mb-2"><Link to="/">Future Tech</Link></li>
              
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Travel</h3>
            <ul className="text-gray-400">
            <li className="mb-2"><Link to="/">Destinations</Link></li>
              <li className="mb-2"><Link to="/">Food & Drink</Link></li>
              <li className="mb-2"><Link to="/">Stay</Link></li>
              <li className="mb-2"><Link to="/">News</Link></li>
              <li className="mb-2"><Link to="/">Videos</Link></li>
              
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Sports</h3>
            <ul className="text-gray-400">
            <li className="mb-2"><Link to="/">Football</Link></li>
              <li className="mb-2"><Link to="/">Tennis</Link></li>
              <li className="mb-2"><Link to="/">Golf</Link></li>
              <li className="mb-2"><Link to="/">Motorsports</Link></li>
              <li className="mb-2"><Link to="/">Esports</Link></li>
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
