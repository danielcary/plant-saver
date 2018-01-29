/*
 * Plant Saver
 * PlantBox.jsx
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/plant-saver/blob/master/LICENSE)
*/
import * as React from 'react';
import { Panel, Glyphicon, Grid, Row, Col, Image } from 'react-bootstrap';

export default class PlantBox extends React.Component {

    removeClicked() {
        if (confirm(`Are you sure you want to delete '${this.props.name}'?`)) {
            this.props.onRemove();
        }
    }

    render() {
        return (
            <div >
                <Panel style={{ width: 250, height: 260 }}>
                    <Grid fluid>
                        <Row>
                            <Col style={{ paddingRight: 0, paddingLeft: 0 }} xs={1}><p></p>
                            </Col>
                            <Col style={{ paddingRight: 0, paddingLeft: 0 }} xs={10}>
                                <img src={this.props.imageUrl} height={170} />
                            </Col>
                            <Col style={{ paddingRight: 0, paddingLeft: 0 }} xs={1}>
                                <span onClick={() => this.props.onEdit(this.props.plantId)} className="plantbox-pencil" style={{ fontSize: 20 }}><Glyphicon glyph="pencil" /></span> <br />
                                <span
                                    onClick={() => this.removeClicked()}
                                    className="plantbox-remove"
                                    style={{ fontSize: 20 }}>
                                    <Glyphicon glyph="remove" />
                                </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ paddingRight: 0, paddingLeft: 0 }} xs={9}>
                                <h4>{this.props.name}</h4>
                            </Col>
                            <Col style={{ paddingRight: 0, paddingLeft: 0 }} xs={3}>
                                <h3 style={{ marginTop: 10, textAlign: "right" }}>{this.props.temp}°{this.props.degree}</h3>
                            </Col>
                        </Row>
                    </Grid>
                </Panel>
            </div>
        );
    }

};