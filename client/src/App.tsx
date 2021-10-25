import React from 'react';
import './App.css';
import Home from './pages/Home';
import { Switch, Route } from 'react-router-dom';
import CreateLocation from './pages/CreateLocation';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/create-location" component={CreateLocation} />
    </Switch>
  );
}

export default App;
