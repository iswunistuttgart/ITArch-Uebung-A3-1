import React, {Component} from 'react';
import logo from './ISW-Logo.jpg';
import medal from './medal.png';
import './App.css';
import QRCode from 'qrcode.react';
import 'whatwg-fetch';
// eslint-disable-next-line
import particlesJS from 'particles.js'

var rest = require('rest');
var ServerIP = 'http://193.196.39.80:8080';


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

        //check and feedback of Team exists
        if (jsonObject.team === "Kein TEAM" && jsonObject.qrcode === "Kein CODE") {
            console.log('Team not found');
            document.getElementById("TeamInput").className = 'App-input warning';
        } else {
            console.log('Team found');
            document.getElementById("TeamInput").className = 'App-input normal';
        }
    });

    //check if Team is best Team and give Medal to QRCode
    if (document.getElementById("QR2") != null) {
        if (THECOMPONENT.state.InputFieldvalue === THECOMPONENT.state.bestTeam) {
            console.log('Logged in Team is best');
            document.getElementById("QR2").style.display = "none";
            document.getElementById("Medal").style.display = "flex"
        } else {
            document.getElementById("QR2").style.display = "flex";
            document.getElementById("Medal").style.display = "none";
        }
    }



    new Promise(function () {
        setTimeout(subTopic, 2000);
    });


}

//Resize QRCodes when Window ist resized
window.onresize = function(event) {
    THECOMPONENT.state.sizeQR1=Math.max(document.documentElement.clientHeight, window.innerHeight || 0)*0.3;
    THECOMPONENT.state.sizeQR2=Math.max(document.documentElement.clientHeight, window.innerHeight || 0)*0.14;
};


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
            bestSpeed: 0,
            sizeQR1: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)*0.3,
            sizeQR2: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)*0.14,
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
                <div id="particles-js"/>


                <header className="App-header">
                    <a href="https://www.isw.uni-stuttgart.de/" target="_blank" rel="noopener noreferrer">
                        <img src={logo} className="App-logo" alt="logo"/>
                    </a>
                    <h1 className="App-title">Welcome to QRCode display service</h1>
                </header>


                <div className="App-flex">
                    <p className="App-intro">
                        Gib hier deinen Team-Namen ein: <input id="TeamInput" className="App-input normal"
                                                               value={this.state.InputFieldvalue}
                                                               onChange={this.updateInputValue}
                                                               title="Teamname muss den in der Python und Java Applikation gesetzten entsprechen (Case Sensitiv)."/>
                    </p>


                    <p className="App-intro">Der letzte erhaltene QRCode:</p>
                    <p>Mit der aktuellen Geschwindigkeit von: {this.state.speed * 100}%</p>


                    <div className="flip-container">
                        <div className="flipper">
                            <div className="front">
                                <QRCode value={this.state.value} size={parseInt(this.state.sizeQR1,10)} />
                            </div>
                            <div className="back">
                                <p>Im QR-Code enthaltene Nachricht:</p>
                                <p><b>{this.state.value}</b></p>
                            </div>
                        </div>
                    </div>


                    <p>Aktuell bester empfangener QRCode kommt von Team:&nbsp;<b> {this.state.bestTeam} </b> mit der
                        Geschwindigkeit von: {this.state.bestSpeed * 100}%</p>
                    <div className="App-flex itemQR" id ="QR2" title="QR-Code des Highscores, erziele eine höhere Geschwindigkeit und verdiene eine Medaille!">
                        <QRCode value={this.state.bestcode} size={parseInt(this.state.sizeQR2,10)}/>
                    </div>
                    <div className="App-flex itemQR" id="Medal" title="Glückwunsch!" style={{"display":"none"}}>
                        <img id="MedalPic" src={medal} alt="Medaille"/>
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
