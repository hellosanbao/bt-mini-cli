const inquirer = require('inquirer');
const path = require('path')
const fs = require('fs')

const config = {
    root: process.cwd(),
    projectRoot: './src',
    pagePath: './pages'
}

class BeantechCli {
    constructor() {
        this.root = config.root
        this.projectRoot = path.resolve(config.root, config.projectRoot)
        this.pagePath = path.resolve(this.projectRoot, config.pagePath)
        this.__init()
    }
    async __init() {
        let arg = await this.getArgv()
        this.createTemplate(arg)
        
    }
    //获取命令行参数
    async getArgv() {
        const promptList = [
            {
                type: 'input',
                message: '请输入页面名称',
                name: 'pageName',
                default: "wechat", // 默认值
                validate:  (val) => {
                    if(!val) val = 'wechat'
                    let dirPath = `${this.pagePath}/${val}`
                    let isex = fs.existsSync(dirPath)
                    if(isex){
                        return '该页面已存在，请更换页面名称'
                    }else{
                        return true
                    }
                }
            },
            {
                type: "checkbox",
                message: "选择初始化页面配置:",
                name: "pageInit",
                choices: [
                    {
                        name: "页面分享",
                    },
                    {
                        name: "下拉刷新",
                        checked: true // 默认选中
                    },
                    {
                        name: "上拉加载更多"
                    }
                ]
            }
        ]
        let answers = await inquirer.prompt(promptList)
        return answers
    }
    //生成对应模板
    createTemplate(arg) {
        let { pageName, pageInit } = arg
        if(!pageName) pageName = 'wechat'
        let dirPath = `${this.pagePath}/${pageName}`
        //读取wxss文件
        let wxssStr = fs.readFileSync(__dirname+'/temp.wxss','utf-8')
        //读取wxml文件
        let wxmlStr = fs.readFileSync(__dirname+'/temp.wxml','utf8').replace(/\$\{pageName\}/ig,pageName)
        //读取json文件
        let json = {
            usingComponents: {}
        }
        pageInit.forEach((item)=>{
            switch (item) {
                case '下拉刷新':
                    json.enablePullDownRefresh = true
                    break;
                case '上拉加载更多':
                    json.onReachBottomDistance = 50
                    break;
                default:
                    break;
            }
        })
        let jsonStr = JSON.stringify(json,null,'\t')
        
        //读取js文件
        let jsStr = fs.readFileSync(__dirname+'/temp.js','utf-8')
        jsStr = jsStr.replace('{{shareTitle}}',`'${pageName}'`)
        jsStr = jsStr.replace('{{sharePath}}',`'/pages/${pageName}/${pageName}'`)

        //创建文件夹
        fs.mkdirSync(dirPath)
        fs.writeFileSync(`${dirPath}/${pageName}.wxss`,wxssStr)
        fs.writeFileSync(`${dirPath}/${pageName}.wxml`,wxmlStr)
        fs.writeFileSync(`${dirPath}/${pageName}.json`,jsonStr)
        fs.writeFileSync(`${dirPath}/${pageName}.js`,jsStr)

        this.changeAppJson(pageName)
    }
    //在app.json中新增对应页面列表配置
    changeAppJson(pageName){
        let json = JSON.parse(fs.readFileSync(path.resolve(this.projectRoot,'./app.json'),'utf-8'))
        let pages = json.pages
        let addPagesPath = `pages/${pageName}/${pageName}`
        if(!pages.includes(addPagesPath)){
            pages.push(addPagesPath)
        }
        json.pages = pages

        fs.writeFileSync(path.resolve(this.projectRoot,'./app.json'),JSON.stringify(json,null,'\t'))

    }
}
new BeantechCli()









