import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export default function ArtworkCard({post }) {
  const { userid: profileId } = useParams();
  const hideLink = profileId && String(profileId) === String(post.userid);

    return (
        <Link key={post.artid} to={`/posts/${post.artid}`} className="thumbnail-link">
               <div>
               {post.firstImage && (
               <img style={{width: "170px", height: "170px", objectFit: "cover"}}
               src={`${post.firstImage}`}
               alt={post.title}
               className="thumbnail"
               />
               )}
               <h3>{truncateText(post.title, 20)}</h3>
               {hideLink ? null : (
          <p>
            <Link className="artist-link" key={post.userid} to={`/profile/${post.userid}`}>
              {post.username}
            </Link>
          </p>
        )}
               {/* {isOwner ? null : <p>by {post.username}</p>} */}
  </div>
          </Link>
    );
}