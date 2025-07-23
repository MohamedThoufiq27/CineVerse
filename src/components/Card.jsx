import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import LiquidGlass from './LiquidGlass';

// --- ICONS ---
import { FaStar, FaPlay, FaArrowUp } from 'react-icons/fa';

// --- API CONFIG ---
const OMDB_API_URL = 'https://www.omdbapi.com/';
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const TRAKT_API_URL = 'https://api.trakt.tv';
const TRAKT_API_KEY = import.meta.env.VITE_TRAKT_API_KEY;
const TRAKT_API_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': TRAKT_API_KEY,
  },
};

// --- HELPER COMPONENTS & FUNCTIONS ---
const DetailItem = ({ label, value }) => (
  <div className="py-3 border-b border-gray-700/50 flex">
    <p className="text-gray-400 font-semibold w-36 flex-shrink-0">{label}</p>
    <p className="text-white">{value}</p>
  </div>
);

const formatRuntime = (runtimeStr) => {
  if (!runtimeStr || runtimeStr === "N/A") return '';
  const minutes = parseInt(runtimeStr);
  if (isNaN(minutes)) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatVotes = (votesStr) => {
    if (!votesStr) return '';
    const num = parseInt(votesStr.replace(/,/g, ''));
    if (isNaN(num)) return '';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num;
};

const Card = () => {
  const [movie, setMovie] = useState(null);
  const [fanart, setFanart] = useState('');
  const [trailer,setTrailer] = useState('');
  const [Homepage,setHomePage] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    const fetchAllDetails = async () => {
      setMovie(null);
      setError('');
      setFanart('');
      try {
        // --- 1. Fetch main details from OMDB ---
        const omdbRes = await axios.get(OMDB_API_URL, { params: { i: id, apikey: OMDB_API_KEY } });
        if (omdbRes.data.Response === "True") {
          setMovie(omdbRes.data);
        } else {
          throw new Error(omdbRes.data.Error);
        }

        // --- 2. Fetch fanart from Trakt.tv ---
        const traktRes = await axios.get(`${TRAKT_API_URL}/movies/${id}?extended=images,full`, TRAKT_API_OPTIONS);
        if (traktRes.data.images?.fanart[0]) {
          setFanart(`https://${traktRes.data.images.fanart[0]}`);
        }
        if(traktRes.data.trailer){
          setTrailer(traktRes.data.trailer);
         
        }
        if(traktRes.data.homepage){
          setHomePage(traktRes.data.homepage);
         
        }
         console.log(traktRes.data)

      } catch (err) {
        setError(err.message || "Failed to fetch movie details.");
        console.error(err);
      }
    };
    fetchAllDetails();
  }, [id]);

  if (error) return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-400 text-xl p-4 text-center">{error}</div>;
  if (!movie) return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white text-xl">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 bg-cover bg-fixed bg-center p-4" style={{ backgroundImage: `url(${fanart || movie.Poster})` }}>
      <LiquidGlass title={movie.Title}>
        <div className='w-full max-w-7xl p-6 flex flex-col gap-8'>

          {/* ====== ROW 1: HEADER ====== */}
          <header className="flex justify-between items-center w-full">
            <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white">{movie.Title}</h1>
                <div className='flex items-center flex-wrap gap-x-3 text-gray-400 mt-2'>
                    <span>{movie.Year}</span>
                    <span>•</span>
                    <span>{movie.Rated}</span>
                    <span>•</span>
                    <span>{formatRuntime(movie.Runtime)}</span>
                </div>
            </div>
            {/* Placeholder for the central icon from the new design */}
            <div className="hidden lg:block w-16 h-16 bg-white/10 rounded-full"></div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-2 bg-black/20 p-3 rounded-lg">
                    <FaStar className="text-yellow-400" size="1.2em" />
                    <span className="text-white font-bold">{movie.imdbRating}</span>
                    <span className="text-gray-400 text-sm">({formatVotes(movie.imdbVotes)})</span>
                </div>
                <button className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-600/70 transition-colors">
                  <FaArrowUp />
                </button>
            </div>
          </header>

          {/* ====== ROW 2: POSTER & FANART ====== */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 relative">
                <img src={movie.Poster} alt={`${movie.Title} Poster`} className="rounded-lg shadow-2xl w-full object-cover" />
                {/* Optional overlay like in the example image */}
                {/* <div className="absolute bottom-4 left-4 right-4 text-center p-2 bg-black/50 rounded-lg backdrop-blur-sm">
                    <p className="text-red-500 font-bold text-xl">NETFLIX</p>
                </div> */}
            </div>
            <div className="md:col-span-2 relative">
                {fanart ? (
                  <img src={fanart} alt={`${movie.Title} Fanart`} className="rounded-lg shadow-2xl w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-lg bg-black/20 flex items-center justify-center">
                    <p className="text-gray-400">Fanart not available.</p>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4">
                    <Link to={trailer}>
                      <button className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg hover:bg-black/70 transition-colors text-white">
                          <FaPlay />
                          <span>Trailer</span>
                      </button>
                    </Link>
                </div>
            </div>
          </section>

          {/* ====== ROW 3: DETAILS ====== */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="md:col-span-2 text-sm">
                 <DetailItem label="Genres" value={movie.Genre} />
                 <DetailItem label="Overview" value={movie.Plot} />
                 <DetailItem label="Release date" value={movie.Released} />
                 <DetailItem label="Countries" value={movie.Country} />
                 <DetailItem label="Language" value={movie.Language} />
                 {movie.Production && movie.Production !== "N/A" && <DetailItem label="Production" value={movie.Production} />}
             </div>
             <div className="flex flex-col items-center justify-between gap-4">
                <Link to={Homepage !== "N/A" ? Homepage : '#'} target="_blank" rel="noopener noreferrer" className="w-full text-center px-5 py-3 bg-purple-600 rounded-lg font-semibold text-white hover:bg-purple-700 transition-colors">
                    Visit Homepage &rarr;
                </Link>
                {/* Placeholder for the bottom-right icon */}
                <div className="w-24 h-24 bg-white/10 rounded-full"></div>
             </div>
          </section>

        </div>
      </LiquidGlass>
    </div>
  );
};

export default Card;