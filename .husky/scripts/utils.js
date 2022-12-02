const readline = require('node:readline');
const { execSync } = require('node:child_process');

const CHECK_BRANCH = ['testing/arena-client'];

function checkMerge(branch) {
  return CHECK_BRANCH.includes(branch);
}

function getCurrentBranch() {
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' });
  return branch.replace(/[\r\n]/g, '');
}

// git merge 合并之后，如果不存在冲突，则会以 process.exit(0) 退出进程
function showConfirm(currentBranch, mergeBranch) {
  process.on('exit', function (code) {
    console.log('never see this log message', code);
  });
  console.log(`\x1B[31m警告！危险操作：你正在将${mergeBranch}分支合并到${currentBranch}分支。\x1B[0m`);
  console.log(`\x1B[31m警告！危险操作：你正在将${mergeBranch}分支合并到${currentBranch}分支。\x1B[0m`);
  console.log(`\x1B[31m警告！危险操作：你正在将${mergeBranch}分支合并到${currentBranch}分支。\x1B[0m`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`确定要将 ${mergeBranch} 分支合并到当前分支吗？(y/n) `, answer => {
    if (answer === 'y') {
      rl.close();
      process.exit(0);
    } else {
      console.log('\x1B[32m撤销合并中...\x1B[0m');
      // 大括号{} 在 PowerShell 中有特殊含义，所以如果在命令行直接输入执行需要用引号包裹
      console.log("\x1B[36mgit reset --merge 'HEAD@{1}'\x1B[0m");
      execSync('git reset --merge HEAD@{1}');
      console.log('\x1B[34m已撤销合并\x1B[0m');
      rl.close();
      process.exit(0);
    }
  });
}

module.exports = {
  checkMerge,
  showConfirm,
  getCurrentBranch,
};
