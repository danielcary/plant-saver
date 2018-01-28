/*
 * Plant Saver
 * MapComponent.jsx
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
import * as React from 'react';
import { Panel, Grid, Col, FormControl, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const START_LAT = 41;
const START_LNG = -80;

export default class MapComponent extends React.Component {

    constructor(props) {
        super(props);

        let defaultLat = this.props.lat || START_LAT;
        let defaultLng = this.props.lng || START_LNG;

        if (!this.props.lat && !this.props.lng) {
            this.props.setCoords(START_LAT, START_LNG);

            // try to get location automatically instead of using default lat, lng
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => {
                    this.setState({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        center: { lat: pos.coords.latitude, lng: pos.coords.longitude }
                    });
                    this.props.setCoords(this.state.lat, this.state.lng);
                });
            }
        }

        this.state = {
            lat: defaultLat,
            lng: defaultLng,
            center: { lat: defaultLat, lng: defaultLng }
        };

        this.MyMap = withScriptjs(withGoogleMap(props =>
            <GoogleMap
                defaultZoom={7}
                defaultCenter={{ lat: defaultLat, lng: defaultLng }}
                center={this.state.center}
                onClick={e => this.mapClicked(e)}
            >
                <Marker position={{ lat: this.state.lat, lng: this.state.lng }} />
            </GoogleMap>
        ));
    }

    mapClicked(e) {
        this.setState({
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        }, () => {
            this.props.setCoords(this.state.lat, this.state.lng);
        });
    }

    render() {
        return (
            <this.MyMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&key=${process.env.GOOGLE_MAPS_KEY}&libraries=geometry,drawing`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />);
    }

}