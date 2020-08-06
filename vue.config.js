const path = require("path");
const resolve = dir => path.resolve(__dirname, dir);
const isProduction = process.env.NODE_ENV !== "development";
const glob = require("glob");
function getEntry(url) {
  let entrys = {};
  glob.sync(url).forEach(item => {
    let urlArr = item.split("/").splice(-3);
    entrys[urlArr[1]] = {
      entry: 'src/views/' + urlArr[1] + '/' + 'main.ts',
      template: 'public/index.html',
      filename: urlArr[1] + '.html',
      title: 'views-' + urlArr[1]
    }
  })
  return entrys;
}
let pages = getEntry("./src/views/**?/*.vue");
module.exports = {
  publicPath: "./", // 基本路径
  outputDir: "dist", // 输出文件目录
  assetsDir: "assets",
  indexPath: "index.html",
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码 (在生产构建时禁用 eslint-loader)
  lintOnSave: process.env.NODE_ENV !== "production",
  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  productionSourceMap: false, // 关闭生产环境的 source map
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("router", resolve("src/router"))
      .set("views", resolve("src/views"));
    // config.plugin("copy").tap(args => {
    //   args[0][0].to = "resource";
    //   return args;
    // });
    // // 配置cdn引入
    // config.plugin("html").tap(args => {
    //   args[0].cdn = cdn;
    //   return args;
    // });
  },
  pages,
  // 这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。
  configureWebpack: config => {
    // 忽略打包配置
    // config.externals = cdn.externals;
    // 生产环境相关配置
    if (isProduction) {
      //gzip压缩
      // 公共代码抽离
      config.optimization = {
        // 分割代码块
        splitChunks: {
          cacheGroups: {
            //公用模块抽离
            common: {
              chunks: "initial",
              minSize: 0, //大于0个字节
              minChunks: 2 //抽离公共代码时，这个代码块最小被引用的次数
            },
            //第三方库抽离
            vendor: {
              priority: 1, //权重
              test: /node_modules/,
              chunks: "initial",
              minSize: 0, //大于0个字节
              minChunks: 2 //在分割之前，这个代码块最小应该被引用的次数
            }
          }
        }
      };
    }
  },
  devServer: {
    overlay: {
      warnings: false,
      errors: true
    },
    hot: true,
    host: "0.0.0.0",
    port: 8088,
    https: false
  }
};