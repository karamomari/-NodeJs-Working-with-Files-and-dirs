const apiUrl = 'http://localhost:3000/api';

// Read file
async function readFile() {
  const fileName = document.getElementById('readFileName').value;
  const response = await fetch(`${apiUrl}/read?fileName=${fileName}`);
  const data = await response.json();
  document.getElementById('readContent').textContent = JSON.stringify(data.content, null, 2) || data.error;
}

// Write file
async function writeFile() {
  const fileName = document.getElementById('writeFileName').value;
  const content = document.getElementById('writeContent').value;
  const response = await fetch(`${apiUrl}/write`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, content })
  });

  const data = await response.json();
  if (response.ok) {
    alert(`${data.message}`);
  } else {
    alert(` ${data.error}`);
  }
}

// Append file
async function appendFile() {
  const fileName = document.getElementById('appendFileName').value;
  const content = document.getElementById('appendContent').value;
  const response = await fetch(`${apiUrl}/append`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, content })
  });

  const data = await response.json();
  if (response.ok) {
    alert(`${data.message}`);
  } else {
    alert(` ${data.error}`);
  }
}

// Delete file
async function deleteFile() {
  const fileName = document.getElementById('deleteFileName').value;
  const response = await fetch(`${apiUrl}/delete?fileName=${fileName}`, { method: 'DELETE' });

  const data = await response.json();
  if (response.ok) {
    alert(`${data.message}`);
  } else {
    alert(` ${data.error}`);
  }
}

// Rename file
async function renameFile() {
  const oldName = document.getElementById('oldFileName').value;
  const newName = document.getElementById('newFileName').value;
  const response = await fetch(`${apiUrl}/rename`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldName, newName })
  });

  const data = await response.json();
  if (response.ok) {
    alert(`${data.message}`);
  } else {
    alert(` ${data.error}`);
  }
}

// Create directory
async function createDirectory() {
  const dirName = document.getElementById('createDirName').value;
  await fetch(`${apiUrl}/create-dir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dirName })
  });
}

// Delete directory
async function deleteDirectory() {
  const dirName = document.getElementById('deleteDirName').value;
  await fetch(`${apiUrl}/delete-dir?dirName=${dirName}`, { method: 'DELETE' });
}
