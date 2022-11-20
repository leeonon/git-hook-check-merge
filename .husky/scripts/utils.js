const readline = require('node:readline');
const { execSync } = require('node:child_process');

function getCurrentBranch() {
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' });
  return branch.replace(/[\r\n]/g,"");
}


// git merge 合并之后，如果不存在冲突，则会以 process.exit(0) 退出进程
function showConfirm(currentBranch, mergeBranch) {
  process.on('exit', function(code) {
    console.log( "never see this log message", code)
  })
  console.log(`\x1B[31m警告：你正在将${mergeBranch}分支合并到${currentBranch}分支, 这是一个危险操作 \x1B[0m`);

  const rl = readline.createInterface({
    // input: process.stdin,
    output: process.stdout,
  });

  process.on('SIGINT', function() {
    console.log("got SIGINT");
  });

  process.on('uncaughtException', function(err) {
      console.log('Caught exception: ' + err);
  });

  process.on('exit', function(code) {
    console.log( "never see this log message", code)
  })

  rl.on('SIGINT', () => {
    console.log('🚀 ~ file: utils.js ~ line 33 ~ rl.on ~ SIGINT');
  });

  rl.on('SIGTSTP', () => {
    // 这会重写 SIGTSTP，且防止程序进入后台。
    console.log('捕获 SIGTSTP。');
  });

  rl.on('SIGCONT', () => {
    // `prompt` 会自动恢复流
    console.log('🚀 ~ file: utils.js ~ line 31 ~ rl.on ~ prompt', prompt);
  });

  rl.question(`确定要将 ${mergeBranch} 分支合并到当前分支吗？(y/n) `, (answer) => {
    if (answer === 'y') {
      rl.close();
      process.exit(0);
    } else {
      console.log('\x1B[32m撤销合并中...\x1B[0m');
      console.log('\x1B[36mgit reset --merge HEAD@{1}\x1B[0m');
      execSync('git reset --merge HEAD@{1}');
      console.log('\x1B[34m已撤销合并\x1B[0m');
      rl.close();
      process.exit(0);
    }
  });
}

module.exports = {
  showConfirm,
  getCurrentBranch
}