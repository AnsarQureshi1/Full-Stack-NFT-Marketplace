import logo from './logo.svg';
import './App.css';
import {Route , Routes} from "react-router-dom/dist";
import Header from './components/Header';
import Home from './components/Home';
import Create from './components/Create';
import MyNfts from './components/MyNfts';
import CreatorDashboard from './components/CreatorDashboard';
import HomePage from './components/HomePage';
import AboutPage from './components/About';

function App() {
  return (
    <div>
      <nav className='border-b p-6'>
        <Header/>
        <Routes>
        <Route className="mr-4 text-pink-500" path='/' element={<HomePage/>} />
        <Route className="mr-4 text-pink-500" path='/marketplace' element={<Home/>} />
        <Route className="mr-4 text-pink-500" path='/create' element={<Create/>}/>
        <Route className="mr-4 text-pink-500" path='/my-Nfts' element={<MyNfts/>}/>
        <Route className="mr-4 text-pink-500" path='/dashboard' element={<CreatorDashboard/>}/>
        <Route className="mr-4 text-pink-500" path='/about' element={<AboutPage/>}/>
      </Routes>
      </nav>
     
    </div>
  );
}

export default App;
//1cDY5oIeKQ9xvU9wXIe2jgaDY1heIqdvri_69A3dYHyXB_1Xexu9am99V4kouwyI