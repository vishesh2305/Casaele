import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
// The Translate import has been removed

function AppWrapper() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Header />
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
      </Routes>

      {/* The Translate component has been removed from here */}

      <Newsletter />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;