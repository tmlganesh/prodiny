import React, { useState, useEffect } from 'react';
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Share,
  Bookmark,
  MoreHorizontal,
  Search,
  Bell,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { cn } from '../utils/cn';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../components/ui/dropdown-menu';
import Avatar from '../components/ui/avatar';


const Dashboard = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('best');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [colleges, setColleges] = useState([]);
  const [upvotedPosts, setUpvotedPosts] = useState(new Set());
  const [downvotedPosts, setDownvotedPosts] = useState(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchColleges();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      const projectsData = response.data.projects || response.data || [];
      setProjects(projectsData.map(project => ({
        ...project,
        upvotes: project.upvotes || Math.floor(Math.random() * 1000),
        comments: project.comments || Math.floor(Math.random() * 50),
        // ...existing code...
      })));
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Set some dummy data for demo
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchColleges = async () => {
    try {
      const response = await api.get('/colleges');
      setColleges(response.data.colleges || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      await api.post('/projects', {
        title: newPost.title,
        description: newPost.content,
        status: 'open'
      });
      setNewPost({ title: '', content: '' });
      setShowCreatePost(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleVote = (postId, type) => {
    if (type === 'up') {
      setUpvotedPosts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
          setDownvotedPosts(prevDown => {
            const newDownSet = new Set(prevDown);
            newDownSet.delete(postId);
            return newDownSet;
          });
        }
        return newSet;
      });
    } else {
      setDownvotedPosts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
          setUpvotedPosts(prevUp => {
            const newUpSet = new Set(prevUp);
            newUpSet.delete(postId);
            return newUpSet;
          });
        }
        return newSet;
      });
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return `${Math.floor(diffInDays / 7)}w`;
  };

  const getVoteCount = (project) => {
    const baseVotes = project.upvotes || 0;
    const upvoteBonus = upvotedPosts.has(project._id) ? 1 : 0;
    const downvoteBonus = downvotedPosts.has(project._id) ? -1 : 0;
    return baseVotes + upvoteBonus + downvoteBonus;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-black">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-black shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              {/* Logo */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="font-bold text-lg sm:text-xl text-black tracking-wide">prodiny</span>
              </div>
              {/* Search */}
              <div className="hidden sm:flex flex-1 max-w-lg mx-4 lg:mx-8">
                <div className="relative w-full">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                  <Input
                    placeholder="Search Prodiny"
                    className="w-full pl-10 pr-4 py-2 bg-white border-black rounded-full focus:bg-white focus:border-black text-black placeholder-black"
                  />
                </div>
              </div>
              {/* User Actions */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" className="p-2 hover:bg-white rounded-lg">
                  <Bell size={18} className="text-black" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-lg hover:bg-white">
                      <Avatar name={user?.name} size={24} className="bg-orange-500" />
                      <ChevronDown size={14} className="text-black hidden sm:block" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent isOpen={isDropdownOpen}>
                    <DropdownMenuItem onClick={logout}>
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1 lg:flex-[2] min-w-0">
              {/* Tabs */}
              <div className="bg-white rounded-2xl border border-black mb-6 shadow-lg">
                <div className="grid w-full grid-cols-4">
                  <button
                    onClick={() => setActiveTab('best')}
                    className={`flex items-center justify-center py-4 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'best'
                        ? 'border-orange-500 text-black'
                        : 'border-transparent text-black hover:text-orange-500'
                      }`}
                  >
                    Best
                  </button>
                  <button
                    onClick={() => setActiveTab('hot')}
                    className={`flex items-center justify-center py-4 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'hot'
                        ? 'border-orange-500 text-black'
                        : 'border-transparent text-black hover:text-orange-500'
                      }`}
                  >
                    Hot
                  </button>
                  <button
                    onClick={() => setActiveTab('new')}
                    className={`flex items-center justify-center py-4 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'new'
                        ? 'border-orange-500 text-black'
                        : 'border-transparent text-black hover:text-orange-500'
                      }`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => setActiveTab('top')}
                    className={`flex items-center justify-center py-4 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'top'
                        ? 'border-orange-500 text-black'
                        : 'border-transparent text-black hover:text-orange-500'
                      }`}
                  >
                    Top
                  </button>
                </div>
              </div>
              {/* Create Post */}
              {!showCreatePost ? (
                <Card className="p-3 sm:p-4 mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar name={user?.name} size={32} className="bg-orange-500 flex-shrink-0" />
                    <Button
                      onClick={() => setShowCreatePost(true)}
                      variant="outline"
                      className="flex-1 text-left justify-start min-w-0"
                    >
                      <span className="truncate">Create Project</span>
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-4 sm:p-6 mb-6">
                  <form onSubmit={handleCreatePost} className="space-y-3">
                    <Input
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Title"
                    />
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Text (optional)"
                      rows={4}
                      className="w-full p-3 border border-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-black placeholder-black"
                    />
                    <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreatePost(false)}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
                        Post
                      </Button>
                    </div>
                  </form>
                </Card>
              )}
              {/* Posts */}
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <Card className="p-12 text-center">
                    <h3 className="text-lg font-semibold text-black mb-2">No projects yet</h3>
                    <p className="text-black mb-4">Be the first to create a project!</p>
                    <Button
                      onClick={() => setShowCreatePost(true)}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Create Project
                    </Button>
                  </Card>
                ) : (
                  projects.map((project) => (
                    <Card key={project._id} className="hover:border-orange-500 transition-colors shadow-lg">
                      <div className="flex flex-col sm:flex-row">
                        {/* Vote Buttons */}
                        <div className="flex sm:flex-col items-center justify-center sm:justify-start p-2 bg-white border-b sm:border-b-0 sm:border-r border-black rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl order-2 sm:order-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(project._id, 'up')}
                            className={cn(
                              "p-1 hover:bg-white rounded-lg",
                              upvotedPosts.has(project._id) ? "text-orange-500" : "text-black"
                            )}
                          >
                            <ArrowUp size={20} />
                          </Button>
                          <span className={cn(
                            "text-sm font-bold py-1",
                            upvotedPosts.has(project._id) ? "text-orange-500" :
                              downvotedPosts.has(project._id) ? "text-blue-500" : "text-black"
                          )}>
                            {getVoteCount(project)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(project._id, 'down')}
                            className={cn(
                              "p-1 hover:bg-white rounded-lg",
                              downvotedPosts.has(project._id) ? "text-blue-500" : "text-black"
                            )}
                          >
                            <ArrowDown size={20} />
                          </Button>
                        </div>
                        {/* Post Content */}
                        <div className="flex-1 p-3 sm:p-4 order-1 sm:order-2">
                          {/* Post Header */}
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-black mb-2">
                            <span className="font-bold hover:underline cursor-pointer text-black">
                              {/* {project.collegeId?.name} or other label */}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="truncate">Posted by u/{project.createdBy?.name || project.ownerId?.name || 'anonymous'}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex-shrink-0">{formatTimeAgo(project.createdAt)}</span>
                          </div>
                          {/* Title */}
                          <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 hover:text-orange-500 cursor-pointer line-clamp-2">
                            {project.title}
                          </h3>
                          {/* Content */}
                          <p className="text-black text-sm mb-3 line-clamp-3">
                            {project.description}
                          </p>
                          {/* Status Badge */}
                          {project.status && (
                            <Badge
                              color={project.status === 'open' ? 'blue' : 'gray'}
                              className="mb-3"
                            >
                              {project.status}
                            </Badge>
                          )}
                          {/* Actions */}
                          <div className="flex items-center gap-2 sm:gap-4 text-black overflow-x-auto">
                            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs hover:bg-white text-black hover:text-black flex-shrink-0 rounded-lg">
                              <MessageSquare size={14} />
                              <span className="hidden sm:inline">{project.comments} Comments</span>
                              <span className="sm:hidden">{project.comments}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs hover:bg-white text-black hover:text-black flex-shrink-0 rounded-lg">
                              <Share size={14} />
                              <span className="hidden sm:inline">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs hover:bg-white text-black hover:text-black flex-shrink-0 rounded-lg">
                              <Bookmark size={14} />
                              <span className="hidden sm:inline">Save</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="p-1 hover:bg-white text-black hover:text-black flex-shrink-0 rounded-lg">
                              <MoreHorizontal size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
            {/* Sidebar */}
            <div className="w-full lg:w-80 lg:flex-shrink-0 space-y-6">
              {/* Popular Communities */}
              <Card>
                <div className="p-4 border-b border-black rounded-t-2xl">
                  <h3 className="font-bold text-black">Popular Colleges</h3>
                </div>
                <div className="p-4 space-y-3">
                  {colleges.slice(0, 5).map((college, index) => (
                    <div key={college._id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <span className="text-xs text-black w-3 sm:w-4 flex-shrink-0">{index + 1}</span>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs">C</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-black truncate">{college.name}</p>
                            <p className="text-xs text-black">{Math.floor(Math.random() * 10000)} members</p>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 sm:px-3 py-1 flex-shrink-0 rounded-lg">
                        Join
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full text-blue-500 border-blue-500 hover:bg-white rounded-lg">
                    View All
                  </Button>
                </div>
              </Card>
              {/* User Info */}
              <Card>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar name={user?.name} size={40} className="bg-orange-500" />
                    <div>
                      <p className="font-bold text-black">{user?.name}</p>
                      <p className="text-sm text-black">Student at {user?.collegeId?.name || 'Engineering College'}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-black mb-3">
                    <div className="text-center flex-1">
                      <p className="font-bold text-orange-500">1.2k</p>
                      <p className="text-xs sm:text-sm">Karma</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="font-bold text-blue-500">2y</p>
                      <p className="text-xs sm:text-sm">Cake day</p>
                    </div>
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg">
                    New Project
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
