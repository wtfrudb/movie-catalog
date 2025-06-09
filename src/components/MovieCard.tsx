import React from "react";
import { Card, Button } from "react-bootstrap";
import type { Movie } from "../types/Movie";

interface Props {
  movie: Movie;
  onClick?: (movie: Movie) => void;
  addToCart: (movie: Movie) => void;
}

const MovieCard: React.FC<Props> = ({ movie, onClick, addToCart }) => {  
  return (
    <Card style={{ width: "18rem", margin: "1rem", height: "100%" }}>
      <div style={{ height: "350px", overflow: "hidden" }}>
        <Card.Img
          variant="top"
          src={movie.imageUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain", // или "cover", если нужно видеть всё изображение
            borderBottom: "1px solid #ccc"
          }}
        />
      </div>
      <Card.Body style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "200px" }}>
        <div>
          <Card.Title>{movie.title}</Card.Title>
          <Card.Text>{movie.topic}</Card.Text>
          <Card.Text>{movie.releaseYear}</Card.Text>

        </div>
        <div className="d-flex">
          <Button
            variant="outline-light"
            style={{ backgroundColor: 'black', color: 'pink', borderColor: 'black' }}
            onClick={() => addToCart(movie)}
            className="me-2"
          >
            Добавить в корзину
          </Button>

          <Button
            variant="outline-light"
            style={{ backgroundColor: 'pink', color: 'black', borderColor: 'pink' }}
            onClick={() => onClick?.(movie)}
          >
            Подробнее
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
