import Home from '../src/Pages/Home';
import Features from '../src/Pages/Features';
import Month from '../src/Pages/Month';
import Days from '../src/Pages/Days';
import Entry from '../src/Pages/Entry';

import './App.css'
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/features" element={<Features/>}/>
      <Route path="/:year/monthlist" element={<Month/>}/>
      <Route path="/:year/:month/daylist" element={<Days/>}/>
      <Route path="/journalentry/:year/:month/:day" element={<Entry/>}/>
    </Routes>
  );
}

export default App