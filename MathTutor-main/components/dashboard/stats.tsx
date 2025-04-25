'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Folder, Image, Target, Users } from 'lucide-react';

export function Stats() {
  const [aiPromptCount, setAiPromptCount] = useState(0);
  const [roadmapCount, setRoadmapCount] = useState(0);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem("mathTutorToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/api/users/agent`, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      console.log(response.data)

      if (response.data) {
        setAiPromptCount(response.data.chatHistory/2);
        setRoadmapCount(response.data.roadmap);
      }
      
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const stats = [
    {
      title: 'AI Learning Prompts',
      value: aiPromptCount, // Dynamically updated
      icon: Folder
    },
    {
      title: 'Roadmap Created',
      value: roadmapCount,
      icon: Image
    },
    {
      title: 'Certification Achieved',
      value: 'Coming Soon',
      icon: Target
    },
    {
      title: 'Guidance Session',
      value: 'Coming Soon',
      icon: Users
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="flex items-center gap-4 p-4 lg:p-6">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <h3 className="text-xl lg:text-xl font-semibold tracking-tight">
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
