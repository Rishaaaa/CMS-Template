

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import React from 'react';

import HomePage from './components/HomePage';
import HomePage2 from './components/HomePage2';

import FarmerTemplate from './components/FarmerTemplate';
import NewTemplate from './components/NewTemplate';

const App = () => {

  return (

    <Router>
      <div>
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route path='/farmer-template' element={<FarmerTemplate />} />
          <Route path='/new-template/:id' element={<NewTemplate />} />
          <Route exact path="/homepage2" element={<HomePage2 />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
