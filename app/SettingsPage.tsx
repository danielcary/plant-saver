import * as React from 'react';
import { Grid, Alert, FormGroup, FormControl, ControlLabel, InputGroup, Button, Radio } from 'react-bootstrap';

import * as settings from './settings';
import { ISettings } from './settings';

interface ISettingsState {
    location: string;
    email: string;
    phone: string;
    useEmail: boolean;
    useFahrenheit: boolean;
    notificationsEnabled: boolean;
}

export default class SettingsPage extends React.Component<{}, ISettingsState> {

    constructor(props) {
        super(props);

        this.state = {
            location: '',
            email: '',
            phone: '',
            useEmail: true,
            useFahrenheit: true,
            notificationsEnabled: true
        };

        /*   Settings.get().then(settings => {
               this.setState({
                   location: settings.location,
                   email: settings.email,
                   phone: settings.phoneNumber,
                   useFahrenheit: settings.useFahrenheit,
                   useEmail: settings.useEmailNotifications,
                   notificationsEnabled: settings.areNotificationsPaused
               });
           });
   */
    }

    locationChanged(e) {
        this.setState({ location: e.target.value });
    }

    emailChanged(e) {
        this.setState({ email: e.target.value });
    }

    phoneChanged(e) {
        this.setState({ phone: e.target.value });
    }

    canSave() {
        return false;
    }

    notificationTypeChanged(email: boolean) {
        this.setState({ useEmail: email })
    }

    render() {
        return (
            <Grid>
                {(settings.get().locationId == null &&
                    <Alert bsStyle="warning">
                        Please enter your location in order to track weather!
                    </Alert>
                )}
                <FormGroup>
                    <ControlLabel>Location</ControlLabel>
                    <FormControl type="text" value={this.state.location} onChange={e => this.locationChanged(e)} />
                </FormGroup>

                <ControlLabel>Notification Settings</ControlLabel>
                <FormGroup>
                    <InputGroup>
                        <InputGroup.Addon>
                            <input type="radio" checked={this.state.useEmail} onChange={() => this.notificationTypeChanged(true)} name="notificationradiogroup" />
                        </InputGroup.Addon>
                        <FormControl
                            type="text"
                            placeholder="you@example.com"
                            value={this.state.email}
                            onChange={e => this.emailChanged(e)}
                        />
                    </InputGroup>
                </FormGroup>

                <FormGroup>
                    <InputGroup>
                        <InputGroup.Addon>
                            <input type="radio" checked={!this.state.useEmail} onChange={() => this.notificationTypeChanged(false)} name="notificationradiogroup" />
                        </InputGroup.Addon>
                        <FormControl
                            type="text"
                            placeholder="(123)-134-2445"
                            value={this.state.phone}
                            onChange={e => this.phoneChanged(e)}
                        />
                    </InputGroup>
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Temperature Scale</ControlLabel><br />
                    <Button onClick={() => this.setState({ useFahrenheit: !this.state.useFahrenheit })} >{this.state.useFahrenheit ? "°F" : "°C"}</Button>
                </FormGroup>

                <div style={{ textAlign: "right" }}>
                    <Button disabled={!this.canSave()}>
                        Save
                    </Button>
                </div>

                <Button>
                    Pause Alarm
                </Button>
            </Grid>
        );
    }


};