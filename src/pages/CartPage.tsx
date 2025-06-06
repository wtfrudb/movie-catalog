import { useCart } from "../context/CartContext.tsx";
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOrder = () => {
    setShowConfirm(false);
    clearCart();
    setShowSuccess(true);
  };

  return (
    <div className="container mt-4">
      <h2>Корзина</h2>
      {cart.length === 0 ? <p>Корзина пуста</p> : (
        <ul>
          {cart.map(item => (
            <li key={item.movie.id}>
              {item.movie.title} — 
              <input type="number" value={item.quantity} min={1}
                     onChange={e => updateQuantity(item.movie.id, parseInt(e.target.value))} />
              <Button variant="danger" onClick={() => removeFromCart(item.movie.id)}>Удалить</Button>
            </li>
          ))}
        </ul>
      )}
      {cart.length > 0 && (
        <Button onClick={() => setShowConfirm(true)}>Забронировать</Button>
      )}

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton><Modal.Title>Подтверждение</Modal.Title></Modal.Header>
        <Modal.Body>Вы уверены, что хотите сделать заказ на {totalItems} фильмов?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>Отмена</Button>
          <Button onClick={handleOrder}>Подтвердить</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSuccess} onHide={() => setShowSuccess(false)}>
        <Modal.Header closeButton><Modal.Title>Успех</Modal.Title></Modal.Header>
        <Modal.Body>Заказ успешно оформлен!</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowSuccess(false)}>ОК</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CartPage;
