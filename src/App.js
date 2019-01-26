import React, {Component} from 'react';
import logo from './ISW-Logo.jpg';
import './App.css';
import QRCode from 'qrcode.react';
import 'whatwg-fetch';
import particlesJS from 'particles.js'

var rest = require('rest');
var ServerIP = 'http://193.196.37.135:8080';


var THECOMPONENT;
var queueTopic = 'QRCode-Read';

function subTopic() {

    rest(ServerIP + '/getBestCode/').then(function (response) {
        console.log('response: ', response.entity);
        var jsonObject = JSON.parse(response.entity.toString());
        if (THECOMPONENT !== undefined) {
            console.log('response: ', jsonObject);
            THECOMPONENT.setState({
                bestcode: "" + jsonObject.qrcode,
                bestTeam: jsonObject.team,
                bestSpeed: jsonObject.speed
            });

        }
    });
    rest(ServerIP + '/getQRCode/' + THECOMPONENT.state.InputFieldvalue).then(function (response) {
        console.log('response: ', response.entity);
        var jsonObject = JSON.parse(response.entity.toString());
        console.log('response: ', jsonObject.qrcode);

        if (THECOMPONENT !== undefined) THECOMPONENT.setState({
            value: "" + jsonObject.qrcode,
            speed: jsonObject.speed
        });

        //prüfe und kennzeichne ob Team existiert
        if (jsonObject.team === "Kein TEAM" && jsonObject.qrcode === "Kein CODE") {
            console.log('Team not found');
            document.getElementById("TeamInput").className = 'App-input warning';
        } else {
            console.log('Team found');
            document.getElementById("TeamInput").className = 'App-input normal';
        }
    });
    new Promise(function () {
        setTimeout(subTopic, 2000);
    });


}


class App extends Component {
    code = "";

    constructor(props) {
        super(props);
        THECOMPONENT = this;
        console.log("Initialisiere die Homepage");
        this.state = {
            value: this.code,
            InputFieldvalue: queueTopic,
            speed: 0,
            bestcode: '',
            bestTeam: '',
            bestSpeed: 0
        };
        subTopic();

        /* particlesJS.load(@dom-id, @path-json, @callback (optional));*/
        const particles = window.particlesJS;
        particles.load('particles-js', 'particles/particlesjs-isw3.json', function () {
            console.log('callback - particles.js config loaded');
        });
    }

    render() {
        return (
            <div className="App">
                <div id="particles-js"></div>


                <header className="App-header">
                    <a href="https://www.isw.uni-stuttgart.de/" target="_blank">
                        <img src={logo} className="App-logo" alt="logo"/>
                    </a>
                    <h1 className="App-title">Welcome to QRCode display service</h1>
                </header>


                <div className="App-flex">
                    <p className="App-intro">
                        Gib hier deinen Team-Namen ein: <input id="TeamInput" className="App-input normal"
                                                               value={this.state.InputFieldvalue}
                                                               onChange={this.updateInputValue}/>
                    </p>


                    <p className="App-intro">Der letzte erhaltene QRCode:</p>
                    <p>Mit der aktuellen Geschwindigkeit von: {this.state.speed * 100}%</p>


                    <div className="flip-container">
                        <div className="flipper">
                            <div className="front">
                                <QRCode value={this.state.value} size={1.5 * 256}/>
                            </div>
                            <div className="back">
                                <p>Im QR-Code enthaltene Nachricht:</p>
                                <p><b>{this.state.value}</b></p>
                            </div>
                        </div>
                    </div>


                    <p>Aktuell bester empfangener QRCode kommt von Team:&nbsp;<b> {this.state.bestTeam} </b> mit der
                        Geschwindigkeit von: {this.state.bestSpeed * 100}%</p>
                    <div className="App-flex itemQR">
                        <QRCode value={this.state.bestcode} size={0.5 * 256}/>
                    </div>
                </div>
            </div>

        );
    }

    updateInputValue(evt) {
        THECOMPONENT.setState({InputFieldvalue: evt.target.value});
    }

    getValue() {
        return this.code;
    }

    triggerClick() {
        this.code += "ss+";
        console.log("click click" + this.code);
        this.setState({
            value: this.code,
        });
    }
}

export default App;
