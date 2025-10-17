import React, { useState, useRef, useEffect  } from "react";
import "../Design/Gallery.css";
import art1 from "../assets/art1.png";
import art2 from "../assets/art2.png";
import art3 from "../assets/art3.png";
import art4 from "../assets/art4.png";
import art5 from "../assets/art5.png";
import art6 from "../assets/art6.png";
import sundoodle from "../assets/sundoodle.png";
import moondoodle from "../assets/moondoodle.png";


export default function Gallery() {
  const images = [art1, art2, art3, art4, art5, art6, sundoodle, moondoodle];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnailsRef = useRef(null);
  const thumbRefs = useRef([]);
    // keep active thumbnail in view when selectedIndex changes
  useEffect(() => {
    const selectedborder = thumbRefs.current[selectedIndex];
    if (selectedborder) {
      // prefer centering the item in the scroll container
      selectedborder.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <div className="gallery-outer">
    <div className="gallery-container">
      {/* Main image */}
      <div className="main-image">
        <img src={images[selectedIndex]} alt={`Artwork ${selectedIndex + 1}`} />
      </div>

      {/* Thumbnails */}
      <div className="thumbnail-strip">
        <button
          className="nav-btn"
          onClick={() => setSelectedIndex((selectedIndex - 1 + images.length) % images.length)}
        >
          ◀
        </button>

        <div className="thumbnails" ref={thumbnailsRef}>
          {images.map((src, index) => (
            <img
              key={index}
              ref={(selectedborder) => (thumbRefs.current[index] = selectedborder)}
              src={src}
              className={`thumbnailList ${selectedIndex === index ? "active" : ""}`}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>

        <button
          className="nav-btn"
          onClick={() => setSelectedIndex((selectedIndex + 1) % images.length)}
        >
          ▶
        </button>
      </div>

      {/* Pagination label */}
      <div className="page-label">{`${selectedIndex + 1} of ${images.length}`}</div>
    </div>
    </div>
  );
}
