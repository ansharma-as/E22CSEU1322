const axios = require('axios');
const config = require('../config');

const httpClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

httpClient.interceptors.request.use(
  config => {
    if (!require('../config').isProduction()) {
      const { method, url, headers } = config;
      const hasAuth = headers?.Authorization ? '✓' : '✗';
      console.log(`API Request: ${method.toUpperCase()} ${url} [Auth: ${hasAuth}]`);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  response => {
    if (!require('../config').isProduction()) {
      console.log(`API Response: ${response.config.method.toUpperCase()} ${response.config.url} [${response.status}]`);
    }
    return response;
  },
  error => {
    const { response, request, message, config } = error;
    
    if (response) {
      const statusCode = response.status;
      
      if (statusCode === 401) {
        console.error(`Authentication error: ${config?.url} [${statusCode}] - Token may have expired`);
      } else if (statusCode === 403) {
        console.error(`Permission denied: ${config?.url} [${statusCode}]`);
      } else if (statusCode === 404) {
        console.error(`Resource not found: ${config?.url} [${statusCode}]`);
      } else if (statusCode >= 500) {
        console.error(`Server error: ${config?.url} [${statusCode}]`);
      } else {
        console.error(
          `API Error: ${config?.method?.toUpperCase() || 'UNKNOWN'} ${config?.url || 'UNKNOWN'} ` +
          `[${statusCode}] ${response.data?.message || response.statusText}`
        );
      }
    } else if (request) {
      console.error(`Network error: No response received for ${config?.url || 'UNKNOWN'}`);
    } else {
      console.error(`Request error: ${message}`);
    }
    
    return Promise.reject(error);
  }
);

module.exports = httpClient;