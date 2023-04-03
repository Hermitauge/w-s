// Get the HTML element with the ID 'movielist' and assign it to the variable 'moviesList'
let moviesList = document.getElementById("movielist");

// Set the API key to use for fetching movie data
let apikey = "8dbfc7eb";

// Get the HTML element with the ID 'search' and assign it to the variable 'query'
const query = document.getElementById("search");

// Initialize variables to store movie data and watchlist data
let favorites = null;
let movies = JSON.parse(localStorage.getItem("watchList")) || [];

// Define a function that adds a movie to the watchlist and updates local storage, then reloads the page
window.addToWatch = (data) => {
  let id = Math.floor(Math.random() * 800) + 1;
  movies.push({
    movie_id: id,
    movie: data,
  });
  localStorage.setItem("watchList", JSON.stringify(movies));
  window.location.reload();
};

// Wait for the DOM to load before executing the following code
document.addEventListener("DOMContentLoaded", () => {

  // Add an event listener to the form with the ID 'searchbar' that listens for the 'submit' event, and when it occurs, execute the following code
  document.getElementById("searchbar").addEventListener("submit", async (e) => {
    e.preventDefault();

    // If the search query is empty, show a toast message indicating that a movie name should be entered
    // Otherwise, fetch data for the movie using the OMDB API
    query.value === ""
      ? M.toast({ html: "Enter Movie name", classes: "rounded" })
      : await fetch(
          `https://www.omdbapi.com/?apikey=${apikey}&t=${query.value}`
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            favorites = data;

            // If the movie data doesn't include a title, show a toast message indicating that the movie was not found
            // Otherwise, create a card with the movie details and add it to the 'moviesList' element
            data.Title === undefined
              ? M.toast({ html: JSON.stringify(data.Error) })
              : (moviesList.innerHTML = `
          <div class="card">
             <div class="poster"><img class="img" src="${data.Poster}" /></div>
             <div id="movie-info">
                <div id="info">
                    <div id="title-div">
                      <h2 id="title">${data.Title}</h2> 
                      <span class="fa fa-star checked rating"></span>
                      <span class="rating">${data.imdbRating} </span>
                    </div>
                    <ul id="rating-etc">
                            <li class="rating-info">${data.Runtime}</li>
                            <li class="rating-info">${data.Genre}</li>
                            <li class="rating-info add">
                                <button type="button" id="watch-btn"
                                 onclick="addToWatch(favorites)"> 
                                    <i class="small material-icons add">add_circle</i>
                                </button>
                           </li>
                           <li><span class="add-watch">Watchlist</span></li>
                    </ul>
                </div>
                <div id="description">
                  <p class="movie-description">${data.Plot}</p>
                </div>
             </div>
          </div>
         `);

            // Reset the search query to an empty string
            query.value = "";
          })
          .catch((err) => console.log(err));
  });
});

// Get the HTML element with the ID 'favorites' and assign it to the variable 'favoriteList'
let favoriteList = document.getElementById("favorites");

// Get the HTML element with the ID 'no-movies' and assign it to the variable 'nomovies'
const nomovies = document.getElementById("no-movies");

// Get the watchlist data from local storage and parse it as JSON, then assign it to the variable 'movielist'
const movielist = JSON.parse(localStorage.getItem("watchList"));

// If the 'movielist' array is empty, show the 'no-movies' element and hide it otherwise
if(movielist.length === 0) {
   nomovies.style.visibility = "visible";
   nomovies.style.width = "auto";
   nomovies.style.height = "auto";
   // document.location.replace("index.html")
}

// Define a function that redirects the user to the index page
const goWishList = () => {
   document.location.replace("index.html");
}

// Define a function that removes a movie from the 'movielist' array and updates local storage, then reloads the page
window.removeMovie = (id) => {
   const updatedlist = movielist.filter((movie) => {
         return movie.movie_id != id
   })
  localStorage.setItem('watchList', JSON.stringify(updatedlist));
  window.location.reload();
}

// Loop through each movie in the 'movielist' array and create a card with its details
movielist.forEach((element) => {
    let id = element.movie_id;
    console.log(id)
    favoriteList.innerHTML += `
    <div class="card">
       <div class="poster"><img class="img" src="${element.movie.Poster}" /></div>
       <div id="movie-info">
          <div id="info">
              <div id="title-div">
                <h2 id="title">${element.movie.Title}</h2> 
                <span class="fa fa-star checked rating"></span>
                <span class="rating">${element.movie.imdbRating} </span>
              </div>
              <ul id="rating-etc">
                      <li class="rating-info">${element.movie.Runtime}</li>
                      <li class="rating-info">${element.movie.Genre}</li>
                      <li class="rating-info add">
                          <button type="button" id="watch-btn"
                           onclick="removeMovie(${id})"> 
                              <i class="small material-icons add">do_not_disturb_on</i>
                          </button>
                     </li>
                     <li><span class="add-watch">Remove</span></li>
              </ul>
          </div>
          <div id="description">
            <p class="movie-description">${element.movie.Plot}</p>
          </div>
       </div>
    </div>  
   `
});