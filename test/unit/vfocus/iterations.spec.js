var path = require('path');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

describe('VFocus - Iterations', function() {


	describe('forEach', function() {
		var forEachTree, forEachTreeFocus;
		beforeEach(function() {
			forEachTree = h(
      	'div#0', [
        	h('p#1', [
          	h('b#2'),
          	h('i#3')
        	]),
        	h('p#4')
    	]);
    
    	forEachTreeFocus = new VFocus(forEachTree);
		});


		it('iterates through the right nodes in the right order', function(){
			var nodesIds = [];
			var expectedNodeIds = ['0', '1', '2', '3', '4'];
			forEachTreeFocus.forEach(function(node){
				nodesIds.push(node.vNode.properties.id);
			});

			expect(nodesIds).to.deep.equal(expectedNodeIds);
		});

	});


	describe('flatten', function() {
		var flattenTree, rootNodeFocus, firstNodeFocus, secondNodeFocus, thirdNodeFocus, fourthNodeFocus;
		beforeEach(function() {
			flattenTree = h(
      	'div#0', [
        	h('p#1', [
          	h('b#2'),
          	h('i#3')
        	]),
        	h('p#4')
    	]);

    	rootNodeFocus = new VFocus(flattenTree);
    	firstNodeFocus = rootNodeFocus.next();
	    secondNodeFocus = firstNodeFocus.next();
	    thirdNodeFocus = secondNodeFocus.next();
	    fourthNodeFocus = thirdNodeFocus.next();
		});


		it('returns the right list of nodes in the right order', function(){
			var returnedNodeList = rootNodeFocus.flatten();
			var expectedNodeList = [rootNodeFocus, firstNodeFocus, secondNodeFocus, thirdNodeFocus, fourthNodeFocus];

			expect(returnedNodeList).to.deep.equal(expectedNodeList);
		});

	});


	describe('takeWhile', function() {

		beforeEach(function() {

		});

		it('', function(){

		});

	});


	describe('filter', function() {

		beforeEach(function() {

		});

		it('', function(){

		});

	});


	describe('find', function() {

		beforeEach(function() {

		});

		it('', function(){

		});

	});

});