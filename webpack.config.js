//поимогает работать с путями показывает текущюю директорию
const path = require('path')

//после установки плагина подключаем его npm i -D html-webpack-plugin
const HTMLWebpackPlugin = require('html-webpack-plugin')
//подключаем очистку dist
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  //говорит где лежат исходники приложения
  context: path.resolve(__dirname, 'src'),
  //означает что в режиме разработки
  mode: 'development',
  //с этого вебпак стартует сборку
 entry:  {
   main: './index.js',
   analytics: './analytics.js'
 },
//сюда он будет билдить проект
 output: {
   //значит паттер [name]динамически будет указывать на обьект entry a именно переберет name и analytics
   filename: '[name].[contenthash].js',
   path: path.resolve(__dirname, 'dist')
 },
 plugins: [
   //плагин всегда начинается с new
   new HTMLWebpackPlugin({
     //путь к файлу index.html
     template: './index.html'
   }),
   new CleanWebpackPlugin()
 ],
 module: {
   rules: [
     {
       //регулярное выражение
       //тут типо если во время импорта встречает .css тогда ему необходимо запустить определенный тип лоадера
       test: /\.css$/,
       //webpack все пропускает через себя с права на лево
       //style-loader все стили добавляет в секцию html
       use: ['style-loader', 'css-loader']
     }
   ]
 }
}
