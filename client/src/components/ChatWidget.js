import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Minimize2, 
  Users,
  Phone,
  Video,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';

const ChatWidget = ({ className }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');

  // Mock chat data
  const conversations = [
    {
      id: 1,
      name: 'Project Team Alpha',
      type: 'group',
      members: 5,
      lastMessage: 'Hey everyone, let\'s discuss the new features',
      lastMessageTime: '2 min ago',
      unreadCount: 3,
      isOnline: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      type: 'direct',
      lastMessage: 'Thanks for the help with the code!',
      lastMessageTime: '5 min ago',
      unreadCount: 1,
      isOnline: true
    },
    {
      id: 3,
      name: 'CS Department',
      type: 'group',
      members: 12,
      lastMessage: 'New assignment posted',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      isOnline: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      message: 'Hey, are you available for a quick discussion about the project?',
      time: '10:30 AM',
      isMe: false
    },
    {
      id: 2,
      sender: 'You',
      message: 'Sure! What would you like to discuss?',
      time: '10:32 AM',
      isMe: true
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      message: 'I was thinking about the database design. Do you think we should use MongoDB or PostgreSQL?',
      time: '10:33 AM',
      isMe: false
    },
    {
      id: 4,
      sender: 'You',
      message: 'MongoDB would be good for our use case since we have flexible data structures',
      time: '10:35 AM',
      isMe: true
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Here you would send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <MessageSquare size={20} className="text-white" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            4
          </Badge>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <Card className={cn(
        "w-80 h-96 shadow-xl transition-all duration-200",
        isMinimized && "h-12"
      )}>
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} />
            <span className="font-medium">
              {activeChat ? activeChat.name : 'Messages'}
            </span>
            {activeChat && activeChat.type === 'group' && (
              <Badge variant="secondary" className="text-xs">
                {activeChat.members}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {activeChat && (
              <>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-blue-700">
                  <Phone size={14} />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-blue-700">
                  <Video size={14} />
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
            >
              <Minimize2 size={14} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
            >
              <X size={14} />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-full">
            {!activeChat ? (
              // Conversations List
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setActiveChat(conv)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  >
                    <div className="relative">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium",
                        conv.type === 'group' ? 'bg-green-500' : 'bg-blue-500'
                      )}>
                        {conv.type === 'group' ? (
                          <Users size={16} />
                        ) : (
                          conv.name[0].toUpperCase()
                        )}
                      </div>
                      {conv.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{conv.name}</p>
                        <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Active Chat View
              <>
                {/* Back Button */}
                <div className="p-2 border-b">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveChat(null)}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    ← Back to messages
                  </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.isMe ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-xs px-3 py-2 rounded-lg text-sm",
                          msg.isMe
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        )}
                      >
                        {!msg.isMe && (
                          <p className="font-medium text-xs mb-1">{msg.sender}</p>
                        )}
                        <p>{msg.message}</p>
                        <p className={cn(
                          "text-xs mt-1",
                          msg.isMe ? "text-blue-100" : "text-gray-500"
                        )}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Send size={16} />
                    </Button>
                  </div>
                </form>
              </>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatWidget;
