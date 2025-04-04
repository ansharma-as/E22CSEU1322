const axios = require('axios');
const config = require('../config');
const httpClient = require('../utils/httpClient');

let authToken = null;
let tokenExpiry = 0;
let isRefreshingToken = false;
let tokenRefreshPromise = null;

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


const getAuthToken = async (retryCount = 0) => {
  try {
    if (isRefreshingToken && tokenRefreshPromise) {
      return await tokenRefreshPromise;
    }

    if (authToken && tokenExpiry > Date.now() + 10000) {
      return authToken;
    }
    
    isRefreshingToken = true;
    
    tokenRefreshPromise = (async () => {
      console.log('Fetching new authentication token...');
      
      try {
        const credentials = {
          email: config.auth.email,
          name: config.auth.name,
          rollNo: config.auth.rollNo,
          accessCode: config.auth.accessCode,
          clientID: config.auth.clientId,
          clientSecret: config.auth.clientSecret
        };
        
       
        const response = await axios.post(config.api.authUrl, credentials, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        });
        
        if (response.data && response.data.access_token) {
          authToken = response.data.access_token;
          const expiresIn = response.data.expires_in || 3600;
          tokenExpiry = Date.now() + ((expiresIn - 60) * 1000);
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
        
        const maxRetries = 3;
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000; 
          console.log(`⏳ Retrying token refresh (${retryCount + 1}/${maxRetries}) after ${delay}ms...`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return getAuthToken(retryCount + 1);
        }
        
        throw apiError;
      }
    })();
    
    try {
      return await tokenRefreshPromise;
    } finally {
      isRefreshingToken = false;
      tokenRefreshPromise = null;
    }
  } catch (error) {
    console.error('Unexpected error in getAuthToken:', error.message);
    isRefreshingToken = false;
    tokenRefreshPromise = null;
    throw error;
  }
};

const ensureValidToken = async () => {
  if (!authToken || tokenExpiry <= Date.now() + 10000) { 
    return await getAuthToken();
  }
  return authToken;
};


const forceTokenRefresh = async () => {
  console.log('🔄 Forcing token refresh...');
  authToken = null;
  tokenExpiry = 0;
  return await getAuthToken();
};

const getAuthHeaders = async () => {
  const token = await ensureValidToken();
  return {
    'Authorization': `Bearer ${token}`
  };
};


const makeAuthenticatedRequest = async (method, url, options = {}, retried = false) => {
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

    if (error.response && error.response.status === 401 && !retried) {
      console.log('Authentication failed, refreshing token and retrying...');
      await forceTokenRefresh();
      return makeAuthenticatedRequest(method, url, options, true);
    }
    
    console.error(`Error making authenticated ${method.toUpperCase()} request to ${url}:`, error.message);
    throw error;
  }
};

module.exports = {
  initialize,
  getAuthToken,
  ensureValidToken,
  forceTokenRefresh,
  getAuthHeaders,
  makeAuthenticatedRequest
};