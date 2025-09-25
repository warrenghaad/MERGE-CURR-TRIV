const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload setup with more options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|bmp|webp|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, Word docs, and text files are allowed.'));
    }
  }
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// In-memory storage for demo (in real app, use database)
let notes = [];
let tasks = [];
let fileList = [];

// Serve static files
app.use(express.static('public'));

// Basic route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoints
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'running', 
    message: 'MERGE-CURR-TRIV application is operational',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '1.0.0',
    features: {
      catalog: 'Interactive catalog system with search and filters',
      curriculum: 'Ziggurat-based educational curriculum builder', 
      fileUpload: 'Document and image upload with metadata',
      notesApi: 'Create, read, update, delete notes',
      tasksApi: 'Task management with completion tracking'
    },
    endpoints: {
      dashboard: '/',
      catalog: '/catalog.html',
      curriculum: '/ziggurat-curriculum.html',
      api: {
        status: '/api/status',
        notes: '/api/notes',
        tasks: '/api/tasks', 
        files: '/api/files',
        upload: '/api/upload'
      }
    },
    stats: {
      notes: notes.length,
      tasks: tasks.length,
      files: fileList.length,
      uptime: process.uptime()
    }
  });
});

// Notes API
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  const note = {
    id: Date.now(),
    title,
    content,
    timestamp: new Date().toISOString()
  };
  notes.unshift(note);
  res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  notes = notes.filter(note => note.id !== id);
  res.json({ success: true });
});

// Tasks API
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { text } = req.body;
  const task = {
    id: Date.now(),
    text,
    completed: false,
    timestamp: new Date().toISOString()
  };
  tasks.push(task);
  res.json(task);
});

app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== id);
  res.json({ success: true });
});

// Document/File upload API with enhanced metadata
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const fileInfo = {
    id: Date.now(),
    originalName: req.file.originalname,
    filename: req.file.filename,
    path: req.file.path,
    mimetype: req.file.mimetype,
    size: req.file.size,
    sizeFormatted: formatFileSize(req.file.size),
    type: getFileType(req.file.originalname, req.file.mimetype),
    timestamp: new Date().toISOString()
  };
  
  fileList.push(fileInfo);
  res.json(fileInfo);
});

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to determine file type
function getFileType(filename, mimetype) {
  const ext = path.extname(filename).toLowerCase();
  if (mimetype && mimetype.startsWith('image/')) return 'image';
  if (ext === '.pdf') return 'pdf';
  if (ext === '.doc' || ext === '.docx') return 'word';
  if (ext === '.txt') return 'text';
  return 'document';
}

// Get uploaded file
app.get('/api/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

app.get('/api/files', (req, res) => {
  res.json(fileList);
});

// Counter API
let counter = 0;
app.get('/api/counter', (req, res) => {
  res.json({ count: counter });
});

app.post('/api/counter/increment', (req, res) => {
  counter++;
  res.json({ count: counter });
});

app.post('/api/counter/decrement', (req, res) => {
  counter--;
  res.json({ count: counter });
});

app.post('/api/counter/reset', (req, res) => {
  counter = 0;
  res.json({ count: counter });
});

// Start server - bind to configured host for Replit compatibility
app.listen(PORT, HOST, () => {
  console.log(`🚀 MERGE-CURR-TRIV Server running on http://${HOST}:${PORT}`);
  console.log(`📚 Environment: ${NODE_ENV}`);
  console.log(`🔗 Dashboard: http://${HOST}:${PORT}`);
  console.log(`📋 Catalog: http://${HOST}:${PORT}/catalog.html`);
  console.log(`🏛️ Curriculum: http://${HOST}:${PORT}/ziggurat-curriculum.html`);
  console.log(`📊 API Status: http://${HOST}:${PORT}/api/status`);
});