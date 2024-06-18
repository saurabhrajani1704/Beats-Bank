import axios from 'axios';
//Function to get Auth token 
const getAuthToken = async (code) => {
    const clientId = "your client key";
    const clientSecret = "your client secret key";
    const redirectUri = "http://localhost:3000/callback";
  
    if (!clientId || !clientSecret || !redirectUri) {
      console.error('Missing environment variables for Spotify API.');
      return;
    }
    const tokenOptions = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
        }).toString(),
    };
    const response = await axios(tokenOptions);
    console.log('response of get auth:', response);
    const token = response.data.access_token;
    //store this token in local storage
    localStorage.setItem('spotify_access_token', token);
    return token;
};

// This Authorization will be exchanged for an access token that your app can use to make requests to the Spotify Web API.


//Function to Redirect to Spotify Login
export const redirectToSpotifyLogin = () => {
    const clientId = "your client key";
    const redirectUri = "http://localhost:3000/callback";
  
    if (!clientId || !redirectUri) {
      console.error('Missing environment variables for Spotify API.');
      return;
    }
  
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=playlist-read-private`;
    window.location.href = spotifyAuthUrl;
};
export default getAuthToken;
  

  
  