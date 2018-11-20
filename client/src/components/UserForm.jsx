import React, { Component } from 'react';
import axios from 'axios';

class UserForm extends Component {
    constructor() {
        super();
        this.state = {
            description: '',
            selectedFile: '',
            imgSource: './tmp/bearseat.png',
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

    onSubmit = (e) => {
        e.preventDefault();
        const { description, selectedFile } = this.state;
        let formData = new FormData();

        formData.append('description', description);
        formData.append('selectedFile', selectedFile);

        axios.post('/', formData)
            .then((result) => {

                this.setState( {imgSource: result.data.newImg.toString()});
                // access results...
            })
            //TODO get erros
            .catch((err) => {
            });
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
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
                />
            </form>
        );
    }
}
export default UserForm