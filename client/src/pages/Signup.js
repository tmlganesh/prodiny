import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeId: ''
  });
  const [colleges, setColleges] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await api.get('/colleges');
      setColleges(response.data.colleges || []);
    } catch (error) {
      toast.error('Failed to fetch colleges');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...signupData } = formData;
      signupData.role = 'student';
      const result = await signup(signupData);
      if (result && result.success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        toast.error((result && result.error) || 'Failed to create account');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-reddit-lightgray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Brand / Visual Panel */}
        <div className="hidden md:flex flex-col justify-center rounded-2xl p-8 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white shadow-lg">
          <div className="mb-6">
            <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">P</span>
            </div>
          </div>
          <h3 className="text-3xl font-extrabold leading-tight">Prodiny for Students</h3>
          <p className="mt-4 text-gray-200 max-w-lg">Create your student profile, join project teams, and build a portfolio that stands out to recruiters and faculty.</p>
          <ul className="mt-6 space-y-3 text-gray-200">
            <li className="flex items-start gap-3"><span className="font-semibold">•</span> Verified college network</li>
            <li className="flex items-start gap-3"><span className="font-semibold">•</span> Team collaboration & versioned projects</li>
            <li className="flex items-start gap-3"><span className="font-semibold">•</span> Showcase and certificates</li>
          </ul>
        </div>

        {/* Form Panel */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto h-12 w-12 bg-reddit-orange rounded-full flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-gray-900">Create your account</h2>
              <p className="mt-2 text-sm text-gray-600">Sign up to start collaborating on projects</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 block w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-reddit-blue"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 block w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-reddit-blue"
                  placeholder="you@college.edu"
                />
              </div>

              <div>
                <label htmlFor="collegeId" className="block text-sm font-medium text-gray-700">College</label>
                <select
                  id="collegeId"
                  name="collegeId"
                  required
                  value={formData.collegeId}
                  onChange={handleChange}
                  className="mt-2 block w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-reddit-blue"
                >
                  <option value="">Select your college</option>
                  {colleges.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative mt-2">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-reddit-blue pr-10"
                    placeholder="Create a password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm password</label>
                <div className="relative mt-2">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-reddit-blue pr-10"
                    placeholder="Confirm your password"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label="Toggle password visibility" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center items-center px-4 py-3 bg-reddit-orange text-white font-semibold rounded-lg hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-reddit-orange">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account? <Link to="/login" className="text-reddit-blue font-medium hover:underline">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
