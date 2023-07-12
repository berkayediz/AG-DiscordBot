import glob from 'glob';
import path from 'path';
import fs from 'fs-extra';

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
    console.log(matches);
    for (const match of matches) {
      deleteFolderRecursive(match);
    }
  }
);

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

/*async function cleanup() {
  for (let i = 0; i < paths.length; i++) {
    const currentPath = paths[i];
    console.log('- ' + currentPath);

    if (fs.existsSync(currentPath)) {
      await new Promise((resolve) => {
        rimraf(
          currentPath,
          {
            glob: {
              ignore: 'config.json',
            },
          },
          (err) => {
            if (err) {
              console.log(err);
              return;
            }

            resolve();
          }
        );
      });
    }
  }
}

cleanup();*/
