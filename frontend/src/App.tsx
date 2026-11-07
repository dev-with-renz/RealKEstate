import { Route, Routes } from 'react-router-dom'
import { QuoteProvider } from './context/QuoteContext'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import PropertyDetail from './pages/PropertyDetail'

export default function App() {
  return (
    <QuoteProvider>
      <Routes>
        <Route>
          <Route index element={<Home />} />
          <Route element={<NotFound />} />
          <Route element={<PropertyDetail />} />
          
        </Route>
      </Routes>
    </QuoteProvider>
  );
}
