import axios from 'axios';

const API_BASE_URL = 'http://localhost:9292';

export const getTopUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data.users;
  } catch (error) {
    console.error('Error fetching top users:', error);
    throw error;
  }
};

export const getTrendingPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts?type=popular`);
    return response.data.posts;
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    throw error;
  }
};

export const getLatestPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts?type=latest`);
    return response.data.posts;
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    throw error;
  }
};