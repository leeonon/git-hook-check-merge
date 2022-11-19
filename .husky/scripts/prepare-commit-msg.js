const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// no fast-forward merge 情况下 prepare-commit-msg 和 post-merge 钩子都会触发
// 判断是否是 merge conflic 情况，是的话才去执行 prepare-commit-msg 钩子
function isMergingConflict() {
  // 是否合并中
  const mergeMsgPath = path.resolve(process.cwd(), '.git/MERGE_MSG');
  const isMerging = fs.existsSync(mergeMsgPath);
  if (!isMerging) {
    return false;
  }

  try {
    const mergeMsg = fs.readFileSync(mergeMsgPath, { encoding: 'utf8' });
    return /\n# Conflicts:\n/.test(mergeMsg);
  } catch (err) {}
  return false;
}

// 从 .git/MERGE_HEAD (sha) 提取合并进来的分支名
function getMergeBranch() {
  try {
    const mergeHeadPath = path.resolve(process.cwd(), '.git/MERGE_HEAD');
    const mergeHeadSha = fs.readFileSync(mergeHeadPath, { encoding: 'utf8' });
    const mergeBranchInfo = execSync(`git name-rev ${mergeHeadSha}`);
    return / (.*?)\n/.exec(mergeBranchInfo)[1];
  } catch (err) {
    return '';
  }
}

(() => {
  if (isMergingConflict) {
    const x = isMergingConflict();
    console.log('🚀 ~ file: prepare-commit-msg.js ~ line 36 ~ isMergingConflict', x);
  }
})()