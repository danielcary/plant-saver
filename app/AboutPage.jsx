/*
 * Plant Saver
 * AboutPage.jsx
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
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
                        Plant Saver sends you alerts to your email when it is going to be too cold for your outdoor plants. Simply enter the temperature you want to be reminded out.
                        Then, based on your location, we will send you an email in the evening if it is going to be at or below that temperature. 
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