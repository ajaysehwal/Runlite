'use client';
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface GitHubStarButtonProps {
  projectUrl?: string;
  owner: string; // GitHub username or organization
  repo: string;  // Repository name
}

const GitHubStarButton: React.FC<GitHubStarButtonProps> = ({ 
  projectUrl = "https://github.com/ajaysehwal/runlite", 
  owner, 
  repo 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        const data = await response.json();
        setStarCount(data.stargazers_count);
      } catch (error) {
        console.error("Failed to fetch star count:", error);
      }
    };

    fetchStarCount();
  }, [owner, repo]);

  return (
    <a
      href={projectUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 
        text-sm font-medium
        border rounded-md
        transition-all duration-200
        select-none
        ${isHovered 
          ? 'bg-gray-50 border-gray-300' 
          : 'bg-white border-gray-300'
        }
        hover:bg-gray-50
        active:scale-95
        shadow-sm
        cursor-pointer
        no-underline
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      aria-label="Star this project on GitHub"
    >
      <Star 
        size={16}
        className={`
          transition-colors duration-200
          ${isHovered 
            ? 'fill-gray-600 text-gray-600' 
            : 'text-gray-600'
          }
        `}
      />
      <span className="text-gray-700">Star</span>
      <span className={`
        px-2 py-0.5 ml-1 text-xs font-medium rounded-full
        transition-all duration-200
        bg-gray-100 text-gray-600
      `}>
        {starCount !== null ? starCount : 'Loading...'}
      </span>
    </a>
  );
};

export default GitHubStarButton;
