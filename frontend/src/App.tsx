import { Route, Routes } from 'react-router-dom'
import { QuoteProvider } from './context/QuoteContext'
import AppShell from './components/layout/AppShell'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import About from './pages/About'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import PaymentGuide from './pages/PaymentGuide'
import Contact from './pages/Contact'

export default function App() {
  return (
    <QuoteProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path ="*" element={<NotFound />} />
          <Route path="about" element={<About />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:slug" element={<PropertyDetail />} />
          <Route path="payment-guide" element={<PaymentGuide />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </QuoteProvider>
  );
}
