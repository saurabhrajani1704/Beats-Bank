import axios from 'axios';

const getPlaylistMe = async (token) => {
  const playlistUrl = 'https://api.spotify.com/v1/me/playlists';
  const playlistOptions = {
    method: 'GET',
    url: playlistUrl,
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const response = await axios(playlistOptions);
    return response.data;
  } catch (error) {
    console.error('Error getting Spotify playlists:', error);
  }
};

export default getPlaylistMe;

