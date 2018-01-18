import * as React from 'react';
import { Panel, Grid, FormControl, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import GoogleLogin from 'react-google-login';

export default class LoginPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Grid>
                <Panel>
                    <GoogleLogin
                        clientId={process.env.GOOGLE_OAUTH_AUD}
                        onSuccess={this.props.onLoginSuccess}
                        onFailure={res => console.log(res)}
                    />
                </Panel>
            </Grid>
        );
    }

}
