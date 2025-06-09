import { Navbar, Nav, Container, Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface Props {
  onLogout: () => void;
  onSearch: (query: string) => void;
}

export default function NavbarComponent({ onLogout, onSearch }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearch(value);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/catalog">
          🎬 КиноКаталог
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar" className="justify-content-between">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/catalog">Каталог</Nav.Link>
            <Nav.Link as={Link} to="/cart">Корзина</Nav.Link>
            <Nav.Link as={Link} to="/orders">Заказы</Nav.Link>
          </Nav>

          {location.pathname === '/catalog' && (
            <Form className="d-flex mx-auto w-50 px-3">
              <Form.Control
                type="search"
                placeholder="Поиск по названию..."
                className="me-2"
                aria-label="Поиск"
                value={searchInput}
                onChange={handleSearchChange}
              />
            </Form>
          )}

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
