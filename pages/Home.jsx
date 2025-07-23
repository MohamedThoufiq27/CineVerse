import { useEffect, useState } from 'react'
import Search from '../src/components/Search'
import Spinner from '../src/components/Spinner';
import Moviecard from '../src/components/Moviecard';
import {useDebounce} from 'react-use'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { getTrendingMovies, updateSearchCount } from '../src/lib/appwrite';


const BASE_URL_TRAKT='https://api.trakt.tv';

// const BASE_URL_OMDB='https://www.omdbapi.com'

// const API_KEY_OMDB=import.meta.env.VITE_OMDB_API_KEY;
const API_KEY_TRAKT = import.meta.env.VITE_TRAKT_API_KEY;

// API headers
const API_OPTIONS_TRAKT={
    method:'GET',
    headers:{
      'Content-Type':'application/json',
      'trakt-api-version':`2`,
      'trakt-api-key':API_KEY_TRAKT
    }
};



// main component
const Home = () => {
  const [searchTerm,setSearchTerm]=useState('');
  const [errorMessage,setErrorMessage]=useState('');
  const [movieList,setMovieList]=useState([]);
  const [trendingMovies,setTrendingMovies]=useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [debouncedSearchTerm,setdebouncedSearchTerm]=useState('');
  

  // debounce the search term to prevent calling the API request each time the word changes 
  // which optimizes the api request by waiting 500 ms after user stopped typing 
  useDebounce(()=>setdebouncedSearchTerm(searchTerm),1000,[searchTerm]);
  //fetching the movies from TMDB API
  const fetchMovies = async(query='')=>{
    setIsLoading(true);
    setErrorMessage('');

    try{

      const endpoint= query 
      ? `${BASE_URL_TRAKT}/search/movie?query=${encodeURIComponent(query)}&extended=images,full`
      : `${BASE_URL_TRAKT}/movies/trending?page=1&limit=20&extended=images,full`;

      
      const response= await axios(endpoint,API_OPTIONS_TRAKT);
      
      const data=response.data;
      // console.log(data);
      // if(!response){
      //   setErrorMessage(response.data || 'Failed to Fetch movies');
      //   setMovieList([]);
      //   return;
      // }

     
        const traktMovies = data.map(item => item.movie);
        setMovieList(traktMovies);
        console.log(traktMovies);
    
      // console.log(movieList);
      if(query && data){
        await updateSearchCount(query,traktMovies[0]);
        console.log(traktMovies[0]);
      }
    }catch(error){

      console.log(`error fetching the data ${error}`);
      setErrorMessage("error fetching the movies, please try again later");

    }finally{
      setIsLoading(false);
    }
  }

  const fetchTrendingMovies = async()=>{
    try{
      const movies= await getTrendingMovies();

      setTrendingMovies(movies);
      console.log(movies);
    }catch(error){
      console.error(`Error fetching Trending Movies ${error}`);
    }
  }

  //we are calling the fetchMovies function every time when a user hits a search Term with 500 ms waiting time debounce
  useEffect(()=>{
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm]);

  //fetches the top 5 trending movies based on the past user searches every time when the page reloads
  useEffect(()=>{
    fetchTrendingMovies();
  },[]);

  return (
    
        <main>

          <div className='pattern'></div>

          <div className='wrapper'>

            <header>
              <img src='/hero.png' alt='hero banner'/>
              <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            </header>

            {trendingMovies.length>0 && (
              <section className='trending'>
                  <h2>Trending Movies</h2>

                  <ul>
                    
                    {trendingMovies.map((movie,index)=>(
                      <Link to={`/movie/${movie.movie_slug}`} key={movie.movie_slug}>
                        <li key={movie.movie_slug}>
                            <p>{index+1}</p>
                            <img src={movie.poster_url} alt={movie.title}/>
                        </li>
                      </Link>
                    ))}
                  </ul>
              </section>
            )}

            <section className='all-movies'>
              <h2 className='text-white'>All Movies</h2>
              
              {isLoading ? (
                <p className='text-white'>
                  <Spinner />
                </p>
              ) : errorMessage ? (
                  <p className='text-red-500'>{errorMessage}</p>
                ) : (
                  <ul>
                    {movieList.map((movie)=>(
                        <Link to={`/movie/${movie.ids.imdb}`} key={movie.ids.imdb}>
                            <Moviecard key={movie.ids.imdb} movie={movie}/>
                        </Link>
                    ))}
                  </ul>
                )
              }

            </section>

          </div>

        </main>
      
  )
}

export default Home