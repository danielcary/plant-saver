import * as React from 'react';
import { Grid, Panel, PageHeader, Row, Col } from 'react-bootstrap';

export default class AboutPage extends React.Component {

    render() {
        return (
            <Grid>
                <PageHeader>
                    About
                </PageHeader>
                <Row>
                    <Col sm={7}>
                        <p>
                            Plant Saver helps you
                        </p>
                    </Col>
                    <Col sm={5}>
                        <p>
                            Plant Saver uses Google Maps to select your location. By using Plant Saver you are agreeing to be bound by <a href="https://www.google.com/policies/terms/">Google's Terms of Service</a>.
                        </p>
                        <p>
                            Weather data is <a href="https://darksky.net/poweredby">Powered by Dark Sky</a>
                        </p>
                        <p>
                            Source code can be found on <a href="https://github.com/danielcary/plant-saver">this GitHub Repo</a>
                        </p>
                        <p>
                            Made by Daniel Cary
                        </p>
                    </Col>
                </Row>
            </Grid>
        );
    }

};