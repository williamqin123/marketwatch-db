import { Routes, Route } from 'react-router-dom';
import CreateAccount from './pages/CreateAccount';
import MyAccount from './pages/MyAccount';
import PriceHistory from './pages/PriceHistory';
import Tickers from './pages/Tickers';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<CreateAccount />} />
      <Route path="/me" element={<MyAccount />} />
      <Route path="/pricehistory/:tickerSymbol" element={<PriceHistory />} />
      <Route path="/tickers" element={<Tickers />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;