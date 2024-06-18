import { useEffect, useState } from "react";
import getAuthToken,{redirectToSpotifyLogin} from "../api/getAuthToken.js";
import getPlaylist from "../api/getPlaylist.js";
import exportToCSV from "../utils/export.js";
import getPlaylistMe from "../api/getPlaylistMe.js";
import Footer from "./Footer.js";

/**
 * @typedef {Object} Track
 * @property {string} name
 * @property {Object[]} artists
 * @property {string} artists[].name
 * @property {Object} album
 * @property {string} album.name
 */

/**
 * @typedef {Object} Playlist
 * @property {string} name
 * @property {Object} tracks
 * @property {Object[]} tracks.items
 * @property {Track} tracks.items[].track
 */

/**
 * @typedef {Object} UserPlaylist
 * @property {string} id
 * @property {string} name
 */

const Body = () => {
  const [playlistId, setPlaylistId] = useState("");
  const [playlist, setPlaylist] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Exchange the code for an access token
      getAuthToken(code)
        .then((token) => {
          if (token) {
            localStorage.setItem("spotify_access_token", token);
            setAccessToken(token);
            fetchUserPlaylists(token);
          }
        })
        .catch((error) => {
          console.error("Error fetching access token:", error);
        });
    } else {
      const token = localStorage.getItem("spotify_access_token");
      if (token) {
        setAccessToken(token);
        fetchUserPlaylists(token);
      }
    }
  }, []);

  const fetchUserPlaylists = (token) => {
    getPlaylistMe(token)
      .then((playlists) => {
        setUserPlaylists(playlists.items);
      })
      .catch((error) => {
        console.error("Error fetching user playlists:", error);
      });
  };
  const fetchPlaylist = async (id) => {
    if (!id) {
      console.error("Playlist ID is required");
      return;
    }
  
    const token = localStorage.getItem("spotify_access_token");
    if (token) {
      try {
        const data = await getPlaylist(id, token);
        setPlaylist(data);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    } else {
      redirectToSpotifyLogin();
      console.error("No access token found");
    }
  };
  

  return (
    <div>
      <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('https://stats.fm/images/app_3.webp')" }}>
      <div className="absolute inset-0 bg-black opacity-55"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-md mx-auto my-8 bg-black bg-opacity-55 p-12 rounded">
      <h1 className="text-2xl font-bold mb-4 text-center text-white">Beats Bank: Get Backup For your Playlists Instantly</h1>
      {!accessToken ? (
        <button
          onClick={redirectToSpotifyLogin}
          className="bg-orange-500 max-w-md mx-auto my-2 text-white text-pretty font-bold p-2 mb-4 w-full"
        >
          Log in to Spotify
        </button>
      ) : (
        <div className="flex flex-col">
          <select
            value={playlistId}
            onChange={(e) => setPlaylistId(e.target.value)}
            className="border p-2 m-4 bg-black text-white font-mono"
          >
            <option value="">Choose a playlist</option>
            {userPlaylists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter Playlist ID"
            value={playlistId}
            onChange={(e) => setPlaylistId(e.target.value)}
            className="border p-2 m-4 bg-black text-white font-mono"
          />
          <button
            onClick={() => fetchPlaylist(playlistId)}
            className="bg-orange-500 p-2  m-4  text-white text-pretty font-bold  mb-4"
          >
            Get Playlist
          </button>
          {playlist && (
            <button
              onClick={() => exportToCSV(playlist)}
              className="bg-amber-500 p-2 m-4 text-white text-pretty font-bold  mb-4 "
            >
              Download Playlist
            </button>
          )}
        </div>
      )}
    </div>

    {playlist && (
      <div className="relative z-10 mt-8 max-w-4xl w-full  bg-black bg-opacity-75 p-6 rounded">
        <h2 className="text-xl font-bold mb-4 text-white">{playlist.name}</h2>
        <table>
          <thead>
            <tr>
              <th className="py-3  text-white font-semibold">Track Name</th>
              <th className="py-3  text-white font-semibold">Artist</th>
              <th className="py-3  text-white font-semibold">Album</th>
            </tr>
          </thead>
          <tbody>
            {playlist.tracks.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 text-white text-center">{item.track.name}</td>
                <td className="py-2 text-white text-center">
                  {item.track.artists.map((artist) => artist.name).join(", ")}
                </td>
                <td className="py-2 text-white text-center">{item.track.album.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  <Footer />
</div>


</div>
    
  );
};

export default Body;
