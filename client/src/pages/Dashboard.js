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
  TrendingUp,
  Star,
  Award,
  Eye,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
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
        subreddit: project.collegeId?.name || 'engineering'
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
      setColleges(response.data || []);
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
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Reddit Style */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-xl text-gray-900">prodiny</span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search Prodiny"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-gray-300 rounded-full focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Bell size={20} className="text-gray-500" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <div className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100">
                    <Avatar name={user?.name} size={24} className="bg-orange-500" />
                    <ChevronDown size={16} className="text-gray-500" />
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

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-12 gap-4">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8">
            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-300 mb-4">
              <Tabs className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-transparent border-b border-gray-200 rounded-none p-0">
                  <TabsTrigger 
                    value="best" 
                    isActive={activeTab === 'best'} 
                    onClick={setActiveTab}
                    className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
                  >
                    <Award size={16} />
                    Best
                  </TabsTrigger>
                  <TabsTrigger 
                    value="hot" 
                    isActive={activeTab === 'hot'} 
                    onClick={setActiveTab}
                    className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
                  >
                    <TrendingUp size={16} />
                    Hot
                  </TabsTrigger>
                  <TabsTrigger 
                    value="new" 
                    isActive={activeTab === 'new'} 
                    onClick={setActiveTab}
                    className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
                  >
                    <Star size={16} />
                    New
                  </TabsTrigger>
                  <TabsTrigger 
                    value="top" 
                    isActive={activeTab === 'top'} 
                    onClick={setActiveTab}
                    className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
                  >
                    <Eye size={16} />
                    Top
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Create Post */}
            {!showCreatePost ? (
              <Card className="p-3 mb-4 bg-white border border-gray-300">
                <div className="flex items-center gap-3">
                  <Avatar name={user?.name} size={32} className="bg-orange-500" />
                  <Button
                    onClick={() => setShowCreatePost(true)}
                    variant="outline"
                    className="flex-1 text-left justify-start bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-500"
                  >
                    Create Project
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-4 mb-4 bg-white border border-gray-300">
                <form onSubmit={handleCreatePost} className="space-y-3">
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Title"
                    className="border-gray-300"
                  />
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Text (optional)"
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreatePost(false)}
                      className="border-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                      Post
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Posts */}
            <div className="space-y-2">
              {projects.length === 0 ? (
                <Card className="p-8 text-center bg-white border border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to create a project!</p>
                  <Button 
                    onClick={() => setShowCreatePost(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Create Project
                  </Button>
                </Card>
              ) : (
                projects.map((project) => (
                  <Card key={project._id} className="bg-white border border-gray-300 hover:border-gray-400 transition-colors">
                    <div className="flex">
                      {/* Vote Buttons */}
                      <div className="flex flex-col items-center p-2 bg-gray-50 border-r border-gray-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(project._id, 'up')}
                          className={cn(
                            "p-1 hover:bg-orange-100",
                            upvotedPosts.has(project._id) ? "text-orange-500" : "text-gray-400"
                          )}
                        >
                          <ArrowUp size={20} />
                        </Button>
                        <span className={cn(
                          "text-sm font-bold py-1",
                          upvotedPosts.has(project._id) ? "text-orange-500" : 
                          downvotedPosts.has(project._id) ? "text-blue-500" : "text-gray-700"
                        )}>
                          {getVoteCount(project)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(project._id, 'down')}
                          className={cn(
                            "p-1 hover:bg-blue-100",
                            downvotedPosts.has(project._id) ? "text-blue-500" : "text-gray-400"
                          )}
                        >
                          <ArrowDown size={20} />
                        </Button>
                      </div>

                      {/* Post Content */}
                      <div className="flex-1 p-3">
                        {/* Post Header */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <span className="font-bold hover:underline cursor-pointer">
                            r/{project.subreddit}
                          </span>
                          <span>•</span>
                          <span>Posted by u/{project.createdBy?.name || project.ownerId?.name || 'anonymous'}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(project.createdAt)}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                          {project.title}
                        </h3>

                        {/* Content */}
                        <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                          {project.description}
                        </p>

                        {/* Status Badge */}
                        {project.status && (
                          <Badge 
                            variant={project.status === 'open' ? 'default' : 'secondary'}
                            className="mb-3"
                          >
                            {project.status}
                          </Badge>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-4 text-gray-500">
                          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs hover:bg-gray-100">
                            <MessageSquare size={16} />
                            {project.comments} Comments
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs hover:bg-gray-100">
                            <Share size={16} />
                            Share
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs hover:bg-gray-100">
                            <Bookmark size={16} />
                            Save
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100">
                            <MoreHorizontal size={16} />
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
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* Popular Communities */}
            <Card className="bg-white border border-gray-300">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Popular Communities</h3>
              </div>
              <div className="p-3 space-y-3">
                {colleges.slice(0, 5).map((college, index) => (
                  <div key={college._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-4">{index + 1}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">r/</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">r/{college.name}</p>
                          <p className="text-xs text-gray-500">{Math.floor(Math.random() * 10000)} members</p>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1">
                      Join
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full text-blue-500 border-blue-500 hover:bg-blue-50">
                  View All
                </Button>
              </div>
            </Card>

            {/* User Info */}
            <Card className="bg-white border border-gray-300">
              <div className="p-3">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={user?.name} size={40} className="bg-orange-500" />
                  <div>
                    <p className="font-bold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">Student at {user?.collegeId?.name || 'Engineering College'}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <div className="text-center">
                    <p className="font-bold text-orange-500">1.2k</p>
                    <p>Karma</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-blue-500">2y</p>
                    <p>Cake day</p>
                  </div>
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  New Project
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
