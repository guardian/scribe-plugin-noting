/**
* VFocus: Wrap virtual node in a Focus node.
*
* Makes it possible to move around as you wish in the tree.
*
* vNode: the vNode to focus on
* parent: parent vFocus
*/

module.exports = VFocus;


function VFocus(vNode, parent) {
  // Don't change these references pretty please
  this.vNode = vNode;
  this.parent = parent;
};

VFocus.prototype.index = function (){
  return this.parent.vNode.children.indexOf(this.vNode);
}

/**
* Internally useful
*/

VFocus.prototype.rightVNode = function() {
  if (this.isRoot()) return null;

  var rightVNodeIndex = this.index() + 1;
  return this.parent.vNode.children[rightVNodeIndex];
};

VFocus.prototype.leftVNode = function() {
  if (this.isRoot()) return null;

  var leftVNodeIndex = this.index() - 1;
  return leftVNodeIndex >= 0 ? this.parent.vNode.children[leftVNodeIndex] : null;
};


/**
* Checks
*/

VFocus.prototype.isRoot = function() {
  return ! this.parent;
};

VFocus.prototype.canRight = function() {
  return !!this.rightVNode();
};

VFocus.prototype.canLeft = function() {
  return !!this.leftVNode();
};

VFocus.prototype.canDown = function() {
  return this.vNode.children && this.vNode.children.length ? true : false;
};

VFocus.prototype.canUp = function() {
  return ! this.isRoot();
};


/**
* Movements
*/

// Focus next (pre-order)
VFocus.prototype.next = function() {
  function upThenRightWhenPossible(vFocus) {
    // Terminate if we've visited all nodes.
    if (!vFocus) return null;

    return vFocus.right() || upThenRightWhenPossible(vFocus.up());
  }

  return this.down() || this.right() || upThenRightWhenPossible(this);
};

// Focus previous (pre-order)
VFocus.prototype.prev = function() {
  function downFurthestRight(vFocus) {
    function furthestRight(vFocus) {
      var focus = vFocus;
      while (focus.canRight()) { focus = focus.right(); }
      return focus;
    }

    return vFocus.canDown() ? downFurthestRight(vFocus.down()) : furthestRight(vFocus);
  }

  var focus;
  if (this.left() && this.left().down()) {
    focus = downFurthestRight(this.left());
  } else if (this.left()) {
    focus = this.left();
  } else {
    focus = this.up();
  }

  return focus;
};

// Focus first child
VFocus.prototype.down = function() {
  if (! this.canDown()) return null;

  return new VFocus(this.vNode.children[0], this);
};

// Focus parent
VFocus.prototype.up = function() {
  if (! this.canUp()) return null;

  return this.parent;
};

// Focus node to the right (on the same level)
VFocus.prototype.right = function() {
  if (! this.canRight()) return null;

  return new VFocus(this.rightVNode(), this.parent);
};

// Focus node to the left (on the same level)
VFocus.prototype.left = function() {
  if (! this.canLeft()) return null;

  return new VFocus(this.leftVNode(), this.parent);
};

VFocus.prototype.top = function() {
  return this.canUp() ? this.parent.top() : this;
};


/**
* Mutating operations
*/

// Replace `this.vNode` and return `this` to enable chaining.
// Note that this mutates the tree.
VFocus.prototype.replace = function(replacementVNode) {
  if (this.isRoot()) {
    // Replace and focus on the replacement.
    this.vNode = replacementVNode;
  } else {
    // Replace the object in the tree we're focusing on.
    var vNodeIndex = this.index();
    this.parent.vNode.children.splice(vNodeIndex, 1, replacementVNode);

    // And focus on the replacement.
    this.vNode = replacementVNode;
  }

  return this;
};

// Remove `this.vNode`, i.e. remove the reference from the tree.
VFocus.prototype.remove = function() {
  if (this.isRoot()) {
    // No can do. Should maybe raise an exception.
  } else {
    var vNodeIndex = this.index();
    this.parent.vNode.children.splice(vNodeIndex, 1);
  }

  return this;
};

VFocus.prototype.insertBefore = function(newVNodes) {
  var newVNodes = newVNodes instanceof Array ? newVNodes : [newVNodes];

  if (this.isRoot()) {
    // No can do. Should maybe raise an exception.
  } else {
    var siblings = this.parent.children();
    var vNodeIndex = this.index();

    // Insert before ourself.
    newVNodes.reverse().forEach(function (vNode) {
      siblings.splice(vNodeIndex, 0, vNode);
    });
  }

  return this;
};

VFocus.prototype.insertAfter = function(newVNodes) {
  var newVNodes = newVNodes instanceof Array ? newVNodes : [newVNodes];

  if (this.isRoot()) {
    // No can do. Should maybe raise an exception.
  } else {
    var siblings = this.parent.children();
    var vNodeIndex = this.index();

    if (siblings.length === vNodeIndex + 1) {
      // Last element of array
      siblings = siblings.concat(newVNodes);
      this.parent.vNode.children = siblings;
    } else {
      // Insert before the next sibling.
      newVNodes.reverse().forEach(function (vNode) {
        siblings.splice(vNodeIndex + 1, 0, vNode);
      });
    }
  }

  return this;
};

// If the tree has been mutated and parent/vNode references not been updated
// a VFocus might not refer to its "correct" parent. This will update our
// `this.parent` reference.
//
// Note: If you have to use this method you should probably figure out how
// your mutating function can change parent references to correctly reflect
// the tree you're focusing on.
VFocus.prototype.refresh = function() {
  var self = this;
  function myself(focus) { return focus.vNode === self.vNode }

  // Traverse the tree until we end up focusing on `this.vNode`.
  var me = this.top().find(myself);

  // Now we know who our parent is, so we update this object's parent
  // reference.
  this.parent = me.parent;

  return this;
};


/**
* Iteration methods
*/

VFocus.prototype.forEach = function(fn) {
  var node = this;
  while (node) {
    fn(node);
    node = node.next();
  }
};

// Flatten `this` and all nodes after, returning a list
VFocus.prototype.flatten = function(replacementVNode) {
  var focuses = [];
  this.forEach(function(focus) { focuses.push(focus); });

  return focuses;
};

// Take while condition is true. Return list.
// predicate: function that receives the current item
//       and returns true/false.
VFocus.prototype.takeWhile = function(predicate, movement) {
  var movement = movement || 'next';

  var focus = this;
  var acc = [];
  while (focus && predicate(focus)) {
    acc.push(focus);
    focus = focus[movement]();
  }
  return acc;
};

VFocus.prototype.filter = function(predicate, movement) {
  var movement = movement || 'next';

  var results = [];
  this.forEach(function(focus) {
    if (predicate(focus)) results.push(focus);
  }, movement);

  return results;
};

// Find focus satisfying predicate.
// predicate: function that takes a focus and returns true/false.
// movement: string name of one of the movement functions, e.g. 'up' or 'prev'.
// If nothing is found null is returned (as we step off the tree).
VFocus.prototype.find = function(predicate, movement) {
  var movement = movement || 'next';
  var focus = this;

  while (focus) {
    if (predicate(focus)) break;
    focus = focus[movement]();
  }

  return focus;
};

VFocus.prototype.children = function(){
  return this.vNode.children;
};

VFocus.prototype.addChild = function(child){
  this.vNode.children.push(child);
};

VFocus.prototype.indexOf = function(focus){
  //if we are passing a VFocus use the vNode
  var vNode = (focus.vNode || focus);
  return this.children().indexOf(vNode);
}

VFocus.prototype.spliceChildren = function(){
  return this.children().splice.apply(this, arguments);
};
