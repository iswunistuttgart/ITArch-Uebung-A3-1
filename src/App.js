import React, {Component} from 'react';
import logo from './ISW-Logo.jpg';
import './App.css';
import QRCode from 'qrcode.react';
import 'whatwg-fetch';

var rest = require('rest');
var ServerIP = 'http://193.196.37.135:8080';



var THECOMPONENT;
var queueTopic = 'QRCode-Read';
function subTopic() {
<<<<<<< HEAD
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
=======
    if(consumerCreated){
        console.log("Initialisiere Team-Subscriber");
        kafka.consumer("console-consumer-" + Math.round(Math.random() * 10000000000)).join({
            "format": "binary",
            "auto.commit.enable": "false",
            'auto.offset.reset' : 'smallest'
        }, function(err, consumer_instance) {
            CurrentConsumer =consumer_instance;
            //CurrentConsumerbest = consumer_instance;
            if (err) return console.log("Failed to create instance in consumer group: " + err);
            subTeam();

        });


        // Consumer for best Messsage

        console.log("Initialisiere BestQR-Subscriber");
        kafka.consumer("console-consumer-" + Math.round(Math.random() * 10000000000)).join({
            "format": "binary",
            "auto.commit.enable": "false",
            'auto.offset.reset': 'smallest'
        }, function (err, consumer_instance) {
            CurrentConsumerbest = consumer_instance;
            if (err) return console.log("Failed to create instance in consumer group: " + err);
            subBest();
        });

        consumerCreated = false;
    }else{
        subTeam();
        subBest();
    }





}
function subTeam(){

    //console.log("Consumer TEAM  instance initialized: " + CurrentConsumer.toString() + " TOPIC: " + queueTopic);
    var stream = CurrentConsumer.subscribe(queueTopic);
    stream.on('data', function(msgs) {
        console.log("YEAAA message TEAM : " + queueTopic);
        for(var i = 0; i < msgs.length; i++){
            //console.log(msgs[i].value.toString('utf8'));
            var jsonObject = JSON.parse(msgs[i].value);
            if (THECOMPONENT !== undefined) THECOMPONENT.setState({
                value: "" + jsonObject.QRCode,
                speed: jsonObject.Speed
            })
>>>>>>> 689a169dbc8f6abcf389b4bb8f1848dfbab4b6fd
        }
    });
    rest(ServerIP + '/getQRCode/' + THECOMPONENT.state.InputFieldvalue).then(function (response) {
        console.log('response: ', response.entity);
        var jsonObject = JSON.parse(response.entity.toString());
        console.log('response: ', jsonObject.qrcode);

        if (THECOMPONENT !== undefined) THECOMPONENT.setState({
            value: "" + jsonObject.qrcode,
            speed: jsonObject.speed
        })
    });
    new Promise(function () {
        setTimeout(subTopic, 2000);
    });

<<<<<<< HEAD
=======
    // Events are also emitted by the parent consumer_instance, so you can either consume individual streams separately
    // or multiple streams with one callback. Here we'll just demonstrate the 'end' event.
    CurrentConsumer.on('end', function() {
        console.log("Consumer instance closed.");
    });
}

function  subBest(){

    //console.log("Consumer BEST instance initialized: " + CurrentConsumerbest.toString() + " TOPIC: " + bestQRTopic);
    var stream = CurrentConsumerbest.subscribe(bestQRTopic);
    stream.on('data', function (msgs) {
        console.log("YEAAA BEST message");
        for (var i = 0; i < msgs.length; i++) {
            //console.log(msgs[i].value.toString('utf8'));
            var jsonObject = JSON.parse(msgs[i].value);
            if (THECOMPONENT !== undefined) THECOMPONENT.setState({
                bestcode: "" + jsonObject.QRCode,
                bestTeam: jsonObject.Team,
                bestSpeed: jsonObject.Speed
            })
        }


    });

    stream.on('error', function (err) {
        console.log("Consumer BEST instance reported an error: " + err);
        console.log("Attempting BEST to shut down consumer instance...");
        CurrentConsumerbest.shutdown(function logShutdown(err) {
                if (err)
                    console.log("Error BEST while shutting down: " + err);
                else
                    console.log("Shutdown BEST cleanly.");

            }

        );
        setTimeout(function() {
            // rest of code here
            //subBest();
        }, 5000);


        //new Promise(subTopic);

    });
    stream.on('end', function () {
        console.log("Consumer BEST stream closed.");
        setTimeout(function() {
            // rest of code here
            subBest();
        }, 5000);
    });

    // Events are also emitted by the parent consumer_instance, so you can either consume individual streams separately
    // or multiple streams with one callback. Here we'll just demonstrate the 'end' event.
    CurrentConsumerbest.on('end', function () {
        console.log("Consumer instance closed.");
    });
>>>>>>> 689a169dbc8f6abcf389b4bb8f1848dfbab4b6fd
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
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to QRCode display service</h1>
                </header>
                <p>
                    Gib hier deinen Team-Namen ein: <input value={this.state.InputFieldvalue}
                                                           onChange={this.updateInputValue}/>
                </p>


                <p className="App-intro">
                    Der letzte erhaltene QRCode: {this.state.value}
                </p>
                <p className="App-QRField">
                    Mit der aktuellen Geschwindigkeit von: {this.state.speed * 100}%
                </p>
                <p className="App-QRField">
                    <QRCode value={this.state.value} size={1.5 * 256}/>
                </p>

                <p className="App-QRField">
                    Aktuell bester empfangener QRCode kommt von Team: {this.state.bestTeam} mit der Geschwindigkeit
                    von: {this.state.bestSpeed * 100}%
                </p>
                <p className="App-QRField">
                    <QRCode value={this.state.bestcode} size={0.5 * 256}/>
                </p>

            </div>
        );


    }
    updateInputValue(evt){
        THECOMPONENT.setState({InputFieldvalue:evt.target.value});
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
