import * as React from 'react';
import { Panel, Grid, Col, FormControl, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const defaultLat = 41;
const defaultLng = -80;

export default class MapComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lat: defaultLat,
            lng: defaultLng
        }

        // get location automatically (if we can)
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                this.setState({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            });
        }

        this.MyMap = withScriptjs(withGoogleMap(props =>
            <GoogleMap
                defaultZoom={5}
                defaultCenter={{ lat: defaultLat, lng: defaultLng }}
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
        });

        if(this.props.setCoords) {
            this.props.setCoords(this.state);
        }
    }

    render() {
        return (
            <this.MyMap
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />);
    }

}