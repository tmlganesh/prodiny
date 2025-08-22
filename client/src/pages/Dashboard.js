import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Users, Calendar, ArrowUpCircle, MessageSquare } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [recommendedSubgroups, setRecommendedSubgroups] = useState([]);
  const [expandedCollege, setExpandedCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, collegesRes, recommendedRes] = await Promise.all([
        api.get('/projects?limit=10'),
        api.get('/colleges?limit=5'),
        api.get('/subgroups/recommended')
      ]);

      setProjects(projectsRes.data.projects);
      setColleges(collegesRes.data.colleges);
      setRecommendedSubgroups(recommendedRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProject = async (projectId) => {
    try {
      await api.post(`/projects/${projectId}/join`);
      toast.success('Successfully joined the project!');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join project');
    }
  };

  const handleJoinSubgroup = async (subgroupId) => {
    try {
      await api.post(`/subgroups/${subgroupId}/join`);
      toast.success('Successfully joined the subgroup!');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join subgroup');
    }
  };

  const fetchCollegeDetails = async (collegeId) => {
    try {
      const response = await api.get(`/colleges/${collegeId}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch college details');
      return null;
    }
  };

  const toggleCollege = async (collegeId) => {
    if (expandedCollege === collegeId) {
      setExpandedCollege(null);
    } else {
      setExpandedCollege(collegeId);
      // Fetch detailed college info if not already loaded
      const college = colleges.find(c => c._id === collegeId);
      if (!college.subgroups || college.subgroups.length === 0) {
        const details = await fetchCollegeDetails(collegeId);
        if (details) {
          setColleges(colleges.map(c => 
            c._id === collegeId ? { ...c, subgroups: details.subgroups } : c
          ));
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-reddit-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-reddit-lightgray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">
                Discover new projects and connect with your college community.
              </p>
            </div>

            {/* Projects Feed */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <div key={project._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <ArrowUpCircle className="w-6 h-6 text-gray-400 hover:text-reddit-orange cursor-pointer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                          <span className="font-medium">r/{project.collegeId?.name}</span>
                          <span>•</span>
                          <span>Posted by u/{project.ownerId?.name}</span>
                          <span>•</span>
                          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-700 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.tags?.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <button 
                            onClick={() => handleJoinProject(project._id)}
                            className="flex items-center space-x-1 text-reddit-blue hover:text-reddit-lightblue"
                          >
                            <Users size={16} />
                            <span>Join ({project.members?.length})</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                            <MessageSquare size={16} />
                            <span>Discuss</span>
                          </button>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {project.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* College Communities Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">College Communities</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {colleges.map((college) => (
                  <div key={college._id}>
                    <div 
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => toggleCollege(college._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-reddit-blue rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {college.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{college.name}</h3>
                            <p className="text-sm text-gray-500">
                              {college.subgroups?.length || 0} subgroups • {college.projects?.length || 0} projects
                            </p>
                          </div>
                        </div>
                        {expandedCollege === college._id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {expandedCollege === college._id && (
                      <div className="px-4 pb-4 bg-gray-50">
                        <div className="ml-13 space-y-2">
                          {college.subgroups?.map((subgroup) => (
                            <div key={subgroup._id} className="flex items-center justify-between p-3 bg-white rounded-md">
                              <div>
                                <h4 className="font-medium text-gray-900">{subgroup.name}</h4>
                                <p className="text-sm text-gray-500">{subgroup.description}</p>
                                <p className="text-xs text-gray-400">
                                  {subgroup.members?.length || 0} members
                                </p>
                              </div>
                              <button 
                                onClick={() => handleJoinSubgroup(subgroup._id)}
                                className="px-3 py-1 text-sm bg-reddit-blue text-white rounded-full hover:bg-blue-600"
                              >
                                Join
                              </button>
                            </div>
                          ))}
                          {(!college.subgroups || college.subgroups.length === 0) && (
                            <p className="text-sm text-gray-500 text-center py-4">
                              No subgroups available yet.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommended Subgroups */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Recommended for You</h3>
              </div>
              <div className="p-4 space-y-3">
                {recommendedSubgroups.map((subgroup) => (
                  <div key={subgroup._id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{subgroup.name}</h4>
                      <p className="text-xs text-gray-500">
                        {subgroup.members?.length || 0} members
                      </p>
                    </div>
                    <button 
                      onClick={() => handleJoinSubgroup(subgroup._id)}
                      className="px-2 py-1 text-xs bg-reddit-orange text-white rounded-full hover:bg-orange-600"
                    >
                      Join
                    </button>
                  </div>
                ))}
                {recommendedSubgroups.length === 0 && (
                  <p className="text-sm text-gray-500 text-center">
                    No recommendations available.
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Quick Stats</h3>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Projects</span>
                  <span className="font-medium">{projects.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Your College</span>
                  <span className="font-medium">{user?.college?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
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
