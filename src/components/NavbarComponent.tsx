import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

interface Props {
  onLogout: () => void;
}

export default function NavbarComponent({ onLogout }: Props) {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/catalog">
          🎬 КиноКаталог
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/catalog">Каталог</Nav.Link>
            <Nav.Link as={Link} to="/cart">Корзина</Nav.Link>
            <Nav.Link as={Link} to="/orders">Заказы</Nav.Link> {/* Добавлена ссылка Заказы */}
          </Nav>
          <Button
            variant="outline-light"
            style={{ backgroundColor: 'pink', color: 'black', borderColor: 'pink' }}
            onClick={() => {
              onLogout();
              navigate('/login');
            }}
          >
            Выйти
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
