import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Award } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect. Collaborate. 
            <span className="text-reddit-orange"> Create.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join the ultimate platform for college students to discover projects, 
            connect with peers, and build amazing things together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-reddit-orange text-white font-semibold rounded-full hover:bg-orange-600 transition-colors flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-reddit-blue text-reddit-blue font-semibold rounded-full hover:bg-reddit-blue hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Prodiny?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to turn your ideas into reality with fellow students
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-reddit-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Discover Projects</h3>
              <p className="text-gray-600">
                Browse through exciting projects from students across your college and find the perfect match for your skills and interests.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-reddit-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Join Communities</h3>
              <p className="text-gray-600">
                Connect with like-minded students in specialized subgroups and participate in discussions that matter to you.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Build Your Portfolio</h3>
              <p className="text-gray-600">
                Showcase your contributions, lead projects, and build a portfolio that stands out to future employers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects Preview */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600">
              See what amazing projects students are working on
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-reddit-orange rounded-full"></div>
                  <div>
                    <p className="font-semibold text-sm">Sample Project {i}</p>
                    <p className="text-xs text-gray-500">Computer Science</p>
                  </div>
                </div>
                <h3 className="font-semibold mb-2">AI-Powered Study Assistant</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Building an intelligent study companion that helps students organize their learning materials and track progress.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">React</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Python</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">AI/ML</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-reddit-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Collaborating?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of students already building the future together
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-reddit-orange text-white font-semibold rounded-full hover:bg-orange-600 transition-colors"
          >
            <span>Join Prodiny Today</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
