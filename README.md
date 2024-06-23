一、环境及版本说明<br/>
vue 版本 3.4.21<br/>
element-ui 版本 2.6.3<br/>
node版本 18.19.0

二、开发相关环境及配置<br/>
2.1接口地址<br/>
正式接口地址：129.204.166.163:3080

测试接口地址: localhost:3080

2.2文档地址
接口文档: https://apifox.com/apidoc/shared-25a0116c-28cc-4210-867a-420ad2d8e1ff

设计文档:

三、项目配置<br/>
3.1安装node环境<br/>
3.2项目安装<br/>
  pnpm install<br/>
3.3项目编译<br/>
  pnpm run serve<br/>
3.4项目打包<br/>
  npm run build<br/>

四、代码及代码目录结构及代码文件功能说明<br/>
4.1插件说明<br/>
前端使用vue-cli构建项目<br/>
使用axios发送请求<br/>
4.2代码结构说明<br/>
  node_modules node模块安装目录<br/>
  public 公共目录<br/>
  Src 开发的目录<br/>
    assets 项目静态文件目录<br/>
    api.js 接口调用配置<br/>
    router 路由文件目录<br/>
    views 页面目录<br/>
    components 组件文件<br/>
    app.vue 项目入口文件<br/>
    main.js 项目核心文件<br/>
    .gitignore 忽略编译生成的中间文件<br/>
    package-lock.json 模块与模块之间的依赖关系文件<br/>
    package.json 项目描述文件<br/>
    README.md 项目说明文档<br/>
