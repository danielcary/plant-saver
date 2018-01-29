/*
 * Plant Saver
 * SettingsPage.jsx
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
import * as React from 'react';
import { Grid, Row, Col, Alert, PageHeader, FormGroup, FormControl, ControlLabel, InputGroup, Button, Radio, Checkbox } from 'react-bootstrap';
import axios from 'axios';
import MapComponent from './MapComponent';
import * as settings from './settings';

export default class SettingsPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            settings: {
                email: settings.get().email,
                notificationsEnabled: settings.get().notificationsEnabled,
                useFahrenheit: settings.get().useFahrenheit,
                latitude: settings.get().latitude,
                longitude: settings.get().longitude,
                utcOffset: settings.get().utcOffset
            }
        };

    }

    emailChanged(e) {
        let settings = this.state.settings;
        settings.email = e.target.value;
        this.setState({ settings: settings });
    }

    notificationsEnabledChanged() {
        let settings = this.state.settings;
        settings.notificationsEnabled = !settings.notificationsEnabled;
        this.setState({ settings: settings });
    }

    useFahrenheitChanged() {
        let settings = this.state.settings;
        settings.useFahrenheit = !settings.useFahrenheit;
        this.setState({ settings: settings });
    }

    setCoords(lat, lng) {
        let settings = this.state.settings;
        settings.latitude = lat;
        settings.longitude = lng;
        this.setState({ settings: settings });
    }

    updateUTCOffset() {
        return new Promise((resolve, reject) => {
            if (settings.get().latitude == this.state.settings.latitude
                && settings.get().longitude == this.state.settings.longitude) {
                resolve();
            } else {
                axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${this.state.settings.latitude},${this.state.settings.longitude}&timestamp=133116120&key=${process.env.GOOGLE_MAPS_KEY}`)
                    .then(res => {
                        if (res.data.status != 'OK') {
                            throw res;
                        }

                        let settings = this.state.settings;
                        settings.utcOffset = Math.round(res.data.rawOffset / 60 / 60);
                        this.setState({ settings: settings }, () => resolve());
                    }).catch(err => reject(err));
            }
        });
    }

    save() {
        this.setState({ loading: true }, () => {
            this.updateUTCOffset()
                .then(() => settings.updateSettings(this.state.settings))
                .then(() => alert('Saved!'))
                .catch(err => {
                    console.log(err);
                    alert('Error saving settings!');
                }).then(() => this.setState({ loading: false }));
        });
    }

    deleteAccount() {
        if (confirm("Are you sure you wish to delete your account? This cannot be reveresed.")) {
            settings.deleteAccount()
                .then(() => this.props.signOut())
                .catch(err => {
                    console.log(err);
                    alert('Error deleting account!');
                });
        }
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={6}>
                        <h3>Notification Settings</h3>
                    </Col>
                    <Col xs={6}>
                        <div style={{ marginTop: 20, textAlign: "right" }}>
                            <Button
                                onClick={() => this.save()}
                                disabled={this.state.loading}>
                                Save
                            </Button>
                            <Button
                                bsStyle="danger"
                                onClick={() => this.deleteAccount()}>
                                Delete Account
                            </Button>
                        </div>
                    </Col>
                </Row>
                <hr />
                <FormGroup>
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        type="text"
                        placeholder="you@example.com"
                        value={this.state.settings.email}
                        onChange={e => this.emailChanged(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Checkbox
                        checked={this.state.settings.notificationsEnabled}
                        onChange={() => this.notificationsEnabledChanged()}>
                        Allow Notifications
                    </Checkbox>
                </FormGroup>
                <FormGroup>
                    <Checkbox
                        checked={this.state.settings.useFahrenheit}
                        onChange={() => this.useFahrenheitChanged()}>
                        Use Fahrenhiet
                    </Checkbox>
                </FormGroup>

                <br />
                <h3>Location</h3>
                <hr />
                <MapComponent
                    lat={this.state.settings.latitude}
                    lng={this.state.settings.longitude}
                    setCoords={this.setCoords.bind(this)} />
            </Grid>
        );
    }


};