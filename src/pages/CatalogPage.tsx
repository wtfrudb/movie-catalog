import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { Modal, Button } from "react-bootstrap";
import type { Movie, Movie as MovieType } from "../types/Movie";

const CatalogPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieType | null>(null);

  const handleAddToCart = (movie: Movie) => {
    const storedCart = localStorage.getItem('cart');
    let cart: { movie: Movie; quantity: number }[] = storedCart ? JSON.parse(storedCart) : [];

    const existingItem = cart.find(item => item.movie.id === movie.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ movie, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Фильм добавлен в корзину!');
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
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex flex-wrap">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={setSelectedMovie}
            addToCart={handleAddToCart}
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
