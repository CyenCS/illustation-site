import ArtworkHooks from '../Script/ArtworkHooks.js';
import ArtworkCard from './ArtworkCard.jsx';

// ArtworkList component to display a list of artwork posts
function ArtworkList({ search, currentPage, profileid }) {
    const { posts} = ArtworkHooks({ search, currentPage, profileid }); 
    // Returned values => from the imported file by using the custom hooks 

    return(
        <div className='listpage'>
            {posts.map((post) => (
              <ArtworkCard key={post.artid} post={post} profile={post.userid}/>
            ))}
        </div>
    );
}

export default ArtworkList;