var h= require('virtual-hyperscript');
var isNote = require('./src/utils/noting/is-note');
var vFocus = require('./src/vfocus')

var d = h('div');
var df = new vFocus(d);
var note = new vFocus(h('gu-note'));

console.log('-----------------------');
console.log(d, note);
console.log('-----------------------');


console.log(isNote(df));
console.log(isNote(note));
