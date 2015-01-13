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
			forEachTreeFocus.forEach(node => nodesIds.push(node.vNode.properties.id));

			expect(nodesIds).to.deep.equal(expectedNodeIds);
		});

	});


	describe('flatten', function() {
		var flattenTree, rootVFocus, firstVFocus, secondVFocus, thirdVFocus, fourthVFocus;
		beforeEach(function() {
			flattenTree = h(
      	'div#0', [
        	h('p#1', [
          	h('b#2'),
          	h('i#3')
        	]),
        	h('p#4')
    	]);

    	rootVFocus = new VFocus(flattenTree);
    	firstVFocus = rootVFocus.next();
	    secondVFocus = firstVFocus.next();
	    thirdVFocus = secondVFocus.next();
	    fourthVFocus = thirdVFocus.next();
		});


		it('returns the right list of nodes in the right order', function(){
			var returnedNodeList = rootVFocus.flatten();
			var expectedNodeList = [rootVFocus, firstVFocus, secondVFocus, thirdVFocus, fourthVFocus];

			expect(returnedNodeList).to.deep.equal(expectedNodeList);
		});

	});


	describe('takeWhile', function() {
		var takeWhileTree, rootVFocus, firstVFocus, secondVFocus, thirdVFocus;
		beforeEach(function() {
			takeWhileTree = h(
      	'div#0', [
        	h('p#1', [
          	h('b#2'),
          	h('i#3')
        	]),
        	h('p')
    	]);

			rootVFocus = new VFocus(takeWhileTree);
    	firstVFocus = rootVFocus.next();
	    secondVFocus = firstVFocus.next();
	    thirdVFocus = secondVFocus.next();
		});

		it('returns the right list of node that have and id', function(){
			var expectedList = [rootVFocus, firstVFocus, secondVFocus, thirdVFocus];
			var returnedList = rootVFocus.takeWhile(vFocus => !!vFocus.vNode.properties.id);

			expect(returnedList).to.deep.equal(expectedList);
		});

	});


	describe('filter', function() {
		var filterTree, rootVFocus, firstVFocus, secondVFocus;
		beforeEach(function() {
			filterTree = h(
      	'div', [
        	h('p#1', [
          	h('b'),
          	h('i#3')
        	]),
        	h('p')
    	]);

			rootVFocus = new VFocus(filterTree);
    	firstVFocus = rootVFocus.next();
	    secondVFocus = firstVFocus.next().next();
		});

		it('filters the nodes having an id', function(){
			var expectedList = [firstVFocus, secondVFocus];
			var returnedList = rootVFocus.filter(vFocus => !!vFocus.vNode.properties.id);

			expect(returnedList).to.deep.equal(expectedList);

		});

	});


	describe('find', function() {
		var findTree, rootVFocus;
		beforeEach(function() {
			findTree = h(
      	'div', [
        	h('p#1', [
          	h('b'),
          	h('i#3')
        	]),
        	h('p')
    	]);

			rootVFocus = new VFocus(findTree);    	
		});

		it('finds the node with the expected id', function(){
			var expectedVFocus = rootVFocus.next().next().next();
			var foundVFocus = rootVFocus.find(vFocus => !!(vFocus.vNode.properties.id === '3'));

			expect(foundVFocus.vNode).to.equal(expectedVFocus.vNode);
		});

	});

});