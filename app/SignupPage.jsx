import * as React from 'react';
import { Panel, Grid, Col, FormControl, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import * as gapi from './gapi';

import MapComponent from './MapComponent';

export default class SignupPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: gapi.getBasicProfile().U3
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
                                <FormControl
                                    type="email"
                                    placeholder={gapi.getBasicProfile().U3}
                                    value={this.state.email} />
                            </Col>
                        </FormGroup>
                    </Form>


                    <MapComponent />

                    <Button>
                        Submit
                    </Button>
                </Panel>
            </Grid >
        );
    }

}