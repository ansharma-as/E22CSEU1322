import React, { useState, useEffect } from 'react';
import { getTrendingPosts } from '../api';
import { motion } from 'framer-motion';

const getRandomCategory = (postId) => {
  const categories = [
    { name: 'Travel', color: 'bg-purple-100 text-purple-800', icon: '✈️' },
    { name: 'Food', color: 'bg-red-100 text-red-800', icon: '🍔' },
    { name: 'Technology', color: 'bg-blue-100 text-blue-800', icon: '💻' },
    { name: 'Health', color: 'bg-green-100 text-green-800', icon: '🏃‍♂️' },
    { name: 'Fashion', color: 'bg-pink-100 text-pink-800', icon: '👗' },
  ];
  return categories[postId % categories.length];
};

const getRandomImageUrl = (postId) => {
  const categories = ['nature', 'tech', 'people', 'architecture', 'animals'];
  const category = categories[postId % categories.length];
  return `https://source.unsplash.com/featured/800x500?${category}&sig=${postId}`;
};

const getRandomTime = (postId) => {
  const hours = [2, 4, 6, 8, 10, 12, 18, 24, 36, 48];
  return `${hours[postId % hours.length]} hours ago`;
};

const getReactions = (postId) => {
  return {
    likes: 120 + (postId * 17) % 800,
    shares: 30 + (postId * 7) % 200,
    bookmarks: 15 + (postId * 3) % 100
  };
};

const PostCard = ({ post, index }) => {
  const category = getRandomCategory(post.id);
  const postTime = getRandomTime(post.id);
  const reactions = getReactions(post.id);
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="relative">
        <img 
          src={getRandomImageUrl(post.id)} 
          alt="Post cover" 
          className="w-full h-64 sm:h-72 object-cover"
        />
        <div className="absolute top-4 left-4">
          <div className={`${category.color} flex items-center px-3 py-1.5 rounded-full text-xs font-medium`}>
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </div>
        </div>
        
        <div className="absolute top-4 right-4">
          <div className="bg-gray-900 bg-opacity-60 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
            </svg>
            {postTime}
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-24"></div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm mr-4">
            <img 
              src={`https://i.pravatar.cc/150?img=${parseInt(post.userid) % 70}`}
              alt={post.user} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold">{post.user}</h4>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" clipRule="evenodd"></path>
                </svg>
                Influencer
              </span>
              <span className="mx-2">•</span>
              <span>{postTime}</span>
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {post.content}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {`${post.content} - This trending post is gaining significant engagement across our platform. The content resonates with many users in the ${category.name} community.`}
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-5">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mr-4">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-2 0c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6 6 2.686 6 6z" clipRule="evenodd" />
                <path d="M15 10a1 1 0 01-1 1h-3m0 0V8m0 3v3" />
              </svg>
            </div>
            <div>
              <h4 className="text-blue-800 dark:text-blue-300 font-medium">Trending Insight</h4>
              <p className="text-blue-700 dark:text-blue-200 text-sm mt-1">
                This post has <span className="font-bold">{post.commentCount}</span> comments, 
                making it one of our top engaging content pieces right now.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <motion.button 
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                </svg>
                <span>{reactions.likes}</span>
              </motion.button>
              
              <motion.button 
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path>
                </svg>
                <span className="font-bold">{post.commentCount}</span>
              </motion.button>
              
              <motion.button 
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M13 4.5a2.5 2.5 0 00-5 0l.74 5.2-2.06-2.06a2.5 2.5 0 00-3.54 3.54l7.28 7.28a.75.75 0 001.06 0L18.2 11.74a2.5 2.5 0 00-3.54-3.54l-2.06 2.06.74-5.2z" clipRule="evenodd"></path>
                </svg>
                <span>{reactions.shares}</span>
              </motion.button>
            </div>
            
            <motion.button 
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
              </svg>
              <span>{reactions.bookmarks}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const fetchPosts = async () => {
    try {
      setIsRefreshing(true);
      const data = await getTrendingPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch trending posts. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Refresh data every 30 seconds
    const intervalId = setInterval(fetchPosts, 30000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80">
        <div className="w-20 h-20 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Discovering trending content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Unable to load trending posts</h3>
        </div>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          onClick={fetchPosts}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Demo filter tabs 
  const filterTabs = [
    { id: 'all', label: 'All Topics' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  return (
    <div>
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Trending Content</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Posts with the highest engagement across our platform
          </p>
        </div>
        
        <button 
          onClick={fetchPosts}
          disabled={isRefreshing}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isRefreshing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"></path>
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>

      <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <div className="flex space-x-2">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-300 text-lg">No trending posts available right now.</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Check back soon for new trending content!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
      
      {/* Trending Insights Panel */}
      {posts.length > 0 && (
        <motion.div 
          className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Trending Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center text-green-600 dark:text-green-300 mr-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <h4 className="text-green-800 dark:text-green-300 font-medium">Comment Engagement</h4>
              </div>
              <p className="text-green-700 dark:text-green-200 text-sm">Comments are up 23% compared to last week's trending content.</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-300 mr-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                </div>
                <h4 className="text-purple-800 dark:text-purple-300 font-medium">Top Categories</h4>
              </div>
              <p className="text-purple-700 dark:text-purple-200 text-sm">Technology and Travel are today's most active categories.</p>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-800 flex items-center justify-center text-orange-600 dark:text-orange-300 mr-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <h4 className="text-orange-800 dark:text-orange-300 font-medium">Peak Activity</h4>
              </div>
              <p className="text-orange-700 dark:text-orange-200 text-sm">Most trending content is posted between 4-6 PM.</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrendingPosts;