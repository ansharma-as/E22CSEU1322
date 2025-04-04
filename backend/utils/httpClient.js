const axios = require('axios');
const config = require('../config');

const httpClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

httpClient.interceptors.request.use(
  config => {
    if (!require('../config').isProduction()) {
      const { method, url, headers } = config;
      const hasAuth = headers?.Authorization ? '✓' : '✗';
      console.log(`🌐 API Request: ${method.toUpperCase()} ${url} [Auth: ${hasAuth}]`);
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
      console.log(`✅ API Response: ${response.config.method.toUpperCase()} ${response.config.url} [${response.status}]`);
    }
    return response;
  },
  error => {
    const { response, request, message, config } = error;
    
    if (response) {
      console.error(
        `API Error: ${config?.method?.toUpperCase() || 'UNKNOWN'} ${config?.url || 'UNKNOWN'} ` +
        `[${response.status}] ${response.data?.message || response.statusText}`
      );
    } else if (request) {
      console.error(`API Error: No response received for ${config?.url || 'UNKNOWN'}`);
    } else {
      console.error(`API Error: ${message}`);
    }
    
    return Promise.reject(error);
  }
);

module.exports = httpClient;