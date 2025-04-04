const config = require('../config');
const authController = require('./auth.controller');
const cache = require('../utils/cache');

let isRefreshingData = false;
let dataRefreshPromise = null;
let lastRefreshAttempt = 0;
const REFRESH_COOLDOWN = 5000; 

const initialize = async () => {
  try {
    await authController.initialize();
    
    await fetchAllData();
    
    setupPeriodicRefresh();
    
    return true;
  } catch (error) {
    console.error('Failed to initialize data controller:', error.message);
    throw error;
  }
};

const setupPeriodicRefresh = () => {
  console.log(`⏱️ Setting up data refresh every ${config.cache.refreshInterval / 1000} seconds`);
  
  setInterval(async () => {
    try {
      await refreshData();
    } catch (error) {
      console.error('Error during scheduled data refresh:', error.message);
    }
  }, config.cache.refreshInterval);
};

const fetchAllData = async () => {
  if (isRefreshingData && dataRefreshPromise) {
    return await dataRefreshPromise;
  }
  
  const now = Date.now();
  if (lastRefreshAttempt > 0 && now - lastRefreshAttempt < REFRESH_COOLDOWN) {
    console.log(`⏳ Data refresh attempted too soon, waiting for cooldown...`);
    await new Promise(resolve => setTimeout(resolve, REFRESH_COOLDOWN));
  }
  
  isRefreshingData = true;
  lastRefreshAttempt = now;
  
  dataRefreshPromise = (async () => {
    try {
      console.log('🔄 Fetching all data...');
      
      await authController.ensureValidToken();
      
      const users = await fetchAllUsers();
      
      const userIds = Object.keys(users);
      for (const userId of userIds) {
        await fetchUserPosts(userId);
      }
      
      cache.updateLastUpdated();
      
      console.log('Data fetch completed successfully');
      return true;
    } catch (error) {
      console.error('Error fetching all data:', error.message);
      
      if (error.response && error.response.status === 401) {
        try {
          console.log('Auth error during data fetch, refreshing token...');
          await authController.forceTokenRefresh();
          
          console.log('Retrying data fetch with new token...');
          
          const users = await fetchAllUsers();
          
          const userIds = Object.keys(users);
          for (const userId of userIds) {
            await fetchUserPosts(userId);
          }
          
          cache.updateLastUpdated();
          
          console.log('Data fetch retry completed successfully');
          return true;
        } catch (retryError) {
          console.error('Data fetch retry failed:', retryError.message);
          throw retryError;
        }
      }
      
      throw error;
    } finally {
      isRefreshingData = false;
      dataRefreshPromise = null;
    }
  })();
  
  return await dataRefreshPromise;
};


const refreshData = async () => {
  try {
    return await fetchAllData();
  } catch (error) {
    console.error('Error refreshing data:', error.message);

    return false;
  }
};


const fetchAllUsers = async () => {
  try {
    const response = await authController.makeAuthenticatedRequest('get', '/users');
    
    cache.setUsers(response.users || {});
    
    return response.users || {};
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
};

const fetchUserPosts = async (userId) => {
  try {
    const response = await authController.makeAuthenticatedRequest('get', `/users/${userId}/posts`);
    const posts = response.posts || [];
    
    cache.setUserPostCount(userId, posts.length);
    
    for (const post of posts) {
      const isNewPost = cache.addPost(post);
      
      if (isNewPost) {
        await fetchPostComments(post.id);
      }
    }
    
    return posts;
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error.message);
    throw error;
  }
};


const fetchPostComments = async (postId) => {
  try {
    const response = await authController.makeAuthenticatedRequest('get', `/posts/${postId}/comments`);
    const comments = response.comments || [];
    
    cache.setPostComments(postId, comments);
    
    return comments;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error.message);

    return [];
  }
};

module.exports = {
  initialize,
  refreshData,
  fetchAllData,
  fetchAllUsers,
  fetchUserPosts,
  fetchPostComments
};