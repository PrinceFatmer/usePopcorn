import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
// import StarRating from './StarRating';
import './index.css';
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'));

// function Test() {
//   const [movieRating, setMovieRating] = useState(0);
  
//   const handleSetMovieRating = (rating) => {
//     setMovieRating(rating);
//   };

//   return (
//     <div>
//       <StarRating maxRating={7} onSetMovieRating={handleSetMovieRating} />
//       <p>{movieRating ? `This movie was rated ${movieRating} star` : "This movie was yet to be rated" }</p>
//     </div>
//   );
// }

root.render(
  <React.StrictMode>
    {/* <StarRating />
    <StarRating maxRating={9} color='red' size={25}/>
    <Test/> */}
    <App/>
  </React.StrictMode>
);
