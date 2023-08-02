import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './home';
import 'bootstrap/dist/css/bootstrap.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Main(){
  return<>
    <Home/>

  </>
}

root.render(
      <Main/>
);

