
const cache = require('../utils/cache');
const getPosts = async (req, res) => {
  try {
    const { type = 'latest' } = req.query;
    
    if (type !== 'popular' && type !== 'latest') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid type parameter',
        error: "Type must be either 'popular' or 'latest'"
      });
    }
    
    let posts;
    if (type === 'popular') {
      posts = getPopularPosts();
    } else {
      posts = getLatestPosts();
    }
    
    res.json({ posts });
  } catch (error) {
    console.error(`Error in getPosts (type=${req.query.type}):`, error.message);
    res.status(500).json({
      status: 'error',
      message: `Failed to fetch ${req.query.type} posts`,
      error: error.message
    });
  }
};


const getPopularPosts = () => {
  const posts = cache.getPosts();
  const commentCounts = cache.getAllPostCommentCounts();
  const users = cache.getUsers();
  
  if (posts.length === 0 || commentCounts.size === 0) {
    return [];
  }
  
  const countValues = Array.from(commentCounts.values());
  const maxComments = Math.max(...countValues);
  
  const popularPosts = posts
    .filter(post => cache.getPostCommentCount(post.id) === maxComments)
    .map(post => ({
      ...post,
      commentCount: cache.getPostCommentCount(post.id),
      user: users[post.userid]
    }));
    
  return popularPosts;
};


const getLatestPosts = () => {
  const posts = cache.getPosts();
  const users = cache.getUsers();
  
  if (posts.length === 0) {
    return [];
  }
  
  const latestPosts = [...posts]
    .sort((a, b) => b.id - a.id) 
    .slice(0, 5) 
    .map(post => ({
      ...post,
      commentCount: cache.getPostCommentCount(post.id) || 0,
      user: users[post.userid]
    }));
    
  return latestPosts;
};


const getPostDetails = (postId) => {
  const posts = cache.getPosts();
  const users = cache.getUsers();
  
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    return null;
  }
  
  const comments = cache.getPostComments(postId);
  
  return {
    ...post,
    user: users[post.userid],
    commentCount: comments.length,
    comments
  };
};

module.exports = {
  getPosts,
  getPopularPosts,
  getLatestPosts,
  getPostDetails
};