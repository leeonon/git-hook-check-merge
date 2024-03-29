// https://github.com/typicode/husky/issues/930
// https://github.com/dahlbyk/posh-git/issues/106

const { execSync } = require('node:child_process');
const { checkMerge, showConfirm, getCurrentBranch } = require('./utils');

function getMergeBranch() {
  const reg = /@\{\d+\}: merge (.*):/;
  const reflogMessage = execSync('git reflog -1', { encoding: 'utf8' });
  const refExec = reg.exec(reflogMessage);
  if (refExec && refExec.length) {
    return reg.exec(reflogMessage)?.[1];
  }

  return null;
}

function main() {
  const mergeBranch = getMergeBranch();

  if (checkMerge(mergeBranch)) {
    const currentBranch = getCurrentBranch();
    showConfirm(currentBranch, mergeBranch);
  }
}

main();
