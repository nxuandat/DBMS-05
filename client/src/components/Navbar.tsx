import { Navbar as NavBarBs, Container, Nav, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
export function NavBar() {
  return (
    <NavBarBs className='bg-white shadow-sm mb-3'>
      <Container>
        <Nav className='me-auto'>
          <Nav.Link to={"/"} as={NavLink}>
            Home
          </Nav.Link>
          <Nav.Link to={"/dashboard"} as={NavLink}>
            Dashboard
          </Nav.Link>
          <Nav.Link to={"/about"} as={NavLink}>
            About Us
          </Nav.Link>
        </Nav>
        <Button></Button>
      </Container>
    </NavBarBs>
  );
}
