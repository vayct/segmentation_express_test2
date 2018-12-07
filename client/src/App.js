import React, { Component } from 'react';
import axios from 'axios';

import UserForm from './components/UserForm';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style5.css'
import './assets/css/imgbox.css'
import './assets/css/column.css'





class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            active: false,
            selectedFile: '',
            imgSource1: '',
            imgSource2: '',
            spatialBandwidth: '1',
            rangeBandwidth: '1',
            minimumRegionArea: '1',
            };
        this.toggleClass = this.toggleClass.bind(this)

    }

    onChange = (e) => {
        switch (e.target.name) {
            case 'selectedFile':
                this.setState({ selectedFile: e.target.files[0] });
                this.setState({
                    imgSource1: URL.createObjectURL((e.target.files[0])),
                    imgSource2: URL.createObjectURL((e.target.files[0]))
                });
                break;
            default:
                this.setState({ [e.target.name]: e.target.value });
        }
    };

    getInitialState(){
        return {"active": "false"};
    }
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
                this.setState( {imgSource2: resultImageOutput});

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
                this.setState( {imgSource2: resultImageOutput});

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


    toggleClass() {

        this.setState({active: !this.state.active});
    };
    render(){
        return (
            <div className="wrapper">
                <nav id="sidebar" className={this.state.active ? 'active' : ''}>
                    <div className="sidebar-header">
                        <h3>Image Segmentation</h3>
                    </div>

                    <ul className="list-unstyled components">
                        <p>EDISON Algorithm</p>

                        <input
                            type="file"
                            name="selectedFile"
                            onChange={this.onChange}
                        />
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
                        <button onClick={this.submitColorsClassification}>Submit Colors Classification</button>
                        <button onClick={this.submitEdison}>Submit EDISON</button>


                    </ul>


                </nav>
                <div id="content">

                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container-fluid">

                            <button type="button" id="sidebarCollapse" className={this.state.active ? 'active':''} onClick={this.toggleClass}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                            <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" onClick={this.toggleClass}
                                    data-toggle="collapse" data-target="#navbarSupportedContent"
                                    aria-controls="navbarSupportedContent" aria-expanded="false"
                                    aria-label="Toggle navigation">
                                <i className="fas fa-align-justify"></i>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="nav navbar-nav ml-auto">
                                    <li className="nav-item">
                                        <a className="nav-link">Help</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link">Documentation</a>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div class="row">
                            <div class="column">
                            <div class="imgbox">
                                <img
                                    class="center-fit"
                                    name="mainImage1"
                                    src={this.state.imgSource1}
                                    onChange={this.onChange}
                                    alt="main viewing panel"
                                />
                            </div>
                            </div>
                        <div class="column">
                        <div className="imgbox">
                            <img
                                className="center-fit"
                                name="mainImage2"
                                src={this.state.imgSource2}
                                onChange={this.onChange}
                                alt="main viewing panel"
                            />
                        </div>
                        </div>
                    </div>



            </div>

            </div>
        )
    }
}

/*
class App extends Component {
 state = {
    response: '',
    post: '',
    responseToPost: '',
  };
    componentDidMount() {
        this.callApi()
            .then(res => this.setState({ response: res.express }))
            .catch(err => console.log(err));
    }
    callApi = async () => {
        const response = await fetch('/api/hello');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };
    handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch('/api/world', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: this.state.post }),
        });
        const body = await response.text();
        this.setState({ responseToPost: body });
    };


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <p> {this.state.response}</p>
        <form submitColorsClassification={this.handleSubmit}>
            <p>
              <strong>Post to Server:</strong>
            </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value})}
            />
            <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>



          <form action="/" encType="multipart/form-data" method="post">
              <input
                  type="file"
                  name="file-to-upload">
              </input>
              <input
                  type="submit"
                  value="upload">
              </input>
          </form>


      </div>
    );
  }
}*/

export default App;
