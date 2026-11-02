import { Route, Routes } from 'react-router-dom'
import { QuoteProvider } from './context/QuoteContext'
import Home from './pages/Home'

export default function App() {
  return (
    <QuoteProvider>
      <Routes>
        <Route>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </QuoteProvider>
  );
}
