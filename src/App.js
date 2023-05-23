import './App.css';
import { useState } from 'react';
import jsonFile from './staticHtmlJson.json';
import Render from './Render.js';

function App() {
  useState('');

  return (
    <Render />
    // <div>
    //   <ol className='item'>
    //     {
    //       jsonFile.map( post => (
    //         <li key={post.id} align="start">
    //           <div>
    //             <p className='title'>{post.title}</p>
    //             <p className='body'>{post.body}</p>
    //           </div>
    //         </li>
    //       ))
    //     }
    //   </ol>
    // </div> 
  );
}

export default App;
