import React, {useState, useEffect} from 'react';
import Card from './card';



function SignedIn(props) {

    const [userObj, setObj] = useState({});
    const [cards, setCards] = useState([]);
    const [selectedSong, setSong] = useState("5TUZhrb8UaaA76NhzZax2Z");

    useEffect(() => {
        if (userObj) {
            let requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            if (localStorage.getItem("stravaInfo")) {
                setObj(JSON.parse(localStorage.getItem("stravaInfo")));
            } else {
                fetch(`https://www.strava.com/api/v3/athlete?access_token=${localStorage.getItem("stravaTok")}`, requestOptions)
                    .then(response => response.text())
                    .then(async result => {
                        let res = JSON.parse(result);
                        if (res.message === "Authorization Error") {
                            await refreshTokens()
                        }

                        setObj(JSON.parse(result))
                        localStorage.setItem("stravaInfo", result);
                    })
                    .catch(error => console.log('error', error));
            }



            let songOpt = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch("http://localhost:4000/getActivities/?id=10441589", songOpt)
                .then(response => response.text())
                .then(async result => {
                    console.log(result);
                    let songs = JSON.parse(result);

                    let cardList = []

                    for (const id of Object.keys(songs)) {
                        console.log(id)
                        let activity = localStorage.getItem(id);
                        if (!activity) { // if it's not in local storage
                            activity = await getActivity(id);
                            localStorage.setItem(id, JSON.stringify(activity))
                        } else {
                            activity = JSON.parse(activity);
                        }

                        let songList = []
                        let imageList = []
                        for (const song of songs[id]) {
                            let locSong = localStorage.getItem(song)
                            if (locSong) {
                                locSong = JSON.parse(locSong);
                            } else {
                                locSong = JSON.parse(await (getSong(song)));

                                if (locSong.error && locSong.error.status === 401) { // If token expired
                                    await refreshTokens();
                                }
                                localStorage.setItem(song, JSON.stringify(locSong))
                            }

                            if (locSong.album) {
                                songList.push(<span id={locSong.id} className={selectedSong} id={locSong.id}>{locSong.name},&nbsp; </span>)
                                imageList.push(
                                    <img id={locSong.id} onMouseOver={() => setSong(locSong.id)} key={locSong.id} src={locSong["album"].images[1].url} alt={"songImage"} width={80}/>
                                )
                            }

                        }
                        console.log(imageList)
                        cardList.push(<Card id={id} imageList={imageList} songList={songList} activity={activity}/>)
                        //<Card id={id} imageList={imageList} songList={songList} activity={activity}/>

                    }
                    console.log(cardList);
                    setCards(cardList);

                })
                .catch(error => console.log('error', error));

        }
    }, []);

    const refreshTokens = async() => {
        let refOptions = {
            method: 'GET'
        }
        fetch(`http://localhost:4000/refreshTokens/?id=${localStorage.getItem("id")}`, refOptions)
            .then(response => response.text())
            .then(result => {
                let res = JSON.parse(result);
                localStorage.setItem("stravaTok", res.stravaTok);
                localStorage.setItem("spotifyTok", res.spotTok);
            })
            .catch(error => console.log('error', error))
    }

    const getActivity = async (id) => {
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        let returnObj;

        await fetch("https://www.strava.com/api/v3/activities/" + id +"?access_token=" + localStorage.getItem("stravaTok"), requestOptions)
            .then(response => response.text())
            .then(result => {
                returnObj = JSON.parse(result);
            })
            .catch(error => console.log('error', error));

        return returnObj;
    }

    const getSong = async(id) => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("spotifyTok"));

        let results;

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        await fetch("https://api.spotify.com/v1/tracks/" + id, requestOptions)
            .then(response => response.text())
            .then(result => results = result)
            .catch(error => console.log('error', error));

        return results;
    }

    const signout = () => {
        localStorage.clear();
        window.location.reload(false);
    }

    console.log((cards === []));



    return (
        <div id={"appPage"} >
            <div id={"bar"}>
                <div id={"profile"}>
                    <p>{userObj.firstname} {userObj.lastname}</p>
                    <img id="profilePic" src={userObj.profile} alt={"profilepic"}/>
                    <p id={"signout"} onClick={signout}>Sign out</p>
                </div>
            </div>
            <div id={"cardList"}>

                {cards.length !== 0 ? cards : <div id={"content"}><h2>Everything is setup, when you record an activity while listening to Spotify, it will show up here</h2></div>}
            </div>


        </div>

    )
}

export default SignedIn;
//<Card id={id} imageList={imageList} songList={songList} activity={card.activity}/>