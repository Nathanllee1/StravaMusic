import React, {useState, useEffect} from 'react';


function Card(props) {


    let date = new Date(Date.parse(props.activity.start_date_local))

    return (
        <div id={"card"} key={props.id}>
            <h2 onClick={() => window.location = "https://strava.com/activities/" + props.id} id={"header"}>{props.activity.name}</h2>
            <p>{date.toLocaleDateString()}</p>
            <div id={"stats"}>
                <p><span style={{color: "grey"}}>Distance:</span> {Math.round((props.activity.distance / 1609) + Number.EPSILON) * 100 / 100} miles   <span style={{color: "grey"}}>Elevation Climbed:</span> {props.activity.total_elevation_gain}</p>
            </div>

            <div id={"songList"}>
                {props.imageList}
            </div>
            <br />
            <span id={"songList"}>{props.songList.join(", ")}</span>

        </div>
    )
}

export default Card;