const axios = require('axios');
const config = require('../config');
const httpClient = require('../utils/httpClient');

let authToken = null;
let tokenExpiry = 0;

const initialize = async () => {
  try {
    await getAuthToken();
    console.log('Authentication initialized successfully');
    return true;
  } catch (error) {
    console.error('Authentication initialization failed:', error.message);
    throw error;
  }
};

const getAuthToken = async () => {
  try {
    if (authToken && tokenExpiry > Date.now()) {
      return authToken;
    }
    
    console.log('🔑 Fetching new authentication token...');
    
    try {
      const credentials = {
        email: config.auth.email,
        name: config.auth.name,
        rollNo: config.auth.rollNo,
        accessCode: config.auth.accessCode,
        clientID: config.auth.clientId,
        clientSecret: config.auth.clientSecret
      };
      
      const response = await axios.post(config.api.authUrl, credentials);
      
      if (response.data && response.data.access_token) {
        authToken = response.data.access_token;
        tokenExpiry = Date.now() + (response.data.expires_in * 1000);
        console.log('Successfully obtained new authentication token');
        return authToken;
      } else {
        throw new Error('Auth API response did not contain expected token format');
      }
    } catch (apiError) {
      console.error('Error calling authentication API:', apiError.message);
      
      if (apiError.response) {
        console.error('API Error Status:', apiError.response.status);
        console.error('API Error Details:', apiError.response.data);
      } else if (apiError.request) {
        console.error('No response received from authentication API');
      }
      
      throw apiError;
    }
  } catch (error) {
    console.error('Unexpected error in getAuthToken:', error.message);
    throw error;
  }
};


const ensureValidToken = async () => {
  if (!authToken || tokenExpiry <= Date.now()) {
    return await getAuthToken();
  }
  return authToken;
};


const getAuthHeaders = async () => {
  const token = await ensureValidToken();
  return {
    'Authorization': `Bearer ${token}`
  };
};

const makeAuthenticatedRequest = async (method, url, options = {}) => {
  try {
    const headers = await getAuthHeaders();
    const response = await httpClient.request({
      method,
      url,
      ...options,
      headers: {
        ...options.headers,
        ...headers
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error making authenticated ${method.toUpperCase()} request to ${url}:`, error.message);
    throw error;
  }
};

module.exports = {
  initialize,
  getAuthToken,
  ensureValidToken,
  getAuthHeaders,
  makeAuthenticatedRequest
};