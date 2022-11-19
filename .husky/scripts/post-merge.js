const { execSync } = require('node:child_process');
const { showConfirm } = require('./common');

const CHECK_BRANCH = ['master'];

function getMergeBranch() {
  // 从 reflog 提取合并进来的分支名
  function getBranchNameFromReflog(reflogMessage) {
    const reg = /@\{\d+\}: merge (.*):/;
    return reg.exec(reflogMessage)[1];
  }

  const reflogMessage = execSync('git reflog -1', { encoding: 'utf8' });
  const mergedBranchName = getBranchNameFromReflog(reflogMessage);
  return mergedBranchName;
}

(() => {
  const branchName = getMergeBranch();
  if (CHECK_BRANCH.includes(branchName)) {
    showConfirm('当前分支', branchName);
    return;
  }
})();