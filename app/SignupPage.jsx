import * as React from 'react';
import { Panel, Grid, Col, FormControl, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import axios from 'axios';
import myAxios from './axios';

import * as gapi from './gapi';
import MapComponent from './MapComponent';

export default class SignupPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: gapi.getBasicProfile().U3,
            lat: 0,
            lng: 0
        };

    }

    setCoords(lat, lng) {
        this.setState({
            lat: lat,
            lng: lng
        });
    }

    canSubmit() {
        return true;
    }

    submit() {
        // get UTC offset for coords
        axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${this.state.lat},${this.state.lng}&timestamp=133116120&key=${process.env.GOOGLE_MAPS_KEY}`).then(res => {
            if (res.data.status != 'OK') {
                throw res;
            }

            return myAxios().post('/signup', {
                email: this.state.email,
                latitude: this.state.lat,
                longitude: this.state.lng,
                utcOffset: Math.round(res.data.rawOffset / 60 / 60)
            });
        }).then(res => {
            // signup was a success, finish logging in the user
            this.props.signedUp();
        }).catch(err => console.log(err));
    }

    render() {
        return (
            <Grid>
                <Panel>
                    <h3>Signup!</h3>

                    <Form horizontal>
                        <FormGroup>
                            <Col sm={5} componentClass={ControlLabel}>
                                Notification Email Address
                            </Col>
                            <Col sm={7}>
                                <FormControl
                                    type="email"
                                    placeholder={gapi.getBasicProfile().U3}
                                    value={this.state.email} />
                            </Col>
                        </FormGroup>
                    </Form>


                    <MapComponent setCoords={(lat, lng) => this.setCoords(lat, lng)} />

                    <Button onClick={() => this.submit()} disabled={!this.canSubmit()}>
                        Submit
                    </Button>
                </Panel>
            </Grid >
        );
    }

}