

alert("soso")

const apiURL = "http://localhost:3000/api";

// read file

async function readFile() {
  const filename = document.getElementById("readFileName").values;

  const response = await fetch(`${apiURL}/read?fileName=${filename}`);

  const data = await response.json();

  document.getElementById("readContent").textContent =
    data.content || data.error;
}

// write file

async function writeFile() {
  const filename = document.getElementById("writeFileName").values;

  const content = document.getElementById("writeContent").values;

  await fetch(`${apiURL}/write`, {
    method: "POST",
    headers: { "content-type": "application-json" },
    body: JSON.stringify({ filename, content }),
  });
}

// append file

async function appendFile() {
  const filename = document.getElementById("appendFileName").values;

  const content = document.getElementById("appendContent").values;

  await fetch(`${apiURL}/append`, {
    method: "POST",
    headers: { "content-type": "application-json" },
    body: JSON.stringify({ filename, content }),
  });
}

// delete file

async function deleteFile() {
  const filename = document.getElementById("deleteFileName").values;

  await fetch(`${apiURL}/delete?filename=${filename}`, {
    method: "DELETE",
  });
}

// rename file

async function renameFile() {
  const oldValue = document.getElementById("oldFileName").values;

  const newValue = document.getElementById("newFileName").values;

  await fetch(`${apiURL}/rename`, {
    method: "PUT",
    headers: { "content-type": "application-json" },
    body: JSON.stringify({ oldValue, newValue }),
  });
}

// create directory

async function createDirectory() {
  const dirName = document.getElementById("createDirName").values;

  await fetch(`${apiURL}/create-dir`, {
    method: "POST",
    headers: { "content-type": "application-json" },
    body: JSON.stringify({ dirName }),
  });
}

// delete directory



async function deleteDirectory() {
    const dirname = document.getElementById("deleteDirName").values;
  
    await fetch(`${apiURL}/delete-dir?=${dirname}`, {
      method: "DELETE",
    });
  }