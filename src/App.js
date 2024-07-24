import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import Spinner from "./Spinner";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "8d025111";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const uniqueArray = Array.from(new Set(watched));

  function handleSelectId(id) {
    setSelectedId((prevId) => (prevId === id ? null : id));
  }
  function handleClose() {
    setSelectedId(null);
  }
  function HandleAddWatch(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id){
    setWatched((watched)=>watched.filter((movie)=>movie.imdbID!==id));
  }
  // const tempquery= "interstellar";
  
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchMovies() {
        try {
            setIsLoading(true);
            setError("");
            const res = await fetch(
                `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
                { signal }
            );
            const data = await res.json();
            if (data.Response === "False") {
                throw new Error("Movie not found");
            }
            setMovies(data.Search);
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (query.length < 3) {
        setMovies([]);
        setError("");
        return () => controller.abort(); // Cleanup function aborts fetch if component unmounts before completion
    }
     handleClose();
    fetchMovies();

    return function(){
      controller.abort();
    }

}, [query]);
  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <MovieList movies={movies} handleSelectId={handleSelectId} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              handleClose={handleClose}
              onAddWatched={HandleAddWatch}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} onDelete={handleDeleteWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function ErrorMessage({ message }) {
  return <div className="error">{message}</div>;
}
function Loading() {
  return <div className="loader">Loading</div>;
}
function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
// function RightBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }
function MovieDetails({ selectedId, handleClose, onAddWatched, watched }) {
  const [movie, setMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const addedUserRating= watched.find((movie)=>movie.imdbID===selectedId)?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  function AddMovie() {
    const tempMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(tempMovie);
    handleClose();
  }
  useEffect(() => {
    const handleKeyPress = (e) => {
        if (e.code === 'Escape') {
            handleClose(); // Assuming handleClose is correctly defined and implemented
        }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Cleanup function to remove event listener when component unmounts or handleClose changes
    return () => {
        document.removeEventListener('keydown', handleKeyPress);
    };
}, [handleClose]);

  useEffect(
    function () {
      async function loadMovieDeatails() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );
          const data = await res.json();
          setMovie(data);
        } catch {
          alert("Errror in loading data");
        } finally {
          setIsLoading(false);
        }
      }
      loadMovieDeatails();
    },
    [selectedId]
  );
  useEffect(function() {
    if(!title) return;
    document.title= `Movie | ${title}`
    return function(){
      document.title="usePopcorn"
    }
  },[title])
  return (
    <div className="details">
      {isLoading ? (
        <h1>Loading</h1>
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleClose}>
              &larr;
            </button>
            <img src={poster} alt={` Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>
                <b>Genre:</b> {genre}
              </p>
              <p>
                <span>⭐</span>
                {imdbRating}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
             {!isWatched?( <>
              <StarRating
                maxRating={10}
                color="gold"
                size={30}
                onSetMovieRating={setUserRating}
              />
              {userRating > 0 && (
                <button className="btn-add" onClick={AddMovie}>
                  Add To List
                </button>
              )}</>): 
              (<p>You rated this movie {addedUserRating}</p>)}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>
              <b>Starring: </b>
              {actors}
            </p>
            <p>
              <b>Directed By: </b>
              {director}
            </p>
          </section>
        </>
      )}
    </div>
  );
}
function MovieList({ movies, handleSelectId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handleSelectId={handleSelectId}
        />
      ))}
    </ul>
  );
}
function Movie({ movie, handleSelectId }) {
  return (
    <li onClick={() => handleSelectId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.poster} alt={`${movie.title} poster`} />
          <h3>{movie.title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>

              <span>{movie.runtime} min</span>
            </p>
            <button className="btn-delete" onClick={()=>onDelete(movie.imdbID)}>X</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
