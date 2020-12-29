import './App.css';
import React, {useState, useEffect} from 'react';
import demo from './demo.png'
import spot from './Spotify_Logo_RGB_White.png'
import stravaCon from './btn_strava_connectwith_orange.png'
import SignedIn from './SignedIn';

function App() {

    const [strava, setStrava] = useState();
    const [spotify, setSpotify] = useState();

    const [content, setContent] = useState();
    const [fetched, setFetched] = useState(false);

    const apiLoc = "http://60d228aec15f.ngrok.io";

    useEffect(() => {
        if (!fetched) {
            const url = new URL(window.location);

            if (localStorage.getItem("lastClicked") === "strava" ) {
                let stravaCode = url.searchParams.get("code");

                if (!stravaCode) { // edge case where it gets stuck on last clicked
                    localStorage.clear();
                    window.location.reload(false);
                }

                const getData = async() => {
                    let myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    let raw = JSON.stringify({"strava":stravaCode});

                    let requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                    };

                    await fetch(apiLoc + "/authorizeStrava", requestOptions)
                        .then(response => response.text())
                        .then(result => {
                            console.log(result)
                            let res = JSON.parse(result);
                            console.log(res);
                            if (res.spotRef) { // If the user exists

                                localStorage.setItem("stravaTok", res.stravaTok);
                                localStorage.setItem("id", res.stravaId);
                                //console.log(res.stravaID)
                                localStorage.setItem("spotifyTok", res.spotTok);
                                localStorage.setItem("lastClicked", "signedIn")
                                setContent(<SignedIn />);
                            } else { // If it's a new user
                                localStorage.setItem("stravaTok", res.stravaTok);
                                localStorage.setItem("stravaRef", res.stravaRef);
                                localStorage.setItem("id", res.stravaId);

                                setContent (
                                    <div id="content">
                                        <h1>Awesome! Link your Spotify account</h1>
                                        <div id="spotify" onClick={onSpotifyClick}>
                                            <img height={"24px"} src={spot} alt={"spotify"}/>
                                        </div>
                                    </div>
                                )
                            }
                        })
                        .catch(error => console.log('error', error));
                }
                getData();

            } else if (localStorage.getItem("lastClicked") === "signedIn") {
                setContent (
                    <SignedIn />
                )
            } else if (localStorage.getItem("lastClicked") === "spotify" ) {
                let spotCode = url.searchParams.get("code")
                localStorage.setItem("spotify", spotCode);
                submit();

            } else {
                setContent (
                    <div id="content">
                        <h1>Put the songs you listened to on <span style={{"color":"#1DB954"}}>Spotify</span> during your activities on <span style={{"color":"#fc5200"}}>Strava</span></h1>
                        <img width="350" src={demo} alt="Demo"/>
                        <p>Once setup, the process is done completely automatically</p>
                        <br />
                        <br />
                        <h2>Start by connecting your Strava Account</h2>
                        <p>Or if you've already signed up also click here</p>
                        <img id="stravacon" src={stravaCon} onClick={onStravaClick} alt="stravaConnect"/>
                    </div>
                )
            }

            setSpotify(localStorage.getItem("spotify"));
            setStrava(localStorage.getItem("strava"));

            setFetched(true);
        }

    }, [fetched])

    const onStravaClick = () => {
        localStorage.setItem("lastClicked", "strava")
        //console.log(`http://www.strava.com/oauth/authorize?client_id=24406&response_type=code&redirect_uri=` + window.location.origin +`/exchange_token&approval_prompt=force&scope=activity:read_all,activity:write`)
        window.location = `http://www.strava.com/oauth/authorize?client_id=24406&response_type=code&redirect_uri=` + window.location.origin +`/exchange_token&approval_prompt=force&scope=activity:read_all,activity:write`;
    }

    const onSpotifyClick = () => {
        //encodeURIComponent(curUrl)
        localStorage.setItem("lastClicked", "spotify")
        window.location = "https://accounts.spotify.com/authorize?client_id=5a18a679262e4ac094c14cacfd5fd861&response_type=code&redirect_uri=" + encodeURI(window.location.origin)  + "&scope=user-read-private%20user-read-email%20user-read-recently-played&state=34fFs29kd09"
    }

    const submit = () => {

            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            let raw = JSON.stringify({"stravaTok":localStorage.getItem("stravaTok"),"stravaRef":localStorage.getItem("stravaRef"), "spotify":localStorage.getItem("spotify"), "id":localStorage.getItem("id")});

            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(apiLoc + "/createuser", requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log(result);
                    let res = JSON.parse(result);
                    localStorage.setItem("spotTok",res.spotTok);
                    localStorage.setItem("lastClicked", "signedIn")

                    setContent(<SignedIn />)
                })
                .catch(error => console.log('error', error));

    }


    return (
    <div className="App">
        <div id={"debug"}>
            <button onClick={onStravaClick}>Connect with strava</button>
            <button onClick={onSpotifyClick}>Connect with spotify</button>
            <p>Strava: {strava}</p>
            <p>Spotify: {spotify}</p>
            <button onClick={submit}>Submit</button>
            <button onClick={()=>localStorage.clear()}>Clear</button>
        </div>
        <br/>

        {content}

    </div>
  );
}

export default App;

/*
<br/>
      <button onClick={onStravaClick}>Connect with strava</button>
        <button onClick={onSpotifyClick}>Connect with spotify</button>
        <p>Strava: {strava}</p>
        <p>Spotify: {spotify}</p>
        <button onClick={submit}>Submit</button>
 */