import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('haifa');
  const [results, setResults] = useState('');

  function getResults() {
    axios.get(`/${city}`).then((res) => {
      setResults(res.data.temp);
    });
  }
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>type any city name to find the weather info there.</p>
        <input
          type='text'
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
          }}
        />
        <button type='submit' onClick={getResults}>
          Get weather NOW!
        </button>
        <p>{results}</p>
      </header>
    </div>
  );
}

export default App;
