import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(formData);
      if (result && result.success) {
        toast.success('Signed in successfully');
        navigate('/dashboard');
      } else {
        toast.error((result && result.error) || 'Failed to sign in');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
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
          <p className="mt-4 text-gray-200 max-w-lg">Join project teams, showcase your work, and collaborate across colleges. Secure, reliable, and built for learning.</p>
          <ul className="mt-6 space-y-3 text-gray-200">
            <li className="flex items-start gap-3"><span className="font-semibold">•</span> Curated projects and mentorship</li>
            <li className="flex items-start gap-3"><span className="font-semibold">•</span> Secure collaboration tools</li>
            <li className="flex items-start gap-3"><span className="font-semibold">•</span> Certificates & portfolios</li>
          </ul>
        </div>

        {/* Form Panel */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto h-12 w-12 bg-reddit-orange rounded-full flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-gray-900">Sign in</h2>
              <p className="mt-2 text-sm text-gray-600">Access your student workspace</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-reddit-blue focus:ring-reddit-blue border-gray-300 rounded" />
                  <label htmlFor="remember_me" className="text-sm text-gray-600">Remember me</label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot" className="font-medium text-reddit-blue hover:underline">Forgot password?</Link>
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center items-center px-4 py-3 bg-reddit-blue text-white font-semibold rounded-lg hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-reddit-blue">
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account? <Link to="/signup" className="text-reddit-blue font-medium hover:underline">Create one</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
