import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setIsAuthenticated: (auth: boolean) => void;
  setIsAdmin: (admin: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated, setIsAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://localhost:7020/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setIsAdmin(data.role === 'Admin');

        if (data.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/catalog');
        }
      } else {
        alert('Неверный логин или пароль');
      }
    } catch (error) {
      console.error('Ошибка при входе:', error);
      alert('Ошибка подключения к серверу');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto mt-5" style={{ maxWidth: '400px' }}>
      <Card.Body>
        <h2 className="text-center mb-4">Вход</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email адрес</Form.Label>
            <Form.Control
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            disabled={isSubmitting}
            variant="outline-light"
            style={{ backgroundColor: 'pink', color: 'black', borderColor: 'pink' }}
            type="submit"
            className="w-100 mb-3"
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </Button>

          <div className="text-center d-flex justify-content-center align-items-center">
            <p className="mb-0">Нет аккаунта?&nbsp;</p>
            <Button
              variant="link"
              style={{ color: 'black', padding: 5, lineHeight: 1 }}
              onClick={() => navigate('/register')}
            >
              Зарегистрироваться
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Login;
