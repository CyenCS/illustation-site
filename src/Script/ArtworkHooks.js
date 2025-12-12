import { useEffect, useState,} from "react";
import axios from "axios";

const APIURL = process.env.REACT_APP_API_URL || "https://illustation-site.onrender.com";

//Custom hook to fetch artwork posts based on search, pagination, and profile ID

export default function ArtworkHooks({search, currentPage = 1, profileid=null}) {
    const [posts, setPosts] = useState([]);
    const [total, setTotal] = useState(0);
    const [maxPage, setMaxPage] = useState(1);
    const [artistname, setArtistname] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const [selectedPage ,setCurrentPage] = useState(currentPage);
    
        useEffect(() => {
            setLoading(true);
            setError(null);

            const url = profileid ?
              `${APIURL}/fetch/profile/${profileid}` :
              `${APIURL}/illust/illusts`;

            const params = profileid ? { currentPage } : { search, currentPage };

            axios.get(url, { params })
            .then((res) => {
              if (res.data?.success) {
                  setPosts(res.data.posts);
                  setTotal(res.data.total);
                  setMaxPage(res.data.maxpage);
                  if (profileid) {
                    const username = res.data.posts[0]?.username;
                    setArtistname(username);
                    console.log("Artistname:", artistname);
                  }
                  setError(null);
              } else{
                setPosts([]);
                setTotal(0);
                setMaxPage(1);
                setArtistname("");
              }
            }).catch((err) => {
              setPosts([]);
              console.error("Error fetching posts: ", err);
              setError(err.message || "Error fetching posts");
            })
            .finally(() => {
              setLoading(false);
            });
        //   fetchPosts(search, currentPage);
        },[search, currentPage, profileid, artistname]);

    return { posts, total, artistname, maxPage, loading, error };
}