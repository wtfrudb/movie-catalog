import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Проверка обязательных полей
    if (!fullName.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      alert('Пожалуйста, заполните все обязательные поля: ФИО, Email, Пароль и Телефон.');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const response = await fetch('https://localhost:7020/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, address, phone }),
      });
  
      if (response.ok) {
        alert('Регистрация успешна! Пожалуйста, войдите.');
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert('Ошибка регистрации: ' + (errorData.message || 'Попробуйте ещё раз'));
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <Card className="mx-auto mt-5" style={{ maxWidth: '400px' }}>
      <Card.Body>
        <h2 className="text-center mb-4">Регистрация</h2>
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3" controlId="formFullName">
            <Form.Label>ФИО</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите полное имя"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Label>Адрес</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите адрес"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPhone">
            <Form.Label>Телефон</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Введите телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            disabled={isSubmitting}
            variant="outline-light"
            style={{ backgroundColor: 'pink', color: 'black', borderColor: 'pink' }}
            type="submit"
            className="w-100"
          >
            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>

          <div className="text-center d-flex justify-content-center align-items-center">
            <p className="mb-0">Уже есть аккаунт?&nbsp;</p>
            <Button
              variant="link"
              style={{ color: 'black', padding: 1, lineHeight: 3 }}
              onClick={() => navigate('/login')}
            >
              Войти
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Register;
