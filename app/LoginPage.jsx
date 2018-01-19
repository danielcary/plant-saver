import * as React from 'react';
import { Panel, Grid, FormControl, Image, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import GoogleLogin from 'react-google-login';

export default class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            buttonState: "normal"
        };
    }

    getSrc() {
        switch (this.state.buttonState) {
            case "normal":
                return "/images/btn_google_signin_dark_normal_web.png";
            case "focus":
                return "/images/btn_google_signin_dark_focus_web.png";
            case "down":
                return "/images/btn_google_signin_dark_pressed_web.png";
        }
    }

    render() {

        return (
            <Grid>
                <Panel >
                    <div style={{ textAlign: "center" }}>
                        <GoogleLogin
                            clientId={process.env.GOOGLE_OAUTH_AUD}
                            onSuccess={this.props.onLoginSuccess}
                            onFailure={res => console.log(res)}
                            tag="a" type="" style={{}}>
                            <Image
                                onMouseEnter={() => this.setState({ buttonState: "focus" })}
                                onMouseLeave={() => this.setState({ buttonState: "normal" })}
                                onMouseDown={() => this.setState({ buttonState: "down" })}
                                onMouseUp={() => this.setState({ buttonState: "normal" })}
                                src={this.getSrc()} />
                        </GoogleLogin>
                    </div>
                </Panel>
            </Grid>
        );
    }

}
