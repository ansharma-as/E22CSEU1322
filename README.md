# Social Media Analytics Platform

A real-time analytics microservice that provides insights into social media engagement data.

## Overview

This application provides a backend microservice that interfaces with social media platform APIs to deliver analytical insights for business stakeholders. It efficiently caches and analyzes data from users, posts, and comments to provide meaningful metrics without excessive API calls to the source platform.

## Features

- **Top User Analytics**: Identify and track the most active content creators
- **Engagement Insights**: Discover which posts generate the most comments
- **Real-time Feed**: Get the latest posts as they happen
- **Efficient Caching**: Smart data caching to minimize external API calls
- **REST API**: Clean, consistent API design for easy frontend integration

## Tech Stack

- **Backend**: Node.js, Express
- **Authentication**: JWT-based auth system
- **Caching**: In-memory data structures
- **Configuration**: Environment-based using dotenv
- **API Documentation**: Swagger/OpenAPI (coming soon)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ansharma-as/E22CSEU1322.git
   cd E22CSEU1322
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   ```bash
   cp .env
   ```

   Update the values in `.env` with your configuration.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. The server will be running at http://localhost:9292

## Environment Configuration

The application uses environment variables for configuration. The following variables can be set in your `.env` file:

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port the server runs on | 9292 |
| NODE_ENV | Environment (development/production) | development |
| AUTH_EMAIL | Authentication email | - |
| AUTH_NAME | Authentication name | - |
| AUTH_ROLL_NO | Authentication roll number | - |
| AUTH_ACCESS_CODE | Authentication access code | - |
| AUTH_CLIENT_ID | Authentication client ID | - |
| AUTH_CLIENT_SECRET | Authentication client secret | - |
| CACHE_TTL | Cache time-to-live (ms) | 60000 |
| CACHE_REFRESH_INTERVAL | Data refresh interval (ms) | 60000 |

## API Documentation

### Endpoints

- `GET /` - Health check endpoint
- `GET /users` - Get top 5 users with the highest post count
- `GET /posts?type=popular` - Get posts with the highest number of comments
- `GET /posts?type=latest` - Get 5 most recent posts in real-time

### Sample Responses

#### GET /users

```json
{
  "users": [
    {
      "id": "10",
      "name": "Helen Moore",
      "postCount": 12
    },
    {
      "id": "4",
      "name": "Bob Johnson",
      "postCount": 10
    },
    ...
  ]
}
```

#### GET /posts?type=popular

```json
{
  "posts": [
    {
      "id": 246,
      "userid": "1",
      "user": "John Doe",
      "content": "Post about elephants",
      "commentCount": 15
    },
    ...
  ]
}
```

## Project Structure

```
project/
├── config/             
├── controllers/       
├── middleware/      
├── routes/            
├── utils/              
├── .env               
├── .env.example       
├── server.js           
└── package.json

```

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm run lint` - Run code linting