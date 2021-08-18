# Mind-Cloud
Mind-Cloud Based on mongoDB+nodejs+vue

> MangooDB+Node+Express+Vue
可在私有服务器上挂载的文件读写简单应用（事例中主要用于mindjs脑图数据的存储和读写）
由node监听一个端口同时挂载前端和后端的服务应用。

```markdown
- Adr
  - DB : http://localhost:27017
  - BE : http://localhost:3000
  - FE : http://localhost:8181
- API
  - user:'/usersDB'
  - file : '/fileControl'
```

##  Config for host&port
```javascript

/** server/bin/www  line15  **/
//  node服务监听
app.set('host', '192.168.1.106');
var port = normalizePort(process.env.PORT || '3000');

/** server/routes/index.js  line25 **/
//  连接数据库
// mongoose.connect('mongodb://数据库登录用户名:数据库登录密码@数据库连接地址')
mongoose.connect('mongodb://ioc_user:12324@127.0.0.1:27017/ioc_db');
/** config/index  **/
//  静态页面地址与跨域代理
let exp = {
   dev:{
     host: '192.168.1.106',
     port: 8181, 
     proxyTable: {
       '/api': {    
         target: 'http://192.168.1.106:3000',
         changeOrigin: true,
         pathRewrite: {
           '^/api' : ''
         }
       }
     }
   },
   prod:{...}
 }


```

##  BE JS
```bash
run this javascript file : 'server\bin\www'
```

## FE Build Setup
前端应用打包结束后，要手动拷贝css文件达到dist下static目录结构。
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


