import React, { useState, useEffect } from 'react';
import { Search, LogOut, MessageSquare, Users, Heart, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import Avatar from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Spinner } from '../components/ui/spinner';
import { Tag } from '../components/ui/tag';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
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
      
      const response = await api.post('/projects', {
        title: newPost.title,
        description: newPost.content,
        status: 'open',
        tags: []
      });
      
      
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
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <Spinner className="mx-auto mb-4 border-white/20 border-t-white" />
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
  <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-b from-gray-950 to-black/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl">Prodiny</span>
          </div>
          
          {/* Search */}
          <div className="flex flex-1 items-center justify-center px-6">
              <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search posts, communities..."
                className="w-full pl-10 pr-4 py-2 bg-black text-white border-gray-700"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar name={user?.name} size={32} className="bg-white/10" />
              <span className="text-sm font-medium hidden md:block">{user?.name}</span>
            </div>
            <Button onClick={handleLogout} variant="outline" className="p-2 text-gray-300 rounded-lg border-white/10 bg-transparent">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Main Feed - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Post */}
            <Card className="border border-gray-800">
              {!showCreatePost ? (
                <Button onClick={() => setShowCreatePost(true)} variant="outline" className="w-full flex items-center space-x-3 p-3 text-left text-gray-200 bg-transparent border-white/10">
                  <Avatar name={user?.name} size={32} className="bg-white/10" />
                  <span className="text-gray-200">What's on your mind?</span>
                </Button>
                ) : (
                <form onSubmit={handleCreatePost} className="space-y-4 p-4">
                  <Input
                    type="text"
                    placeholder="Post title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full bg-black text-white border-gray-700"
                  />
                  <Textarea
                    placeholder="What's happening in your project?"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={4}
                    className="w-full resize-none bg-white/5 text-white border-gray-700"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowCreatePost(false);
                        setNewPost({ title: '', content: '' });
                      }}
                      variant="outline"
                      className="px-4 py-2 text-gray-200 border-white/10"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="px-6 py-2 bg-white text-black" variant="primary">Post</Button>
                  </div>
                </form>
                )}
            </Card>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <Card className="border border-gray-800 p-8 text-center">
                  <h3 className="text-lg font-semibold text-white">No posts yet</h3>
                  <p className="text-gray-400 mt-2">Be the first to create a post!</p>
                </Card>
              ) : (
                posts.map((post) => {
                  return (
                    <Card key={post._id} className="border border-gray-800">
                      <div className="p-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
                          <span className="font-medium">r/{post.collegeId?.name || 'Unknown'}</span>
                          <span>•</span>
                          <span>Posted by u/{post.ownerId?.name || 'Unknown'}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(post.createdAt)}</span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                        <p className="text-gray-300 mb-4">{post.description}</p>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <Tag key={index}>{tag}</Tag>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-gray-300">
                            <Button variant="outline" className="flex items-center gap-1 text-sm text-gray-300 border-white/10">
                              <Heart className="h-4 w-4" />
                              <span>Like</span>
                            </Button>
                            <Button variant="outline" className="flex items-center gap-1 text-sm text-gray-300 border-white/10">
                              <MessageSquare className="h-4 w-4" />
                              <span>Comment</span>
                            </Button>
                            <Button variant="outline" className="flex items-center gap-1 text-sm text-gray-300 border-white/10">
                              <Users className="h-4 w-4" />
                              <span>Join ({post.members?.length || 0})</span>
                            </Button>
                            <Badge color="green">{post.status}</Badge>
                          </div>
                          
                          {user && post.ownerId?._id === user.id && (
                            <Button onClick={() => handleDeletePost(post._id)} variant="outline" className="flex items-center gap-1 text-sm text-gray-300 border-white/10">
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Sidebar - 1 column */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <Card className="border border-gray-800 p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Avatar name={user?.name} size={48} className="bg-white/10" />
                <div>
                  <h3 className="font-semibold text-white">{user?.name}</h3>
                  <p className="text-sm text-gray-400">{user?.collegeId?.name || 'College Student'}</p>
                </div>
              </div>
              <div className="mt-2">
                <Button as="a" href="/profile" variant="outline" className="w-full text-gray-200 border-white/10">View Profile</Button>
              </div>
            </Card>

            {/* Popular Communities */}
            <Card className="border border-gray-800">
              <div className="p-4 border-b border-white/5">
                <h3 className="font-semibold text-white">Popular Communities</h3>
              </div>
              <div className="p-4 space-y-3">
                {subgroups.slice(0, 5).map((subgroup) => (
                  <div key={subgroup._id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{subgroup.name}</p>
                      <p className="text-xs text-gray-400">
                        {subgroup.members?.length || 0} members
                      </p>
                    </div>
                    <Button variant="primary" className="px-3 py-1 text-xs">Join</Button>
                  </div>
                ))}
                {subgroups.length === 0 && (
                  <p className="text-sm text-gray-400">No communities yet</p>
                )}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="border border-gray-800">
              <div className="p-4 border-b border-white/5">
                <h3 className="font-semibold text-white">Quick Stats</h3>
              </div>
              <div className="p-4 space-y-2 text-gray-300">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Posts today</span>
                  <span className="font-medium">
                    {posts.filter(post => {
                      const today = new Date().toDateString();
                      const postDate = new Date(post.createdAt).toDateString();
                      return today === postDate;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Communities</span>
                  <span className="font-medium">{subgroups.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total posts</span>
                  <span className="font-medium">{posts.length}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
