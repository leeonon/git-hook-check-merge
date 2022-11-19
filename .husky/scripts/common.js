const readline = require('node:readline');


function showConfirm(currentBranch, mergeBranch) {
  console.error(`检测到非法合并: ${mergeBranch} ==into==> ${currentBranch}`);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });

  rl.question(`确定要合并 ${mergeBranch} 分支吗？(y/n) `, (answer) => {
    if (answer === 'y') {
      rl.close();
      process.exit(0);
    } else {
      console.log('撤销合并中...');
      console.log(`exec: git reset --merge HEAD@{1}`);
      execSync('git reset --merge HEAD@{1}');
      console.log('已撤销合并 done');
      rl.close();
      process.exit(0);
    }
  });
}
showConfirm('123', '234')
module.exports = {
  showConfirm
}