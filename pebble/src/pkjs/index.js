require('pebblejs');
var Clay = require('./better-clay')
var UI = require('pebblejs/ui');
var Vector2 = require('pebblejs/lib/vector2');
var Accel = require('pebblejs/ui/accel');
var ajax = require('pebblejs/lib/ajax');

var clayConfig = require('./config.json');
var clay = new Clay(clayConfig);

function debug(content) {
  if(claySettings.debug) {
    console.log(content);
  }
}

function setupAccelerometer() {
  Accel.config({
    rate: claySettings.accelerometer_rate,
    samples: claySettings.accelerometer_samples
  });
}

function refreshWelcomeCard() {
  welcomeCard.body('\n[' + claySettings.identifier + ']\n\n' + claySettings.endpoint + '\n\n' + claySettings.accelerometer_samples + '@' + claySettings.accelerometer_rate + 'Hz');
}

var claySettings = clay.getSettings();

var welcomeCard = new UI.Card({
  title: 'Ckpd Accel',
  scrollable: false,
  status: false,
  action: {
    select: 'images/music_icon_play.png'
  }
});
refreshWelcomeCard();

var recordingCard = new UI.Window({
  status: false,
  backgroundColor: 'white',
  action: {
    select: 'images/music_icon_pause.png'
  }
});

var title = new UI.Text({
  text: 'Recording',
  font: 'gothic-28-bold',
  color: 'BLACK',
  textAlign: 'center',
  position: new Vector2(0, 0),
  size: new Vector2(114, 28)
});
recordingCard.add(title)

var diskImage = new UI.Image({
  position: new Vector2(32, 59),
  size: new Vector2(50, 50),
  image: 'IMAGE_FLOPPY',
  backgroundColor: 'clear'
});

// Update settings on webviewclosed
Pebble.addEventListener('webviewclosed', function(e) {
  debug('Received new settings from phone.');
  claySettings = clay.getSettings();
  refreshWelcomeCard();
  setupAccelerometer();
});

// Start recording
welcomeCard.on('click', function(e) {
  if(e.button + 'select') {
    recordingCard.show();
  }
});

// Stop recording
recordingCard.on('click', function(e) {
  if(e.button + 'select') {
    recordingCard.hide();
  }
});

var sendingPeriodMs = 1000 / claySettings.accelerometer_rate * claySettings.accelerometer_samples;
debug('Sending period: ' + sendingPeriodMs);

// Setup recording when on the recording screen
setupAccelerometer();
recordingCard.on('accelData', function(e) {
  debug('Just received ' + e.samples + ' from the accelerometer.');
  recordingCard.add(diskImage);
  setTimeout(function() {
    diskImage.remove();
  }, Number.parseInt(sendingPeriodMs / 2));

  ajax(
    {
      url: claySettings.endpoint,
      type: 'json',
      method: 'post',
      data: { watch_id: claySettings.identifier, accels: e.accels }
    },
    function(data) {
      debug('Sent ' + e.samples + ' samples to the server.');
    },
    function(data) {
      console.log('Could not send data to ' + claySettings.endpoint);
    }
  );
});

welcomeCard.show();
