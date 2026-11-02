import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}
