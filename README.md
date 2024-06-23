一、环境及版本说明
vue 版本 3.4.21
element-ui 版本 2.6.3
node版本 18.19.0

二、开发相关环境及配置
2.1项目资料
2.1.1接口地址
正式接口地址：129.204.166.163:3080

测试接口地址: localhost:3080

2.1.2文档地址
接口文档: https://apifox.com/apidoc/shared-25a0116c-28cc-4210-867a-420ad2d8e1ff

设计文档:

三、代码及代码目录结构及代码文件功能说明
3.1插件说明
前端使用vue-cli构建项目
使用axios发送请求
3.2代码结构说明
  node_modules node模块安装目录
  public 公共目录
  Src 开发的目录
    assets 项目静态文件目录
    api.js 接口调用配置
    router 路由文件目录
    views 页面目录
    components 组件文件
    app.vue 项目入口文件
    main.js 项目核心文件
    .gitignore 忽略编译生成的中间文件
    package-lock.json 模块与模块之间的依赖关系文件
    package.json 项目描述文件
    README.md 项目说明文档
四、项目配置
4.1安装node环境
4.2项目安装
  pnpm install
4.3项目编译
  pnpm run serve
4.4项目打包
  npm run build
