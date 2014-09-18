/**
 * Virtual DOM parser / serializer for Noting plugin.
 */

var TAG = 'gu:note';

var _ = require('lodash');

var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');

// There was a bug in vdom-virtualize that caused data attributes not
// to be virtualized. Have fixed this and got it merged upstream.
// No new release yet, however, so have specified the specific commit as
// dependency. Feel free to update to future versions when they're released.
var virtualize = require('vdom-virtualize');

var isVText = require('vtree/is-vtext');

var VFocus = require('./vfocus');


/**
 * Virtualises a DOMElement to a callback for mutation.
 * @param  {DOMElement}   domElement
 * @param  {Function} callback
 */
exports.mutate = function(domElement, callback) {

  var originalTree = virtualize(domElement);
  var tree = virtualize(domElement); // we'll mutate this one
  var treeFocus = new VFocus(tree);

  callback(treeFocus);

  // Then diff with the original tree and patch the DOM.
  var patches = diff(originalTree, tree);
  patch(domElement, patches);

};

exports.mutateScribe = function(scribe, callback) {
  var selection = new scribe.api.Selection();

  // Place markers and create virtual trees.
  // We'll use the markers to determine where a selection starts and ends.
  selection.placeMarkers();

  exports.mutate(scribe.el, function(treeFocus) {

    callback(treeFocus, selection);

  });

  // Place caret (necessary to do this explicitly for FF).
  // Currently works by selecting before and after real DOM elements, so
  // cannot use VDOM for this, yet.
  selection.selectMarkers();

  // We need to make sure we clean up after ourselves by removing markers
  // when we're done, as our functions assume there's either one or two
  // markers present.
  selection.removeMarkers();
};
