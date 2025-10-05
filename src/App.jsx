import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AdminLayout from "./components/Admin/AdminLayout";
import React, { useEffect } from 'react'; 
import { auth } from './firebase';
import RequireAuth from "./components/Admin/RequireAuth";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/Users";
import ContentUpload from "./pages/admin/ContentUpload";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Settings from "./pages/admin/Settings";
import Materials from "./pages/admin/Materials";
import Courses from "./pages/admin/Courses";
import Categories from "./pages/admin/Categories";
import Banners from "./pages/admin/Banners";
import CMSList from "./pages/admin/CMSList";
import CMSEdit from "./pages/admin/CMSEdit";
import Forms from "./pages/admin/Forms";
import Coupons from "./pages/admin/Coupons";
import Subscribers from "./pages/admin/Subscribers";
import Messages from "./pages/admin/Messages";
import Translations from "./pages/admin/Translations";
import AdminNotFound from "./pages/admin/NotFound";
import Header from "./components/CommonPage/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import School from "./pages/School";
import MaterialPage from "./pages/MaterialPage";
import MaterialDetail from "./pages/MaterialDetail";
import Shop from "./pages/Shop";
import Newsletter from "./components/CommonPage/Newsletter";
import Footer from "./components/CommonPage/Footer";
import CourseDetail from "./pages/CourseDetail";
import CartCheckout from "./pages/CartCheckout";
import Garden from "./pages/GardenOfIdeas";
import ScrollToTop from "./pages/ScrollToTop";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import DisableContextMenu from "./components/Common/DisableContextMenu";

// The Translate import has been removed

const stripePromise = loadStripe(import.meta.env.STRIPEPUBLISHABLEKEY);
function AppWrapper() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken(true);
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/material" element={<MaterialPage />} />
        <Route path="/material-detail/:id" element={<MaterialDetail />} />
        <Route path="/school" element={<School />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/course-detail/:id" element={<CourseDetail />} />
        <Route path="/cart-checkout" element={<CartCheckout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/garden-of-ideas" element={<Garden />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="content-upload" element={<ContentUpload />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="materials" element={<Materials />} />
          <Route path="courses" element={<Courses />} />
          <Route path="categories" element={<Categories />} />
          <Route path="banners" element={<Banners />} />
          <Route path="cms" element={<CMSList />} />
          <Route path="cms/new" element={<CMSEdit />} />
          <Route path="cms/edit/:id" element={<CMSEdit />} />
          <Route path="forms" element={<Forms />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="subscribers" element={<Subscribers />} />
          <Route path="messages" element={<Messages />} />
          <Route path="translations" element={<Translations />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<AdminNotFound />} />
          </Route>
        </Route>
      </Routes>

      {/* The Translate component has been removed from here */}

      {!isAdmin && <Newsletter />}
      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <DisableContextMenu />
        <AppWrapper />
      </Router>
    </Elements>
  );
}

export default App;