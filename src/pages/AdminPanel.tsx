import React, { useState, useEffect } from 'react';

interface Movie {
  id?: number;
  title: string;
  topic: string;
  mainActors: string;
  director: string;
  scriptwriter: string;
  mediaType: string;
  recordingCompany: string;
  releaseYear: number;
  imageUrl: string;
}

const AdminPanel: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setNewMovie] = useState<Movie>({
    title: '',
    topic: '',
    mainActors: '',
    director: '',
    scriptwriter: '',
    mediaType: '',
    recordingCompany: '',
    releaseYear: new Date().getFullYear(),
    imageUrl: ''
  });
  const [editId, setEditId] = useState<number | null>(null); // Для режима редактирования

  useEffect(() => {
    fetch('https://localhost:7020/api/movies')
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(err => console.error('Ошибка загрузки фильмов:', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMovie(prev => ({
      ...prev,
      [name]: name === 'releaseYear'
        ? value === '' ? '' : parseInt(value)
        : value    }));
  };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editId ? 'PUT' : 'POST';
    const url = editId
      ? `https://localhost:7020/api/movies/${editId}`
      : 'https://localhost:7020/api/movies';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMovie)
    });

    if (response.ok) {
      const updatedMovie = await response.json();

      if (editId) {
        // обновление фильма в списке
        setMovies(prev =>
          prev.map(m => (m.id === editId ? updatedMovie : m))
        );
      } else {
        // добавление нового фильма
        setMovies(prev => [...prev, updatedMovie]);
      }

      // сброс формы
      setNewMovie({
        title: '',
        topic: '',
        mainActors: '',
        director: '',
        scriptwriter: '',
        mediaType: '',
        recordingCompany: '',
        releaseYear: new Date().getFullYear(),
        imageUrl: ''
      });
      setEditId(null);
    } else {
      console.error('Ошибка при сохранении фильма');
    }
  };

  const handleEdit = (movie: Movie) => {
    setNewMovie(movie);
    setEditId(movie.id || null);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const confirmed = window.confirm('Удалить этот фильм?');
    if (!confirmed) return;

    const response = await fetch(`https://localhost:7020/api/movies/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      setMovies(prev => prev.filter(m => m.id !== id));
    } else {
      console.error('Ошибка при удалении');
    }
  };

  return (
    <div className="container mt-4">
      <h2>{editId ? 'Редактировать фильм' : 'Добавить фильм'}</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input name="title" value={newMovie.title} onChange={handleChange} placeholder="Название" required />
        <input name="topic" value={newMovie.topic} onChange={handleChange} placeholder="Жанр" required />
        <input name="mainActors" value={newMovie.mainActors} onChange={handleChange} placeholder="Главные актёры" />
        <input name="director" value={newMovie.director} onChange={handleChange} placeholder="Режиссёр" />
        <input name="scriptwriter" value={newMovie.scriptwriter} onChange={handleChange} placeholder="Сценарист" />
        <select name="mediaType" value={newMovie.mediaType} onChange={handleChange} required>
        <option value="">Выберите носитель</option>
          <option value="CD">CD</option>
          <option value="Видеокассета">Видеокассета</option>
        </select>
        <input name="recordingCompany" value={newMovie.recordingCompany} onChange={handleChange} placeholder="Киностудия" />
        <input name="releaseYear" type="number" value={newMovie.releaseYear} onChange={handleChange} placeholder="Год выпуска" />
        <input name="imageUrl" value={newMovie.imageUrl} onChange={handleChange} placeholder="Ссылка на изображение" />
        <button type="submit">{editId ? 'Сохранить изменения' : 'Добавить'}</button>
      </form>

      <h3>Список фильмов</h3>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>
            <strong>{movie.title}</strong> ({movie.releaseYear}) — {movie.mediaType}, реж.: {movie.director}
            <br />
            <button onClick={() => handleEdit(movie)}>Редактировать</button>
            <button onClick={() => handleDelete(movie.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
