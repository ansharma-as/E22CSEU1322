// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 9292;

// Base URL for the test server
const TEST_SERVER_BASE_URL = 'http://20.244.56.144/evaluation-service';
const AUTH_URL = 'http://20.244.56.144/evaluation-service/auth';

// Your provided auth credentials
// In a production app, these should be in environment variables
const AUTH_CREDENTIALS = {    
        "email": "e22cseu1322@bennett.edu.in",
        "name": "ansh sharma",
        "rollNo": "e22cseu1322",
        "accessCode": "rtCHZJ",
        "clientID": "50844033-6072-42f4-bcf2-55ea21487482",
        "clientSecret": "TwwmGEYXJTBMBPVV"   
};

// Token management
let authToken = null;
let tokenExpiry = 0;

// Cache data structures
let usersCache = null;
let postsCache = [];
let commentsCache = new Map(); // Map of postId to comments array
let postCountByUser = new Map(); // Map of userId to post count
let commentCountByPost = new Map(); // Map of postId to comment count
let lastUpdated = 0;
const CACHE_TTL = 60000; // 1 minute TTL for cache

// Enable CORS to allow requests from frontend
app.use(cors());

// Initialize authentication and data
initializeAuth().then(() => {
  initializeData();
});

// Periodic refresh (every minute)
setInterval(async () => {
  await ensureValidToken();
  refreshData();
}, 60000);

app.get('/', (req, res) => {
  res.send('Backend is running fine!')
});

// Routes
app.get('/users', async (req, res) => {
  try {
    await ensureValidToken();
    await ensureFreshData();
    
    // Get top 5 users by post count
    const topUsers = [...postCountByUser.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId, postCount]) => ({
        id: userId,
        name: usersCache[userId],
        postCount
      }));
    
    res.json({ users: topUsers });
  } catch (error) {
    console.error('Error fetching top users:', error);
    res.status(500).json({ error: 'Failed to fetch top users' });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const type = req.query.type || 'latest';
    await ensureValidToken();
    await ensureFreshData();
    
    let result = [];
    
    if (type === 'popular') {
      // Get the maximum comment count
      const maxComments = Math.max(...commentCountByPost.values());
      
      // Get all posts with the maximum comment count
      result = postsCache
        .filter(post => commentCountByPost.get(post.id) === maxComments)
        .map(post => ({
          ...post,
          commentCount: commentCountByPost.get(post.id),
          user: usersCache[post.userid]
        }));
    } else if (type === 'latest') {
      // Return the 5 most recent posts
      result = postsCache
        .sort((a, b) => b.id - a.id) // Assuming higher IDs are newer posts
        .slice(0, 5)
        .map(post => ({
          ...post,
          commentCount: commentCountByPost.get(post.id) || 0,
          user: usersCache[post.userid]
        }));
    }
    
    res.json({ posts: result });
  } catch (error) {
    console.error(`Error fetching ${req.query.type} posts:`, error);
    res.status(500).json({ error: `Failed to fetch ${req.query.type} posts` });
  }
});

// Auth helper functions
async function initializeAuth() {
  try {
    await getAuthToken();
    // console.log('Authentication initialized successfully');
  } catch (error) {
    // console.error('Error initializing authentication:', error);
  }
}

async function getAuthToken() {
    try {
      // If you already have a valid token from a previous request
      if (authToken && tokenExpiry > Date.now()) {
        return authToken;
      }
      
      console.log('Fetching new auth token...');
      
      try {
        // Try to get a token from the API
        const response = await axios.post("http://20.244.56.144/evaluation-service/auth", {
          "email": "e22cseu1322@bennett.edu.in",
          "name": "ansh sharma",
          "rollNo": "e22cseu1322",
          "accessCode": "rtCHZJ",
          "clientID": "50844033-6072-42f4-bcf2-55ea21487482",
          "clientSecret": "TwwmGEYXJTBMBPVV"
        });
        
        console.log('Auth API response status:', response.status);
        console.log("response data: ", response.data);
        
        if (response.data && response.data.access_token) {
          authToken = response.data.access_token;
          tokenExpiry = Date.now() + (response.data.expires_in * 1000);
          console.log('Successfully obtained new token from API');
          return authToken;
        } else {
          console.log('Auth API response did not contain expected token format:', response.data);
        }
      } catch (apiError) {
        console.error('Error calling auth API:', apiError.message);
        
        // If API call fails, log detailed error info
        if (apiError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('API Error Status:', apiError.response.status);
          console.error('API Error Data:', apiError.response.data);
        } else if (apiError.request) {
          // The request was made but no response was received
          console.error('No response received from auth API');
        }
        
        // Fallback to hardcoded token
        console.log('Falling back to hardcoded token...');
      }
      return authToken;
    } catch (error) {
      console.error('Unexpected error in getAuthToken:', error);
      throw error;
    }
  }

async function ensureValidToken() {
  if (!authToken || tokenExpiry <= Date.now()) {
    await getAuthToken();
  }
  return authToken;
}

// Create a function to get axios instance with current token
// function getApiInstance() {
//   return axios.create({
//     headers: {
//       'Authorization': `Bearer ${authToken}`
//     }
//   });
// }

// Data helper functions
async function initializeData() {
  try {
    // Ensure we have a valid token
    await ensureValidToken();
    
    // Fetch all users
    const usersResponse = await axios.get(`${TEST_SERVER_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
    });
    usersCache = usersResponse.data.users;
    
    // Fetch posts for each user and build our cache
    const userIds = Object.keys(usersCache);
    
    for (const userId of userIds) {
      await fetchUserPosts(userId);
    }
    
    // Update last updated timestamp
    lastUpdated = Date.now();
    
    // console.log('Data initialized successfully');
  } catch (error) {
    // console.error('Error initializing data:', error);
  }
}

async function fetchUserPosts(userId) {
  try {
    const postsResponse = await axios.get(`${TEST_SERVER_BASE_URL}/users/${userId}/posts`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
          }
    });
    const userPosts = postsResponse.data.posts || [];
    
    // Update post count for the user
    postCountByUser.set(userId, userPosts.length);
    
    // Add user posts to the posts cache if not already present
    for (const post of userPosts) {
      const existingPost = postsCache.find(p => p.id === post.id);
      if (!existingPost) {
        postsCache.push(post);
        
        // Fetch comments for the post
        await fetchPostComments(post.id);
      }
    }
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
  }
}

async function fetchPostComments(postId) {
  try {
    // const api = getApiInstance();
    const commentsResponse = await axios.get(`${TEST_SERVER_BASE_URL}/posts/${postId}/comments`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
          } 
    });
    const comments = commentsResponse.data.comments || [];
    
    // Store comments in cache
    commentsCache.set(postId, comments);
    
    // Update comment count for the post
    commentCountByPost.set(postId, comments.length);
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
  }
}

async function refreshData() {
  try {
    // console.log('Refreshing data...');
    await initializeData();
  } catch (error) {
    console.error('Error refreshing data:', error);
  }
}

async function ensureFreshData() {
  // If data is older than the TTL, refresh it
  if (Date.now() - lastUpdated > CACHE_TTL) {
    await refreshData();
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Listening on http://localhost:${PORT}`);
});