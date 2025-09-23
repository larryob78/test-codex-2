#!/usr/bin/env node
const { execSync } = require('child_process');
const { readdirSync, statSync } = require('fs');
const path = require('path');

function collectJsFiles(dir) {
  let files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files = files.concat(collectJsFiles(fullPath));
    } else if (fullPath.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

const roots = [path.join(__dirname, '..', 'src'), __dirname];
let hasError = false;

for (const root of roots) {
  try {
    const files = collectJsFiles(root);
    files.forEach((file) => {
      try {
        execSync(`node --check "${file}"`, { stdio: 'inherit' });
      } catch (err) {
        hasError = true;
      }
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      continue;
    }
    throw err;
  }
}

if (hasError) {
  console.error('Syntax check failed.');
  process.exit(1);
}

console.log('Syntax check passed.');
