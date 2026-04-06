import Recommendation from '../Script/Recommendation.jsx';
import ArtworkList from '../Components/ArtworkList.jsx';


function Home(){

    return (
        <div className="content">
            <h2>Recent Posts</h2>
        <div >
          <ArtworkList />
        </div>
        <h2>Recommendation</h2>
        <div><Recommendation /></div>
        </div>
    );
}

export default Home;