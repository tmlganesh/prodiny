import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Heart, 
  MessageSquare, 
  Share, 
  Bookmark,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import Avatar from './ui/avatar';
import { useAuth } from '../contexts/AuthContext';

const ProjectsFeed = ({ posts, onCreatePost, className }) => {
  const { user } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (newPost.title.trim() && newPost.content.trim()) {
      onCreatePost(newPost);
      setNewPost({ title: '', content: '' });
      setShowCreatePost(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const filterOptions = [
    { id: 'all', label: 'All Posts', icon: TrendingUp },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'popular', label: 'Popular', icon: Heart },
    { id: 'team', label: 'Team Projects', icon: Users }
  ];

  const PostCard = ({ post }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {post.createdBy?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{post.createdBy?.name || 'Anonymous'}</p>
              <p className="text-xs text-gray-500">
                {post.createdBy?.college?.name || 'Unknown College'} • {formatTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <h3 className="font-semibold text-lg mb-2 leading-tight">{post.title}</h3>
        <p className="text-gray-700 text-sm mb-3 leading-relaxed">{post.description}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <Badge 
            variant={post.status === 'open' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {post.status || 'Open'}
          </Badge>
          {post.teamSize && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Users size={12} />
              Team of {post.teamSize}
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600 hover:text-red-600">
              <Heart size={16} className="mr-1" />
              <span className="text-xs">{post.likes || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600 hover:text-blue-600">
              <MessageSquare size={16} className="mr-1" />
              <span className="text-xs">{post.comments || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600 hover:text-green-600">
              <Share size={16} className="mr-1" />
              <span className="text-xs">Share</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-yellow-600">
            <Bookmark size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className={cn("flex-1 max-w-2xl mx-auto", className)}>
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Projects Feed</h1>
          <Button 
            onClick={() => setShowCreatePost(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Create Project
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-2" />
            Filters
          </Button>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-1">
          {filterOptions.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className="h-8"
              >
                <Icon size={14} className="mr-1" />
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <Card className="mb-6 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <h3 className="font-semibold">Create New Project</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <Input
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Project title..."
                className="font-medium"
              />
              <Textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Describe your project idea, goals, and what kind of team members you're looking for..."
                rows={4}
              />
              <div className="flex gap-2 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreatePost(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Create Project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={24} className="text-gray-400" />
              </div>
              <h3 className="font-semibold mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-4">Be the first to share a project idea!</p>
              <Button 
                onClick={() => setShowCreatePost(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={16} className="mr-2" />
                Create First Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectsFeed;
