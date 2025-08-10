import { Client, Databases, ID, Query} from 'appwrite';

const PROJECT_ID=import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID=import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID=import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)


const database = new Databases(client);

export const updateSearchCount = async(query,movie)=>{
    //use appwrite api to search if the search term exist in database 
    try{
        const result=await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
            Query.equal('query',query),
        ])
        
        // if it does , update the count
        if(result.documents.length>0){
            const doc=result.documents[0];

            await database.updateDocument(DATABASE_ID,COLLECTION_ID,doc.$id,{
                count:doc.count+1,
            })
        // if it doesn't create a new document with the search term and count as 1
        }else{
            await database.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(),{
                query,
                count : 1,
                movie_slug : movie.ids.imdb,
                poster_url : `https://${movie.images?.poster[0]}`,
                title:movie.title
            })
        }

        
    }catch(error){
        console.error(error);
    }
}

export const getTrendingMovies= async() => {
    try{
        const results=await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
            Query.limit(5),
            Query.orderDesc("count"),
        ])

        return results.documents;
    }
    catch(error){
        console.error(error);
    }
}

