var express = require("express");
var app = express();

// export GPIO 5 as an output.
var GPIO = require('onoff').Gpio,
    PA_red_led = new GPIO(23, 'out' ),
    PA_green_led = new GPIO(24, 'out' ),
    radio_red_led = new GPIO(20, 'out' ),
    radio_green_led = new GPIO(21, 'out' ),
    heart_red_led = new GPIO(16, 'out' ),
    heart_green_led = new GPIO(12, 'out' ),
    vol_green_led = new GPIO(25, 'out' ),
    PA_PTT_ctl = new GPIO(27, 'out' ),
    PA_sel_ctl = new GPIO(7, 'out' ),
    radio_PTT_ctl = new GPIO(13, 'out' ),
    radio_chan1_ctl = new GPIO(5, 'out' ),
    radio_chan2_ctl = new GPIO(6, 'out' ),
    vol_up_stat = new GPIO(26, 'in', 'both' ),
    vol_dn_stat = new GPIO(18, 'in', 'both' ),
    PA_busy_stat = new GPIO(22, 'in', 'both' ),
    PA_VOX_stat = new GPIO(8, 'in', 'both' ),
    radio_busy_stat = new GPIO(19, 'in', 'both' );


 var options = {
    root: __dirname,
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

 /* serves main page */
app.get("/", function(req, res) {
     res.sendFile('index.html', options)
 });

app.get("/SwitchChange", function(req, res) {
    console.log('Got switch change request.  Switch: ' + req.query.switch + ' State:', req.query.state);
    ctrl_set( req.query.switch, req.query.state );
    res.send("OK");
});

app.get("/LEDChange", function(req, res) {
    console.log('Got LED change request.  LED: ' + req.query.led + ' Color:', req.query.color);
    //    toggle( req.query.led, req.query.color );
    led_set( req.query.led, req.query.color );
    res.send("OK");
});

app.get("/getStatus", function(req, res) {
    var stat = JSON.stringify({VOL_UP:vol_up, VOL_DN:vol_dn, PA_BUSY:PA_busy, PA_VOX:PA_VOX, RADIO_BUSY:radio_busy});
    res.setHeader('Content-Type', 'application/json');
    res.send( stat );
//    console.log( 'status: ' + stat );
//    res.send(JSON.stringify({button1:2, button2:4}));
});


app.post("/user/add", function(req, res) { 
    res.send("OK");
 });
 
 /* serves all the static files */
app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.path);
     res.sendFile( req.params[0], options); 
 });
 
 var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
 });


// Set the LED colors on the board

var ios = { 'LED1': [vol_green_led, vol_green_led],
	    'LED2':[heart_green_led, heart_red_led],
	    'LED3':[PA_green_led, PA_red_led],
	    'LED4':[radio_green_led, radio_red_led]};
var led_state = {'gray':[0,0], 'green':[1,0], 'red':[0,1], 'yellow':[1,1]};

function led_set( led_str, color_str ){
    try{
	var led = ios[ led_str ];               // LED GPIOS
	var states = led_state[ color_str ];    // LED states
	led[0].writeSync( states[0] );          // green LED
	led[1].writeSync( states[1] );          // red LED
    }
    catch( err ){
	console.log( "Error: " + err );
    }
};


var ctrls = {'SWITCH1':PA_PTT_ctl,
	     'SWITCH2':PA_sel_ctl,
	     'SWITCH3':radio_PTT_ctl,
	     'SWITCH4':radio_chan1_ctl,
	     'SWITCH5':radio_chan2_ctl};

// The following controls active level of the controls

var ctrl_states = {'SWITCH1':[0,1],             // PA PTT is active high
		   'SWITCH2':[0,1],             // PA select is high to select Pi
		   'SWITCH3':[0,1],             // Radio PTT is active high
		   'SWITCH4':[0,1],             // Radio chan1 is active high
		   'SWITCH5':[0,1]};            // Radio chan2 is active high

function ctrl_set( ctrl_str, state ){
    try{
	var ctrl = ctrls[ ctrl_str ];
	var level = ctrl_states[ ctrl_str ][ Number(state) ]	
	ctrl.writeSync( level );
    }
    catch( err ){
	console.log( "Error in ctrl_set: " + err );
    }
};


// current status values

var vol_up, vol_dn, PA_busy, PA_VOX, radio_busy;

init_stat();

function init_stat(){
    vol_up = !vol_up_stat.readSync();
    vol_dn = !vol_dn_stat.readSync();
    PA_busy = !PA_busy_stat.readSync();
    PA_VOX = PA_VOX_stat.readSync();
    radio_busy = radio_busy_stat.readSync();
};

vol_up_stat.watch( function(err, state) {
    vol_up = !state;
    console.log( "Vol up went to state " + vol_up );
});

vol_dn_stat.watch( function(err, state) {
    vol_dn = !state;
    console.log( "Vol dn went to state " + vol_dn );
});

PA_busy_stat.watch( function(err, state){
    PA_busy = !state;
    console.log( "PA busy went to state " + PA_busy );   
});

PA_VOX_stat.watch( function(err, state){
    pa_VOX = state;
    console.log( "PA VOX  went to state " + PA_VOX );   
});
 
radio_busy_stat.watch( function(err, state){
    radio_busy = state;
    console.log( "radio busy went to state " + radio_busy );   
});


//setInterval(function() {
//    vol_up = vol_up_sw.readSync();
//    console.log( "Vol up state: " + vol_up );
//}, 1000 );

