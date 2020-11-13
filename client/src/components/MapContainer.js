import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

const apiKey = "AIzaSyCY5W1P8DPRt-14tjH8O4jiLsFxxRp2Jl8";


const BarcelonaBounds = {
  north: 41.470001,
  south: 41.317271,
  west: 2.049637,
  east: 2.227478,
};

const mapStyles = {
  width: "670px",
  height: "500px",

};


function MapContainer(props) {
  let [latitude, setLatitude] = useState("41.3887489");
  let [longitude, setLongitude] = useState("2.139259");

  useEffect(() => {
    getCoords();
  }, [latitude]);

  //get coordinates in order to pass them to the map

  let getCoords = async () => {
    let hola = "George Street 17 London"; // will be changed to product's owner address

    let address = hola.split(" ").join("+");

 
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`)
    .then(res => res.json())
      .then(response => {
       setLatitude(response.results[0].geometry.location.lat);
       setLongitude(response.results[0].geometry.location.lng);
      })
      .catch(err => console.log(err));
  }
   
  return (
    <div>
      <Map
        google={props.google}
        zoom={17}
        style={mapStyles}
        center={{
          lat: latitude,
          lng: longitude,
          defaultBounds: {BarcelonaBounds},
        }}
   
       
      >
        <Marker position={{ lat: latitude, lng: longitude }} />
      </Map>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyCY5W1P8DPRt-14tjH8O4jiLsFxxRp2Jl8",
})(MapContainer);
