const express = require("express");

const fs = require("fs").promises;

const path = require("path");
const router = express.Router();

const getFilePath = (filename) =>
  path.join(__dirname,"storage", path.basename(filename));

// read file

router.get("/read", async (req, res) => {
  try {
    const data = await fs.readFile(getFilePath(req.query.filename), "utf-8");

    res.json({ content: data });
  } catch (error) {
    res.status(404).json({ error: "file not found" });
  }
});

// write file

router.post("/write", async (req, res) => {
  try {
    await fs.writeFile(
      getFilePath(req.body.filename),
      req.body.content,
      "utf-8"
    );

    res.json({ message: "file written successfully" });
  } catch (error) {
    res.status(500).json({ error: "error message file cant be written" });
  }
});

// append file content

router.post("/append", async (req, res) => {
  try {
    await fs.appendFile(
      getFilePath(req.body.filename),
      req.body.content,
      "utf-8"
    );

    res.json({ message: "Content updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "error message updated" });
  }
});

// rename file

router.put("/rename", async (req, res) => {
  const { oldNmae, newname } = req.body;

  if (!oldNmae || !newname)
    return res.status(400).json({ error: "both file names are required" });

  try {
    await fs.rename(getFilePath(oldNmae), getFilePath(newname));

    res.json({ message: "file renamed sucessfully" });
  } catch (error) {
    res.status(500).json({ error: "error message" });
  }
});

// delete file

router.delete("/delete", async (req, res) => {
  const { oldNmae, newname } = req.body;

  try {
    await fs.unlink(getFilePath(req.query.filename));

    res.json({ message: "file deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "sorry cant delete the file" });
  }
});



// create directory

router.post("/create-dir", async (req, res) => {
  try {
    await fs.mkdir(getFilePath(req.query.dirname), {
      recursive: true,
      force: true,
    });
    res.json({ message: "directory deleted succesfully" });
  } catch (error) {
    res.status(500).json({ error: "error deleting the folder" });
  }
});

// delete directory

router.delete("/delete-dir", async (req, res) => {
  try {
    await fs.rm(getFilePath(req.query.dirname), {
      recursive: true,
      force: true,
    });
    res.json({ message: "directory deleted succesfully" });
  } catch (error) {
    res.status(500).json({ error: "error deleting the folder" });
  }
});



module.exports = router; 