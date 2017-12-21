import * as React from 'react';
import { Panel, Grid, Col, FormControl, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';

interface ILoginPageState {
    email: string;
    password: string;
}

export default class SignupPage extends React.Component<{}, ILoginPageState> {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };

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
                                <FormControl type="email" />
                            </Col>
                        </FormGroup>
                    </Form>

                    <FormGroup>
                        <ControlLabel>Latitude</ControlLabel>
                        <FormControl type="number" />
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel>Latitude</ControlLabel>
                        <FormControl type="number" />
                    </FormGroup>


                    <FormGroup>
                        <ControlLabel>Latitude</ControlLabel>
                        <FormControl type="number" />
                    </FormGroup>

                    <GoogleMapReact
                        defaultCenter={{ lat: 70, lng: 30 }}
                        defaultZoom={11}
                    >
                    </GoogleMapReact>

                    <Button>
                        Submit
                    </Button>
                </Panel>
            </Grid >
        );
    }

}