import './App.css';
import React, {useState, useEffect} from 'react';

function App() {

    const [strava, setStrava] = useState();
    const [spotify, setSpotify] = useState();

    useEffect(() => {
        const url = new URL(window.location);

        if (localStorage.getItem("strava")) {

            if (localStorage.getItem("spotify")) {
                // Done
                setStrava(localStorage.getItem("strava"));
                setSpotify(localStorage.getItem("spotify"));



            } else {
                // If strava, but no spotify
                setStrava(localStorage.getItem("strava"));
                let spotCode = url.searchParams.get("code");
                localStorage.setItem("spotify", spotCode);
                setSpotify(spotCode)
            }
        } else {
            // If no strava
            let stravaCode = url.searchParams.get("code")
            localStorage.setItem("strava", stravaCode);
            setStrava(stravaCode);
        }


    }, [])

    const onStravaClick = () => {
        window.location = "http://www.strava.com/oauth/authorize?client_id=24406&response_type=code&redirect_uri=http://localhost:3001/exchange_token&approval_prompt=force&scope=read";
    }

    const onSpotifyClick = () => {
        window.location = "https://accounts.spotify.com/authorize?client_id=5a18a679262e4ac094c14cacfd5fd861&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001&scope=user-read-private%20user-read-email&state=34fFs29kd09"
    }


    return (
    <div className="App">
        <br/>
      <button onClick={onStravaClick}>Connect with strava</button>
        <button onClick={onSpotifyClick}>Connect with spotify</button>
        <p>{strava}</p>
        <p>{spotify}</p>
    </div>
  );
}

export default App;
