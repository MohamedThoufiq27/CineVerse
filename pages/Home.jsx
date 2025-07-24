import { useEffect, useState, useMemo } from 'react';
import Search from '../src/components/Search';
import Spinner from '../src/components/Spinner';
import Moviecard from '../src/components/Moviecard';
import { useDebounce } from 'react-use';
import { Link } from 'react-router-dom';
import LiquidGlass from '../src/components/LiquidGlass';
import axios from 'axios';
import { getTrendingMovies, updateSearchCount } from '../src/lib/appwrite';

const animationStyles = `
  @keyframes blink {
    from, to { color: transparent }
    50% { color: currentColor }
  }
  .animate-blink {
    animation: blink 1s step-end infinite;
  }
`;

const BASE_URL_TRAKT = 'https://api.trakt.tv';
const API_KEY_TRAKT = import.meta.env.VITE_TRAKT_API_KEY;

// API headers
const API_OPTIONS_TRAKT = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'trakt-api-version': `2`,
        'trakt-api-key': API_KEY_TRAKT
    }
};

// main component
const Home = () => {
    const textsToType = useMemo(() => [
        "Find Movies you like without hassle",
        "Discover your next favorite film.",
        "Browse thousands of movies.",
        "Explore by genre or actor."
    ], []);

    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setdebouncedSearchTerm] = useState('');
    
    // State for the typing effect
    const [typedText, setTypedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);

    // Typing effect logic
    useEffect(() => {
        const i = loopNum % textsToType.length;
        const fullText = textsToType[i];
        const typingSpeed = isDeleting ? 75 : 75;

        const handleTyping = () => {
            setTypedText(
                isDeleting
                    ? fullText.substring(0, typedText.length - 1)
                    : fullText.substring(0, typedText.length + 1)
            );

            if (!isDeleting && typedText === fullText) {
                // Pause at the end of typing
                setTimeout(() => setIsDeleting(true), 1000);
            } else if (isDeleting && typedText === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);

        // Cleanup function to clear the timer
        return () => clearTimeout(timer);
    }, [typedText, isDeleting, loopNum, textsToType]);


    // debounce the search term
    useDebounce(() => setdebouncedSearchTerm(searchTerm), 1000, [searchTerm]);
    
    //fetching the movies from Trakt API
    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const endpoint = query
                ? `${BASE_URL_TRAKT}/search/movie?query=${encodeURIComponent(query)}&extended=images,full`
                : `${BASE_URL_TRAKT}/movies/trending?page=1&limit=20&extended=images,full`;

            const response = await axios(endpoint, API_OPTIONS_TRAKT);
            const data = response.data;
            
            const traktMovies = query ? data.map(item => item.movie) : data.map(item => item.movie);
            setMovieList(traktMovies);
            
            if (query && data.length > 0) {
                await updateSearchCount(query, traktMovies[0]);
            }
        } catch (error) {
            console.log(`error fetching the data ${error}`);
            setErrorMessage("Error fetching the movies, please try again later");
        } finally {
            setIsLoading(false);
        }
    }

    const fetchTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        } catch (error) {
            console.error(`Error fetching Trending Movies ${error}`);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        fetchTrendingMovies();
    }, []);

    return (
        <main>
            <div className='pattern'></div>
            <div className='wrapper'>
                <header>
                    <img src='/hero.png' alt='hero banner' />
                    
                        <h1>
                            <span className='text-gradient'>{typedText}</span>
                            <span className="text-white animate-blink text-gradient">&#8203;</span>
                        </h1>
                    
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingMovies.length > 0 && (
                    <section className='trending'>
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <Link to={`/movie/${movie.movie_slug}`} key={movie.movie_slug}>
                                    <li key={movie.movie_slug}>
                                        <p>{index + 1}</p>
                                        <img src={movie.poster_url} alt={movie.title} />
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </section>
                )}

                <section className='all-movies'>
                    <h2 className='text-white'>{debouncedSearchTerm ? 'Search Results' : 'All Movies'}</h2>
                    
                    {isLoading ? (
                        <p className='text-white'><Spinner /></p>
                    ) : errorMessage ? (
                        <p className='text-red-500'>{errorMessage}</p>
                    ) : (
                       <ul>
                            {movieList.map((movie) => (

                                <Link to={`/movie/${movie.ids.imdb}`} key={movie.ids.imdb}>
                                    <LiquidGlass>
                                    <Moviecard movie={movie} />
                                    </LiquidGlass>
                                </Link>
                            ))}
                       
                        
                         </ul>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Home;