import React, { useState } from 'react';
import { Container, Button, Card, ListGroup, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('userId'));

    if (!token) {
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      setMessage("Корзина пуста");
      return;
    }

    try {
      const response = await fetch('/api/rental/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          items: cart.map(item => ({
            movieId: item.movie.id,
            quantity: item.quantity
          }))
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      setMessage("Заказ успешно оформлен!");
      setTimeout(() => setMessage(null), 1500); 
      clearCart();
    } catch (error) {
      setMessage("Ошибка при оформлении заказа");
      console.error('Ошибка:', error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Корзина</h2>

      {message && (
        <Alert           
          variant="outline-light"       
          style={{ backgroundColor: 'pink', color: 'brown', borderColor: 'pink' }}
          onClose={() => setMessage(null)} dismissible>
            {message}
        </Alert>
      )}

      {cart.length === 0 ? (
        <Alert  
          variant="outline-light"       
          style={{ backgroundColor: 'bg-info', color: 'brown', borderColor: 'pink' }}
          >
            Корзина пуста
          </Alert>
      ) : (
        <ListGroup className="mb-3">
          {cart.map((item, index) => (
            <ListGroup.Item key={index}>
              <Row className="align-items-center">
                <Col><strong>{item.movie.title}</strong></Col>
                <Col>Кол-во: {item.quantity}</Col>
                <Col>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => updateQuantity(item.movie.id, item.quantity - 1)}
                  >−</Button>{' '}
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => updateQuantity(item.movie.id, item.quantity + 1)}
                  >+</Button>{' '}
                  <Button
                    variant="outline-light"
                    style={{ backgroundColor: 'black', color: 'pink', borderColor: 'black' }}
                    onClick={() => removeFromCart(item.movie.id)}
                  >
                    Удалить
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <Button
      variant="outline-light"
      style={{ backgroundColor: 'pink', color: 'black', borderColor: 'pink' }}
      onClick={handleCheckout} disabled={cart.length === 0}>
        Оформить заказ
      </Button>
    </Container>
  );
}
