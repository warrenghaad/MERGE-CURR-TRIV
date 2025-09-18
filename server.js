const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload setup
const upload = multer({ dest: 'uploads/' });

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
    stats: {
      notes: notes.length,
      tasks: tasks.length,
      files: fileList.length
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

// File upload API
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const fileInfo = {
    id: Date.now(),
    originalName: req.file.originalname,
    filename: req.file.filename,
    size: req.file.size,
    timestamp: new Date().toISOString()
  };
  
  fileList.push(fileInfo);
  res.json(fileInfo);
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

// Start server - bind to 0.0.0.0 for Replit
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});