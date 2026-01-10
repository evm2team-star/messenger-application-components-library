import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/index.tsx';
import './App.css';
import PageNotFound from './pages/Error404/index.tsx';
import Alert from './components/Alert/index.tsx';
import SnipperTool from './components/Snipper/index.tsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/alert" element={<Alert type="warning"/>} />
        <Route path="/snipper" element={<SnipperTool/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;