const path = require("path");
const resolve = dir => path.resolve(__dirname, dir);
const isProduction = process.env.NODE_ENV !== "development";
const glob = require("glob");
function getEntry(url) {
  const entrys = {};
  glob.sync(url).forEach(item => {
    const urlArr = item.split("/").splice(-3);
    entrys[urlArr[1]] = {
      entry: "src/views/" + urlArr[1] + "/" + "main.ts",
      template: "public/" + urlArr[1] + ".html",
      filename: urlArr[1] + ".html",
      title: "views-" + urlArr[1]
    };
  });
  return entrys;
}
const pages = getEntry("./src/views/**?/*.vue");
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
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?是否在构建样式地图，false将提高构建速度
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-plugin-px2rem")({
            rootValue: 16, //换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
            // unitPrecision: 5, //允许REM单位增长到的十进制数字。
            //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
            // propBlackList: [], //黑名单
            exclude: /(node_module|pc)/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
            // selectorBlackList: [], //要忽略并保留为px的选择器
            // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
            // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
            mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
            minPixelValue: 3 //设置要替换的最小像素值(3px会被转rem)。 默认 0
          })
        ]
      }
    }
    // 启用 CSS modules for all css / pre-processor files.
    // requireModuleExtension: false
  },
  devServer: {
    overlay: {
      warnings: false,
      errors: true
    },
    historyApiFallback: {
      rewrites: [
        // 将所有多入口遍历成路径解析项
        // ...(() => {
        //   const writes = [];
        //   for (const prop in multipleEntrys) {
        //     // 使用属性名匹配为正则
        //     // 这就是上面“需要对该页面的所有路由添加同文件夹名的公共路径”的原因
        //     writes.push({
        //       from: `/^\/${prop}/`,
        //       // 使用属性名读取模板文件
        //       // 这就是上面“模板文件名称需要与文件夹名称相同”的原因
        //       to: path.posix.join("/", `${prop}.html`)
        //     });
        //   }
        //   console.log(writes);
        //   return writes;
        // })(),
        // 匹配所有路径一定要在最后，否则该匹配之后的项，不会被执行
        {
          from: /^\/page/,
          to: "/page.html"
        },
        {
          from: /^\/mobile/,
          to: "/page1.html"
        },
        {
          from: /^\/pc/,
          to: "/page2.html"
        },
        {
          from: /.*/,
          to: path.posix.join("/", "404.html")
        }
      ]
    },
    hot: true,
    host: "0.0.0.0",
    port: 8088,
    https: false
  }
};
