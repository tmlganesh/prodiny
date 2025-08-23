import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  MessageSquare, 
  FolderOpen, 
  ChevronDown, 
  ChevronRight,
  Plus,
  Hash,
  Building
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ activeSection, onSectionChange, className }) => {
  const { user } = useAuth();
  const [colleges, setColleges] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [isCollegesExpanded, setIsCollegesExpanded] = useState(true);
  const [isCommunitiesExpanded, setIsCommunitiesExpanded] = useState(true);

  useEffect(() => {
    fetchColleges();
    fetchCommunities();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await api.get('/colleges?limit=10');
      setColleges(response.data.colleges || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const fetchCommunities = async () => {
    try {
      const response = await api.get('/subgroups/recommended');
      setCommunities(response.data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const mainNavItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      href: '#'
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderOpen,
      href: '#'
    }
  ];

  const NavItem = ({ item, isActive, onClick, className: itemClassName }) => {
    const Icon = item.icon;
    return (
      <Button
        variant="ghost"
        onClick={() => onClick(item.id)}
        className={cn(
          "w-full justify-start gap-3 px-3 py-2 h-auto text-sm font-medium",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          isActive && "bg-gray-100 dark:bg-gray-800 text-black dark:text-white",
          itemClassName
        )}
      >
        <Icon size={18} />
        <span>{item.label}</span>
      </Button>
    );
  };

  const CollegeItem = ({ college }) => (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3 px-6 py-1.5 h-auto text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      <Building size={14} />
      <span className="truncate">{college.name}</span>
    </Button>
  );

  const CommunityItem = ({ community }) => (
    <Button
      variant="ghost"
      className="w-full justify-between gap-2 px-6 py-1.5 h-auto text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      <div className="flex items-center gap-2 min-w-0">
        <Hash size={14} />
        <span className="truncate">{community.name}</span>
      </div>
      {community.memberCount && (
        <Badge variant="secondary" className="text-xs px-1.5 py-0">
          {community.memberCount}
        </Badge>
      )}
    </Button>
  );

  return (
    <div className={cn("flex flex-col h-full bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-lg">Prodiny</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="py-4 space-y-1">
          {/* Main Navigation */}
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeSection === item.id}
                onClick={onSectionChange}
              />
            ))}
          </div>

          <Separator className="my-4" />

          {/* Colleges Section */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              onClick={() => setIsCollegesExpanded(!isCollegesExpanded)}
              className="w-full justify-between px-3 py-2 h-auto text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span>Colleges</span>
              {isCollegesExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </Button>
            
            {isCollegesExpanded && (
              <div className="space-y-0.5">
                {colleges.slice(0, 5).map((college) => (
                  <CollegeItem key={college._id} college={college} />
                ))}
                {colleges.length > 5 && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 px-6 py-1.5 h-auto text-xs text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <Plus size={14} />
                    <span>View {colleges.length - 5} more</span>
                  </Button>
                )}
              </div>
            )}
          </div>

          <Separator className="my-4" />

          {/* Communities Section */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              onClick={() => setIsCommunitiesExpanded(!isCommunitiesExpanded)}
              className="w-full justify-between px-3 py-2 h-auto text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span>Communities</span>
              {isCommunitiesExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </Button>
            
            {isCommunitiesExpanded && (
              <div className="space-y-0.5">
                {communities.slice(0, 8).map((community) => (
                  <CommunityItem key={community._id} community={community} />
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 px-6 py-1.5 h-auto text-xs text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <Plus size={14} />
                  <span>Join Community</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Bottom User Info */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
