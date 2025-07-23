
import {BrowserRouter,Router,Route, Routes} from 'react-router-dom'

import Home from '../pages/Home';
import Card from './components/Card';




// main component
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movie/:id' element={<Card />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App