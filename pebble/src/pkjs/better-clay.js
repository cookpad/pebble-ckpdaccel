var Clay = require('pebble-clay');

Clay.prototype.getDefaults = function(localConfig, defaults) {
  if (typeof(defaults) == 'undefined' || !defaults) {
    defaults = {};
  }
  var self = this;
  if (typeof(localConfig) == 'undefined') {
    localConfig = self.config;
  }

  localConfig.forEach(function(element) {
    if (element.type == 'section') {
      self.getDefaults(element.items, defaults);
    } else if (element.messageKey) {
      defaults[element.messageKey] = element.defaultValue;
    }
  });
  return defaults;
}

Clay.prototype.originalGetSettings = Clay.prototype.getSettings;

Clay.prototype.getSettings = function(response, convert) {
  if (typeof(response) == 'undefined') {
    return JSON.parse(localStorage.getItem('clay-settings')) || this.getDefaults();
  }

  return this.originalGetSettings(response, convert);
};

module.exports = Clay;
