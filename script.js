
let serial;
let portSelector;
let powerButton;
let slider;
let lastButtonState = 0;
let brightness;


function setup(event) {
    console.log('page is loaded');
  
    powerButton = document.getElementById('power');
    powerButton.addEventListener('click', turnOnOff);
  
    slider = document.getElementById('fanSpeed');
    slider.addEventListener('change', setFanSpeed);
  
    brightness = document.getElementById('brightness');
    brightness.addEventListener('change', changeBrightness);



  // set an interval function to run once a second:
   setInterval(setTime, 1000);
   
   // serial port
    serial = new p5.SerialPort(); // new instance of the serialport library
    serial.on('list', printList); // callback function for serialport list event
    serial.on('data', serialEvent); // callback function for serialport data event
    serial.list(); // list the serial ports

    turnOnOff();
    setFanSpeed();
    changeBrightness();
  }

function printList(portList) {
    // create a select object:
    portSelector = document.getElementById('serialport')
    // portList is an array of serial port names
    for (var i = 0; i < portList.length; i++) {
      // add this port name to the select object:
      var option = document.createElement("option");
      option.text = portList[i];
      portSelector.add(option);
    }
    // set an event listener for when the port is changed:
    portSelector.addEventListener('change', openPort);
  }

  function openPort() {
      let item = portSelector.value;
      if (serial.serialport != null) {
          serial.close();
      }
      serial.open(item);
  }

 
  function turnOnOff(event) {
    let thisButton = powerButton;
    if (thisButton.value == 'turn off') {
      thisButton.value = 'turn on';
        document.getElementById("bg").style.backgroundColor = "gray";
        document.getElementById("fanSpeed").style.background = "gray";
        

    } else {
      thisButton.value = 'turn off';
        document.getElementById("bg").style.backgroundColor = "#2e65fe";
  
    }
  }



function setFanSpeed(e) {
 let currentValue = e;
   if (typeof e == 'object') {
     currentValue = e.target.value;
   } 
   slider.value = currentValue;

  if(currentValue > 750){
    document.body.style.backgroundColor = "white";
  }else if(currentValue > 500 && currentValue < 750){
    document.body.style.backgroundColor = "gray";
  }
  else if(currentValue > 250 && currentValue < 500){
    document.body.style.backgroundColor = "dimgray";
  }
  else if(currentValue < 250){
    document.body.style.backgroundColor = "black";
  }
  //  document.body.style.backgroundColor = bgcolor;


 }

 function changeBrightness(b) {
  let currentValue2 = b;
   if (typeof b == 'object') {
     currentValue2 = b.target.value;
   } 

   if(currentValue2 > 275){
    document.getElementById("brightness").style.filter = "brightness(100%)";
  }else if(currentValue2 < 275){
    document.getElementById("brightness").style.filter = "brightness(50%)";
  }
  }
  
  function setTime() {
    let now = new Date().toTimeString();
    let timeSpan = document.getElementById('time');
    timeSpan.innerHTML = now;
  }

  function serialEvent() {
    let inData = serial.readLine();
    console.log (serial.readLine());
    if (inData) {
        var sensors = JSON.parse(inData);
        if (sensors.button !== lastButtonState) {
          if (sensors.button === 0) {
            turnOnOff(sensors.button);
          }
          lastButtonState = sensors.button;
        }
        setFanSpeed(sensors.knob);
        changeBrightness(sensors.light);
    }
  }
  
  window.addEventListener('DOMContentLoaded', setup);
  