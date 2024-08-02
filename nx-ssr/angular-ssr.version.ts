import { existsSync, readdir, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'node:path';

// workaround for removing angular version from dom when using server side rendering
// https://github.com/angular/angular/issues/16283
async function removeVersions(path: string) {
  const chunkFile = join(dirname('dist/nx-ssr'), 'server', path);
  if (!existsSync(chunkFile)) {
    return false;
  }

  const content = readFileSync(chunkFile, { encoding: 'utf8' });

  // find this new Set("ng-version") and just remove it
  writeFileSync(chunkFile, content.replace(/\"ng-version\"/i, ''), {
    encoding: 'utf-8',
  });
}

const serverDistFolder = resolve(dirname('dist/nx-ssr'), 'server');

// iterate over all chink files and remove the version
readdir(serverDistFolder, (err, files) => {
  if (err) return console.error(err);

  files.forEach(function (file) {
    if (file.endsWith('mjs') && file.startsWith('chunk')) {
      removeVersions(file);
    }
  });
});
