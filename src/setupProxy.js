const { createProxyMiddleware: proxy } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        proxy('/api', {                         //遇见/api前缀的请求，就会触发该代理配置
            target: 'http://localhost:8080',    //请求转发给谁
            changeOrigin: true,                 //控制服务器收到的请求头中Host的值
            pathRewrite: { '^/api': '' }        //重写请求路径(必须)
        }),
        proxy('/bd', {                         //遇见/bd前缀的请求，就会触发该代理配置
            target: 'https://www.baidu.com',    //请求转发给谁
            changeOrigin: true,                 //控制服务器收到的请求头中Host的值
            pathRewrite: { '^/bd': '' }        //重写请求路径(必须)
        }),
        proxy('/jfApi', {                         
            target: 'https://www.jianfast.com',    //请求转发给谁
            changeOrigin: true,                 //控制服务器收到的请求头中Host的值
            pathRewrite: { '^/jfApi': '' }        //重写请求路径(必须)
        }),
        proxy('/bz1Api', {
            target: 'https://api.btstu.cn',    //请求转发给谁
            changeOrigin: true,                 //控制服务器收到的请求头中Host的值
            pathRewrite: { '^/bz1Api': '' }        //重写请求路径(必须)
        }),
        proxy('/bz2Api', {
            target: 'https://img.xjh.me',    //请求转发给谁
            changeOrigin: true,                 //控制服务器收到的请求头中Host的值
            pathRewrite: { '^/bz2Api': '' }        //重写请求路径(必须)
        }),
    )
}