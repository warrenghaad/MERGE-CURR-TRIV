# MERGE-CURR-TRIV - Replit Agent Information

## 🤖 For Replit Agents

This document provides essential information for Replit agents working with the MERGE-CURR-TRIV project.

## Project Overview
**MERGE-CURR-TRIV** is a full-stack Node.js web application that combines:
- Interactive catalog management system
- Educational curriculum builder (Ziggurat-themed)
- Document upload and organization
- Notes and task management APIs
- Kindle book import functionality

## Quick Agent Setup

### 1. Environment Check
```bash
# Verify Node.js version
node --version  # Should be >= 18.0.0

# Check if dependencies are installed
npm list
```

### 2. Start Application
```bash
npm start
# Server will run on port 5000 with detailed startup info
```

### 3. Test Endpoints
```bash
# Health check
curl http://localhost:5000/api/status

# Test note creation
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"Agent test"}'
```

## Key Directories & Files

### Core Application
- `server.js` - Main Express server with all APIs
- `package.json` - Dependencies and npm scripts
- `.replit` - Replit-specific configuration

### Frontend Assets (`public/`)
- `index.html` - Main dashboard
- `catalog.html` - Interactive catalog interface
- `ziggurat-curriculum.html` - Educational curriculum builder
- `*.js` - Client-side JavaScript for each page
- `*.css` - Styling for responsive design

### Auto-Created
- `uploads/` - File upload storage (created automatically)
- `node_modules/` - npm dependencies

## API Reference for Agents

### Status & Information
```http
GET /api/status
# Returns comprehensive app status, features, and endpoints
```

### Notes Management
```http
GET /api/notes                    # List all notes
POST /api/notes                   # Create note {title, content}
DELETE /api/notes/:id             # Delete note by ID
```

### Task Management
```http
GET /api/tasks                    # List all tasks
POST /api/tasks                   # Create task {text}
PUT /api/tasks/:id                # Toggle completion
DELETE /api/tasks/:id             # Delete task
```

### File Operations
```http
POST /api/upload                  # Upload file (multipart form)
GET /api/files                    # List uploaded files
GET /api/uploads/:filename        # Download file
```

## Common Agent Tasks

### 1. Adding Sample Data
```javascript
// Add a note
const response = await fetch('/api/notes', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    title: 'Agent Created Note',
    content: 'This note was created by a Replit agent'
  })
});
```

### 2. Testing File Upload
```javascript
// Upload a text file
const formData = new FormData();
formData.append('file', new Blob(['Agent test content'], {type: 'text/plain'}), 'agent-test.txt');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
```

### 3. Monitoring Application
```javascript
// Check app health
const status = await fetch('/api/status').then(r => r.json());
console.log(`App running: ${status.status}, Uptime: ${status.stats.uptime}s`);
```

## Troubleshooting for Agents

### Port Issues
- Default port: 5000
- Override with: `PORT=3000 npm start`
- Check if port is available: `lsof -i :5000`

### File Upload Issues
- Max file size: 10MB
- Allowed types: images, PDFs, Word docs, text files
- Storage location: `./uploads/` (auto-created)

### Memory Management
- Application uses in-memory storage for demo
- Data persists only during server runtime
- For production, consider database integration

## Development Workflow

### Making Changes
1. Edit files directly in Replit
2. Server auto-restarts on file changes (if using nodemon)
3. Refresh browser to see frontend changes
4. Use browser dev tools for debugging

### Testing Changes
1. Check `/api/status` endpoint
2. Test specific APIs with curl or Postman
3. Verify frontend functionality in browser
4. Monitor server logs in console

## Integration Points

### For Educational Content
- Ziggurat curriculum system for historical/mathematical education
- Document categorization for educational materials
- Note-taking system for lesson planning

### For Content Management
- Catalog system with search and filtering
- File organization with metadata
- Color-coded categorization system

### For Data Export/Import
- JSON export functionality in catalog
- Kindle My Clippings.txt import
- API endpoints for programmatic access

## Security Notes

- File uploads are validated by type and size
- No authentication system (suitable for demo/educational use)
- CORS not configured (same-origin policy applies)
- File paths are sanitized to prevent directory traversal

---

**Ready for agent interaction and development!** 🚀

For more detailed information, see the main README.md file or explore the application at runtime.