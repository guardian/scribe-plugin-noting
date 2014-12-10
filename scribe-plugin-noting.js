!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.scribePluginNoting=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
/*!
* vdom-virtualize
* Copyright 2014 by Marcel Klehr <mklehr@gmx.net>
*
* (MIT LICENSE)
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/
var VNode = require("vtree/vnode")
  , VText = require("vtree/vtext")

module.exports = createVNode

function createVNode(domNode, key) {
  key = key || null // XXX: Leave out `key` for now... merely used for (re-)ordering

  if(domNode.nodeType == 1) return createFromElement(domNode, key)
  if(domNode.nodeType == 3) return createFromTextNode(domNode, key)
  return
}

createVNode.fromHTML = function(html, key) {
  var domNode = document.createElement('div'); // create container
  domNode.innerHTML = html; // browser parses HTML into DOM tree
  domNode = domNode.children[0] || domNode; // select first node in tree
  return createVNode(domNode, key);
};

function createFromTextNode(tNode) {
  return new VText(tNode.nodeValue)
}


function createFromElement(el) {
  var tagName = el.tagName
  , namespace = el.namespaceURI == 'http://www.w3.org/1999/xhtml'? null : el.namespaceURI
  , properties = getElementProperties(el)
  , children = []

  for (var i = 0; i < el.childNodes.length; i++) {
    children.push(createVNode(el.childNodes[i]/*, i*/))
  }

  return new VNode(tagName, properties, children, null, namespace)
}


function getElementProperties(el) {
  var obj = {}

  props.forEach(function(propName) {
    if(!el[propName]) return

    // Special case: style
    // .style is a DOMStyleDeclaration, thus we need to iterate over all
    // rules to create a hash of applied css properties.
    //
    // You can directly set a specific .style[prop] = value so patching with vdom
    // is possible.
    if("style" == propName) {
      var css = {}
        , styleProp
      for(var i=0; i<el.style; i++) {
        styleProp = el.style[i]
        css[styleProp] = el.style.getPropertyValue(styleProp) // XXX: add support for "!important" via getPropertyPriority()!
      }

      obj[propName] = css
      return
    }

    // Special case: dataset
    // we can iterate over .dataset with a simple for..in loop.
    // The all-time foo with data-* attribs is the dash-snake to camelCase
    // conversion.
    // However, I'm not sure if this is compatible with h()
    //
    // .dataset properties are directly accessible as transparent getters/setters, so
    // patching with vdom is possible.
    if("dataset" == propName) {
      var data = {}
      for(var p in el.dataset) {
        data[p] = el.dataset[p]
      }

      obj[propName] = data
      return
    }
    
    // Special case: attributes
    // some properties are only accessible via .attributes, so 
    // that's what we'd do, if vdom-create-element could handle this.
    if("attributes" == propName) return
    

    // default: just copy the property
    obj[propName] = el[propName]
    return
  })

  return obj
}

/**
 * DOMNode property white list
 * Taken from https://github.com/Raynos/react/blob/dom-property-config/src/browser/ui/dom/DefaultDOMPropertyConfig.js
 */
var props =

module.exports.properties = [
 "accept"
,"accessKey"
,"action"
,"alt"
,"async"
,"autoComplete"
,"autoPlay"
,"cellPadding"
,"cellSpacing"
,"checked"
,"className"
,"colSpan"
,"content"
,"contentEditable"
,"controls"
,"crossOrigin"
,"data"
,"dataset"
,"defer"
,"dir"
,"download"
,"draggable"
,"encType"
,"formNoValidate"
,"href"
,"hrefLang"
,"htmlFor"
,"httpEquiv"
,"icon"
,"id"
,"label"
,"lang"
,"list"
,"loop"
,"max"
,"mediaGroup"
,"method"
,"min"
,"multiple"
,"muted"
,"name"
,"noValidate"
,"pattern"
,"placeholder"
,"poster"
,"preload"
,"radioGroup"
,"readOnly"
,"rel"
,"required"
,"rowSpan"
,"sandbox"
,"scope"
,"scrollLeft"
,"scrolling"
,"scrollTop"
,"selected"
,"span"
,"spellCheck"
,"src"
,"srcDoc"
,"srcSet"
,"start"
,"step"
,"style"
,"tabIndex"
,"target"
,"title"
,"type"
,"value"

// Non-standard Properties
,"autoCapitalize"
,"autoCorrect"
,"property"

, "attributes"
]

var attrs =
module.exports.attrs = [
 "allowFullScreen"
,"allowTransparency"
,"charSet"
,"cols"
,"contextMenu"
,"dateTime"
,"disabled"
,"form"
,"frameBorder"
,"height"
,"hidden"
,"maxLength"
,"role"
,"rows"
,"seamless"
,"size"
,"width"
,"wmode"

// SVG Properties
,"cx"
,"cy"
,"d"
,"dx"
,"dy"
,"fill"
,"fx"
,"fy"
,"gradientTransform"
,"gradientUnits"
,"offset"
,"points"
,"r"
,"rx"
,"ry"
,"spreadMethod"
,"stopColor"
,"stopOpacity"
,"stroke"
,"strokeLinecap"
,"strokeWidth"
,"textAnchor"
,"transform"
,"version"
,"viewBox"
,"x1"
,"x2"
,"x"
,"y1"
,"y2"
,"y"
]

},{"vtree/vnode":7,"vtree/vtext":8}],3:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook && typeof hook.hook === "function" &&
        !hook.hasOwnProperty("hook")
}

},{}],4:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":6}],5:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],6:[function(require,module,exports){
module.exports = "1"

},{}],7:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property)) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-vhook":3,"./is-vnode":4,"./is-widget":5,"./version":6}],8:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":6}],9:[function(require,module,exports){
var diff = require("vtree/diff")

module.exports = diff

},{"vtree/diff":42}],10:[function(require,module,exports){
module.exports = isObject

function isObject(x) {
    return typeof x === "object" && x !== null
}

},{}],11:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("vtree/is-vhook")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, props, previous, propName);
        } else if (isHook(propValue)) {
            propValue.hook(node,
                propName,
                previous ? previous[propName] : undefined)
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else if (propValue !== undefined) {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, props, previous, propName) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"is-object":10,"vtree/is-vhook":45}],12:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("vtree/is-vnode")
var isVText = require("vtree/is-vtext")
var isWidget = require("vtree/is-widget")
var handleThunk = require("vtree/handle-thunk")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"./apply-properties":11,"global/document":14,"vtree/handle-thunk":43,"vtree/is-vnode":46,"vtree/is-vtext":47,"vtree/is-widget":48}],13:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],14:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],15:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("vtree/is-widget")
var VPatch = require("vtree/vpatch")

var render = require("./create-element")
var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = render(vText, renderOptions)

        if (parentNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    destroyWidget(domNode, leftVNode)

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    if (updateWidget(leftVNode, widget)) {
        return widget.update(leftVNode, domNode) || domNode
    }

    var parentNode = domNode.parentNode
    var newWidget = render(widget, renderOptions)

    if (parentNode) {
        parentNode.replaceChild(newWidget, domNode)
    }

    destroyWidget(domNode, leftVNode)

    return newWidget
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = render(vNode, renderOptions)

    if (parentNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    destroyWidget(domNode, leftVNode)

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, bIndex) {
    var children = []
    var childNodes = domNode.childNodes
    var len = childNodes.length
    var i
    var reverseIndex = bIndex.reverse

    for (i = 0; i < len; i++) {
        children.push(domNode.childNodes[i])
    }

    var insertOffset = 0
    var move
    var node
    var insertNode
    for (i = 0; i < len; i++) {
        move = bIndex[i]
        if (move !== undefined && move !== i) {
            // the element currently at this index will be moved later so increase the insert offset
            if (reverseIndex[i] > i) {
                insertOffset++
            }

            node = children[move]
            insertNode = childNodes[i + insertOffset] || null
            if (node !== insertNode) {
                domNode.insertBefore(node, insertNode)
            }

            // the moved element came from the front of the array so reduce the insert offset
            if (move < i) {
                insertOffset--
            }
        }

        // element at this index is scheduled to be removed so increase insert offset
        if (i in bIndex.removes) {
            insertOffset++
        }
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        console.log(oldRoot)
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"./apply-properties":11,"./create-element":12,"./update-widget":17,"vtree/is-widget":48,"vtree/vpatch":52}],16:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches) {
    return patchRecursive(rootNode, patches)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions) {
        renderOptions = { patch: patchRecursive }
        if (ownerDocument !== document) {
            renderOptions.document = ownerDocument
        }
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./dom-index":13,"./patch-op":15,"global/document":14,"x-is-array":18}],17:[function(require,module,exports){
var isWidget = require("vtree/is-widget")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"vtree/is-widget":48}],18:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],19:[function(require,module,exports){
var patch = require("vdom/patch")

module.exports = patch

},{"vdom/patch":16}],20:[function(require,module,exports){
var DataSet = require("data-set")

module.exports = DataSetHook;

function DataSetHook(value) {
    if (!(this instanceof DataSetHook)) {
        return new DataSetHook(value);
    }

    this.value = value;
}

DataSetHook.prototype.hook = function (node, propertyName) {
    var ds = DataSet(node)
    var propName = propertyName.substr(5)

    ds[propName] = this.value;
};

},{"data-set":25}],21:[function(require,module,exports){
var DataSet = require("data-set")

module.exports = DataSetHook;

function DataSetHook(value) {
    if (!(this instanceof DataSetHook)) {
        return new DataSetHook(value);
    }

    this.value = value;
}

DataSetHook.prototype.hook = function (node, propertyName) {
    var ds = DataSet(node)
    var propName = propertyName.substr(3)

    ds[propName] = this.value;
};

},{"data-set":25}],22:[function(require,module,exports){
module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],23:[function(require,module,exports){
var VNode = require("vtree/vnode.js")
var VText = require("vtree/vtext.js")
var isVNode = require("vtree/is-vnode")
var isVText = require("vtree/is-vtext")
var isWidget = require("vtree/is-widget")
var isHook = require("vtree/is-vhook")
var isVThunk = require("vtree/is-thunk")
var TypedError = require("error/typed")

var parseTag = require("./parse-tag.js")
var softSetHook = require("./hooks/soft-set-hook.js")
var dataSetHook = require("./hooks/data-set-hook.js")
var evHook = require("./hooks/ev-hook.js")

var UnexpectedVirtualElement = TypedError({
    type: "virtual-hyperscript.unexpected.virtual-element",
    message: "Unexpected virtual child passed to h().\n" +
        "Expected a VNode / Vthunk / VWidget / string but:\n" +
        "got a {foreignObjectStr}.\n" +
        "The parent vnode is {parentVnodeStr}.\n" +
        "Suggested fix: change your `h(..., [ ... ])` callsite.",
    foreignObjectStr: null,
    parentVnodeStr: null,
    foreignObject: null,
    parentVnode: null
})

module.exports = h

function h(tagName, properties, children) {
    var childNodes = []
    var tag, props, key, namespace

    if (!children && isChildren(properties)) {
        children = properties
        props = {}
    }

    props = props || properties || {}
    tag = parseTag(tagName, props)

    // support keys
    if ("key" in props) {
        key = props.key
        props.key = undefined
    }

    // support namespace
    if ("namespace" in props) {
        namespace = props.namespace
        props.namespace = undefined
    }

    // fix cursor bug
    if (tag === "input" &&
        "value" in props &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value)
    }

    var keys = Object.keys(props)
    var propName, value
    for (var j = 0; j < keys.length; j++) {
        propName = keys[j]
        value = props[propName]
        if (isHook(value)) {
            continue
        }

        // add data-foo support
        if (propName.substr(0, 5) === "data-") {
            props[propName] = dataSetHook(value)
        }

        // add ev-foo support
        if (propName.substr(0, 3) === "ev-") {
            props[propName] = evHook(value)
        }
    }

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props)
    }


    var node = new VNode(tag, props, childNodes, key, namespace)

    return node
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === "string") {
        childNodes.push(new VText(c))
    } else if (isChild(c)) {
        childNodes.push(c)
    } else if (Array.isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props)
        }
    } else if (c === null || c === undefined) {
        return
    } else {
        throw UnexpectedVirtualElement({
            foreignObjectStr: JSON.stringify(c),
            foreignObject: c,
            parentVnodeStr: JSON.stringify({
                tagName: tag,
                properties: props
            }),
            parentVnode: {
                tagName: tag,
                properties: props
            }
        })
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x)
}

function isChildren(x) {
    return typeof x === "string" || Array.isArray(x) || isChild(x)
}

},{"./hooks/data-set-hook.js":20,"./hooks/ev-hook.js":21,"./hooks/soft-set-hook.js":22,"./parse-tag.js":41,"error/typed":32,"vtree/is-thunk":33,"vtree/is-vhook":34,"vtree/is-vnode":35,"vtree/is-vtext":36,"vtree/is-widget":37,"vtree/vnode.js":39,"vtree/vtext.js":40}],24:[function(require,module,exports){
module.exports = createHash

function createHash(elem) {
    var attributes = elem.attributes
    var hash = {}

    if (attributes === null || attributes === undefined) {
        return hash
    }

    for (var i = 0; i < attributes.length; i++) {
        var attr = attributes[i]

        if (attr.name.substr(0,5) !== "data-") {
            continue
        }

        hash[attr.name.substr(5)] = attr.value
    }

    return hash
}

},{}],25:[function(require,module,exports){
var createStore = require("weakmap-shim/create-store")
var Individual = require("individual")

var createHash = require("./create-hash.js")

var hashStore = Individual("__DATA_SET_WEAKMAP@3", createStore())

module.exports = DataSet

function DataSet(elem) {
    var store = hashStore(elem)

    if (!store.hash) {
        store.hash = createHash(elem)
    }

    return store.hash
}

},{"./create-hash.js":24,"individual":26,"weakmap-shim/create-store":27}],26:[function(require,module,exports){
(function (global){
var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual

function Individual(key, value) {
    if (root[key]) {
        return root[key]
    }

    Object.defineProperty(root, key, {
        value: value
        , configurable: true
    })

    return value
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],27:[function(require,module,exports){
var hiddenStore = require('./hidden-store.js');

module.exports = createStore;

function createStore() {
    var key = {};

    return function (obj) {
        if (typeof obj !== 'object' || obj === null) {
            throw new Error('Weakmap-shim: Key must be object')
        }

        var store = obj.valueOf(key);
        return store && store.identity === key ?
            store : hiddenStore(obj, key);
    };
}

},{"./hidden-store.js":28}],28:[function(require,module,exports){
module.exports = hiddenStore;

function hiddenStore(obj, key) {
    var store = { identity: key };
    var valueOf = obj.valueOf;

    Object.defineProperty(obj, "valueOf", {
        value: function (value) {
            return value !== key ?
                valueOf.apply(this, arguments) : store;
        },
        writable: true
    });

    return store;
}

},{}],29:[function(require,module,exports){
module.exports = function(obj) {
    if (typeof obj === 'string') return camelCase(obj);
    return walk(obj);
};

function walk (obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (isDate(obj) || isRegex(obj)) return obj;
    if (isArray(obj)) return map(obj, walk);
    return reduce(objectKeys(obj), function (acc, key) {
        var camel = camelCase(key);
        acc[camel] = walk(obj[key]);
        return acc;
    }, {});
}

function camelCase(str) {
    return str.replace(/[_.-](\w|$)/g, function (_,x) {
        return x.toUpperCase();
    });
}

var isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

var isDate = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
};

var isRegex = function (obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var has = Object.prototype.hasOwnProperty;
var objectKeys = Object.keys || function (obj) {
    var keys = [];
    for (var key in obj) {
        if (has.call(obj, key)) keys.push(key);
    }
    return keys;
};

function map (xs, f) {
    if (xs.map) return xs.map(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        res.push(f(xs[i], i));
    }
    return res;
}

function reduce (xs, f, acc) {
    if (xs.reduce) return xs.reduce(f, acc);
    for (var i = 0; i < xs.length; i++) {
        acc = f(acc, xs[i], i);
    }
    return acc;
}

},{}],30:[function(require,module,exports){
var nargs = /\{([0-9a-zA-Z]+)\}/g
var slice = Array.prototype.slice

module.exports = template

function template(string) {
    var args

    if (arguments.length === 2 && typeof arguments[1] === "object") {
        args = arguments[1]
    } else {
        args = slice.call(arguments, 1)
    }

    if (!args || !args.hasOwnProperty) {
        args = {}
    }

    return string.replace(nargs, function replaceArg(match, i, index) {
        var result

        if (string[index - 1] === "{" &&
            string[index + match.length] === "}") {
            return i
        } else {
            result = args.hasOwnProperty(i) ? args[i] : null
            if (result === null || result === undefined) {
                return ""
            }

            return result
        }
    })
}

},{}],31:[function(require,module,exports){
module.exports = extend

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],32:[function(require,module,exports){
var camelize = require("camelize")
var template = require("string-template")
var extend = require("xtend/mutable")

module.exports = TypedError

function TypedError(args) {
    if (!args) {
        throw new Error("args is required");
    }
    if (!args.type) {
        throw new Error("args.type is required");
    }
    if (!args.message) {
        throw new Error("args.message is required");
    }

    var message = args.message

    if (args.type && !args.name) {
        var errorName = camelize(args.type) + "Error"
        args.name = errorName[0].toUpperCase() + errorName.substr(1)
    }

    createError.type = args.type;
    createError._name = args.name;

    return createError;

    function createError(opts) {
        var result = new Error()

        Object.defineProperty(result, "type", {
            value: result.type,
            enumerable: true,
            writable: true,
            configurable: true
        })

        var options = extend({}, args, opts)

        extend(result, options)
        result.message = template(message, options)

        return result
    }
}


},{"camelize":29,"string-template":30,"xtend/mutable":31}],33:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],34:[function(require,module,exports){
module.exports=require(3)
},{"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vhook.js":3}],35:[function(require,module,exports){
module.exports=require(4)
},{"./version":38,"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vnode.js":4}],36:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":38}],37:[function(require,module,exports){
module.exports=require(5)
},{"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-widget.js":5}],38:[function(require,module,exports){
module.exports=require(6)
},{"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/version.js":6}],39:[function(require,module,exports){
module.exports=require(7)
},{"./is-vhook":34,"./is-vnode":35,"./is-widget":37,"./version":38,"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/vnode.js":7}],40:[function(require,module,exports){
module.exports=require(8)
},{"./version":38,"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/vtext.js":8}],41:[function(require,module,exports){
var classIdSplit = /([\.#]?[a-zA-Z0-9_:-]+)/
var notClassId = /^\.|#/

module.exports = parseTag

function parseTag(tag, props) {
    if (!tag) {
        return "div"
    }

    var noId = !("id" in props)

    var tagParts = tag.split(classIdSplit)
    var tagName = null

    if (notClassId.test(tagParts[1])) {
        tagName = "div"
    }

    var classes, part, type, i
    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i]

        if (!part) {
            continue
        }

        type = part.charAt(0)

        if (!tagName) {
            tagName = part
        } else if (type === ".") {
            classes = classes || []
            classes.push(part.substring(1, part.length))
        } else if (type === "#" && noId) {
            props.id = part.substring(1, part.length)
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className)
        }

        props.className = classes.join(" ")
    }

    return tagName ? tagName.toLowerCase() : "div"
}

},{}],42:[function(require,module,exports){
var isArray = require("x-is-array")
var isObject = require("is-object")

var VPatch = require("./vpatch")
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var handleThunk = require("./handle-thunk")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        if (isThunk(a) || isThunk(b)) {
            thunks(a, b, patch, index)
        } else {
            hooks(b, patch, index)
        }
        return
    }

    var apply = patch[index]

    if (b == null) {
        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
        destroyWidgets(a, patch, index)
    } else if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties, b.hooks)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                destroyWidgets(a, patch, index)
            }

            apply = diffChildren(a, b, patch, apply, index)
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            destroyWidgets(a, patch, index)
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            destroyWidgets(a, patch, index)
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))

        if (!isWidget(a)) {
            destroyWidgets(a, patch, index)
        }
    }

    if (apply) {
        patch[index] = apply
    }
}

function diffProps(a, b, hooks) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (hooks && aKey in hooks) {
            diff = diff || {}
            diff[aKey] = bValue
        } else {
            if (isObject(aValue) && isObject(bValue)) {
                if (getPrototype(bValue) !== getPrototype(aValue)) {
                    diff = diff || {}
                    diff[aKey] = bValue
                } else {
                    var objectDiff = diffProps(aValue, bValue)
                    if (objectDiff) {
                        diff = diff || {}
                        diff[aKey] = objectDiff
                    }
                }
            } else if (aValue !== bValue) {
                diff = diff || {}
                diff[aKey] = bValue
            }
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var bChildren = reorder(aChildren, b.children)

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else if (!rightNode) {
            if (leftNode) {
                // Excess nodes in a need to be removed
                patch[index] = new VPatch(VPatch.REMOVE, leftNode, null)
                destroyWidgets(leftNode, patch, index)
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (bChildren.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(VPatch.ORDER, a, bChildren.moves))
    }

    return apply
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = new VPatch(VPatch.REMOVE, vNode, null)
        }
    } else if (isVNode(vNode) && vNode.hasWidgets) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b);
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true;
        }
    }

    return false;
}

// Execute hooks when two nodes are identical
function hooks(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = new VPatch(VPatch.PROPS, vNode.hooks, vNode.hooks)
        }

        if (vNode.descendantHooks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                hooks(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    }
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {

    var bKeys = keyIndex(bChildren)

    if (!bKeys) {
        return bChildren
    }

    var aKeys = keyIndex(aChildren)

    if (!aKeys) {
        return bChildren
    }

    var bMatch = {}, aMatch = {}

    for (var key in bKeys) {
        bMatch[bKeys[key]] = aKeys[key]
    }

    for (var key in aKeys) {
        aMatch[aKeys[key]] = bKeys[key]
    }

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen
    var shuffle = []
    var freeIndex = 0
    var i = 0
    var moveIndex = 0
    var moves = {}
    var removes = moves.removes = {}
    var reverse = moves.reverse = {}
    var hasMoves = false

    while (freeIndex < len) {
        var move = aMatch[i]
        if (move !== undefined) {
            shuffle[i] = bChildren[move]
            if (move !== moveIndex) {
                moves[move] = moveIndex
                reverse[moveIndex] = move
                hasMoves = true
            }
            moveIndex++
        } else if (i in aMatch) {
            shuffle[i] = undefined
            removes[i] = moveIndex++
            hasMoves = true
        } else {
            while (bMatch[freeIndex] !== undefined) {
                freeIndex++
            }

            if (freeIndex < len) {
                var freeChild = bChildren[freeIndex]
                if (freeChild) {
                    shuffle[i] = freeChild
                    if (freeIndex !== moveIndex) {
                        hasMoves = true
                        moves[freeIndex] = moveIndex
                        reverse[moveIndex] = freeIndex
                    }
                    moveIndex++
                }
                freeIndex++
            }
        }
        i++
    }

    if (hasMoves) {
        shuffle.moves = moves
    }

    return shuffle
}

function keyIndex(children) {
    var i, keys

    for (i = 0; i < children.length; i++) {
        var child = children[i]

        if (child.key !== undefined) {
            keys = keys || {}
            keys[child.key] = i
        }
    }

    return keys
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"./handle-thunk":43,"./is-thunk":44,"./is-vnode":46,"./is-vtext":47,"./is-widget":48,"./vpatch":52,"is-object":49,"x-is-array":50}],43:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":44,"./is-vnode":46,"./is-vtext":47,"./is-widget":48}],44:[function(require,module,exports){
module.exports=require(33)
},{"/web/scribe-plugin-noting/node_modules/virtual-hyperscript/node_modules/vtree/is-thunk.js":33}],45:[function(require,module,exports){
module.exports=require(3)
},{"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vhook.js":3}],46:[function(require,module,exports){
module.exports=require(4)
},{"./version":51,"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vnode.js":4}],47:[function(require,module,exports){
module.exports=require(36)
},{"./version":51,"/web/scribe-plugin-noting/node_modules/virtual-hyperscript/node_modules/vtree/is-vtext.js":36}],48:[function(require,module,exports){
module.exports=require(5)
},{"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-widget.js":5}],49:[function(require,module,exports){
module.exports=require(10)
},{"/web/scribe-plugin-noting/node_modules/virtual-dom/node_modules/is-object/index.js":10}],50:[function(require,module,exports){
module.exports=require(18)
},{"/web/scribe-plugin-noting/node_modules/virtual-dom/node_modules/x-is-array/index.js":18}],51:[function(require,module,exports){
module.exports=require(6)
},{"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/version.js":6}],52:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":51}],53:[function(require,module,exports){
module.exports=require(8)
},{"./version":51,"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/vtext.js":8}],54:[function(require,module,exports){
// Scribe noting plugin

var notingCommands = require('./src/noting-commands');

// config, example:
// { user: 'Firstname Lastname',
//   scribeInstancesSelector: '.ui-rich-text-editor__input' }
module.exports = function(config) {
  return function(scribe) {
    notingCommands.init(scribe, config);
  };
};

},{"./src/noting-commands":69}],55:[function(require,module,exports){
var _ = require('lodash');
var isVFocus = require('../../utils/vfocus/is-vfocus');
var isVText = require('../../utils/vfocus/is-vtext');
var isEmpty = require('../../utils/vfocus/is-empty');

var findAllNotes = require('../../utils/noting/find-all-notes');
var flattenTree = require('../../utils/vfocus/flatten-tree');

module.exports = function removeEmptyNotes(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passed to removeEmptyNotes');
  }

  //return all notes from the given tree
  var allNoteSegments = _.flatten(findAllNotes(focus));

  var noteSequences = allNoteSegments.map(flattenTree);

  noteSequences.forEach(function(noteSequence) {

    var noteParent = noteSequence.splice(0, 1)[0];

    //if we have a totally empty note we have an array of 1
    if (noteSequence.length <= 0) {
      noteParent.remove();
      return;
    }

    //assume we have only empty child elements
    //if one is not change the state of the check
    var childrenAreEmpty = noteSequence.reduce(function(check, childFocus) {
      if (!isEmpty(childFocus)) {
        return false;
      } else {
        return true;
      }
    }, true);

    //if a note is totally empty remove it
    if (childrenAreEmpty) noteParent.remove();

  });

};

},{"../../utils/noting/find-all-notes":73,"../../utils/vfocus/flatten-tree":97,"../../utils/vfocus/is-empty":100,"../../utils/vfocus/is-vfocus":103,"../../utils/vfocus/is-vtext":104,"lodash":"lodash"}],56:[function(require,module,exports){
var isVFocus = require('../../utils/vfocus/is-vfocus');
var isScribeMarker = require('../../utils/noting/is-scribe-marker');

module.exports = function removeScribemarkers(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passed to removeScribemarkers');
  }

  focus.filter(isScribeMarker).forEach(function(marker) {
    marker.remove();
  });

};

},{"../../utils/noting/is-scribe-marker":87,"../../utils/vfocus/is-vfocus":103}],57:[function(require,module,exports){
var _ = require('lodash');
var addClass = require('../../actions/vdom/add-class');
var removeClass = require('../../actions/vdom/remove-class');
var isVFocus = require('../../utils/vfocus/is-vfocus');

// Ensure the first (and only the first) note segment has a
// `note--start` class and that the last (and only the last)
// note segment has a `note--end` class.
module.exports = function updateStartAndEndClasses(noteSegments) {

  if (!noteSegments) {
    return;
  }

  noteSegments = _.isArray(noteSegments) ? noteSegments : [noteSegments];

  noteSegments.forEach(function(note, index) {
    note = note.vNode ? note.vNode : note;
    removeClass(note, 'note--start');
    removeClass(note, 'note--end');
  });

  addClass(noteSegments[0].vNode, 'note--start');
  addClass(noteSegments[noteSegments.length -1].vNode, 'note--end');

  return noteSegments;
};

},{"../../actions/vdom/add-class":63,"../../actions/vdom/remove-class":64,"../../utils/vfocus/is-vfocus":103,"lodash":"lodash"}],58:[function(require,module,exports){
var isVFocus = require('../../utils/vfocus/is-vfocus');
var toggleNoteClasses = require('./toggle-note-classes');
var findAllNotes = require('../../utils/noting/find-all-notes');

var NOTE_CLASS_COLLAPSED = 'note--collapsed';

module.exports = function toggleAllNoteCollapseState(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passed to toggleAllNoteCollapseState');
  }

  var notes = findAllNotes(focus);
  return toggleNoteClasses(notes, NOTE_CLASS_COLLAPSED);

};

},{"../../utils/noting/find-all-notes":73,"../../utils/vfocus/is-vfocus":103,"./toggle-note-classes":59}],59:[function(require,module,exports){
var _ = require('lodash');
var toggleClass = require('../vdom/toggle-class');

module.exports = function toggleNoteClasses(notes, className) {

  if (!notes || !className) {
    throw new Error('A valid collection of notes and a valid className must be passed to toggleNoteClasses');
  }

  notes = _.isArray(notes) ? notes : [notes];
  notes = _.flatten(notes);

  notes.forEach(function(vNode) {
    toggleClass(vNode, className);
  });

};

},{"../vdom/toggle-class":65,"lodash":"lodash"}],60:[function(require,module,exports){
var isVFocus = require('../../utils/vfocus/is-vfocus');
var toggleNoteClasses = require('./toggle-note-classes');
var findSelectedNote = require('../../utils/noting/find-selected-note');

var NOTE_CLASS_COLLAPSED = 'note--collapsed';

module.exports = function toggleSelectedNoteCollapseState(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passed to toggleSelectedNoteCollapseState');
  }

  var note = findSelectedNote(focus);

  if (!note){
    return;
  }

  return toggleNoteClasses(note, NOTE_CLASS_COLLAPSED);

};

},{"../../utils/noting/find-selected-note":81,"../../utils/vfocus/is-vfocus":103,"./toggle-note-classes":59}],61:[function(require,module,exports){
var _ = require('lodash');
var isVFocus = require('../../utils/vfocus/is-vfocus');
var isNote = require('../../utils/noting/is-note');

module.exports = function unWrapNote(focus) {

  if (!isVFocus(focus) || !focus.parent) {
    throw new Error('Only a valid VFocus element can be passed to unWrapNote');
  }

  if (!isNote(focus)) {
    throw new Error('Only a note may be passed to unWrapnote');
  }

  var note = focus.vNode;

  var tree = !!focus.parent.vNode
    ? focus.parent.vNode.children
    : focus.parent.children;

  //remove note and add children
  tree.splice(tree.indexOf(note), 1, note.children);

  focus.parent.vNode.children = _.flatten(tree);

  // We want the note contents to now have their grandparent as parent.
  // The safest way we can ensure this is by changing the VFocus object
  // that previously focused on the note to instead focus on its parent.
  focus.vNode = focus.parent.vNode;
  focus.parent = focus.parent.parent;
  return focus;

};

},{"../../utils/noting/is-note":86,"../../utils/vfocus/is-vfocus":103,"lodash":"lodash"}],62:[function(require,module,exports){
var TAG = 'gu-note';
var CLASS_NAME = 'note';

var _ = require('lodash');
var h = require('virtual-hyperscript');

var getUKDate = require('../../utils/get-uk-date');

// Wrap in a note.
// toWrap can be a vNode, DOM node or a string. One or an array with several.
module.exports = function wrapInNote(focus, data){

  var notes = _.isArray(focus) ? focus : [focus];

  // Note that we have to clone dataAttrs or several notes might end up
  // sharing the same dataset object.
  data = data ? _.clone(data) : {};

  var tagName = TAG + '.' + CLASS_NAME;

  return h(tagName, {title: getUKDate(data), dataset: data}, notes);

};

},{"../../utils/get-uk-date":72,"lodash":"lodash","virtual-hyperscript":23}],63:[function(require,module,exports){
var hasClass = require('../../utils/vdom/has-class');

module.exports = function addClass(vNode, className) {

  if (!vNode || !className) {
    throw new Error('A valid vNode and className must be passed to addClass');
  }

  if (hasClass(vNode, className)) {
    return vNode;
  }

  if (!vNode.properties.className) {
    vNode.properties.className = className;
    return vNode;
  }

  vNode.properties.className = (vNode.properties.className + ' ' + className);
  return vNode;

};

},{"../../utils/vdom/has-class":93}],64:[function(require,module,exports){
var hasClass = require('../../utils/vdom/has-class');

module.exports = function removeClass(vNode, className) {

  if (!vNode || !className) {
    throw new Error('A valid vNode and className must be passed to removeClass');
  }

  if (!hasClass(vNode, className)) {
    return vNode;
  }

  var regex = new RegExp(className, ['g']);
  vNode.properties.className = vNode.properties.className.replace(regex, '');
  return vNode;
};

},{"../../utils/vdom/has-class":93}],65:[function(require,module,exports){
var isVFocus = require('../../utils/vfocus/is-vfocus');
var hasClass = require('../../utils/vdom/has-class');
var addClass = require('./add-class');
var removeClass = require('./remove-class');

module.exports = function toggleClass(vNode, className) {

  if (isVFocus(vNode)) {
    vNode = vNode.vNode;
  }

  if (!vNode || !className) {
    throw new Error('A valid vNode and className must be passed to toggleClass');
  }

  return hasClass(vNode, className) ? removeClass(vNode, className) : addClass(vNode, className);
};

},{"../../utils/vdom/has-class":93,"../../utils/vfocus/is-vfocus":103,"./add-class":63,"./remove-class":64}],66:[function(require,module,exports){
exports.collapseToggleSelectedNote = require('../actions/noting/toggle-selected-note-collapse-state');
exports.collapseToggleAllNote = require('../actions/noting/toggle-all-note-collapse-state');

},{"../actions/noting/toggle-all-note-collapse-state":58,"../actions/noting/toggle-selected-note-collapse-state":60}],67:[function(require,module,exports){
/**
 * Noting API
 *
 * Perform noting actions on a Virtual DOM
 */
'use strict';

exports.user = 'unknown';

var h = require('virtual-hyperscript');
var _ = require('lodash');

var isVText = require('vtree/is-vtext');
var VText = require('vtree/vtext');

var NODE_NAME = 'GU-NOTE';
var TAG = 'gu-note';
var CLASS_NAME = 'note';
var DATA_NAME = 'data-note-edited-by';
var DATA_NAME_CAMEL = 'noteEditedBy';
var DATA_DATE = 'data-note-edited-date';
var DATA_DATE_CAMEL = 'noteEditedDate';
var NOTE_BARRIER_TAG = 'gu-note-barrier';

var vdom = require('./note-vdom');
var getEditedByTitleText = require('../utils/get-uk-date');
var wrapInNote = require('../actions/noting/wrap-in-note');
var unwrap = require('../actions/noting/unwrap-note');
var addUniqueVNodeClass = require('../actions/vdom/add-class');
var removeVNodeClass = require('../actions/vdom/remove-class');
var generateUUID = require('../utils/generate-uuid');


// Update note properties, adding them if they aren't already there.
// Note that this is also a way of merging notes, as we update the
// start and end classes as well as give the segments the same edited
// by information.
function updateNoteProperties(noteSegments) {
  updateStartAndEndClasses(noteSegments);

  // FIXME JP 20/11/14
  // This is a bug with users not being updated on the right note
  // noteSegments.forEach(updateEditedBy);

  var uuid = generateUUID();
  noteSegments.forEach(function (segment) {
    segment.vNode.properties.dataset['noteId'] = uuid;
  });

}

// Ensure the first (and only the first) note segment has a
// `note--start` class and that the last (and only the last)
// note segment has a `note--end` class.
var updateStartAndEndClasses = require('../actions/noting/reset-note-segment-classes');

function updateEditedBy(noteSegment) {
  var dataset = userAndTimeAsDatasetAttrs();

  noteSegment.vNode.properties.dataset[DATA_NAME_CAMEL] = dataset[DATA_NAME_CAMEL];
  noteSegment.vNode.properties.dataset[DATA_DATE_CAMEL] = dataset[DATA_DATE_CAMEL];

  noteSegment.vNode.properties.title = getEditedByTitleText(dataset);
}

function userAndTimeAsDatasetAttrs() {
  var dataset = {};
  dataset[DATA_NAME_CAMEL] = exports.user;
  dataset[DATA_DATE_CAMEL] = new Date().toISOString();

  return dataset;
}

function createVirtualScribeMarker() {
  return h('em.scribe-marker', []);
}

// We need these to make it possible to place the caret immediately
// inside/outside of a note.
function createNoteBarrier() {
  return new VText('\u200B');
}

function updateNoteBarriers(treeFocus) {

  function removeNoteBarriers(treeFocus) {
    treeFocus.filter(vdom.focusOnTextNode).forEach(function (focus) {
      focus.vNode.text = focus.vNode.text.replace(/\u200B/g, '');
    });
  }

  function insertNoteBarriers(treeFocus) {
    vdom.findAllNotes(treeFocus).forEach(function (noteSegments) {

      _.first(noteSegments).next().insertBefore(createNoteBarrier());
      // This is necessarily complex (been through a few iterations) because
      // of Chrome's lack of flexibility when it comes to placing the caret.
      var afterNote = _.last(noteSegments).find(vdom.focusOutsideNote);
      var textNodeAfterNoteFocus = afterNote && afterNote.find(vdom.focusOnNonEmptyTextNode);

      if (textNodeAfterNoteFocus) {
        textNodeAfterNoteFocus.vNode.text = '\u200B' + textNodeAfterNoteFocus.vNode.text;
      }

    });
  }

  removeNoteBarriers(treeFocus);
  insertNoteBarriers(treeFocus);
}


// tree - tree containing a marker.
// Note that we will mutate the tree.
function createEmptyNoteAtCaret(treeFocus) {
  // We need a zero width space character to make the note selectable.
  var zeroWidthSpace = '\u200B';

  // To make sure the caret is placed within the note we place a scribe
  // maker within it.
  // Chrome is picky about needing the space to be before the marker
  // (otherwise the caret won't be placed within the note).
  var replacementVNode = wrapInNote([zeroWidthSpace, createVirtualScribeMarker()], userAndTimeAsDatasetAttrs());

  // We assume there's only one marker.
  var marker = vdom.findMarkers(treeFocus)[0];
  marker.replace(replacementVNode);

  var noteSegments = vdom.findEntireNote(marker);
  updateNoteProperties(noteSegments);
}

// treeFocus: tree focus of tree containing two scribe markers
// Note that we will mutate the tree.
function createNoteFromSelection(treeFocus) {
  // We want to wrap text nodes between the markers. We filter out nodes that have
  // already been wrapped.
  var toWrapAndReplace = vdom.findTextNodeFocusesBetweenMarkers(treeFocus).filter(vdom.focusOutsideNote);


  // Wrap the text nodes.
  var userAndTime = userAndTimeAsDatasetAttrs();
  var wrappedTextNodes = toWrapAndReplace.map(function (focus) {
    return wrapInNote(focus.vNode, userAndTime);
  });


  // Replace the nodes in the tree with the wrapped versions.
  _.zip(toWrapAndReplace, wrappedTextNodes).forEach(function(focusAndReplacementVNode) {
    var focus = focusAndReplacementVNode[0];
    var replacementVNode = focusAndReplacementVNode[1];

    focus.replace(replacementVNode);
  });


  // If we end up with an empty note a <BR> tag would be created. We have to do
  // this before we remove the markers.
  preventBrTags(treeFocus);


  // We want to place the caret after the note. First we have to remove the
  // existing markers.
  vdom.removeVirtualScribeMarkers(treeFocus);


  // Update note properties (merges if necessary).
  var lastNoteSegment = vdom.findLastNoteSegment(toWrapAndReplace[0]);

  var noteSegments = vdom.findEntireNote(lastNoteSegment);
  updateNoteProperties(noteSegments);


  // We need to clear the cache, and this has to be done before we place
  // our markers or we'll end up placing the cursor inside the note instead
  // of immediately after it.
  //
  // TODO: Revisit our caching strategy to make it less of a "foot gun", or
  // refactor so that we do less tree traversals and remove the caching.
  vdom.updateNotesCache(treeFocus);


  // Now let's place that caret.
  var outsideNoteFocus = _.last(noteSegments).find(vdom.focusOutsideNote);

  // We guard against the case when the user notes the last piece of text in a
  // Scribe instance. In that case we don't bother placing the cursor.
  // (What behaviour would a user expect?)
  if (outsideNoteFocus) {
    if (! vdom.focusOnParagraph(outsideNoteFocus)) {
      // The user's selection ends within a paragraph.

      // To place a marker we have to place an element inbetween the note barrier
      // and the marker, or Chrome will place the caret inside the note.
      outsideNoteFocus.insertBefore([new VText('\u200B'), createVirtualScribeMarker()]);

    } else {

      // The user's selection ends with a whole paragraph being selected. Now
      // we need to place the caret in a different manner (or we will end up
      // with a new empty paragraph). So we place the caret at the start of the
      // next paragraph.
      var focus = outsideNoteFocus.find(vdom.focusOnNonEmptyTextNode);
      if (focus) focus.insertBefore(createVirtualScribeMarker());
    }
  }

  vdom.removeEmptyNotes(treeFocus);
}

function unnote(treeFocus) {
  // We assume the caller knows there's only one marker.
  var marker = vdom.findMarkers(treeFocus)[0];
  // We can't use findEntireNote here since it'll sometimes give us the wrong result.
  // See `findEntireNote` documentation. Instead we look the note up by its ID.
  vdom.updateNotesCache(treeFocus);
  var noteSegment = vdom.findAncestorNoteSegment(marker);
  var noteSegments = vdom.findNote(treeFocus, noteSegment.vNode.properties.dataset.noteId);

  noteSegments.forEach(unwrap);

  exports.ensureNoteIntegrity(treeFocus);

  // The marker is where we want it to be (the same position) so we'll
  // just leave it.
}


/*
Unnote part of note, splitting the rest of the original note into new notes.

Example
-------
Text within a note has been selected:

  <p>Asked me questions about the vessel<gu-note>|, the time she left Marseilles|, the
  course she had taken,</gu-note> and what was her cargo. I believe, if she had not
  been laden, and I had been her master, he would have bought her.</p>


We find the entire note and, within the note, we note everything _but_ what we want to unnote:

  <p>Asked me questions about the vessel<gu-note>, the time she left Marseilles<gu-note>, the
  course she had taken,</gu-note></gu-note> and what was her cargo. I believe, if she had not
  been laden, and I had been her master, he would have bought her.</p>


Then we unwrap the previously existing note. The text we selected has been unnoted:

  <p>Asked me questions about the vessel, the time she left Marseilles<gu-note>, the
  course she had taken,</gu-note> and what was her cargo. I believe, if she had not
  been laden, and I had been her master, he would have bought her.</p>

*/
function unnotePartOfNote(treeFocus) {
  function notToBeUnnoted(focus) {
    var candidateVTextNode = focus.vNode;
    return textNodesToUnnote.indexOf(candidateVTextNode) === -1;
  }

  var focusesToUnnote = vdom.findTextNodeFocusesBetweenMarkers(treeFocus);
  var entireNote = vdom.findEntireNote(focusesToUnnote[0]);


  var entireNoteTextNodeFocuses = _(entireNote).map(vdom.focusAndDescendants)
    .flatten().value().filter(vdom.focusOnTextNode);

  var entireNoteTextNodes = entireNoteTextNodeFocuses.map(function (focus) { return focus.vNode; });


  var textNodesToUnnote = focusesToUnnote.map(function (focus) { return focus.vNode; });
  var toWrapAndReplace = _.difference(entireNoteTextNodes, textNodesToUnnote);


  var focusesToNote = entireNoteTextNodeFocuses.filter(notToBeUnnoted);
  var userAndTime = userAndTimeAsDatasetAttrs();


  // Wrap the text nodes.
  var wrappedTextNodes = toWrapAndReplace.map(function (vNode) {
    return wrapInNote(vNode, userAndTime);
  });

  // Replace the nodes in the tree with the wrapped versions.
  _.zip(focusesToNote, wrappedTextNodes).forEach(function(focusAndReplacementVNode) {
    var focus = focusAndReplacementVNode[0];
    var replacementVNode = focusAndReplacementVNode[1];

    focus.replace(replacementVNode);
  });

  // Unwrap previously existing note.
  entireNote.forEach(unwrap);


  // Unless the user selected the entire note contents, notes to the left
  // and/or right of the selection will have been created. We need to update
  // their attributes and CSS classes.
  var onlyPartOfContentsSelected = focusesToNote[0];


  if (onlyPartOfContentsSelected) {
    var tf = focusesToNote[0].top();
    exports.ensureNoteIntegrity(tf);
  }

  // Place marker immediately before the note to the right (this way of doing
  // that seems to be the most reliable for some reason). Both Chrome and
  // Firefox have issues with this however. To force them to behave we insert
  // an empty span element inbetween.
  var markers = vdom.findMarkers(treeFocus.refresh());
  _.last(markers).insertAfter(new VText('\u200B'));
  markers[0].remove();


  // If the user selected everything but a space (or zero width space), we remove
  // the remaining note. Most likely that's what our user intended.
  vdom.removeEmptyNotes(treeFocus.refresh());

}


/*
  Example. We have two notes:
  <p>
    <gu-note>Some noted text</gu-note>| and some other text inbetween |<gu-note>More noted text</gu-note>
  </p>

  We press BACKSPACE, deleting the text, and end up with:
  <p>
    <gu-note data-note-edited-by="Edmond Dantès" data-note-edited-date="2014-09-15T16:49:20.012Z">Some noted text</gu-note><gu-note data-note-edited-by="Lord Wilmore" data-note-edited-date="2014-09-20T10:00:00.012Z">More noted text</gu-note>
  </p>

  This function will merge the notes:
  <p>
    <gu-note data-note-edited-by="The Count of Monte Cristo" data-note-edited-date="2014-10-10T17:00:00.012Z">Some noted text</gu-note><gu-note data-note-edited-by="The Count of Monte Cristo" data-note-edited-date="2014-10-10T17:00:00.012Z">More noted text</gu-note>
  </p>

  The last user to edit "wins", the rationale being that they have approved
  these notes by merging them. In this case all note segments are now
  listed as being edited by The Count of Monte Cristo and the timestamp
  shows the time when the notes were merged.
 */

function mergeIfNecessary(treeFocus) {

  function inconsistentTimestamps(note) {
    function getDataDate(noteSegment) {
      return noteSegment.vNode.properties.dataset[DATA_DATE_CAMEL];
    }

    var uniqVals = _(note).map(getDataDate).uniq().value();
    return uniqVals.length > 1;
  }

  function lacksStartOrEnd(note) {
    var hasNoteStart = 'noteStart' in note[0].vNode.properties.dataset;
    var hasNoteEnd = 'noteEnd' in note[note.length - 1].vNode.properties.dataset;

    return ! (hasNoteStart && hasNoteEnd);
  }

  // Merging is simply a matter of updating the attributes of any notes
  // where all the segments of the note doesn't have the same timestamp,
  // or where there's no start or end property (e.g. when the user has deleted
  // the last note segment of a note).
  function criteria(note) { return inconsistentTimestamps(note) || lacksStartOrEnd(note); }
  vdom.findAllNotes(treeFocus).filter(criteria).forEach(updateNoteProperties);
}


// In a contenteditable, Scribe currently insert a <BR> tag into empty elements.
// This causes styling issues when the user deletes a part of a note,
// e.g. using backspace. This function provides a workaround and should be run
// anytime a note segment might be empty (as defined by `vdom.consideredEmpty`).
// TODO: Fix this in Scribe.
function preventBrTags(treeFocus) {
  function isTrue(obj) { return !!obj; }

  function removeEmptyAncestors(focus) {
    var f = focus;
    while (f) {
      if (! f.canDown()) f.remove();
      f = f.up();
    }
  }

  // When we delete a space we want to add a space to the previous
  // note segment.
  function addSpaceToPrevSegment(segment) {
      var prevNoteSegment = segment.prev().find(vdom.focusOnNote, 'prev');

      if (prevNoteSegment) {
        var lastTextNode = _.last(prevNoteSegment.vNode.children.filter(isVText));
        if (lastTextNode) lastTextNode.text = lastTextNode.text + ' ';
      }
  }

  // We're only interested in when content is removed, meaning
  // there should only be one marker (a collapsed selection).
  //
  // Could possibly develop a way of knowing deletions from
  // additions, but this isn't necessary at the moment.
  var markers = vdom.findMarkers(treeFocus);
  if (markers.length === 2) return;


  // We're good to go.
  var marker = markers[0];
  if (!marker) return;
  // Let's find any note segment before or after the marker.
  var segments = [
    marker.find(vdom.focusOnNote, 'prev'),
    marker.find(vdom.focusOnNote)
  ].filter(isTrue);

  // Replace/delete empty notes, and parents that might have become empty.
  segments.filter(function (segment) { return !!segment; })
    .map(function (segment) {
      if (vdom.withEmptyTextNode(segment)) addSpaceToPrevSegment(segment);

      if (vdom.withoutText(segment) || vdom.withEmptyTextNode(segment)) {
      // In Chrome, removing causes text before the note to be deleted when
      // deleting the last note segment. Replacing with an empty node works
      // fine in Chrome and FF.
      var replaced = segment.replace(new VText('\u200B'));

      removeEmptyAncestors(replaced);
    }
  });
}


exports.ensureNoteIntegrity = function (treeFocus) {
  // cache must be up to date before running this
  vdom.updateNotesCache(treeFocus);
  mergeIfNecessary(treeFocus);
  updateNoteBarriers(treeFocus);
  preventBrTags(treeFocus);
};


exports.toggleNoteAtSelection = function toggleNoteAtSelection(treeFocus, selection) {
  function state() {
    var selectionMarkers = vdom.findMarkers(treeFocus);
    var selectionIsCollapsed = selectionMarkers.length === 1;
    var withinNote = vdom.selectionEntirelyWithinNote(selectionMarkers);

    var state;
    if (selectionIsCollapsed && withinNote) {
      state = 'caretWithinNote';
    } else if (withinNote) {
      state = 'selectionWithinNote';
    } else if (selectionIsCollapsed) {
      state = 'caretOutsideNote';
    } else {
      state = 'selectionOutsideNote'; // at least partially outside.
    }

    return state;
  }

  var scenarios = {
    caretWithinNote: function (treeFocus) { unnote(treeFocus); },
    selectionWithinNote: function (treeFocus) {  unnotePartOfNote(treeFocus); },
    caretOutsideNote: function (treeFocus) { createEmptyNoteAtCaret(treeFocus); },
    selectionOutsideNote: function (treeFocus) { createNoteFromSelection(treeFocus); }
  };

  // Perform action depending on which state we're in.
  scenarios[state()](treeFocus);
};

// TODO: Replace with `selectionEntirelyWithinNote`.
exports.isSelectionInANote = function isSelectionInANote(selectionRange, parentContainer) {

  // Walk up the (real) DOM checking isTargetNode.
  function domWalkUpFind(node, isTargetNode) {
    if (!node.parentNode || node === parentContainer) { return false; }

    return isTargetNode(node) ? node : domWalkUpFind(node.parentNode, isTargetNode);
  }

  // Return the note our selection is inside of, if we are inside one.
  function domFindAncestorNote(node) {
    return domWalkUpFind(node, function(node) {
      return node.tagName === NODE_NAME;
    });
  }

  return domFindAncestorNote(selectionRange.startContainer) && domFindAncestorNote(selectionRange.endContainer) && true;
};

},{"../actions/noting/reset-note-segment-classes":57,"../actions/noting/unwrap-note":61,"../actions/noting/wrap-in-note":62,"../actions/vdom/add-class":63,"../actions/vdom/remove-class":64,"../utils/generate-uuid":71,"../utils/get-uk-date":72,"./note-vdom":68,"lodash":"lodash","virtual-hyperscript":23,"vtree/is-vtext":47,"vtree/vtext":53}],68:[function(require,module,exports){
/**
 * Shared note vdom functions.
 */

'use strict';
//const
var NODE_NAME = 'GU-NOTE';
var TAG = 'gu-note';
var NOTE_BARRIER_TAG = 'gu-note-barrier';

var _ = require('lodash');
var isVText = require('vtree/is-vtext');

var hasClass = require('../utils/vdom/has-class');
var hasAttribute = require('../utils/vdom/has-attribute');
var isTag = require('../utils/vdom/is-tag');
var isEmpty = require('../utils/vdom/is-empty');

var focusOnNote = require('../utils/noting/is-note');
var focusOnMarker = require('../utils/noting/is-scribe-marker');
var focusNotOnMarker = require('../utils/noting/is-not-scribe-marker');
var focusOnTextNode = require('../utils/vfocus/is-vtext');
var focusOnEmptyTextNode = require('../utils/vfocus/is-empty');
var focusOnNonEmptyTextNode = require('../utils/vfocus/is-not-empty');
var focusOnParagraph = require('../utils/vfocus/is-paragraph');
var focusOnlyTextNodes = require('../utils/vfocus/find-text-nodes');
var focusOutsideNote = require('../utils/noting/is-not-within-note');

var hasNoteId = require('../utils/noting/has-note-id');
var stillWithinNote = require('../utils/noting/is-within-note');
var getNodesBetweenScribeMarkers = require('../utils/noting/find-between-scribe-markers');

var findAncestorNoteSegment = require('../utils/noting/find-parent-note');
var findTextNodeFocusesBetweenMarkers = require('../utils/noting/find-text-between-scribe-markers');
var findMarkers = require('../utils/noting/find-scribe-markers');
var findFirstNoteSegment = require('../utils/noting/find-first-note');
var findLastNoteSegment = require('../utils/noting/find-last-note');
var focusAndDescendants = require('../utils/vfocus/flatten-tree');

var withoutText = require('../utils/vfocus/has-no-text-children');
var withEmptyTextNode = require('../utils/vfocus/has-only-empty-text-children');

var findEntireNote = require('../utils/noting/find-entire-note');
var getAllNotes = require('../utils/noting/find-all-notes');
var findNote = require('../utils/noting/find-note-by-id');

var findSelectedNote = require('../utils/noting/find-selected-note');
var selectionEntirelyWithinNote = require('../utils/noting/is-selection-within-note');
var removeVirtualScribeMarkers = require('../actions/noting/remove-scribe-markers');
var removeEmptyNotes = require('../actions/noting/remove-empty-notes');

var notesCache = require('../utils/noting/note-cache');
var findAllNotes = notesCache.get;
var updateNotesCache = notesCache.set;



// Export the following functions
//   TODO: streamline these so that dependant modules use more generic functions

exports.focusAndDescendants = focusAndDescendants;
exports.focusOnEmptyTextNode = focusOnEmptyTextNode;
exports.focusOnNonEmptyTextNode = focusOnNonEmptyTextNode;
exports.focusOnMarker = focusOnMarker;
exports.focusOnNote = focusOnNote;
exports.focusOnParagraph = focusOnParagraph;
exports.focusOnTextNode = focusOnTextNode;
exports.withoutText = withoutText;
exports.withEmptyTextNode = withEmptyTextNode;
exports.findLastNoteSegment = findLastNoteSegment;
exports.focusOutsideNote = focusOutsideNote;
exports.findSelectedNote = findSelectedNote;
exports.findAllNotes = findAllNotes;
exports.findEntireNote = findEntireNote;
exports.findNote = findNote;
exports.findFirstNoteSegment = findFirstNoteSegment;
exports.findMarkers = findMarkers;
exports.findAncestorNoteSegment = findAncestorNoteSegment;
exports.findTextNodeFocusesBetweenMarkers = findTextNodeFocusesBetweenMarkers;
exports.removeEmptyNotes = removeEmptyNotes;
exports.removeVirtualScribeMarkers = removeVirtualScribeMarkers;
exports.selectionEntirelyWithinNote = selectionEntirelyWithinNote;
exports.updateNotesCache = updateNotesCache;

},{"../actions/noting/remove-empty-notes":55,"../actions/noting/remove-scribe-markers":56,"../utils/noting/find-all-notes":73,"../utils/noting/find-between-scribe-markers":74,"../utils/noting/find-entire-note":75,"../utils/noting/find-first-note":76,"../utils/noting/find-last-note":77,"../utils/noting/find-note-by-id":78,"../utils/noting/find-parent-note":79,"../utils/noting/find-scribe-markers":80,"../utils/noting/find-selected-note":81,"../utils/noting/find-text-between-scribe-markers":82,"../utils/noting/has-note-id":83,"../utils/noting/is-not-scribe-marker":84,"../utils/noting/is-not-within-note":85,"../utils/noting/is-note":86,"../utils/noting/is-scribe-marker":87,"../utils/noting/is-selection-within-note":88,"../utils/noting/is-within-note":89,"../utils/noting/note-cache":90,"../utils/vdom/has-attribute":92,"../utils/vdom/has-class":93,"../utils/vdom/is-empty":94,"../utils/vdom/is-tag":95,"../utils/vfocus/find-text-nodes":96,"../utils/vfocus/flatten-tree":97,"../utils/vfocus/has-no-text-children":98,"../utils/vfocus/has-only-empty-text-children":99,"../utils/vfocus/is-empty":100,"../utils/vfocus/is-not-empty":101,"../utils/vfocus/is-paragraph":102,"../utils/vfocus/is-vtext":104,"lodash":"lodash","vtree/is-vtext":47}],69:[function(require,module,exports){
/**
 * Noting commands
 *
 * Scribe noting commands.
 */

'use strict';

var noteToggle = require('./api/note-toggle');
var noteCollapse = require('./api/note-collapse');
var vdom = require('./noting-vdom');
var _ = require('lodash');


/**
 * Initialise noting commands
 * @param  {Scribe} scribe
 * @param  {String} user  Current user string.
 */
exports.init = function(scribe, config) {
  // initialise current user for Noting API
  noteToggle.user = config.user;

  // initialise scribe element selector
  // TODO: Extract the configuration varialbles into its own module.
  noteCollapse.scribeInstancesSelector = config.scribeInstancesSelector;

  scribe.commands.note = createNoteToggleCommand(scribe);
  scribe.commands.noteCollapseToggle = createCollapseToggleCommand(scribe);
  scribe.commands.noteCollapseToggleAll = createCollapseToggleAllCommand(scribe);

  addNoteToggleListener(scribe);
  addNoteCollapseListener(scribe);

  addContentChangedListener(scribe);
};


function createNoteToggleCommand(scribe) {
  var noteCommand = new scribe.api.Command('insertHTML');

  noteCommand.execute = function() {

    vdom.mutateScribe(scribe, function(treeFocus, selection) {
      noteToggle.toggleNoteAtSelection(treeFocus, selection);
    });

  };

  noteCommand.queryState = function() {
    var selection = new scribe.api.Selection();

    return noteToggle.isSelectionInANote(selection.range, scribe.el);
  };

  noteCommand.queryEnabled = function() {
    return true;
  };

  return noteCommand;
}




function createCollapseToggleCommand(scribe) {
  var collapseCommand = new scribe.api.Command('insertHTML');

  // *** collapse toggle command ***
  collapseCommand.execute = function(value) {

    vdom.mutateScribe(scribe, function(treeFocus) {
      noteCollapse.collapseToggleSelectedNote(treeFocus);
    });

  };

  collapseCommand.queryState = function() {

  };

  return collapseCommand;
}


function createCollapseToggleAllCommand(scribe) {
  var collapseAllCommand = new scribe.api.Command('insertHTML');

  // *** toggle collapse all command ***
  collapseAllCommand.execute = function() {
    // This command is a bit special in the sense that it will operate on all
    // Scribe instances on the page.
    //
    // We use a global variable to keep track of the state since we need this
    // to be available to all Scribe instances. Otherwise the state in different
    // instances can get out of sync.
    var state = !window._scribe_plugin_noting__noteCollapsedState,
        scribeInstances = _.toArray(document.querySelectorAll(noteCollapse.scribeInstancesSelector));

    scribeInstances.forEach(function (instance) {

      vdom.mutate(instance, function(treeFocus) {
        noteCollapse.collapseToggleAllNotes(treeFocus, state);
      });

    });

    window._scribe_plugin_noting__noteCollapsedState = state;
  };

  collapseAllCommand.queryEnabled = function() {
    // true when notes are on page
    return !!scribe.el.getElementsByTagName('gu-note').length;
  };

  collapseAllCommand.queryState = function() {
    return this.queryEnabled() && !!window._scribe_plugin_noting__noteCollapsedState;
  };

  return collapseAllCommand;

}


function addNoteToggleListener(scribe) {
  scribe.el.addEventListener('keydown', function (event) {
    var f8 = event.keyCode === 119;
    var f10 = event.keyCode === 121;
    var altBackspace = event.altKey && event.keyCode === 8;

    if (f8 || f10 || altBackspace) {
      event.preventDefault();
      scribe.getCommand('note').execute();
    }
  });
}


function addNoteCollapseListener(scribe) {
  scribe.el.addEventListener('click', function(event) {
    var target = event.target;

    if (target.nodeName == 'GU-NOTE') {

      var selection = new scribe.api.Selection();

      var range = document.createRange();
      range.selectNodeContents(target);

      selection.selection.removeAllRanges();
      selection.selection.addRange(range);

      scribe.getCommand('noteCollapseToggle').execute();
    }
  });
}


function addContentChangedListener(scribe) {
    function mutateScribe() {
        vdom.mutateScribe(scribe, function(treeFocus) {
            noteToggle.ensureNoteIntegrity(treeFocus);
        });
    }

    var throttled = _.throttle(mutateScribe, 1000);

    scribe.el.addEventListener('input', throttled);
}

},{"./api/note-collapse":66,"./api/note-toggle":67,"./noting-vdom":70,"lodash":"lodash"}],70:[function(require,module,exports){
/**
 * Virtual DOM parser / serializer for Noting plugin.
 */

var TAG = 'gu-note';

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

  scribe.transactionManager.run(function () {
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
  });
};

},{"./vfocus":105,"lodash":"lodash","vdom-virtualize":2,"virtual-dom/diff":9,"virtual-dom/patch":19,"vtree/is-vtext":47}],71:[function(require,module,exports){
module.exports = function generateUUID(){
  /* jshint bitwise:false */
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
  });
  return uuid;
};



},{}],72:[function(require,module,exports){
var DATA_NAME_CAMEL = 'noteEditedBy';
var DATA_DATE_CAMEL = 'noteEditedDate';

module.exports = function getUKDate(data){

  data = (data || {});

  var date = data[DATA_DATE_CAMEL]
    ? new Date(data[DATA_DATE_CAMEL])
    : new Date();

  var name = data[DATA_NAME_CAMEL]
    ? data[DATA_NAME_CAMEL]
    : 'unknown';

  // crude formatting avoids a "momentjs" dependency - should be adequate
  // forced UK formatted time in local timezone:  dd/MM/YYYY at hh:mm
  var formattedDate = [
    date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
    'at',
    date.getHours() + ':' + (date.getMinutes() < 9 ? '0' : '') + date.getMinutes()
  ].join(' ');

  return name + ' ' + formattedDate;

};

},{}],73:[function(require,module,exports){
var _ = require('lodash');
var isVFocus = require('../vfocus/is-vfocus');
var isNote = require('./is-note');
var findEntireNote = require('./find-entire-note');

module.exports = function findAllNotes(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus element can be passed to findNoteById');
  }

  // Returns an array of arrays of note segments
  return focus
    .filter(isNote)
    .map(findEntireNote)
    .reduce(function(uniqueNotes, note) {
      // First iteration: Add the note.
      if (uniqueNotes.length === 0) return uniqueNotes.concat([note]);

      // Subsequent iterations: Add the note if it hasn't already been added.
      return _.last(uniqueNotes)[0].vNode === note[0].vNode ? uniqueNotes : uniqueNotes.concat([note]);
    }, []);

};

},{"../vfocus/is-vfocus":103,"./find-entire-note":75,"./is-note":86,"lodash":"lodash"}],74:[function(require,module,exports){
var isVFocus = require('../vfocus/is-vfocus');
var isScribeMarker = require('./is-scribe-marker');
var isNotScribeMarker = require('./is-not-scribe-marker');

module.exports = function findBetweenScribeMarkers(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus element can be passed to findBetweenScribeMarkers');
  }

  //find the first scribe marker within a given focus
  var startFocus = focus.find(isScribeMarker);

  //if no scribe marker is found return a new array
  if (!startFocus) {
    return [];
  }

  //return all nodes upto the next scribe marker
  return startFocus.next().takeWhile(isNotScribeMarker);

};

},{"../vfocus/is-vfocus":103,"./is-not-scribe-marker":84,"./is-scribe-marker":87}],75:[function(require,module,exports){
var isVFocus = require('../vfocus/is-vfocus');
var isWithinNote = require('./is-within-note');
var isNote = require('./is-note');
var findFirstNote = require('./find-first-note');
// Find the rest of a note.
// We identify notes based on 'adjacency' rather than giving them an id.
// This is because people may press RETURN or copy and paste part of a note.
// In such cases we don't want that to keep being the same note.
//
// This has a caveat when:
// 1. A note covers 3 paragraphs.
// 2. Part of a note in paragraph 2 is unnoted.
// 3. The caret is placed in paragraph 3.
// 4. The noting key is pressed.
// findFirstNoteSegment will then move backwards over a P
// and into the first note. We will then unnote the first
// note rather than the second.
//

module.exports = function findEntireNote(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus element can be passed to findEntirenote');
  }

  var parentNote = findFirstNote(focus);

  if(!parentNote) {
    return;
  }

  return parentNote.takeWhile(isWithinNote).filter(isNote);

};

},{"../vfocus/is-vfocus":103,"./find-first-note":76,"./is-note":86,"./is-within-note":89}],76:[function(require,module,exports){
var _ = require('lodash');
var isVFocus = require('../vfocus/is-vfocus');
var isWithinNote = require('./is-within-note');
var isNote = require('./is-note');

module.exports = function findFirstNote(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid vfocus can be passed to findFirstNote');
  }

  return _.last(
    focus.takeWhile(isWithinNote, 'prev').filter(isNote)
  );


};

},{"../vfocus/is-vfocus":103,"./is-note":86,"./is-within-note":89,"lodash":"lodash"}],77:[function(require,module,exports){
var _ = require('lodash');
var isVFocus = require('../vfocus/is-vfocus');
var isWithinNote = require('./is-within-note');
var isNote = require('./is-note');

module.exports = function findFirstNote(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid vfocus can be passed to findFirstNote');
  }

  return _.last(
    focus.takeWhile(isWithinNote).filter(isNote)
  );


};

},{"../vfocus/is-vfocus":103,"./is-note":86,"./is-within-note":89,"lodash":"lodash"}],78:[function(require,module,exports){
var _ = require('lodash');
var isVFocus = require('../vfocus/is-vfocus');
var hasNoteId = require('./has-note-id');
var findAllNotes = require('./find-all-notes');

// Find a note based on its ID. Will not always give the same result as `findEntireNote` ,
// since that'll recognize that a note is adjacent to another one. But when a note
// covers several paragraphs we can't be sure findEntireNote
// will give us the right result (see comment for findEntireNote).
//
// TODO: Redo findEntireNote to be based on findNote and IDs? Could perhaps
// find adjacent notes with the help of focus.prev() and focus.next().
module.exports = function findNoteById(focus, noteId) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus element can be passed to findNoteById');
  }


  var allNoteSegments = _.flatten(findAllNotes(focus));

  return allNoteSegments.filter(function(segment) {
    return hasNoteId(segment.vNode, noteId);
  });

};

},{"../vfocus/is-vfocus":103,"./find-all-notes":73,"./has-note-id":83,"lodash":"lodash"}],79:[function(require,module,exports){
var isNote = require('../noting/is-note');
var isVFocus = require('../vfocus/is-vfocus');

module.exports = function findParentNote(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a VFocus element should be passed to findParentNote');
  }

  return focus.find(isNote, 'up');
};

},{"../noting/is-note":86,"../vfocus/is-vfocus":103}],80:[function(require,module,exports){
var isVFocus = require('../vfocus/is-vfocus');
var isScribeMarker = require('./is-scribe-marker');

module.exports = function findScribeMarkers(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus element can be passed to findScribeMarkers');
  }

  return focus.filter(isScribeMarker);
};

},{"../vfocus/is-vfocus":103,"./is-scribe-marker":87}],81:[function(require,module,exports){
var isVFocus = require('../vfocus/is-vfocus');
var VFocus = require('../../vfocus');
var findScribeMarkers = require('./find-scribe-markers');
var findParentNote = require('./find-parent-note');
var findEntireNote = require('./find-entire-note');

module.exports = function findSelectedNote(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus element can be passed to findSelectedNote');
  }

  var markers = findScribeMarkers(focus);
  if (markers.length <= 0) {
    return;
  }

  var firstMarker = markers[0];

  var note = findParentNote(firstMarker);
  if (!note) {
    return;
  }

  return note && findEntireNote(note) || undefined;

};

},{"../../vfocus":105,"../vfocus/is-vfocus":103,"./find-entire-note":75,"./find-parent-note":79,"./find-scribe-markers":80}],82:[function(require,module,exports){
var isVFocus = require('../vfocus/is-vfocus');
var findBetweenScribeMarkers = require('./find-between-scribe-markers');
var findTextNodes = require('../vfocus/find-text-nodes');


module.exports = function findTextBetweenScribeMarkers(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus element can be passed to findTextBetweenScribeMarkers');
  }

  return findTextNodes(findBetweenScribeMarkers(focus));

};

},{"../vfocus/find-text-nodes":96,"../vfocus/is-vfocus":103,"./find-between-scribe-markers":74}],83:[function(require,module,exports){
var hasAttribute = require('../vdom/has-attribute');
var isVFocus = require('../vfocus/is-vfocus');

module.exports = function hasNoteId(vNode, value) {
  return hasAttribute(vNode, 'data-note-id', value);
};

},{"../vdom/has-attribute":92,"../vfocus/is-vfocus":103}],84:[function(require,module,exports){
var isScribeMarker = require('./is-scribe-marker');

module.exports = function isNotScribeMarker(focus) {
  return !isScribeMarker(focus);
};

},{"./is-scribe-marker":87}],85:[function(require,module,exports){
var isVFocus = require('../vfocus/is-vfocus');
var findParentNote = require('./find-parent-note');

module.exports = function isNotWithinNote(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passed to isNotWithinNote');
  }

  return !findParentNote(focus);

};

},{"../vfocus/is-vfocus":103,"./find-parent-note":79}],86:[function(require,module,exports){
var isVFocus = require('../vfocus/is-vfocus');
var isTag = require('../vdom/is-tag');

// function isNote
// identifies whether a given vfocus is a note
module.exports = function isNote(vfocus) {

  if (!isVFocus(vfocus)) {
    throw new Error('Only a VFocus element should be passed to isNote()');
  }

  return isTag(vfocus.vNode, 'gu-note');
};

},{"../vdom/is-tag":95,"../vfocus/is-vfocus":103}],87:[function(require,module,exports){
// is our selection not a note?
var isVFocus = require('../vfocus/is-vfocus');
var hasClass = require('../vdom/has-class');

module.exports = function isScribeMarker(vfocus) {

  if (!isVFocus(vfocus)) {
    throw new Error('Only a VFocus element should be passed to isNote()');
  }

  return hasClass(vfocus.vNode, 'scribe-marker');
};

},{"../vdom/has-class":93,"../vfocus/is-vfocus":103}],88:[function(require,module,exports){
var _ = require('lodash');
var isVFocus = require('../vfocus/is-vfocus');

var findParentNote = require('./find-parent-note');
var isNotScribeMarker = require('./is-not-scribe-marker');
var isVText = require('../vfocus/is-vtext');
var findScribeMarkers = require('./find-scribe-markers');

module.exports = function isSelectionBetweenNotes(markers) {

  //if we pass a raw VFocus
  if (isVFocus(markers)) {
    markers = findScribeMarkers(markers);
  }

  //if we get passed the wrong argument
  if (!_.isArray(markers)) {
    throw new Error('Only an array of markers or a valid VFocus element can be passed to isSelectionBetweenNotes');
  }

  if (markers.length <= 0) return;

  // if we have two valid markers
  if (markers.length === 2) {
    var selection = markers[0]
      .next()
      .takeWhile(isNotScribeMarker)

      // We need the focusOnTextNode filter so we don't include P tags that
      // contains notes for example.
      .filter(isVText);

    return selection.every(findParentNote);
  }
  //if we only have on valid marker
  //we see if it has a parent note
  else {
    return !!findParentNote(markers[0]);
  }


};

},{"../vfocus/is-vfocus":103,"../vfocus/is-vtext":104,"./find-parent-note":79,"./find-scribe-markers":80,"./is-not-scribe-marker":84,"lodash":"lodash"}],89:[function(require,module,exports){
var isVFocus = require('../vfocus/is-vfocus');


var isVText = require('../vfocus/is-vtext');
var isEmpty = require('../vfocus/is-empty');
var findParentNote = require('../noting/find-parent-note');

module.exports = function isWithinNote(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a vaid VFocus can be passed to isWithinNote');
  }

  return !isVText(focus) || isEmpty(focus) || !!findParentNote(focus);
};

},{"../noting/find-parent-note":79,"../vfocus/is-empty":100,"../vfocus/is-vfocus":103,"../vfocus/is-vtext":104}],90:[function(require,module,exports){
var isVFocus = require('../vfocus/is-vfocus');
var findAllNotes = require('./find-all-notes');

// cache the notes and update them when new notes are added
// caching the existing notes prevent needless tree traversal,
// which have O(n) complexity.
var cache;


function getNotesCache(focus) {
  if (!isVFocus(focus)) {
    throw new Error('only a valid VFocus can be passed to notesCache');
  }

  if(!cache || cache.length === 0){
    cache = setNotesCache(focus);
  }

  return cache;
}

function setNotesCache(focus) {

  if (!isVFocus(focus)) {
    throw new Error('only a valid VFocus can be passed to notesCache');
  }

  cache = findAllNotes(focus);
  return cache;
}

module.exports = {get: getNotesCache, set: setNotesCache};

},{"../vfocus/is-vfocus":103,"./find-all-notes":73}],91:[function(require,module,exports){
module.exports = function toCamelCase(string) {
  return string.replace(/(\-[a-z])/g, function($1) {
    return $1.toUpperCase().replace('-', '');
  });
};

},{}],92:[function(require,module,exports){
var toCamelCase = require('../to-camel-case');

module.exports = function hasAttribute(vNode, attribute, value) {

  if (!vNode || !attribute) {
    throw new Error('Incorrect arguments passed to hasAttribute');
  }

  var isTestingDataAttib = /data/.test(attribute);
  var hasDataSet = !!vNode.properties && !!vNode.properties.dataset;


  //vdom-virtualize will parse data attributes into a dataset hash
  if (isTestingDataAttib && hasDataSet) {

    //remove 'data-'
    attribute = attribute.substring(5, attribute.length);

    //camel case
    attribute = toCamelCase(attribute);

    //test
    return vNode.properties.dataset[attribute] === value;
  }

  //virtual hyperscript will parse data attributes directly onto the properties hash
  else {
    if (!vNode.properties[attribute]) return false;

    if (!vNode.properties[attribute].value) {
      return vNode.properties[attribute] === value;
    }

    return vNode.properties[attribute].value === value;
  }
};

},{"../to-camel-case":91}],93:[function(require,module,exports){
var _ = require('lodash');
// Check if VNode has class
// TODO: Currently not working on nodes with multiple classes (not an
// issue at the moment).
module.exports = function hasClass(vNode, value) {

  if (!vNode || !vNode.properties || !vNode.properties.className) {
    return false;
  }

  var regEx = new RegExp(value);
  return regEx.test(vNode.properties.className);

};

},{"lodash":"lodash"}],94:[function(require,module,exports){
// We incude regular spaces because if we have a note tag that only
// includes a a regular space, then the browser will also insert a <BR>.
// If we consider a string containing only a regular space as empty we
// can remove the note tag to avoid the line break.
//
// Not ideal since it causes the space to be deleted even though the user
// hasn't asked for that. We compensate for this by moving any deleted
// space to the previous note segment.


var _ = require('lodash');
var isVText = require('vtree/is-vtext');

module.exports = function(node) {
  if (isVText(node)) {
   var text = node.text;
   return text === '' ||
     text === '\u200B' ||
     text === '\u00a0' ||
     text === ' ';
  } else {
    return node.children.length <= 0;
  }
 };

},{"lodash":"lodash","vtree/is-vtext":47}],95:[function(require,module,exports){
module.exports = function isTag(node, tag) {
  return node.tagName && node.tagName.toLowerCase() === tag;
};

},{}],96:[function(require,module,exports){
var _ = require('lodash');
var isVFocus = require('../vfocus/is-vfocus');
var isVText = require('../vfocus/is-vtext');

module.exports = function findTextNodes(focuses) {

  focuses = _.isArray(focuses) ? focuses : [focuses];

  focuses.forEach(function(focus) {
    if (!isVFocus(focus)) {
      throw new Error('Only valid VFocus elements should be passed to findTextNodes');
    }
  });

  return focuses.filter(isVText);
};

},{"../vfocus/is-vfocus":103,"../vfocus/is-vtext":104,"lodash":"lodash"}],97:[function(require,module,exports){
var isVFocus = require('./is-vfocus');

module.exports = function flattenTree(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passed to flattenTree');
  }

  return focus.takeWhile(function(insideOfFocus) {
    return !!insideOfFocus.find(function (f) { return f.vNode === focus.vNode; }, 'up');
  });

};

},{"./is-vfocus":103}],98:[function(require,module,exports){
var isVFocus = require('./is-vfocus');
var flatten = require('./flatten-tree');
var isVText = require('./is-vtext');

module.exports = function hasNoTextChildren(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passes to hasNoTextChildren');
  }

  return flatten(focus).filter(isVText).length === 0;
};

},{"./flatten-tree":97,"./is-vfocus":103,"./is-vtext":104}],99:[function(require,module,exports){
var isVFocus = require('./is-vfocus');
var flatten = require('./flatten-tree');
var isVText = require('./is-vtext');
var isEmpty = require('./is-empty');

module.exports = function hasNoTextChildren(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passes to hasNoTextChildren');
  }

  return flatten(focus).filter(isVText).every(isEmpty);
};

},{"./flatten-tree":97,"./is-empty":100,"./is-vfocus":103,"./is-vtext":104}],100:[function(require,module,exports){
var isVFocus = require('./is-vfocus');
var isEmpty = require('../vdom/is-empty');

module.exports = function isEmptyVFocus(vfocus) {

  if (!isVFocus(vfocus)) {
    throw new Error('Only a VFocus element should be passed to isEmptyVFocus');
  }

  return isEmpty(vfocus.vNode);
};

},{"../vdom/is-empty":94,"./is-vfocus":103}],101:[function(require,module,exports){
var isVFocus = require('./is-vfocus');
var isVText = require('./is-vtext');
var isEmpty = require('./is-empty.js');

module.exports = function isNotEmpty(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passed to isNotEmpty');
  }

  //checking if an element is text prevents empty text elements
  //containing elements like breaks being added to the dom when
  //a note is created
  return isVText(focus) && !isEmpty(focus);
};

},{"./is-empty.js":100,"./is-vfocus":103,"./is-vtext":104}],102:[function(require,module,exports){
var isVFocus = require('./is-vfocus.js');
var isTag = require('../vdom/is-tag.js');

module.exports = function isParagraphVFocus(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a VFocus element should be passed to isEmptyVFocus');
  }

  return isTag(focus.vNode, 'p');
};

},{"../vdom/is-tag.js":95,"./is-vfocus.js":103}],103:[function(require,module,exports){
var VFocus = require('../../vfocus');

module.exports = function isVFocus(vFocus) {
  return vFocus instanceof VFocus;
};

},{"../../vfocus":105}],104:[function(require,module,exports){
var isVText = require('vtree/is-vtext');

var VFocus = require('../../vfocus');
var isVFocus = require('../vfocus/is-vfocus');


module.exports = function isVTextVFocus(vfocus) {

  if (!isVFocus(vfocus)) {
    throw new Error('Only a VFocus element should be passed to isVText');
  }

  return isVText(vfocus.vNode);

};

},{"../../vfocus":105,"../vfocus/is-vfocus":103,"vtree/is-vtext":47}],105:[function(require,module,exports){
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

/**
* Internally useful
*/

VFocus.prototype.rightVNode = function() {
  if (this.isRoot()) return null;

  var rightVNodeIndex = this.parent.vNode.children.indexOf(this.vNode) + 1;
  return this.parent.vNode.children[rightVNodeIndex];
};

VFocus.prototype.leftVNode = function() {
  if (this.isRoot()) return null;

  var leftVNodeIndex = this.parent.vNode.children.indexOf(this.vNode) - 1;
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
    var vNodeIndex = this.parent.vNode.children.indexOf(this.vNode);
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
    var vNodeIndex = this.parent.vNode.children.indexOf(this.vNode);
    this.parent.vNode.children.splice(vNodeIndex, 1);
  }

  return this;
};

VFocus.prototype.insertBefore = function(newVNodes) {
  var newVNodes = newVNodes instanceof Array ? newVNodes : [newVNodes];

  if (this.isRoot()) {
    // No can do. Should maybe raise an exception.
  } else {
    var siblings = this.parent.vNode.children;
    var vNodeIndex = siblings.indexOf(this.vNode);

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
    var siblings = this.parent.vNode.children;
    var vNodeIndex = siblings.indexOf(this.vNode);

    if (siblings.length === vNodeIndex + 1) {
      // Last element of array
      siblings = siblings.concat(newVNodes);
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

},{}]},{},[54])(54)
});