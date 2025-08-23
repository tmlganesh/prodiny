import React, { useState, useEffect } from 'react';
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Share,
  Bookmark,
  MoreHorizontal,
  Bell,
  ChevronDown,
  Home,
  Users,
  BookOpen,
  TrendingUp,
  Settings,
  Menu,
  X
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
import { Sidebar, SidebarHeader, SidebarContent, SidebarNav, SidebarNavItem, SidebarSection } from '../components/ui/sidebar';


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
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-900 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="font-semibold text-xl text-gray-900 tracking-tight">Prodiny</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden p-1"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={18} />
              </Button>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarSection>
                <SidebarNav>
                  <SidebarNavItem
                    icon={Home}
                    active={activeNavItem === 'home'}
                    onClick={() => setActiveNavItem('home')}
                  >
                    Home
                  </SidebarNavItem>
                  <SidebarNavItem
                    icon={TrendingUp}
                    active={activeNavItem === 'trending'}
                    onClick={() => setActiveNavItem('trending')}
                  >
                    Trending
                  </SidebarNavItem>
                  <SidebarNavItem
                    icon={BookOpen}
                    active={activeNavItem === 'projects'}
                    onClick={() => setActiveNavItem('projects')}
                  >
                    Projects
                  </SidebarNavItem>
                </SidebarNav>
              </SidebarSection>

              <SidebarSection title="Communities">
                <SidebarNav>
                  <SidebarNavItem
                    icon={Users}
                    active={activeNavItem === 'communities'}
                    onClick={() => setActiveNavItem('communities')}
                  >
                    All Communities
                  </SidebarNavItem>
                  {colleges.slice(0, 5).map((college) => (
                    <SidebarNavItem
                      key={college._id}
                      active={activeNavItem === `college-${college._id}`}
                      onClick={() => setActiveNavItem(`college-${college._id}`)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-4 h-4 bg-primary-600 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-semibold">{college.name.charAt(0)}</span>
                        </div>
                        <span className="truncate">{college.name}</span>
                      </div>
                    </SidebarNavItem>
                  ))}
                </SidebarNav>
              </SidebarSection>

              <SidebarSection title="Resources">
                <SidebarNav>
                  <SidebarNavItem
                    icon={Settings}
                    active={activeNavItem === 'settings'}
                    onClick={() => setActiveNavItem('settings')}
                  >
                    Settings
                  </SidebarNavItem>
                </SidebarNav>
              </SidebarSection>
            </SidebarContent>
          </Sidebar>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 shadow-soft">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Mobile menu button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden p-2"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu size={18} />
                </Button>

                {/* Search */}
                <div className="flex-1 max-w-lg mx-4 lg:mx-8">
                  <Input
                    placeholder="Search projects..."
                    className="w-full px-4 py-2.5 bg-white border-gray-300 focus:border-primary-500 focus:ring-primary-500 text-gray-900 placeholder-gray-500 rounded-lg"
                  />
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-900">
                    <Bell size={18} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                      <div className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <Avatar name={user?.name} size={32} className="bg-primary-600" />
                        <ChevronDown size={14} className="text-gray-600 hidden sm:block" />
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
          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="flex flex-col xl:flex-row gap-8">
                {/* Feed */}
                <div className="flex-1 min-w-0">
              {/* Tabs */}
              <div className="bg-white border border-gray-200 rounded-lg mb-6 shadow-soft">
                <div className="grid w-full grid-cols-4">
                  <button
                    onClick={() => setActiveTab('best')}
                    className={`flex items-center justify-center py-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'best'
                      ? 'border-primary-600 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    Best
                  </button>
                  <button
                    onClick={() => setActiveTab('hot')}
                    className={`flex items-center justify-center py-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'hot'
                      ? 'border-primary-600 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    Hot
                  </button>
                  <button
                    onClick={() => setActiveTab('new')}
                    className={`flex items-center justify-center py-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'new'
                      ? 'border-primary-600 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => setActiveTab('top')}
                    className={`flex items-center justify-center py-3 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'top'
                      ? 'border-primary-600 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    Top
                  </button>
                </div>
              </div>
              {/* Create Post */}
              {!showCreatePost ? (
                <Card className="p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Avatar name={user?.name} size={40} className="bg-primary-600 flex-shrink-0" />
                    <Button
                      onClick={() => setShowCreatePost(true)}
                      variant="outline"
                      className="flex-1 text-left justify-start min-w-0 text-gray-600"
                    >
                      <span className="truncate">What's on your mind? Create a project...</span>
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 mb-6">
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <Input
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="Project title"
                      className="text-gray-900"
                    />
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Describe your project idea..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 placeholder-gray-500"
                    />
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreatePost(false)}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="w-full sm:w-auto">
                        Create Project
                      </Button>
                    </div>
                  </form>
                </Card>
              )}
              {/* Posts */}
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-600 mb-6">Be the first to create a project and start collaborating!</p>
                    <Button
                      onClick={() => setShowCreatePost(true)}
                    >
                      Create Your First Project
                    </Button>
                  </Card>
                ) : (
                  projects.map((project) => (
                    <Card key={project._id} className="hover:shadow-medium transition-shadow">
                      <div className="flex flex-col sm:flex-row">
                        {/* Vote Buttons */}
                        <div className="flex sm:flex-col items-center justify-center sm:justify-start p-4 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-200 order-2 sm:order-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(project._id, 'up')}
                            className={cn(
                              "p-1 hover:bg-gray-200",
                              upvotedPosts.has(project._id) ? "text-primary-600" : "text-gray-500"
                            )}
                          >
                            <ArrowUp size={16} />
                          </Button>
                          <span className="text-sm font-semibold py-1 text-gray-900">
                            {getVoteCount(project)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(project._id, 'down')}
                            className={cn(
                              "p-1 hover:bg-gray-200",
                              downvotedPosts.has(project._id) ? "text-error-600" : "text-gray-500"
                            )}
                          >
                            <ArrowDown size={16} />
                          </Button>
                        </div>
                        {/* Post Content */}
                        <div className="flex-1 p-4 sm:p-6 order-1 sm:order-2">
                          {/* Post Header */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                            <span className="font-medium hover:text-primary-600 cursor-pointer">
                              {project.collegeId?.name || 'Engineering'}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="truncate">Posted by {project.createdBy?.name || project.ownerId?.name || 'Anonymous'}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex-shrink-0">{formatTimeAgo(project.createdAt)}</span>
                          </div>
                          {/* Title */}
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-primary-600 cursor-pointer">
                            {project.title}
                          </h3>
                          {/* Content */}
                          <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
                            {project.description}
                          </p>
                          {/* Status Badge */}
                          {project.status && (
                            <Badge
                              color={project.status === 'open' ? 'blue' : 'gray'}
                              className="mb-4"
                            >
                              {project.status}
                            </Badge>
                          )}
                          {/* Actions */}
                          <div className="flex items-center gap-6 text-gray-500">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-xs hover:text-gray-700">
                              <MessageSquare size={14} />
                              <span className="hidden sm:inline">{project.comments} Comments</span>
                              <span className="sm:hidden">{project.comments}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-xs hover:text-gray-700">
                              <Share size={14} />
                              <span className="hidden sm:inline">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-xs hover:text-gray-700">
                              <Bookmark size={14} />
                              <span className="hidden sm:inline">Save</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="p-1 hover:text-gray-700">
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
                {/* Right Sidebar */}
                <div className="w-full xl:w-80 xl:flex-shrink-0 space-y-6">
                  {/* User Info */}
                  <Card>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Avatar name={user?.name} size={48} className="bg-primary-600" />
                        <div>
                          <p className="font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-sm text-gray-600">Student at {user?.collegeId?.name || 'Engineering College'}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm mb-6 border-t border-gray-200 pt-4">
                        <div className="text-center flex-1">
                          <p className="font-semibold text-gray-900 text-lg">1.2k</p>
                          <p className="text-xs text-gray-500">Karma</p>
                        </div>
                        <div className="text-center flex-1 border-l border-gray-200">
                          <p className="font-semibold text-gray-900 text-lg">2y</p>
                          <p className="text-xs text-gray-500">Cake day</p>
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => setShowCreatePost(true)}>
                        New Project
                      </Button>
                    </div>
                  </Card>

                  {/* Trending Topics */}
                  <Card>
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Trending Topics</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {['Machine Learning', 'Web Development', 'Mobile Apps', 'Data Science', 'AI Research'].map((topic, index) => (
                        <div key={topic} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 w-4 flex-shrink-0 font-medium">{index + 1}</span>
                            <span className="text-sm font-medium text-gray-900">{topic}</span>
                          </div>
                          <TrendingUp size={14} className="text-primary-600" />
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
