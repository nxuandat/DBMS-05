// import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { AboutUs } from "./pages/AboutUs";
// import { NavBar } from "./components/Navbar";
import ButtonAppBar from "./components/ButtonAppBar";
import LogIn from "./pages/LogIn";
// import { SignUp } from "./pages/SignUp";
function App() {
  return (
    <>
      <ButtonAppBar />
      <Container className='mb-4'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/login' element={<LogIn />} />
          {/* <Route path='/signup' element={<SignUp />} /> */}
        </Routes>
      </Container>
    </>
  );
}

export default App;
