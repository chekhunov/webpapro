// const multi = require("multi-loader");
// const webpack = require("webpack");

//помогает работать с путями показывает текущюю директорию
const path = require('path')

//после установки плагина подключаем его npm i -D html-webpack-plugin
const HTMLWebpackPlugin = require('html-webpack-plugin')
//подключаем очистку dist
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

const CopyWebpackPlugin = require('copy-webpack-plugin')
//минификация css
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const CssUrlRelativePlugin = require('css-url-relative-plugin')

//оптимизация css
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
//оптимизация js
const TerserWebpackPlugin = require('terser-webpack-plugin')

const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all"
        }
    }
    if(isProd) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin
        ]
    }
return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
    const loaders = [
            { loader: MiniCssExtractPlugin.loader,
                options: {
                    //hot module replacement не нужна перезагрузка
                    //если isDev true добавляем hmr
                    // hmr: isDev,
                    // hmr: process.env.NODE_ENV === 'development',
                    // reloadAll: true,
                    // publicPath: "/public/path/to/",
                }
            },
            "css-loader",
    ]

    if (extra) {
        loaders.push(extra)
    }
return loaders
}

const babelOptions = preset => {
    const opts = {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-class-properties']
    }
if(preset) {
    opts.presets.push(preset)
}
    return opts
}

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }]

    if(isDev) {
        loaders.push('eslint-loader')
    }
    return loaders
}

const plugins = () => {
    const base = [
            //плагин всегда начинается с new
            new HTMLWebpackPlugin({
                //путь к файлу index.html
                template: './index.html',
                minify: {
                    //елси тру то минифицируется нужно в продакшене
                    collapseWhitespace: isProd
                }

            }),
            new MiniCssExtractPlugin({
                filename: filename('css')
            }),
            new CleanWebpackPlugin(),
            // new webpack.HotModuleReplacementPlugin(),
            new CopyWebpackPlugin(
                {
                    patterns: [
                        //типо от куда что куда копируем могут быть папки и мамки под каждую создавать обьект как в примере
                        {
                            from: path.resolve(__dirname, 'src/favicon.ico'),
                            to: path.resolve(__dirname, 'dist')
                        },
                        {
                            from: path.resolve(__dirname, 'src/styles'),
                            to: path.resolve(__dirname, 'dist/styles')
                        }
                    ]
                }
            )
        ]
if(isProd) {
    base.push(new BundleAnalyzerPlugin())
}
    return base
}

//режим разработки если development то тру если продакшен то фолз
const isDev = process.env.NODE_ENV === 'development'
console.log('is dev:', isDev)
const isProd = !isDev

module.exports = {
  //говорит где лежат исходники приложения
  context: path.resolve(__dirname, 'src'),
  //означает что в режиме разработки
  mode: 'development',
  //с этого вебпак стартует сборку
 entry:  {
   main: ['@babel/polyfill','./index.jsx'],
   analytics: './analytics.ts'
 },
//сюда он будет билдить проект
 output: {
   //значит паттер [name]динамически будет указывать на обьект entry a именно переберет name и analytics
   filename: filename( 'js'),
     path: path.resolve(__dirname, 'dist')
 },
    resolve: {
      //говорим вебпаку какие расширения он должен понимать по умолчанию
        extensions: ['.js', '.json', '.png'],
        //обьект который указывает на корень прилодения
        //позволяет избавить ся от такого ../../../
        alias: {
            //@... ключ который указывает на ккакой то путь
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src'),

        }
    },
    //чтобы в каждом файле где нужен jquery не импортить библиотеку
    optimization: optimization(),
    devServer: {
      port: 8080,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : false,
    plugins: plugins(),
 module: {
   rules: [
     {
       //регулярное выражение
       //тут типо если во время импорта встречает .css тогда ему необходимо запустить определенный тип лоадера
       test: /\.css$/,
       //webpack все пропускает через себя с права на лево
       //style-loader все стили добавляет в секцию html
       use: cssLoaders(),
        },
       {
           test: /\.less$/,
           use: cssLoaders('less-loader')
       },
       {
           test: /\.s[ac]ss$/,
           use: cssLoaders('sass-loader')
       },
       {
           //таким образом вебпак будет откликаться на эти расширения
           test: /\.(png|jpg|gif|svg|jpe?g)$/,
           use: [
               {
                   options: {
                       name: '[path][name].[ext]'
                   },
                       loader: "file-loader"
               },
           ]
       },
       {
           test: /\.(ttf|woff|woff2|eot)$/,
               use: ['file-loader']
       },
       {
           test: /\.xml$/,
               use: ['xml-loader']
       },
       {
           test: /\.csv$/,
               use: ['csv-loader']
       },
       {
           test: /\.m?js$/,
           exclude: /node_modules/,
           use: jsLoaders()
       },
       {
           test: /\.ts$/,
           exclude: /node_modules/,
           use: {
               loader: 'babel-loader',
               options: babelOptions('@babel/preset-typescript')
           }
       },
       {
           test: /\.jsx$/,
           exclude: /node_modules/,
           use: {
               loader: 'babel-loader',
               options: babelOptions('@babel/preset-react')
           }
       }
   ]
 }
}
