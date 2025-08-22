import React from 'react';
import Hyperspeed from '../components/Hyperspeed';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Hyperspeed />
      <div className="hyperspeed-content">
        {/* Hero Section (minimal) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Connect. Collaborate. <span className="text-white">Create.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Join the ultimate platform for college students to discover projects, connect with peers, and build amazing things together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
