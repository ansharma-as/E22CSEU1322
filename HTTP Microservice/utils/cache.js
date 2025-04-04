const config = require('../config');

const cache = {
  users: null,
  
  posts: [],
  comments: new Map(),
  
  postCountByUser: new Map(),
  commentCountByPost: new Map(), 
  
  lastUpdated: 0
};

const getTTL = () => config.cache.ttl;

const getLastUpdated = () => cache.lastUpdated;

const updateLastUpdated = () => {
  cache.lastUpdated = Date.now();
};


const getUsers = () => cache.users;

const setUsers = (users) => {
  cache.users = users;
};

const getUserPostCount = (userId) => cache.postCountByUser.get(userId) || 0;

const setUserPostCount = (userId, count) => {
  cache.postCountByUser.set(userId, count);
};

const getAllUserPostCounts = () => cache.postCountByUser;

const getPosts = () => cache.posts;

const addPost = (post) => {
  const existingPostIndex = cache.posts.findIndex(p => p.id === post.id);
  
  if (existingPostIndex === -1) {
    cache.posts.push(post);
    return true;
  } else {
    cache.posts[existingPostIndex] = post;
    return false;
  }
};

const getPostComments = (postId) => cache.comments.get(postId) || [];

const setPostComments = (postId, comments) => {
  cache.comments.set(postId, comments);
  cache.commentCountByPost.set(postId, comments.length);
};

const getPostCommentCount = (postId) => cache.commentCountByPost.get(postId) || 0;

const getAllPostCommentCounts = () => cache.commentCountByPost;


const clearCache = () => {
  cache.users = null;
  cache.posts = [];
  cache.comments.clear();
  cache.postCountByUser.clear();
  cache.commentCountByPost.clear();
  cache.lastUpdated = 0;
};

module.exports = {
  getTTL,
  getLastUpdated,
  updateLastUpdated,
  clearCache,
  getUsers,
  setUsers,
  getUserPostCount,
  setUserPostCount,
  getAllUserPostCounts,
  
  getPosts,
  addPost,
  
  getPostComments,
  setPostComments,
  getPostCommentCount,
  getAllPostCommentCounts
};