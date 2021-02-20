// console.log('tttttt');
const path = require('path');
const fs = require('fs-extra');
const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const projectTypes = require('../source/project.json');

const proTypeKeys = Object.keys(projectTypes);
const defaultProjectName = 'sshua-app';

let nextPromise = undefined;


(async function initLib() {


  program.command('init [project-name]')
    .usage('<project-name>')
    .action((projectName) => {
      let nextQ = [
        {
          type: 'list',
          message: '项目类型：',
          name: "projectType",
          choices: proTypeKeys
        }
      ];
      if (!projectName) {
        nextQ.unshift({
          type: 'input',
          name: 'projectName',
          message: '请输入项目名称：',
          default: defaultProjectName
        })
      }

      inquirer.prompt([...nextQ]).then(answer => {
        let params = {
          name: projectName || answer.projectName || defaultProjectName,
          type: answer.projectType
        }
        let projectPath = path.join(process.cwd(), params.name);




        try {

          if (!fs.pathExistsSync(projectPath)) {
            fs.ensureDir(projectPath);
          } else {
            nextPromise = inquirer.prompt([
              {
                type: 'confirm',
                name: 'isInquiry',
                message: '已存在相同名称的文件夹，是否继续？',
                default: true
              }
            ]);
          }
          const initTask = require('./task/initproject');

          nextPromise && nextPromise.then(async (res) => {
            if (res.isInquiry) {
              await fs.remove(projectPath);
              await fs.ensureDir(projectPath);
              initTask(params)
            }
          }) || initTask(params);

        } catch (err) {
          console.log(chalk.red(err));
        }
        // console.log('xxxxxx', params);
        // require('./task/initproject')(params.type,params.name);
      })
    })

  program.parse();

})()