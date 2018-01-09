import * as React from 'react';
import { Modal, Row, Col, Button, Glyphicon, ControlLabel, FormGroup, InputGroup, FormControl } from 'react-bootstrap';

import { plantPicUrls, convertForDisplay, convertForSaving } from './plant';
/*
export interface IAddModifyPlantModelProps {
    title: string;
    fahrenheit: boolean;
    onHide: () => void;
    onSave: (picIndex: number, name: string, temp: number) => void

    currentPictureIndex?: number;
    plantName?: string;
    alertTemperature?: number;
}

interface IAddModifyPlantModalState {
    currentPictureIndex: number;
    plantName: string;
    alertTemperature: number;
    errorMessage: string;
}*/

export default class AddModifyPlantModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentPictureIndex: props.currentPictureIndex || 1,
            plantName: props.plantName || "",
            alertTemperature: convertForDisplay(props.alertTemperature || 32),
            errorMessage: ""
        };

    }

    onNameChange(e) {

        this.setState({
            plantName: e.target.value
        });
    }

    onTempChange(e) {


        this.setState({
            alertTemperature: e.target.value
        });
    }

    arrowOver(right) {

        let index = this.state.currentPictureIndex;
        index += right ? 1 : -1;

        let picCounts = Object.keys(plantPicUrls).length;
        if (index < 1) {
            index = picCounts;
        } else if (index > picCounts) {
            index = 1;
        }

        this.setState({
            currentPictureIndex: index
        });
    }

    canSave() {
        return this.state.plantName.trim().length > 0;
    }

    save() {
        this.props.onSave(
            this.props.id,
            this.state.plantName,
            this.state.currentPictureIndex,
            convertForSaving(this.state.alertTemperature)
        );
    }


    render() {
        return (
            <Modal bsSize="large" show onHide={this.props.onHide} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Add a plant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={6}>
                            <Row>
                                <Col xs={2}>
                                    <h3 className="arrow" onClick={() => this.arrowOver(false)} ><Glyphicon glyph="chevron-left" /></h3>
                                </Col>
                                <Col xs={8}>
                                    <div style={{ textAlign: "center" }}>
                                        <img src={plantPicUrls[this.state.currentPictureIndex]} height={180} />
                                    </div>
                                </Col>
                                <Col xs={2}>
                                    <h3 className="arrow" onClick={() => this.arrowOver(true)} ><Glyphicon glyph="chevron-right" /></h3>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={6}>
                            <FormGroup>
                                <ControlLabel>Plant Name</ControlLabel>
                                <FormControl
                                    type="text"
                                    placeholder="My Plant"
                                    value={this.state.plantName}
                                    onChange={e => this.onNameChange(e)} />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Alert Temperature (°{this.props.fahrenheit ? "F" : "C"})</ControlLabel>
                                <FormControl
                                    type="number"
                                    min={convertForDisplay(-99)}
                                    max={convertForDisplay(99)}
                                    step={0.1}
                                    value={this.state.alertTemperature}
                                    onChange={e => this.onTempChange(e)} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <div style={{ textAlign: "right" }}>
                                <Button
                                    disabled={!this.canSave()}
                                    onClick={() => this.save()}
                                >Save</Button>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }


};