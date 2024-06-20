import fs from "fs";
import archiver from "archiver";
import path from "path";

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

function zipDirectory(source, out) {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const stream = fs.createWriteStream(out);

    stream.on("close", () => resolve());
    archive.on("error", (err) => reject(err));

    archive.pipe(stream);
    archive.directory(source, false).finalize();
  });
}

function logColorful(message, color) {
  console.log(`${color}${message}${RESET}`);
}

function copyFile(source, destination) {
  try {
    fs.copyFileSync(source, destination);
    logColorful(`Copied file: ${source} to ${destination}`, GREEN);
  } catch (err) {
    logColorful(
      `Failed to copy file: ${source} to ${destination}. Error: ${err.message}`,
      RED
    );
  }
}

function createFolderIfNotExists(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    logColorful(`Created folder: ${folder}`, GREEN);
  }
}

function cleanFolder(folder) {
  if (fs.existsSync(folder)) {
    fs.readdirSync(folder).forEach((file) => {
      const curPath = path.join(folder, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        cleanFolder(curPath);
        fs.rmdirSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    logColorful(`Cleaned folder: ${folder}`, GREEN);
  }
}

const excludedFiles = [
  ".gitignore",
  "README.md",
  "LICENSE",
  "build.js",
  "package-lock.json",
  "package.json",
  "bun.lockb",
  ".DS_Store",
  "yarn.lock",
  "yarn-error.log",
  "buildspace-os-mod.zip",
];
const excludedFolders = [".github", ".git", "build", "node_modules"];

createFolderIfNotExists("build");
cleanFolder("build");

const files = fs.readdirSync(".");

logColorful("Building project 🏗️", BLUE);
for (const file of files) {
  if (excludedFiles.includes(file) || excludedFolders.includes(file)) {
    continue;
  }

  const stats = fs.statSync(file);
  if (stats.isFile()) {
    copyFile(file, `build/${file}`);
  } else if (stats.isDirectory()) {
    const subFiles = fs.readdirSync(file);
    createFolderIfNotExists(`build/${file}`);
    for (const subFile of subFiles) {
      copyFile(`${file}/${subFile}`, `build/${file}/${subFile}`);
    }
  }
}

logColorful("Project built successfully 🎉", BLUE);

logColorful("Zipping build folder 📦", BLUE);
zipDirectory("./build", "./buildspace-os-mod.zip")
  .then(() => logColorful("Build folder zipped successfully 🎉", GREEN))
  .catch((error) => {
    logColorful("Failed to zip build folder ❌", RED);
    logColorful(`Error: ${error.message}`, RED);
  });
