
// Import React to resolve React namespace errors in type definitions
import React from 'react';

// News Types
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  thumbnail: string;
  date: string;
  author: string;
  featured?: boolean;
}

// Program/Show Types
export interface Program {
  id: string;
  title: string;
  description: string;
  host: string;
  schedule: string;
  thumbnail: string;
  duration: string;
  type: 'news' | 'debate' | 'interview' | 'documentary' | 'talk-show';
}

// Team Member Types
export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo: string;
  social: {
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
  expertise: string[];
}

// Award Types
export interface Award {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
  icon?: string;
}

// Career Types
export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'internship';
  description: string;
  requirements: string[];
  postedDate: string;
}

// Photo Gallery Types
export interface PhotoItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
  location?: string;
  description?: string;
  dispatchId?: string;
  coordinates?: string;
}

// Stat Types
export interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

// Mission Card Types
export interface MissionCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Navigation Types
export interface NavLink {
  name: string;
  href: string;
  children?: NavLink[];
}
