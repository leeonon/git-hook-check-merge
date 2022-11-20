// https://github.com/typicode/husky/issues/930

const { execSync } = require('node:child_process');
const { showConfirm, getCurrentBranch } = require('./utils');

const CHECK_BRANCH = ['master'];

function getMergeBranch() {
  // 从 reflog 提取合并进来的分支名
  const reg = /@\{\d+\}: merge (.*):/;
  const reflogMessage = execSync('git reflog -1', { encoding: 'utf8' });
  const mergedBranchName = reg.exec(reflogMessage)[1];

  return mergedBranchName;
}

function main() {
  const mergeBranch = getMergeBranch();

  if (CHECK_BRANCH.includes(mergeBranch)) {
    const currentBranch = getCurrentBranch();

    showConfirm(currentBranch, mergeBranch);
    return;
  }
}

main();