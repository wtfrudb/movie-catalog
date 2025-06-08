import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Modal, ListGroup, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface RentalItem {
  id: number;
  movieId: number;
  quantity: number;
  movieTitle: string;
  movieDescription: string;
  releaseYear: number;
  returnDate: string | null; // nullable, т.к. может быть null
}

interface RentalOrder {
  id: number;
  rentalDate: string;
  items: RentalItem[] | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<RentalOrder | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('/api/rental/my', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleOpenModal = (order: RentalOrder) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    const confirmed = window.confirm('Вы уверены, что хотите отменить заказ?');
    if (!confirmed) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/rental/${selectedOrder.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Не удалось отменить заказ`);
      }

      setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
      handleCloseModal();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка отмены заказа');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Загрузка заказов...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-3">
        <Alert variant="danger">
          <Alert.Heading>Ошибка загрузки заказов</Alert.Heading>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Попробуйте снова
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Мои заказы</h2>

      {orders.length === 0 ? (
        <Alert variant="info">У вас еще нет заказов</Alert>
      ) : (
        orders.map((order) => (
          <Card
            key={order.id}
            className="mb-3 shadow-sm"
            onClick={() => handleOpenModal(order)}
            style={{ backgroundColor: 'pink', color: 'dark', borderColor: 'pink' }}
          
          >
            <Card.Body>
              <Card.Title>Заказ №{order.id}</Card.Title>
              <Card.Text>
                <strong>Дата:</strong> {new Date(order.rentalDate).toLocaleString()}<br />
                <strong>Фильмы:</strong>{' '}
                {order.items && Array.isArray(order.items)
                  ? order.items.reduce((sum, item) => sum + item.quantity, 0)
                  : 0}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Заказ №{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <>
              <p><strong>Дата заказа:</strong> {new Date(selectedOrder.rentalDate).toLocaleString()}</p>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <ListGroup variant="flush">
                  {selectedOrder.items.map((item) => (
                    <ListGroup.Item key={item.id} className="mb-3">
                      <h5>{item.movieTitle} ({item.releaseYear})</h5>
                      <p>{item.movieDescription}</p>
                      <p><strong>Количество:</strong> {item.quantity}</p>
                      <p><strong>Дата возврата:</strong>{' '}
                        {item.returnDate ? new Date(item.returnDate).toLocaleDateString() : 'Не установлена'}
                      </p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>Нет объектов в этом заказе.</p>
              )}
            </>
          ) : (
            <Spinner animation="border" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-light"
            style={{ backgroundColor: 'black', color: 'pink', borderColor: 'black' }}
            onClick={handleCancelOrder} disabled={deleting}>
              {deleting ? 'Отмена...' : 'Отменить заказ'}
          </Button>
          <Button 
            variant="outline-light"
            style={{ backgroundColor: 'pink', color: 'black', borderColor: 'pink' }}
            onClick={handleCloseModal} disabled={deleting}>
              Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
