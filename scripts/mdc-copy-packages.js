#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const NODE_MODULES_MATERIAL = path.join('node_modules', '@material');
const NODE_MODULES_MCW = path.join('node_modules', 'material-components-web');
const MDC_WEB = process.argv.slice(2).find((arg) => arg[0] !== '-') || path.join('..', 'material-components-web');

function die(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function run(command, cwd = '') {
  const parts = command.split(' ');
  const options = {stdio: 'inherit'};
  if (cwd) {
    options.cwd = cwd;
  }

  return spawnSync(parts[0], parts.slice(1), options);
}

if (!fs.existsSync('node_modules') || !fs.existsSync(NODE_MODULES_MATERIAL)) {
  die('This script must be executed from the root folder of a project with material-components-web dependencies.');
}

if (!fs.existsSync(MDC_WEB) || !fs.existsSync(path.join(MDC_WEB, 'packages'))) {
  die(`MDC Web not found at ${MDC_WEB}`);
}

if (process.argv.indexOf('--skip-dist') > -1) {
  console.log('Skipping generating MCW dist files; copying as-is.');
} else {
  console.log('First generating dist files within MCW...');
  const distResult = run('npm run dist', MDC_WEB);
  if (distResult.status !== 0) {
    die('Failed to generate MCW dist files.');
  }
  const cpResult = run('node scripts/cp-pkgs', MDC_WEB);
  if (cpResult.status !== 0) {
    die('Failed to copy MCW dist files into packages.');
  }
}

const dirs = fs.readdirSync(NODE_MODULES_MATERIAL)
  .map((dirname) => path.join(NODE_MODULES_MATERIAL, dirname))
  .concat(fs.existsSync(NODE_MODULES_MCW) ? NODE_MODULES_MCW : []);

console.log(`Removing installed MDC packages and replacing with contents from ${MDC_WEB}...`)
dirs.forEach((dirname) => {
  run(`rm -rf ${dirname}`);
  if (dirname !== NODE_MODULES_MCW && !dirname.startsWith(NODE_MODULES_MATERIAL)) {
    console.warn(`Skipping unexpected directory ${dirname}`);
    return;
  }

  const source = dirname === NODE_MODULES_MCW ?
    path.join(MDC_WEB, 'packages', 'material-components-web') :
    path.join(MDC_WEB, 'packages', `mdc-${path.basename(dirname)}`);
  // const relativeSource = path.relative(path.dirname(dirname), source);

  run(`cp -r ${source} ${dirname}`);

  console.log(path.basename(dirname));
});

console.log('Done. To restore from npm, just run `npm i` again.');
