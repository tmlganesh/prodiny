import React, { useState, useEffect } from 'react';
import { Search, LogOut, MessageSquare, Users, Heart, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    console.log('Dashboard mounted, user:', user);
    console.log('Token:', localStorage.getItem('token'));
    fetchPosts();
    fetchSubgroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/projects?limit=20');
      setPosts(response.data.projects || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in to view posts');
        navigate('/login');
      } else {
        toast.error('Failed to load posts');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSubgroups = async () => {
    try {
      const response = await api.get('/subgroups/recommended');
      setSubgroups(response.data || []);
    } catch (error) {
      console.error('Error fetching subgroups:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      console.log('Creating post with data:', {
        title: newPost.title,
        description: newPost.content,
        status: 'open',
        tags: []
      });
      
      const response = await api.post('/projects', {
        title: newPost.title,
        description: newPost.content,
        status: 'open',
        tags: []
      });
      
      console.log('Post created successfully:', response.data);
      toast.success('Post created successfully!');
      setNewPost({ title: '', content: '' });
      setShowCreatePost(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Please log in to create posts');
        navigate('/login');
      } else if (error.response?.status === 400) {
        const errorMsg = error.response.data?.errors?.[0]?.msg || 
                        error.response.data?.message || 
                        'Validation error';
        toast.error(errorMsg);
      } else {
        toast.error('Failed to create post');
      }
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await api.delete(`/projects/${postId}`);
      toast.success('Post deleted successfully!');
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error deleting post:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in to delete posts');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You can only delete your own posts');
      } else {
        toast.error('Failed to delete post');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-reddit-orange border-r-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 max-w-7xl items-center px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-reddit-orange rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl">Prodiny</span>
          </div>
          
          {/* Search */}
          <div className="flex flex-1 items-center justify-center px-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search posts, communities..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-reddit-orange focus:border-transparent"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium hidden md:block">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Main Feed - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Post */}
            <div className="bg-white rounded-lg border p-6">
              {!showCreatePost ? (
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="w-full flex items-center space-x-3 p-3 text-left text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span>What's on your mind?</span>
                </button>
              ) : (
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Post title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-reddit-orange"
                  />
                  <textarea
                    placeholder="What's happening in your project?"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-reddit-orange resize-none"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreatePost(false);
                        setNewPost({ title: '', content: '' });
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-reddit-orange text-white rounded-lg hover:bg-orange-600 font-medium"
                    >
                      Post
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="bg-white rounded-lg border p-12 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">No posts yet</h3>
                  <p className="text-gray-500 mt-2">Be the first to create a post!</p>
                </div>
              ) : (
                posts.map((post) => {
                  console.log('Post owner ID:', post.ownerId?._id, 'Current user ID:', user?.id);
                  return (
                    <div key={post._id} className="bg-white rounded-lg border">
                      <div className="p-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                          <span className="font-medium">r/{post.collegeId?.name || 'college'}</span>
                          <span>•</span>
                          <span>Posted by u/{post.ownerId?.name || 'user'}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(post.createdAt)}</span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                        <p className="text-gray-700 mb-4">{post.description}</p>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-gray-500">
                            <button className="flex items-center space-x-1 hover:text-gray-700">
                              <Heart className="h-4 w-4" />
                              <span className="text-sm">Like</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-gray-700">
                              <MessageSquare className="h-4 w-4" />
                              <span className="text-sm">Comment</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-gray-700">
                              <Users className="h-4 w-4" />
                              <span className="text-sm">Join ({post.members?.length || 0})</span>
                            </button>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {post.status}
                            </span>
                          </div>
                          
                          {/* Delete button - only show for posts owned by current user */}
                          {user && post.ownerId?._id === user.id && (
                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className="flex items-center space-x-1 text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete post"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="text-sm">Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Sidebar - 1 column */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-lg">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.collegeId?.name || 'College Student'}</p>
                </div>
              </div>
            </div>

            {/* Popular Communities */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Popular Communities</h3>
              </div>
              <div className="p-4 space-y-3">
                {subgroups.slice(0, 5).map((subgroup) => (
                  <div key={subgroup._id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{subgroup.name}</p>
                      <p className="text-xs text-gray-500">
                        {subgroup.members?.length || 0} members
                      </p>
                    </div>
                    <button className="px-3 py-1 text-xs bg-reddit-orange text-white rounded-full hover:bg-orange-600">
                      Join
                    </button>
                  </div>
                ))}
                {subgroups.length === 0 && (
                  <p className="text-sm text-gray-500">No communities yet</p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Quick Stats</h3>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Posts today</span>
                  <span className="font-medium">
                    {posts.filter(post => {
                      const today = new Date().toDateString();
                      const postDate = new Date(post.createdAt).toDateString();
                      return today === postDate;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Communities</span>
                  <span className="font-medium">{subgroups.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total posts</span>
                  <span className="font-medium">{posts.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
