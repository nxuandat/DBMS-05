// import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { AboutUs } from "./pages/AboutUs";
// import { NavBar } from "./components/Navbar";
import ButtonAppBar from "./components/ButtonAppBar";
import Footer from "./components/Footer";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import UpdateInfo from "./pages/UpdateInfo";
import AminListUser from "./pages/AdminListUser";
import ListMedicine from "./pages/ListMedicine";
import AddMedicine from "./pages/AddMedicine";
import AddDoctor from "./pages/AddDoctor";
import AddStaff from "./pages/AddStaff";
function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <ButtonAppBar />
      <Container className='mb-4' style={{ flex: 1 }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/reset' element={<ResetPassword />} />
          <Route path='/updateInfo' element={<UpdateInfo />} />
          <Route path='/adminListUser' element={<AminListUser />} />
          <Route path='/listMedicine' element={<ListMedicine />} />
          <Route path='/addMedicine' element={<AddMedicine />} />
          <Route path='/addDoctor' element={<AddDoctor />} />
          <Route path='/addStaff' element={<AddStaff />} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
