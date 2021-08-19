//установили jquery
// import * as $ from 'jquery'
// import Post from '@models/Post';
import './babel';
import './styles/style.css';
import './styles/less.less';
import './styles/scss.scss';
// import json from '@/assets/json'
// import logo from '@/assets/1.png'
// import csv from '@/assets/data.csv'
// const post = new Post('Webpack Post', logo)
//c помощью jquery в тег pre в html файле выводим данные
// $('pre').addClass(post.toString())
// $('pre').html(post.toString())

import React from 'react';
import { render } from 'react-dom';

const App = () => (
    <div className="container">
        <h1>Webpack Course</h1>
        <hr />
        <div className="logo" />
        <hr />
        <pre />
        <hr />
        <div className="box">
            <h2>Less</h2>
        </div>

        <div className="card">
            <h2>SCSS</h2>
        </div>
    </div>
)

render(<App/>, document.getElementById('app'))