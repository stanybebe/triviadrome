import User from './pages/User';
import Admin from './pages/Admin';


import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React from 'react';

function App() {
  return (
    <Router>
    <Routes>
      <Route exact path='/home' element={<User/>} />
      <Route exact path='/admin' element={<Admin/>} />
    </Routes>
  </Router>
  );
}

export default App;
