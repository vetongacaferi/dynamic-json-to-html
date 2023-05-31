import Modal from 'react-modal';
import { useState, useEffect } from 'react';

import Render from './Render.js';
// import staticJson from './staticHtmlJson.json';
import './App.css';
import uuid from 'react-native-uuid';

function App() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [jsonData, setJsonData] = useState([]);
  const [jsonToRender, setJsonToRender] = useState(null);


  useEffect(() => {
    getFromDatabase();
  }, [])

  const getFromDatabase = () =>{
    fetch('http://localhost:11000/json/get')
    .then(resp => resp.json())
    .then(data => {
      console.log('data', data);
      setJsonData(data ?? [])
    });
  }

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
    setTitle("");
    setContent("");
  }

  const handleCancelForm = () => {
    setJsonToRender(null);
    getFromDatabase();
  }

  const handleButtonClick = (jsonId) => {
    const findJson = jsonData.find(x => x.jsonId == jsonId);
    if (findJson) {
      console.log('JSON.parse(findJson.content),', typeof JSON.parse(findJson.content));
      setJsonToRender({ content: JSON.parse(findJson.content), jsonId: findJson.jsonId });
    }
  }

  const handleSaveJson = async (e) => {

    
    e.preventDefault();

    // validate json
    let jsonData = "";
    try {
      jsonData = JSON.parse(content);
    }
    catch (e) {
        // The JSON was invalid, `e` has some further information
        alert('Json is not valid');
        return;
    }
    if(!Array.isArray(jsonData)){
      alert('It should be an array of inputs');
      return;
    }

    const id = uuid.v1();

    let result = await fetch(
      'http://localhost:11000/json/save', {
      method: "post",
      body: JSON.stringify({ jsonId: id, title: title, content: content }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    result = await result.json();
    if (result) {
      alert('succefully saved');
      setJsonToRender({ content: jsonData, jsonId: id });
      closeModal();
    }
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        ariaHideApp={false}
        onRequestClose={closeModal}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 90 }}>
            <form style={{ height: '90%' }}>
              <span>
                <label>Title: </label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
              </span>
              <span style={{ display: 'block' }}>Json content: </span>
              <textarea className='textbox-input' value={content} onChange={(e) => setContent(e.target.value)} />
            </form>
          </div>
          <div style={{ flex: 10 }}>
            <button onClick={(e) => handleSaveJson(e)}>Ok</button>
            <button onClick={() => closeModal(false)}>Cancel</button>
          </div>
        </div>

      </Modal>
      {
        jsonToRender == null ?
          (<div>
            <button style={{ backgroundColor: 'gray' }} onClick={() => openModal()}> Add new form</button>
            <h3>History:</h3>
            <div>
              {jsonData.map((json) => <button style={{ display: 'block' }} key={json.jsonId} onClick={() => handleButtonClick(json.jsonId)}>{json.title}</button>)}
            </div>
          </div>)
          : <Render htmlFormData={jsonToRender.content} jsonId={jsonToRender.jsonId} onCancelForm={handleCancelForm}/>
      }

    </div>

  );
}

export default App;
