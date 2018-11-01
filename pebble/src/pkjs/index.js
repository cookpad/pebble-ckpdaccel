require('pebblejs');
var Clay = require('pebble-clay');

var clayConfig = require('./config.json');
var clay = new Clay(clayConfig);

function getClaySettings() {
  return JSON.parse(localStorage.getItem('clay-settings'));
}

var claySettings = getClaySettings();
