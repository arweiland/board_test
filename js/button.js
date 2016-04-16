

function changeLED(led) {
    if (led.src.match("gray")) {
        led.src = "images/green.png";
        sendLEDChange( led.id, "green");
    } else if (led.src.match("green" )){
        led.src = "images/red.png";
		sendLEDChange( led.id, "red");
    } else if (led.src.match("red")){
    	led.src = "images/yellow.png";
    	sendLEDChange( led.id, "yellow");
    } else {
    	led.src = "images/gray.png";
    	sendLEDChange( led.id, "gray");
    }
};

function sendLEDChange( id, color )
{
	var xmlhttp = new XMLHttpRequest();
	var url = "LEDChange?" + "led=" + id + "&color=" + color;
	xmlhttp.onreadystatechange = function() {
    	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        	console.log( "LED change succeeded")
    	};
    }
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
};


function changeSwitch(sw) {
    if (sw.src.match("red")) {
        sw.src = "images/gray.png";
        sendSwitchChange( sw.id, "0");
    } else {
    	sw.src = "images/red.png";
    	sendSwitchChange( sw.id, "1");
    }
}

function sendSwitchChange( id, state )
{
	var xmlhttp = new XMLHttpRequest();
	var url = "SwitchChange?" + "switch=" + id + "&state=" + state;
	xmlhttp.onreadystatechange = function() {
    	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        	console.log( "Switch change succeeded")
    	}
    }
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
};



// This function called from onload event
function getStatus() {
	setInterval( getStatus1, 250 );
//	getStatus1();
};

function getStatus1() {
	var xmlhttp = new XMLHttpRequest();
	var url = "getStatus";
	xmlhttp.onreadystatechange = function() {
  	  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var myArr = JSON.parse(xmlhttp.responseText);
    	    myFunction(myArr);
    	}
    }
    xmlhttp.open("GET", url, true);
	xmlhttp.send();
	function myFunction(arr) {
	    proc_status( arr );
	}

};

function proc_status( status ) {
    for (var key in status) {
//	console.log( 'Stat: ' + key + ' = ' + status[ key ] );
	el = document.getElementById( key );
	if (status[ key ] == 0 ){
	    el.src = "images/gray.png";
	}else{
	    el.src = "images/red.png";
	}
    }
}

// test function
function getStatus2() {
	sw = document.getElementById( 'SWITCH1');
	changeSwitch( sw );
};










