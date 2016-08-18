## jade-inject-webpack-plugin
jade模板注入依赖插件

#### 安装
```
$ npm i --save-dev jade-inject-webpack-plugin
```

#### 使用方法
```
  new JadeInjectPlugin({
    indent:['spaces',2], //默认空格2, 其它选项: ['tab',1]
    entry:{
      './views/entry/index.jade':{      //入口模板路径
        'js':['commons.js','index.js'], //需要注入的js文件名
        'css':['index.css'],            //需要注入的css文件名
        'output':'./views'              //输出路径,可选,默认覆盖原文件
      },
      './views/entry/about.jade':{
        'js':['commons.js','about.js'],
        'css':['about.css'],
        'output':'./views'
      }
    }
  })
```

- indent 模板缩进的种类和数量,可选, 默认空格2 : ['spaces', 2]
- entry 需要注入的jade入口模板, 必须, 如果js或css只有其中一项, 则另一项可以省略.

#### 详见Demo 
[https://github.com/jackhutu/koa2-webpack-startkit](https://github.com/jackhutu/koa2-webpack-startkit)

### License
MIT
