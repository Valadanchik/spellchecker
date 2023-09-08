import React from 'react';
import './App.css';
import {Editor} from "./components/editor";
import 'react-quill/dist/quill.snow.css';

function App() {
  return (
    <div className="App">
      <h2>Italian</h2>
    <Editor lang='it'/>
      <h2>French</h2>
    <Editor lang='fr'/>
      <h2>English</h2>
    <Editor lang='en'/>
    </div>
  );
}

export default App;
