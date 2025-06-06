import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Modal, ListGroup, Alert, Spinner } from 'react-bootstrap';

interface Movie {
  id: number;
  title: string;
  description: string;
}

interface RentalItem {
  id: number;
  movieId: number;
  quantity: number;
  movie: Movie;
}

interface RentalOrder {
  id: number;
  orderDate: string;
  items: RentalItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<RentalOrder | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Требуется авторизация');
        }

        const response = await fetch('https://localhost:7020/api/rental/my', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Если используете куки
        });

        if (response.status === 401) {
          // Перенаправляем на страницу входа если не авторизован
          window.location.href = '/login';
          return;
        }

        if (!response.ok) {
          // Пытаемся получить детали ошибки от сервера
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
        setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOpenModal = (order: RentalOrder) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="mt-3">
          <Alert.Heading>Ошибка при загрузке заказов</Alert.Heading>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mb-4">Мои заказы</h2>
      
      {orders.length === 0 ? (
        <Alert variant="info">
          У вас пока нет заказов
        </Alert>
      ) : (
        orders.map((order) => (
          <Card
            key={order.id}
            className="mb-3"
            style={{ cursor: 'pointer' }}
            onClick={() => handleOpenModal(order)}
          >
            <Card.Body>
              <Card.Title>Заказ №{order.id}</Card.Title>
              <Card.Text>
                Дата: {new Date(order.orderDate).toLocaleString()}
                <br />
                Фильмов: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Детали заказа №{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <>
              <p>Дата заказа: {new Date(selectedOrder.orderDate).toLocaleString()}</p>
              <ListGroup variant="flush">
                {selectedOrder.items.map((item) => (
                  <ListGroup.Item key={item.id}>
                    🎬 <strong>{item.movie.title}</strong> — {item.quantity} шт.
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          ) : (
            <Spinner animation="border" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}