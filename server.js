const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API endpoint to save tasks
app.post('/api/tasks', (req, res) => {
  const { tasks } = req.body;
  
  try {
    fs.writeFileSync(path.join(dataDir, 'tasks.json'), JSON.stringify(tasks, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving tasks:', err);
    res.status(500).json({ error: 'Failed to save tasks' });
  }
});

// API endpoint to get tasks
app.get('/api/tasks', (req, res) => {
  try {
    if (fs.existsSync(path.join(dataDir, 'tasks.json'))) {
      const tasks = JSON.parse(fs.readFileSync(path.join(dataDir, 'tasks.json')));
      res.json(tasks);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error('Error loading tasks:', err);
    res.status(500).json({ error: 'Failed to load tasks' });
  }
});

// Serve the main page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Shadow Realm running on http://localhost:${PORT}`);
});