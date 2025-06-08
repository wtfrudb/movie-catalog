import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Modal, ListGroup, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  description: string;
}

interface RentalItem {
  id: number;
  movieId: number;
  quantity: number;
  movieTitle: string;
  movieDescription: string;
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
    const confirmed = window.confirm('Are you sure you want to cancel this order?');
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
        throw new Error(errorText || `Failed to cancel order`);
      }

      setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
      handleCloseModal();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error cancelling order');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading orders...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-3">
        <Alert variant="danger">
          <Alert.Heading>Error loading orders</Alert.Heading>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <Alert variant="info">You don't have any orders yet</Alert>
      ) : (
        orders.map((order) => (
          <Card
            key={order.id}
            className="mb-3 shadow-sm"
            onClick={() => handleOpenModal(order)}
            style={{ cursor: 'pointer' }}
          >
            <Card.Body>
              <Card.Title>Order #{order.id}</Card.Title>
              <Card.Text>
                <strong>Date:</strong> {new Date(order.rentalDate).toLocaleString()}<br />
                <strong>Items:</strong>{' '}
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
          <Modal.Title>Order Details #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <>
              <p><strong>Order Date:</strong> {new Date(selectedOrder.rentalDate).toLocaleString()}</p>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <ListGroup variant="flush">
                  {selectedOrder.items.map((item) => (
                    <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                      <div>
                      <strong>{item.movieTitle}</strong>
                      <p className="mb-0 text-muted">
                        {item.movieDescription.length > 50
                          ? item.movieDescription.substring(0, 50) + '...'
                          : item.movieDescription}
                      </p>
                      </div>
                      <span className="badge bg-primary rounded-pill">x{item.quantity}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No items in this order.</p>
              )}
            </>
          ) : (
            <Spinner animation="border" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCancelOrder} disabled={deleting}>
            {deleting ? 'Cancelling...' : 'Cancel Order'}
          </Button>
          <Button variant="secondary" onClick={handleCloseModal} disabled={deleting}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
