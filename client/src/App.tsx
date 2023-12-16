// import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { AboutUs } from "./pages/AboutUs";
// import { NavBar } from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import AminListUser from "./pages/AdminListUser";
import ListMedicine from "./pages/ListMedicine";
import AddMedicine from "./pages/AddMedicine";
import AddDoctor from "./pages/AddDoctor";
import AddStaff from "./pages/AddStaff";
import AppointmentForm from "./pages/AppointmentForm";
import ProtectedIsLoginRoute from "./protected routes/ProtectedIsLoginRoutes";
// import UserAnalytics from "./components/Analytics/UserAnalytics";
import AppointmentButton from "./components/AppointmentButton";
import AnalyticsAdmin from "./pages/AnalyticsAdmin";
import PatientRecord from "./pages/PatientRecord";
function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <Container className='mb-4' style={{ flex: 1 }}>
        <AppointmentButton />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/reset' element={<ResetPassword />} />
          <Route
            path='/profile'
            element={
              <ProtectedIsLoginRoute>
                <Profile />
              </ProtectedIsLoginRoute>
            }
          />
          <Route path='/adminListUser' element={<AminListUser />} />
          <Route path='/listMedicine' element={<ListMedicine />} />
          <Route path='/addMedicine' element={<AddMedicine />} />
          <Route path='/addDoctor' element={<AddDoctor />} />
          <Route path='/addStaff' element={<AddStaff />} />
          <Route path='/admin/analytics' element={<AnalyticsAdmin />} />
          <Route
            path='/appointment'
            element={
              <ProtectedIsLoginRoute>
                <AppointmentForm />
              </ProtectedIsLoginRoute>
            }
          />
          <Route path='/record' element={<PatientRecord />} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
