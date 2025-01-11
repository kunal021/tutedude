# Project Setup: React Frontend with Vite and Node.js Backend

This guide explains how to set up and run the project, which consists of a React frontend (using Vite and TypeScript) and a Node.js backend (using JavaScript). The repository is structured with two root folders:

- `client`: Contains the React frontend code.
- `server`: Contains the Node.js backend code.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Project Structure

```
root/
├── client/     # React frontend (Vite + TypeScript)
└── server/     # Node.js backend (JavaScript)
```

## Setup Instructions

### Clone the Repository

```bash
git clone <repository_url>
cd <repository_name>
```

### Setting Up the Frontend

1. Navigate to the `client` folder:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. The frontend will run at `http://localhost:5173` (default Vite port). Open your browser to this address.

### Setting Up the Backend

1. Navigate to the `server` folder:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:

   ```bash
   npm start
   ```

4. The backend will run at `http://localhost:8888` (default port, configurable in the code).

### Environment Variables

Both the frontend and backend might require environment variables to function. Below are the steps to configure them:

#### Frontend

1. Create a `.env` file in the `client` directory:

   ```bash
   touch client/.env
   ```

2. Add the required environment variables. For example:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

   or refer .example.env file.

#### Backend

1. Create a `.env` file in the `server` directory:

   ```bash
   touch server/.env
   ```

2. Add the required environment variables. For example:

   ```env
   MONGO_URI="MONGODB_URL"
   PORT=8888
   REFRESH_TOKEN_SECRET="REFRESH_TOKEN_SECRET"
   ACCESS_TOKEN_SECRET="ACCESS_TOKEN_SECRET"
   REFRESH_TOKEN_LIFE="REFRESH_TOKEN_LIFE"
   ACCESS_TOKEN_LIFE="ACCESS_TOKEN_LIFE"
   CLOUDINARY_CLOUD_NAME="CLOUDINARY_CLOUD_NAME"
   CLOUDINARY_API_KEY="CLOUDINARY_API_KEY"
   CLOUDINARY_API_SECRET="CLOUDINARY_API_SECRET"
   ```

   or refer .example.env file.

### Build and Production

#### Frontend

1. Build the frontend:

```bash
npm run build
```

2. The production-ready files will be in the `client/dist` folder.

#### Backend

The backend does not require a separate build step but ensure all dependencies are installed using `npm install` before deploying.

### Run Both Frontend and Backend Simultaneously

To streamline development:

1. Open two terminal instances.
2. In one terminal, navigate to `client` and run the frontend:

   ```bash
   cd client
   npm run dev
   ```

3. In the other terminal, navigate to `server` and run the backend:

   ```bash
   cd server
   npm start
   ```

### Troubleshooting

- Ensure the API URL in the frontend `.env` file matches the running backend server's URL.
- Check for errors in the terminal logs when running `npm install` or `npm start`.
- Restart the servers if you make changes to the environment variables.
