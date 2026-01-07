import React from 'react';
import ArtworkList from '../Components/ArtworkList.jsx';

function Recommendation() {
    return (
        <div className="recommendation">
            
            <ArtworkList recommend={true} />
        </div>
    );
}

export default Recommendation;