import { useEffect, useState } from "react";


const Moviecard = ({movie:{images,title,year,language,rating}}) => {
  
  const [imgUrl,setImgUrl] = useState(); 
  useEffect(()=>{
    const url=`https://${images?.poster[0]}`;
    setImgUrl(url);
  },[images])

  // console.log((images?.poster[0]).split('.webp')[0]);
 
  return (
    <div className='movie-card'>
        <img className="text-white" src={imgUrl ? imgUrl : '/no-movie.png'} alt={title} />
        {/* <img src="https://walter-r2.trakt.tv/images/movies/000/915/211/posters/thumb/6cb8440a2c.jpg.webp" /> */}
        <div className='mt-4'>
            <h3>{title}</h3>
            <div className='content'>
                <div className='rating'>
                    <img src='/star.svg' alt='Star Icon' />
                    <p>{rating ? rating.toFixed(1) : 'N/A'}</p>
                </div>

                <span>•</span>
                <p className='lang'>{language}</p>

                <span>•</span>
                <p className='year'>{year ? year : 'N/A'}</p>
            </div>
        </div>
    </div>
  )
}

export default Moviecard