
const cache = require('../utils/cache');

const getTopUsers = async (req, res) => {
  try {
    const users = cache.getUsers();
    const postCounts = cache.getAllUserPostCounts();
    
    if (!users || !postCounts || postCounts.size === 0) {
      return res.json({ users: [] });
    }
    
    const userEntries = Array.from(postCounts.entries());
    
    const topUsers = userEntries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId, postCount]) => ({
        id: userId,
        name: users[userId],
        postCount
      }));
      
    res.json({ users: topUsers });
  } catch (error) {
    console.error('Error in getTopUsers:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch top users',
      error: error.message
    });
  }
};


const getUserDetails = (userId) => {
  const users = cache.getUsers();
  
  if (!users || !users[userId]) {
    return null;
  }
  
  return {
    id: userId,
    name: users[userId],
    postCount: cache.getUserPostCount(userId)
  };
};

module.exports = {
  getTopUsers,
  getUserDetails
};