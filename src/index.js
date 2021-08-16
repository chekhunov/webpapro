import Post from './Post'
import './styles/style.css'
import json from './assets/json'


const post = new Post('Webpack Post')
console.log('Post', post.toString())
console.log('Json', json)
