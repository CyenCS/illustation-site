import React from 'react';
import ArtworkList from '../Components/ArtworkList.jsx';

function Recommendation() {
    return (
        <div className="recommendation">
            <ArtworkList recommend={true} />
        {/* <p>Here are some recommended items for you:</p>
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </ul> */}
        </div>
    );
}

export default Recommendation;