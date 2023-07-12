import rimraf from 'rimraf';
import path from 'path';
import fs from 'fs-extra';
import glob from 'glob';
import { exec } from 'promisify-child-process';

// Path is where package.json is.
const ProcessArguments = process.argv.slice(2);
const StartTime = Date.now();
const MainPath = process.cwd();
const DistPath = path.join(MainPath, 'dist');
const SourceFiles = new glob.GlobSync('./src/**/*.!(ts)').found;
const ResourceFiles = new glob.GlobSync('./resources/**/*.!(ts)').found;
let copiedFiles = 0;
let compilationPromise;

async function buildPipeline() {
  console.log(`[AnilGulerBot] Starting Compilation`);

  if (!process.argv.includes('WATCHING')) {
    // Remove old dist files.
    if (fs.existsSync(DistPath)) {
      await new Promise((resolve) => {
        glob(
          'dist/**/*.*',
          {
            ignore: ['dist/config/**/*.*', 'dist/users/**/*.*', 'dist/database/data.db'],
          },
          function (error, matches) {
            if (error) {
              console.error(error);
              return;
            }
            for (const match of matches) {
              deleteFolderRecursive(match);
            }
            resolve();
          }
        );
      });
    }

    console.log(`[AnilGulerBot] Compiling Typescript`);
    compilationPromise = exec('tsc', { cwd: MainPath }).catch((err) => {
      if (err.stdout) {
        console.log('\r\n');
        console.log('-----[ READ THIS CAREFULLY ]-------');
        console.log(`Failed to build correctly!`);
        console.log(`This means that a file, code, or data is incorrectly formatted.`);
        console.log(`Run the following command in terminal, command line,`);
        console.log(`or powershell for more information...\r\n`);
        console.log(`Command: npx tsc`);
        console.log('-----------------------------------\r\n');
        console.log(`Errors in Code Found:`);
        console.error(err.stdout);
        process.exit();
      }
    });
  }

  // Handle Source Copy
  console.log(`[AnilGulerBot] Copy Compiled Content`);
  for (let i = 0; i < SourceFiles.length; i++) {
    const oldPath = SourceFiles[i];
    const newPath = SourceFiles[i].replace('src', 'dist');
    const dirName = path.dirname(newPath).normalize();

    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    fs.copyFileSync(oldPath, newPath);
    copiedFiles += 1;
  }

  for (let i = 0; i < ResourceFiles.length; i++) {
    const oldPath = ResourceFiles[i];
    const newPath = ResourceFiles[i].replace('resources', 'dist');
    const dirName = path.dirname(newPath).normalize();

    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    if (fs.existsSync(path.join(MainPath, newPath))) continue;

    fs.copyFileSync(oldPath, newPath);
    copiedFiles += 1;
  }

  console.log(`[AnilGulerBot] Copied ${copiedFiles} Extra Files for AnilGulerBot`);

  if (compilationPromise) {
    await compilationPromise;
  }

  console.log(`[AnilGulerBot] Build Time: ${Date.now() - StartTime}ms`);
  console.log(`[AnilGulerBot] Attempting to Boot Server...`);
}

function deleteFolderRecursive(path) {
  if (fs.lstatSync(path).isDirectory()) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function (file) {
        var curPath = path + '/' + file;
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  } else {
    fs.unlinkSync(path);
  }
}

buildPipeline();
