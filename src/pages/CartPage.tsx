import React, { useState } from 'react';
import { Container, Button, ListGroup, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const [rentalDate, setRentalDate] = useState("");

  const navigate = useNavigate();

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Вы не авторизованы");
      return;
    }
  
    if (!rentalDate) {
      alert("Пожалуйста, выберите дату аренды");
      return;
    }
  
    try {
      const response = await fetch("https://localhost:7020/api/rental/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            movieId: item.movie.id,
            quantity: item.quantity,
            returnDate: rentalDate, // добавлено поле с датой аренды/возврата
          })),
        }),
      });
  
      if (!response.ok) {
        throw new Error("Ошибка при оформлении заказа");
      }
  
      // Очистить корзину и сбросить дату аренды
      clearCart();
      setRentalDate("");
      setMessage("Заказ успешно оформлен!");
  
    } catch (error) {
      alert("Произошла ошибка при оформлении заказа");
      console.error(error);
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
        <>
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
                      disabled={item.quantity <= 1}
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

          {/* Поле даты отображается только если есть товары в корзине */}
          <div className="mb-3">
            <label htmlFor="rentalDate" className="form-label">Дата аренды:</label>
            <input
              type="date"
              id="rentalDate"
              className="form-control"
              value={rentalDate}
              onChange={(e) => setRentalDate(e.target.value)}
              required
            />
          </div>

          <Button
            variant="outline-light"
            style={{ backgroundColor: 'pink', color: 'black', borderColor: 'pink' }}
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Оформить заказ
          </Button>
        </>
      )}
    </Container>
  );
}
