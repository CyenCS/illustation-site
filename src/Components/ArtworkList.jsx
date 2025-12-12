import ArtworkHooks from '../Script/ArtworkHooks.js';
import ArtworkCard from './ArtworkCard.jsx';

function ArtworkList({ search, currentPage, profileid }) {
    const { posts} = ArtworkHooks({ search, currentPage, profileid }); 
    // Returned values => from the imported file by using the custom hooks 

    return(
        <div className='listpage'>
            {posts.map((post) => (
              <ArtworkCard key={post.artid} post={post} />
            ))}
        </div>
    );
}

export default ArtworkList;