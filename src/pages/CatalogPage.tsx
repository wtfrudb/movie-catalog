import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { Modal, Button, Alert } from "react-bootstrap";
import type { Movie, Movie as MovieType } from "../types/Movie";
import { useCart } from "../context/CartContext"; 

const CatalogPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);
  const [message, setMessage] = useState<string | null>(null); // ⬅️ уведомление

  const { addToCart } = useCart(); 

  const handleAddToCart = (movie: Movie) => {
    addToCart(movie);
    setMessage("Фильм добавлен в корзину!");
    setTimeout(() => setMessage(null), 1500); // ⬅️ скрыть через 3 сек
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Не авторизован");
      return;
    }

    fetch("https://localhost:7020/api/movies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки фильмов");
        return res.json();
      })
      .then((data) => setMovies(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Каталог фильмов</h2>

      {message && (
        <Alert           
          variant="outline-light"       
          style={{ backgroundColor: 'pink', color: 'brown', borderColor: 'pink' }}
          onClose={() => setMessage(null)} dismissible>
            {message}
        </Alert>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex flex-wrap">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={setSelectedMovie}
            addToCart={() => handleAddToCart(movie)} // ⬅️ обёрнутая функция
          />
        ))}
      </div>

      {selectedMovie && (
        <Modal show={true} onHide={() => setSelectedMovie(null)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedMovie.title} ({selectedMovie.releaseYear})
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={selectedMovie.imageUrl}
              className="img-fluid mb-3"
              alt={selectedMovie.title}
            />
            <p><strong>Тема:</strong> {selectedMovie.topic}</p>
            <p><strong>Главные актёры:</strong> {selectedMovie.mainActors}</p>
            <p><strong>Режиссёр:</strong> {selectedMovie.director}</p>
            <p><strong>Сценарист:</strong> {selectedMovie.scriptwriter}</p>
            <p><strong>Тип носителя:</strong> {selectedMovie.mediaType}</p>
            <p><strong>Кинокомпания:</strong> {selectedMovie.recordingCompany}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedMovie(null)}>
              Закрыть
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default CatalogPage;
