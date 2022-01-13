import React from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

function ReactMap() {
    return (
        <div>
        <Map google={this.props.google} zoom={14}>

            <Marker onClick={this.onMarkerClick}
                name={'Current location'} />

            <InfoWindow onClose={this.onInfoWindowClose}>
                {/* <div>
                    <h1>{this.state.selectedPlace.name}</h1>
                </div> */}
            </InfoWindow>
        </Map>
            
        </div>
    )
}

export default GoogleApiWrapper({
    apiKey: ("57326886237-e5s64g1s5givufhqfckv4ucj5iegp14f.apps.googleusercontent.com")
})(ReactMap)

