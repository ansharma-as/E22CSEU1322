const config = require('../config');
const authController = require('./auth.controller');
const cache = require('../utils/cache');

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
  console.log(`Setting up data refresh every ${config.cache.refreshInterval / 1000} seconds`);
  
  setInterval(async () => {
    try {
      await refreshData();
    } catch (error) {
      console.error('Error during scheduled data refresh:', error.message);
    }
  }, config.cache.refreshInterval);
};


const fetchAllData = async () => {
  try {
    console.log('Fetching all data...');
    
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
    throw error;
  }
};

const refreshData = async () => {
  try {
    console.log('🔄 Refreshing data...');
    await fetchAllData();
    return true;
  } catch (error) {
    console.error('Error refreshing data:', error.message);
    throw error;
  }
};


const fetchAllUsers = async () => {
  try {
    const response = await authController.makeAuthenticatedRequest('get', '/users');
    
    cache.setUsers(response.users);
    
    return response.users;
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
    
    // Store in cache
    cache.setPostComments(postId, comments);
    
    return comments;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error.message);
    throw error;
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