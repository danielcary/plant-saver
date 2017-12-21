import * as React from 'react';
import { Link, match } from 'react-router-dom';
import { Nav, Navbar, NavItem, Grid, Modal, Jumbotron, PageHeader, Radio, FormGroup, ControlLabel, FormControl, Button, InputGroup, Row, Col, Well, Glyphicon } from 'react-bootstrap';

import PlantBox from './PlantBox';
import AddModifyPlantModal from './AddModifyPlantModal';

import * as Plant from './plant';
import { IPlant } from './plant';

interface IPlantPageState {
    showAddPlantModal: boolean;
    editingPlant: IPlant;
    plants: IPlant[];
    loading: boolean;
}

export default class PlantPage extends React.Component<{}, IPlantPageState> {

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
        let boxes: JSX.Element[] = [];

        this.state.plants.forEach(plant => {
            boxes.push(
                <PlantBox
                    plantId={plant.id}
                    name={plant.name}
                    imageUrl={Plant.plantPicUrls[plant.pictureId]}
                    minTempF={plant.temperature}
                    currentTempF={40}
                    fahrenheit
                    onEdit={() => this.setState({ editingPlant: plant })}
                    onRemove={() => this.removePlant(plant.id)}
                />
            );
        });

        let renderComps: JSX.Element[] = [];
        const perRow = 3;
        for (let i = 0; i < Math.ceil(boxes.length / perRow); i++) {
            let cols: JSX.Element[] = [];

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

    addPlant(picIndex: number, name: string, temp: number) {
        Plant.addPlant(name, temp, picIndex).then(res => {
            this.setState({
                plants: res,
                loading: false
            });
        }).catch(err => console.log(err));

        this.setState({ showAddPlantModal: false, loading: true })
    }

    savePlant(picIndex: number, name: string, temp: number) {
        Plant.editPlant(this.state.editingPlant.id, name, temp, picIndex).then(res => {
            this.setState({
                plants: res,
                loading: false
            });
        }).catch(err => console.log(err));

        this.setState({ editingPlant: null, loading: true })
    }

    removePlant(id: number) {
        Plant.removePlant(id).then(res => {
            this.setState({
                plants: res,
                loading: false
            });
        }).catch(err => console.log(err));

        this.setState({ loading: true });
    }

    render() {
        return (
            <Grid>
                {(this.state.loading && <h1>loading</h1>)}
                {this.state.showAddPlantModal && <AddModifyPlantModal
                    onHide={() => this.setState({ showAddPlantModal: false })}
                    onSave={this.addPlant}
                    fahrenheit title="Add Plant" />}
                {this.state.editingPlant && <AddModifyPlantModal
                    onHide={() => this.setState({ editingPlant: null })}
                    onSave={this.savePlant}
                    plantName={this.state.editingPlant.name}
                    alertTemperature={this.state.editingPlant.temperature}
                    currentPictureIndex={this.state.editingPlant.pictureId}
                    fahrenheit title="Edit Plant" />}
                <PageHeader>
                    Your Plants <Glyphicon onClick={() => this.setState({ showAddPlantModal: true })} glyph="plus" />
                </PageHeader>

                {this.renderBoxes()}

            </Grid>
        );
    }

};