import React from 'react';


function Card(props) {


    let date = new Date(Date.parse(props.activity.start_date_local))

    return (
        <div id={"card"} key={props.id}>
            <h2 onClick={() => window.location = "https://strava.com/activities/" + props.id} id={"header"}>{props.activity.name}</h2>
            <p>{date.toLocaleDateString()}</p>
            <div id={"stats"}>
                <p><span style={{color: "grey"}}>Distance:</span> {Math.round((props.activity.distance / 1609) + Number.EPSILON) * 100 / 100} miles  &nbsp; &nbsp; &nbsp;

                    <span style={{color: "grey"}}>Elevation Climbed:</span> {Math.round(props.activity.total_elevation_gain * 3.28084 + Number.EPSILON) * 100 / 100} feet</p>
            </div>
            <br/>

            <div id={"songList"}>
                {props.imageList}
            </div>
            <br />
            <span id={"songList"}>{props.songList}</span>

        </div>
    )
}

export default Card;