import ArtworkHooks from '../Script/ArtworkHooks.js';
import ArtworkCard from './ArtworkCard.jsx';
import { useAuthContext } from '../Script/AuthContext.jsx';

// ArtworkList component to display a list of artwork posts
function ArtworkList({ search, currentPage, profileid, recommend }) {
    const { posts} = ArtworkHooks({ search, currentPage, profileid, recommend }); 
    // Returned values => from the imported file by using the custom hooks 
    const { user } = useAuthContext();
  const isProfileOwner = String(user?.userid) === String(profileid);

    return(
        <div className='listpage'>
            {posts.map((post) => (
              <ArtworkCard key={post.artid} post={post} profile={post.userid} isOwner={isProfileOwner}/>
            ))}
        </div>
    );
}

export default ArtworkList;