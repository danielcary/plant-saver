import * as React from 'react';
import { Link, match } from 'react-router-dom';
import { Nav, Navbar, NavItem, Grid, Modal, Jumbotron, PageHeader, Radio, FormGroup, ControlLabel, FormControl, Button, InputGroup, Row, Col, Well, Glyphicon } from 'react-bootstrap';

import PlantBox from './PlantBox';
import AddModifyPlantModal from './AddModifyPlantModal';

import * as Plant from './plant';
import { get as getSettings } from './settings';
/*
interface IPlantPageState {
    showAddPlantModal: boolean;
    editingPlant: IPlant;
    plants: IPlant[];
    loading: boolean;
}*/

export default class PlantPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showAddPlantModal: false,
            editingPlant: null,
            plants: [],
            loading: true
        };

        // load plants
        Plant.loadPlants().then(res => {
            this.setState({
                plants: res,
                loading: false
            });
        });

        // bind methods
        this.addPlant = this.addPlant.bind(this);
        this.savePlant = this.savePlant.bind(this);
    }

    renderBoxes() {
        let boxes = [];

        this.state.plants.forEach(plant => {
            boxes.push(
                <PlantBox
                    plantId={plant.id}
                    name={plant.name}
                    imageUrl={Plant.plantPicUrls[plant.pictureId]}
                    temp={Plant.convertForDisplay(plant.temperature)}
                    degree={Plant.degreeType()}
                    onEdit={() => this.setState({ editingPlant: plant })}
                    onRemove={() => this.removePlant(plant.id)}
                />
            );
        });

        let renderComps = [];
        const perRow = 3;
        for (let i = 0; i < Math.ceil(boxes.length / perRow); i++) {
            let cols = [];

            for (let j = i * perRow; j < i * perRow + perRow; j++) {
                cols.push(
                    <Col sm={4} key={j + "box"}>
                        {j < boxes.length && boxes[j]}
                    </Col>
                );
            }

            renderComps.push(<Row key={i + "row"}>{cols.map(e => e)}</Row>);
        }

        return <div>{renderComps.map(e => e)}</div>;
    }

    addPlant(name, picIndex, temp) {
        this.setState({ showAddPlantModal: false, loading: true }, () => {
            Plant.addPlant(name, picIndex, temp).then(res => {
                this.setState({
                    plants: res,
                    loading: false
                });
            }).catch(err => {
                console.log(err);
                alert('Error adding plant!');
                this.setState({ loading: false });
            });
        });
    }

    savePlant(id, name, picIndex, temp) {
        this.setState({ editingPlant: null, loading: true }, () => {
            Plant.editPlant(id, name, picIndex, temp).then(res => {
                this.setState({
                    plants: res,
                    loading: false
                });
            }).catch(err => {
                console.log(err);
                alert('Error editing plant!');
                this.setState({ loading: false });
            });
        });
    }

    removePlant(id) {
        this.setState({ loading: true }, () => {
            Plant.removePlant(id).then(res => {
                this.setState({
                    plants: res,
                    loading: false
                });
            }).catch(err => {
                console.log(err);
                alert('Error removing plant!');
                this.state({ loading: false });
            });
        });
    }

    render() {
        return (
            <Grid>
                {this.state.showAddPlantModal && <AddModifyPlantModal
                    onHide={() => this.setState({ showAddPlantModal: false })}
                    onSave={(id, name, picIndex, temp) => this.addPlant(name, picIndex, temp)}
                    fahrenheit={getSettings().useFahrenheit}
                    title="Add Plant" />}
                {this.state.editingPlant && <AddModifyPlantModal
                    onHide={() => this.setState({ editingPlant: null })}
                    onSave={this.savePlant}
                    id={this.state.editingPlant.id}
                    plantName={this.state.editingPlant.name}
                    alertTemperature={this.state.editingPlant.temperature}
                    currentPictureIndex={this.state.editingPlant.pictureId}
                    fahrenheit={getSettings().useFahrenheit}
                    title="Edit Plant" />}
                <PageHeader>
                    Your Plants <Glyphicon onClick={() => this.setState({ showAddPlantModal: true })} glyph="plus" />
                </PageHeader>
                {this.state.loading && <div style={{ marginTop: 100 }} className="loader"></div>}

                {!this.state.loading && this.renderBoxes()}

            </Grid>
        );
    }

};