# MERGE-CURR-TRIV

## 🏛️ Interactive Catalog & Curriculum System

A comprehensive Node.js web application featuring an interactive catalog system with document management, educational curriculum builder, and smart categorization capabilities. Perfect for organizing educational content, managing documents, and building structured learning experiences.

## ✨ Features

### 📚 Interactive Catalog System
- **Smart Cataloging**: Auto-suggestions for categories and tags
- **Real-time Search**: Intelligent search with filtering capabilities  
- **Document Upload**: Support for PDFs, Word docs, images, and text files
- **Kindle Integration**: Import books and highlights from Kindle My Clippings.txt
- **Color Coding**: Visual organization with customizable color labels
- **Export/Import**: JSON export for data portability

### 🏛️ Ziggurat Curriculum Builder
- **Historical Context**: Educational content based on ancient civilizations
- **Interactive Learning**: Step-by-step curriculum building with visual elements
- **Relevancy Scoring**: Smart content prioritization
- **Lesson Planning**: Structured approach to educational content delivery

### 📝 Notes & Tasks Management
- **Notes API**: Create, read, update, delete notes with timestamps
- **Task Management**: Track completion status and manage todo items
- **File Management**: Upload and organize files with metadata

## 🚀 Quick Start

### For Replit Users
1. **Fork/Import** this repository to your Replit account
2. **Run**: The application will automatically start on port 5000
3. **Access**: Use the webview to interact with the application
4. **Explore**: Navigate between Dashboard, Catalog, and Curriculum sections

### Local Development
```bash
# Clone the repository
git clone https://github.com/warrenghaad/MERGE-CURR-TRIV.git
cd MERGE-CURR-TRIV

# Install dependencies
npm install

# Start the server
npm start

# Open browser to http://localhost:5000
```

## 🛠️ API Endpoints

### Status & Health
- `GET /api/status` - Application health check and statistics

### Notes Management
- `GET /api/notes` - Retrieve all notes
- `POST /api/notes` - Create new note (body: {title, content})
- `DELETE /api/notes/:id` - Delete specific note

### Task Management  
- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create new task (body: {text})
- `PUT /api/tasks/:id` - Toggle task completion
- `DELETE /api/tasks/:id` - Delete specific task

### File Management
- `POST /api/upload` - Upload file (multipart/form-data)
- `GET /api/files` - List all uploaded files
- `GET /api/uploads/:filename` - Download specific file

### Counter (Demo)
- `GET /api/counter` - Get current count
- `POST /api/counter/increment` - Increment counter
- `POST /api/counter/decrement` - Decrement counter  
- `POST /api/counter/reset` - Reset counter to zero

## 📁 Project Structure

```
MERGE-CURR-TRIV/
├── server.js                 # Main Express server
├── package.json              # Dependencies and scripts
├── .replit                   # Replit configuration
├── public/                   # Static web assets
│   ├── index.html           # Main dashboard
│   ├── catalog.html         # Interactive catalog interface
│   ├── catalog.js           # Catalog functionality
│   ├── ziggurat-curriculum.html # Curriculum builder
│   └── ziggurat-curriculum.js   # Curriculum logic
├── uploads/                  # File upload directory (auto-created)
└── docs/                    # Documentation files
```

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)

### File Upload Limits
- Maximum file size: 10MB
- Supported formats: JPEG, PNG, GIF, PDF, DOC, DOCX, TXT
- Storage: Local disk with unique filename generation

## 🧪 Testing the Application

1. **Start the server**: `npm start`
2. **Open browser**: Navigate to `http://localhost:5000`
3. **Test features**:
   - Add notes and tasks via the API
   - Upload files through the catalog interface  
   - Explore the ziggurat curriculum builder
   - Check the status endpoint for system health

## 📚 Educational Context

This application combines practical web development with educational content management, specifically designed around:

- **Historical Curriculum**: Ancient civilizations and their innovations
- **Geometric Learning**: Mathematical concepts through historical examples
- **Document Management**: Modern organizational tools for educational content
- **Interactive Learning**: Hands-on approach to curriculum building

## 🤝 Contributing

This project is configured for easy collaboration:

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

Open source project - see repository for specific license terms.

---

*Ready for Replit agents and educational exploration!* 🚀
