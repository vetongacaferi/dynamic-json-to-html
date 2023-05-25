import './App.css';
import Render from './Render.js';
import staticJson from './staticHtmlJson.json';

function App() {
  return (
    <Render formData={staticJson}/>
  );
}

export default App;
