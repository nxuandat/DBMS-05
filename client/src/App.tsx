// import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { AboutUs } from "./pages/AboutUs";
import React, { Suspense,useEffect,useState } from "react";
// import { NavBar } from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LogIn from "./pages/LogIn";
import LogIn2 from "./pages/LogIn2";
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
import ProtectedIsAdminRoute from "./protected routes/ProtectedIsAdminRoutes";
import DentistSchedule from "./pages/DentistSchedule";
import AppointmentListUser from "./pages/AppointmentListUser";
import LoadingError from "./components/LoadingError.tsx";
const Notfound = React.lazy(() => import("./components/NotFound.tsx"));


function useDelayRender(delay = 300) {
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return loading;
}


function App() {
  const loading = useDelayRender();

  if (loading) {
    return <LoadingError/>;
  }
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
            <Route path='/login2' element={<LogIn2 />} />
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
            <Route path='/adminListUser' element={
              <ProtectedIsAdminRoute>
                <AminListUser />
              </ProtectedIsAdminRoute>
            }
            />
            <Route path='/listMedicine' element={
              <ProtectedIsAdminRoute>
                <ListMedicine />
              </ProtectedIsAdminRoute>
            }
            />
            <Route path='/addMedicine' element={
              <ProtectedIsAdminRoute>
                <AddMedicine />
              </ProtectedIsAdminRoute>
            }
            />
            <Route path='/addDoctor' element={
              <ProtectedIsAdminRoute>
                <AddDoctor />
              </ProtectedIsAdminRoute>
            }
            />
            <Route path='/addStaff' element={
              <ProtectedIsAdminRoute>
                <AddStaff />
              </ProtectedIsAdminRoute>
            }
            />
            <Route path='/admin/analytics' element={
              <ProtectedIsAdminRoute>
                <AnalyticsAdmin />
              </ProtectedIsAdminRoute>
            }
            />
            <Route
              path='/appointment'
              element={
                <ProtectedIsLoginRoute>
                  <AppointmentForm />
                </ProtectedIsLoginRoute>
              }
            />
            <Route path='/record'
              element={
                <ProtectedIsLoginRoute>
                  <PatientRecord />
                </ProtectedIsLoginRoute>
              }
            />
            <Route
              path='/dentist-schedule'
              element={
                <ProtectedIsLoginRoute>
                  <DentistSchedule />
                </ProtectedIsLoginRoute>
              }
            />
            <Route
              path='/appointment-list-user'
              element={
                <ProtectedIsLoginRoute>
                  <AppointmentListUser />
                </ProtectedIsLoginRoute>
              }
            />
            <Route
              path="*"
              element={
                <React.Suspense fallback={<LoadingError />}>
                  <Notfound />
                </React.Suspense>
              }
            />
          </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
