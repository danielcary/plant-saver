import * as React from 'react';
import { Grid, Alert, FormGroup, FormControl, ControlLabel, InputGroup, Button, Radio, Checkbox } from 'react-bootstrap';

import * as settings from './settings';
import { ISettings } from './settings';

interface ISettingsState {
    loading: boolean;
    email: string;
    notificationsEnabled: boolean;
    useFahrenheit: boolean;
}

export default class SettingsPage extends React.Component<{}, ISettingsState> {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            email: settings.get().email,
            useFahrenheit: settings.get().useFahrenheit,
            notificationsEnabled: settings.get().notificationsEnabled
        };

    }

    emailChanged(e) {
        this.setState({ email: e.target.value });
    }

    notificationsEnabledChanged() {
        this.setState({ notificationsEnabled: !this.state.notificationsEnabled });
    }

    useFahrenheitChanged() {
        this.setState({ useFahrenheit: !this.state.useFahrenheit });
    }

    save() {
        this.setState({ loading: true });
        settings.updateSettings(this.state.email, this.state.notificationsEnabled, this.state.useFahrenheit).then(() => {
            this.setState({ loading: false });
        }).catch(err => {
            alert('Error saving settings!');
            this.setState({ loading: false });
        })
    }

    render() {
        return (
            <Grid>
                <FormGroup>
                    <ControlLabel>Notification Settings</ControlLabel>
                    <FormControl
                        type="text"
                        placeholder="you@example.com"
                        value={this.state.email}
                        onChange={e => this.emailChanged(e)}
                    />
                    <Checkbox
                        checked={this.state.notificationsEnabled}
                        onChange={() => this.notificationsEnabledChanged()}>
                        Send Notifications
                    </Checkbox>
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Temperature Scale</ControlLabel><br />
                    <Button
                        onClick={() => this.useFahrenheitChanged()}>
                        {this.state.useFahrenheit ? "°F" : "°C"}
                    </Button>
                </FormGroup>

                <div style={{ textAlign: "right" }}>
                    <Button
                        onClick={() => this.save()}
                        disabled={this.state.loading}>
                        Save
                    </Button>
                </div>
            </Grid>
        );
    }


};