const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Helper function to get absolute file path (prevents path traversal attacks)
// const getFilePath = (fileName) => path.join(__dirname, '..', 'storage', path.basename(fileName));
const getFilePath = (fileName) => path.join(__dirname, '..', 'storage', 'json', path.basename(fileName));




router.get('/read', async (req, res) => {
  try {
    const fileName = req.query.fileName;
    const filePath = getFilePath(fileName);


    if (path.extname(fileName).toLowerCase() !== '.json') {
      return res.status(400).json({ error: 'Only JSON files are allowed' });
    }

    const data = await fs.readFile(filePath, 'utf8');

    if (!data.trim()) {
      return res.status(400).json({ error: 'File is empty or invalid JSON' });
    }

    try {
      const jsonData = JSON.parse(data);
      res.json({ content: jsonData });
    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON format' });
    }

  } catch (err) {
    console.error('Error:', err);
    res.status(404).json({ error: 'File not found or cannot be accessed' });
  }
});





router.post('/append', async (req, res) => {
  const { fileName, content } = req.body;

  try {
    if (path.extname(fileName).toLowerCase() !== '.json') {
      return res.status(400).json({ error: 'Only JSON files are allowed' });
    }
    const filePath = getFilePath(fileName);
    let jsonData = {};

    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      jsonData = JSON.parse(fileContent);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        return res.status(500).json({ error: 'Error reading file' });
      }
    }

    let newContent = JSON.parse(content);;


    const merged = { ...jsonData, ...newContent };

    await fs.writeFile(filePath, JSON.stringify(merged, null, 2), 'utf8');

    res.json({ message: 'Content appended successfully', data: merged });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





router.put('/rename', async (req, res) => {
  const { oldName, newName } = req.body;


  if (path.extname(oldName).toLowerCase() !== '.json' || path.extname(newName).toLowerCase() !== '.json') {
    return res.status(400).json({ error: 'Only JSON files are allowed' });
  }

  if (!oldName || !newName) {
    return res.status(400).json({ error: 'Both old and new file names are required' });
  }

  const oldFilePath = getFilePath(oldName);
  const newFilePath = getFilePath(newName);

  try {
    // Check if the old file exists
    await fs.access(oldFilePath);

    // Rename the file
    await fs.rename(oldFilePath, newFilePath);
    res.json({ message: 'File renamed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post('/write', async (req, res) => {
  const { fileName, content } = req.body;

  if (!fileName.endsWith('.json')) {
    return res.status(400).json({ error: 'Only JSON files are allowed' });
  }

  try {
    const jsonObject = typeof content === 'string' ? JSON.parse(content) : content;

    const jsonContent = JSON.stringify(jsonObject, null, 2);

    await fs.writeFile(getFilePath(fileName), jsonContent, 'utf8');
    res.json({ message: 'File written successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.delete('/delete', async (req, res) => {
  try {
    const { fileName } = req.query;
    if (!fileName) {
      return res.status(400).json({ error: 'File name is required' });
    }

    if (!fileName.endsWith('.json')) {
      return res.status(400).json({ error: 'Only JSON files are allowed' });
    }
    await fs.unlink(getFilePath(req.query.fileName));
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});







router.post('/create-dir', async (req, res) => {
  const { dirName } = req.body;

  if (!dirName) {
    return res.status(400).json({ error: 'Directory name is required' });
  }

  const dirPath = getFilePath(dirName);

  try {
    await fs.mkdir(dirPath, { recursive: true }); // Creates nested directories if needed
    res.json({ message: 'Directory created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/delete-dir', async (req, res) => {
  const { dirName } = req.query;

  if (!dirName) {
    return res.status(400).json({ error: 'Directory name is required' });
  }

  const dirPath = getFilePath(dirName);

  try {
    await fs.rm(dirPath, { recursive: true, force: true }); // Deletes even if it's not empty
    res.json({ message: 'Directory deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.delete('/delete', async (req, res) => {
  try {
    await fs.unlink(getFilePath(req.query.fileName));
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
