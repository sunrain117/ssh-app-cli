const path = require('path');
const chalk = require('chalk');
const Ora = require('ora');
const fs=require('fs-extra');
const logSystem = require('log-symbols');
const download = require('download-git-repo');
const sourceFile = require('../../source/project.json');

module.exports = function (params) {
  // ora.

  let gitUrl = sourceFile[params.type]['git'];
  if (!gitUrl) {
    console.log(chalk.red(`下载失败，模版链接`));
    return;
  }
  const spinner = new Ora({
    text:"正在下载中..."
  });
  spinner.start();
  download(`direct:${gitUrl}`, params.name, { clone: true }, async function (err) {
    if (err) {
      spinner.fail('下载失败');
      console.log(chalk.red(err));
      return;
    }
    let projectPath=path.join(process.cwd(),params.name,'.git');
    // console.log(projectPath);
    await fs.remove(projectPath);
    spinner.stop();
    spinner.succeed(chalk.green('下载成功'));
    console.log(`
    cd ${params.name} && npm install

    npm run start
    `);

  })
}