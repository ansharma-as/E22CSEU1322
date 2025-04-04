require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT || 9292,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  
  api: {
    baseUrl: process.env.EXTERNAL_API_BASE_URL,
    authUrl: process.env.EXTERNAL_API_AUTH_URL,
  },
  
  auth: {
    email: process.env.AUTH_EMAIL || 'e22cseu1322@bennett.edu.in',
    name: process.env.AUTH_NAME || 'ansh sharma',
    rollNo: process.env.AUTH_ROLL_NO || 'e22cseu1322',
    accessCode: process.env.AUTH_ACCESS_CODE || 'rtCHZJ',
    clientId: process.env.AUTH_CLIENT_ID || '50844033-6072-42f4-bcf2-55ea21487482',
    clientSecret: process.env.AUTH_CLIENT_SECRET || 'TwwmGEYXJTBMBPVV',
  },
  
  cache: {
    ttl: parseInt(process.env.CACHE_TTL) || 60000,
    refreshInterval: parseInt(process.env.CACHE_REFRESH_INTERVAL) || 60000,
  },
  
  isProduction() {
    return this.server.nodeEnv === 'production';
  },
  
};

module.exports = config;