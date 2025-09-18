# MERGE-CURR-TRIV

## Overview
This project was imported from GitHub (https://github.com/warrenghaad/MERGE-CURR-TRIV) as a minimal repository and has been configured as a complete Node.js web application for the Replit environment.

## Recent Changes
- **September 18, 2025**: Added Kindle Import and Document Upload Features
  - Implemented Kindle My Clippings.txt parser with smart categorization
  - Added document/image upload with extraction capabilities
  - Auto-categorizes books based on content analysis (Psychology, Business, Technology, etc.)
  - Generates smart tags from highlight content
  - Shows highlight counts and book metadata in catalog

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
The application is a fully functional offline-capable cataloging system with the following features:
- **Smart Catalog**: Interactive cataloging with auto-suggestions, categories, and tags
- **Kindle Integration**: Import books and highlights from Kindle My Clippings.txt files
- **Document Management**: Upload and extract images from PDFs, Word docs, and image files
- **Intelligent Categorization**: Automatically categorizes books and content based on keywords
- **Offline-Ready**: Works offline and syncs to GitHub for local development