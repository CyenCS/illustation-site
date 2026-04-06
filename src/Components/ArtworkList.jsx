import ArtworkHooks from '../Script/ArtworkHooks.js';
import ArtworkCard from './ArtworkCard.jsx';
import { useAuthContext } from '../Script/AuthContext.jsx';

// ArtworkList component to display a list of artwork posts
function ArtworkList({ search, currentPage, profileid, recommend }) {
    const {posts, loading} = ArtworkHooks({ search, currentPage, profileid, recommend }); 
    return(
        <div>
            {loading ? (
                <p className="loading">Loading...</p>
            ) : (
                 <div className='listpage'>
                    {posts.map((post) => (
                        <ArtworkCard key={post.artid} post={post} profile={post.userid}/>
                     ))
                    }
        </div>
            )}
        </div>
    );
}

export default ArtworkList;