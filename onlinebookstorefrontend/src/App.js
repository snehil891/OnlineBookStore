import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginAndSignUp from './Pages/LoginAndSignUp';
import ForgotPassword from './Pages/ForgotPassword';
import Home from './Pages/HomePage';
import Navbar from './Components/Navbar';
import ProtectedRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import BookDetail from './Components/BookDetail';
import BookList from './Pages/BookList';
import CartPage from './Pages/CartPage';
import OrderForm from './Components/OrderForm';
import AdminDashboard from './Admin/AdminDashboard';
import AdminRoute from './Utils/AdminRoute';
import OrderHistory from './Pages/OrderHistory';
import Footer from './Components/Footer';

function App() {
  return (
    <div style={{ backgroundColor: "#F5ECE0", minHeight: "100vh" }}>
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LoginAndSignUp />}></Route>
            <Route path='/forgot-password' element={<ForgotPassword />}></Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/home-page' element={<><Navbar /> <Home /> <Footer /></>}></Route>
            <Route path="/books" element={<><Navbar /><BookDetail /></>} />
            <Route path="/books-details" element={<><Navbar /><BookList /></>} />
            <Route path='/cart' element={<><Navbar /><CartPage /></>}></Route>
            <Route path='/order-form' element={<OrderForm />}></Route>
            <Route path='/order-history' element={<><Navbar /><OrderHistory /></>}></Route>
          </Route>
          <Route element={<AdminRoute />}>
            <Route path='/admin-dashboard' element={<AdminDashboard />}></Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
