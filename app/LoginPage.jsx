import * as React from 'react';
import { Panel, Grid, FormControl, FormGroup, ControlLabel, Button } from 'react-bootstrap';


export default class LoginPage extends React.Component {

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
                    <div className="g-signin2" ></div>
                </Panel>
            </Grid>
        );
    }

}
