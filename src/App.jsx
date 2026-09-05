import {Routes, Route} from 'react-router-dom';
import {Box} from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BooksEncode from './pages/BooksEncode';
function App() {
  return (
    <Box sx={{display: 'flex', width: '100vw', height: '100vh', flexDirection: 'column', bgcolor: '#ececee'}}>
      <Header/>
      <Box sx={{flex: 1, display: 'flex'}}>
        <Sidebar/>
        <Routes>
          <Route path='/encodebook' element={<BooksEncode/>}/>
        </Routes>
      </Box>
    </Box>
  )
}

export default App
