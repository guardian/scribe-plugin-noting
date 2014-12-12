var DATA_NAME_CAMEL = 'noteEditedBy';
var DATA_DATE_CAMEL = 'noteEditedDate';

var config = require('../config');

module.exports = function getUKDate(data){

  data = (data || {});

  var date = data[DATA_DATE_CAMEL]
    ? new Date(data[DATA_DATE_CAMEL])
    : new Date();

  var name = config.get('user');

  // crude formatting avoids a "momentjs" dependency - should be adequate
  // forced UK formatted time in local timezone:  dd/MM/YYYY at hh:mm
  var formattedDate = [
    date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
    'at',
    date.getHours() + ':' + (date.getMinutes() < 9 ? '0' : '') + date.getMinutes()
  ].join(' ');

  return name + ' ' + formattedDate;

};
