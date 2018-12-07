import React, { Component } from 'react';
import axios from 'axios';

class UserForm extends Component {
    constructor() {
        super();
        this.state = {
            description: '',
            selectedFile: '',
            imgSource: 'bearseat.png',

            spatialBandwidth: '1',
            rangeBandwidth: '1',
            minimumRegionArea: '1',


        };
    }

    onChange = (e) => {
        switch (e.target.name) {
            case 'selectedFile':
                this.setState({ selectedFile: e.target.files[0] });
                this.setState({
                    imgSource: URL.createObjectURL((e.target.files[0]))
                });
                break;
            default:
                this.setState({ [e.target.name]: e.target.value });
        }
    };

    submitColorsClassification = (e) => {
        e.preventDefault();
        const { description,
            selectedFile} = this.state;
        let formData = new FormData();

        formData.append('description', description);

        formData.append('selectedFile', selectedFile);

        axios.post('/segmentation/colorsClassification', formData)
            .then((result) => {

                // access results...
                let resultPath = result.data.segmentationResultDir.toString();
                let resultImageOutput = resultPath + result.data.segmentationResultOutput;
                this.setState( {imgSource: resultImageOutput});

                //deleting the file
                // axios.delete('/delete',{
                //     data: {
                //         imagePath: resultPath,
                //         imageFiles: result.data.segmentationResultFiles
                //     }});
            })
            //TODO get erros
            .catch((err) => {
            });
    };

    submitEdison = (e) => {
        e.preventDefault();
        const { description, selectedFile, spatialBandwidth, rangeBandwidth, minimumRegionArea} = this.state;
        let formData = new FormData();

        formData.append('description', description);
        formData.append('selectedFile', selectedFile);
        formData.append('spatialBandwidth', spatialBandwidth);
        formData.append('rangeBandwidth', rangeBandwidth);
        formData.append('minimumRegionArea', minimumRegionArea);
        axios.post('/segmentation/edison', formData)
            .then((result) =>{

                let resultPath = result.data.segmentationResultDir.toString();
                let resultImageOutput = resultPath + result.data.segmentationResultOutput;
                this.setState( {imgSource: resultImageOutput});

                //deleting the file
                // axios.delete('/delete',{
                //     data: {
                //         imagePath: resultPath,
                //         imageFiles: result.data.segmentationResultFiles
                //     }});
            })
            //TODO get erros
            .catch((err) => {
            });
    };
    render() {
        return (
            <div>
            <form onSubmit={this.submitColorsClassification}>
                <input
                    type="text"
                    name="description"
                    value={this.state.description}
                    onChange={this.onChange}
                />
                <input
                    type="file"
                    name="selectedFile"
                    onChange={this.onChange}
                />
                <button type="submit">Submit</button>
                <img
                    name="images"
                    src ={this.state.imgSource}
                    onChange = {this.onChange}
                    alt='hello world'
                />
            </form>
                <br/>
                <br/>
                <br/>
                <div>
                    <form onSubmit={this.submitEdison}>
                        <input
                            name="spatialBandwidth"
                            type="number"
                            min="0"
                            max="20"
                            defaultValue={this.state.spatialBandwidth}
                            value={this.state.spatialBandwidth}
                            onChange={this.onChange}
                        />
                        <input
                            name="rangeBandwidth"
                            type="number"
                            min="0"
                            max="20"
                            defaultValue={this.state.rangeBandwidth}
                            value={this.state.rangeBandwidth}
                            onChange={this.onChange}
                        />
                        <input
                            name="minimumRegionArea"
                            type="number"
                            min="0"
                            max="50005000"
                            defaultValue={this.state.minimumRegionArea}
                            value={this.state.minimumRegionArea}
                            onChange={this.onChange}
                        />
                        <button type="submit">EDISON Segmentation</button>
                    </form>

                </div>
            </div>

        );
    }
}
export default UserForm