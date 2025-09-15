# MERGE-CURR-TRIV

## Overview
This project was imported from GitHub (https://github.com/warrenghaad/MERGE-CURR-TRIV) as a minimal repository and has been configured as a complete Node.js web application for the Replit environment.

## Recent Changes
- **September 15, 2025**: Initial setup from minimal GitHub import
  - Created complete Node.js/Express web application structure
  - Configured for Replit environment with proper host binding (0.0.0.0:5000)
  - Added frontend with status checking and responsive design
  - Set up workflow and deployment configuration

## Project Architecture
- **Backend**: Node.js with Express server
  - Main server file: `server.js`
  - Serves static files from `public/` directory
  - API endpoint at `/api/status` for health checking
  - Configured to bind to 0.0.0.0:5000 for Replit proxy compatibility

- **Frontend**: Static HTML/CSS/JavaScript
  - Located in `public/` directory
  - Responsive design with status indicators
  - Real-time server status checking
  - Modern CSS with gradient background and card layout

- **Dependencies**: 
  - Express.js for web server
  - Standard Node.js runtime

## Configuration
- **Workflow**: "Server" running `npm start` on port 5000
- **Deployment**: Configured for autoscale deployment target
- **Environment**: Replit with Node.js 20 support

## Current State
The application is fully functional and ready for use. It displays a status page showing the application is running correctly and includes both frontend and backend components working together.