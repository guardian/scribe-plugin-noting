!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.scribePluginNoting=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var arrayRef = [];
var splice = arrayRef.splice;
function pull(array) {
    var args = arguments, argsIndex = 0, argsLength = args.length, length = array ? array.length : 0;
    while (++argsIndex < argsLength) {
        var index = -1, value = args[argsIndex];
        while (++index < length) {
            if (array[index] === value) {
                splice.call(array, index--, 1);
                length--;
            }
        }
    }
    return array;
}
module.exports = pull;
},{}],2:[function(require,module,exports){
(function (global){
"use strict";;(function(){var undefined;var arrayPool=[], objectPool=[];var idCounter=0;var indicatorObject={};var keyPrefix=+new Date() + "";var largeArraySize=75;var maxPoolSize=40;var whitespace=" \t\u000b\f ﻿" + "\n\r\u2028\u2029" + " ᠎             　";var reEmptyStringLeading=/\b__p \+= '';/g, reEmptyStringMiddle=/\b(__p \+=) '' \+/g, reEmptyStringTrailing=/(__e\(.*?\)|\b__t\)) \+\n'';/g;var reEsTemplate=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;var reFlags=/\w*$/;var reFuncName=/^\s*function[ \n\r\t]+\w/;var reInterpolate=/<%=([\s\S]+?)%>/g;var reLeadingSpacesAndZeros=RegExp("^[" + whitespace + "]*0+(?=.$)");var reNoMatch=/($^)/;var reThis=/\bthis\b/;var reUnescapedString=/['\n\r\t\u2028\u2029\\]/g;var contextProps=["Array", "Boolean", "Date", "Error", "Function", "Math", "Number", "Object", "RegExp", "String", "_", "attachEvent", "clearTimeout", "isFinite", "isNaN", "parseInt", "setTimeout"];var shadowedProps=["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];var templateCounter=0;var argsClass="[object Arguments]", arrayClass="[object Array]", boolClass="[object Boolean]", dateClass="[object Date]", errorClass="[object Error]", funcClass="[object Function]", numberClass="[object Number]", objectClass="[object Object]", regexpClass="[object RegExp]", stringClass="[object String]";var cloneableClasses={};cloneableClasses[funcClass] = false;cloneableClasses[argsClass] = cloneableClasses[arrayClass] = cloneableClasses[boolClass] = cloneableClasses[dateClass] = cloneableClasses[numberClass] = cloneableClasses[objectClass] = cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;var debounceOptions={leading:false, maxWait:0, trailing:false};var descriptor={configurable:false, enumerable:false, value:null, writable:false};var iteratorData={args:"", array:null, bottom:"", firstArg:"", init:"", keys:null, loop:"", shadowedProps:null, support:null, top:"", useHas:false};var objectTypes={boolean:false, "function":true, object:true, number:false, string:false, undefined:false};var stringEscapes={"\\":"\\", "'":"'", "\n":"n", "\r":"r", "\t":"t", "\u2028":"u2028", "\u2029":"u2029"};var root=objectTypes[typeof window] && window || this;var freeExports=objectTypes[typeof exports] && exports && !exports.nodeType && exports;var freeModule=objectTypes[typeof module] && module && !module.nodeType && module;var moduleExports=freeModule && freeModule.exports === freeExports && freeExports;var freeGlobal=objectTypes[typeof global] && global;if(freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)){root = freeGlobal;}function baseIndexOf(array, value, fromIndex){var index=(fromIndex || 0) - 1, length=array?array.length:0;while(++index < length) {if(array[index] === value){return index;}}return -1;}function cacheIndexOf(cache, value){var type=typeof value;cache = cache.cache;if(type == "boolean" || value == null){return cache[value]?0:-1;}if(type != "number" && type != "string"){type = "object";}var key=type == "number"?value:keyPrefix + value;cache = (cache = cache[type]) && cache[key];return type == "object"?cache && baseIndexOf(cache, value) > -1?0:-1:cache?0:-1;}function cachePush(value){var cache=this.cache, type=typeof value;if(type == "boolean" || value == null){cache[value] = true;}else {if(type != "number" && type != "string"){type = "object";}var key=type == "number"?value:keyPrefix + value, typeCache=cache[type] || (cache[type] = {});if(type == "object"){(typeCache[key] || (typeCache[key] = [])).push(value);}else {typeCache[key] = true;}}}function charAtCallback(value){return value.charCodeAt(0);}function compareAscending(a, b){var ac=a.criteria, bc=b.criteria, index=-1, length=ac.length;while(++index < length) {var value=ac[index], other=bc[index];if(value !== other){if(value > other || typeof value == "undefined"){return 1;}if(value < other || typeof other == "undefined"){return -1;}}}return a.index - b.index;}function createCache(array){var index=-1, length=array.length, first=array[0], mid=array[length / 2 | 0], last=array[length - 1];if(first && typeof first == "object" && mid && typeof mid == "object" && last && typeof last == "object"){return false;}var cache=getObject();cache["false"] = cache["null"] = cache["true"] = cache.undefined = false;var result=getObject();result.array = array;result.cache = cache;result.push = cachePush;while(++index < length) {result.push(array[index]);}return result;}function escapeStringChar(match){return "\\" + stringEscapes[match];}function getArray(){return arrayPool.pop() || [];}function getObject(){return objectPool.pop() || {array:null, cache:null, criteria:null, "false":false, index:0, "null":false, number:null, object:null, push:null, string:null, "true":false, undefined:false, value:null};}function isNode(value){return typeof value.toString != "function" && typeof (value + "") == "string";}function releaseArray(array){array.length = 0;if(arrayPool.length < maxPoolSize){arrayPool.push(array);}}function releaseObject(object){var cache=object.cache;if(cache){releaseObject(cache);}object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;if(objectPool.length < maxPoolSize){objectPool.push(object);}}function slice(array, start, end){start || (start = 0);if(typeof end == "undefined"){end = array?array.length:0;}var index=-1, length=end - start || 0, result=Array(length < 0?0:length);while(++index < length) {result[index] = array[start + index];}return result;}function runInContext(context){context = context?_.defaults(root.Object(), context, _.pick(root, contextProps)):root;var Array=context.Array, Boolean=context.Boolean, Date=context.Date, Error=context.Error, Function=context.Function, Math=context.Math, Number=context.Number, Object=context.Object, RegExp=context.RegExp, String=context.String, TypeError=context.TypeError;var arrayRef=[];var errorProto=Error.prototype, objectProto=Object.prototype, stringProto=String.prototype;var oldDash=context._;var toString=objectProto.toString;var reNative=RegExp("^" + String(toString).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/toString| for [^\]]+/g, ".*?") + "$");var ceil=Math.ceil, clearTimeout=context.clearTimeout, floor=Math.floor, fnToString=Function.prototype.toString, getPrototypeOf=isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf, hasOwnProperty=objectProto.hasOwnProperty, push=arrayRef.push, propertyIsEnumerable=objectProto.propertyIsEnumerable, setTimeout=context.setTimeout, splice=arrayRef.splice, unshift=arrayRef.unshift;var defineProperty=(function(){try{var o={}, func=isNative(func = Object.defineProperty) && func, result=func(o, o, o) && func;}catch(e) {}return result;})();var nativeCreate=isNative(nativeCreate = Object.create) && nativeCreate, nativeIsArray=isNative(nativeIsArray = Array.isArray) && nativeIsArray, nativeIsFinite=context.isFinite, nativeIsNaN=context.isNaN, nativeKeys=isNative(nativeKeys = Object.keys) && nativeKeys, nativeMax=Math.max, nativeMin=Math.min, nativeParseInt=context.parseInt, nativeRandom=Math.random;var ctorByClass={};ctorByClass[arrayClass] = Array;ctorByClass[boolClass] = Boolean;ctorByClass[dateClass] = Date;ctorByClass[funcClass] = Function;ctorByClass[objectClass] = Object;ctorByClass[numberClass] = Number;ctorByClass[regexpClass] = RegExp;ctorByClass[stringClass] = String;var nonEnumProps={};nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = {constructor:true, toLocaleString:true, toString:true, valueOf:true};nonEnumProps[boolClass] = nonEnumProps[stringClass] = {constructor:true, toString:true, valueOf:true};nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = {constructor:true, toString:true};nonEnumProps[objectClass] = {constructor:true};(function(){var length=shadowedProps.length;while(length--) {var key=shadowedProps[length];for(var className in nonEnumProps) {if(hasOwnProperty.call(nonEnumProps, className) && !hasOwnProperty.call(nonEnumProps[className], key)){nonEnumProps[className][key] = false;}}}})();function lodash(value){return value && typeof value == "object" && !isArray(value) && hasOwnProperty.call(value, "__wrapped__")?value:new lodashWrapper(value);}function lodashWrapper(value, chainAll){this.__chain__ = !!chainAll;this.__wrapped__ = value;}lodashWrapper.prototype = lodash.prototype;var support=lodash.support = {};(function(){var ctor=function ctor(){this.x = 1;}, object={"0":1, length:1}, props=[];ctor.prototype = {valueOf:1, y:1};for(var key in new ctor()) {props.push(key);}for(key in arguments) {}support.argsClass = toString.call(arguments) == argsClass;support.argsObject = arguments.constructor == Object && !(arguments instanceof Array);support.enumErrorProps = propertyIsEnumerable.call(errorProto, "message") || propertyIsEnumerable.call(errorProto, "name");support.enumPrototypes = propertyIsEnumerable.call(ctor, "prototype");support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);support.funcNames = typeof Function.name == "string";support.nonEnumArgs = key != 0;support.nonEnumShadows = !/valueOf/.test(props);support.ownLast = props[0] != "x";support.spliceObjects = (arrayRef.splice.call(object, 0, 1), !object[0]);support.unindexedChars = "x"[0] + Object("x")[0] != "xx";try{support.nodeClass = !(toString.call(document) == objectClass && !({toString:0} + ""));}catch(e) {support.nodeClass = true;}})(1);lodash.templateSettings = {escape:/<%-([\s\S]+?)%>/g, evaluate:/<%([\s\S]+?)%>/g, interpolate:reInterpolate, variable:"", imports:{_:lodash}};var iteratorTemplate=function iteratorTemplate(obj){var __p="var index, iterable = " + obj.firstArg + ", result = " + obj.init + ";\nif (!iterable) return result;\n" + obj.top + ";";if(obj.array){__p += "\nvar length = iterable.length; index = -1;\nif (" + obj.array + ") {  ";if(support.unindexedChars){__p += "\n  if (isString(iterable)) {\n    iterable = iterable.split('')\n  }  ";}__p += "\n  while (++index < length) {\n    " + obj.loop + ";\n  }\n}\nelse {  ";}else if(support.nonEnumArgs){__p += "\n  var length = iterable.length; index = -1;\n  if (length && isArguments(iterable)) {\n    while (++index < length) {\n      index += '';\n      " + obj.loop + ";\n    }\n  } else {  ";}if(support.enumPrototypes){__p += "\n  var skipProto = typeof iterable == 'function';\n  ";}if(support.enumErrorProps){__p += "\n  var skipErrorProps = iterable === errorProto || iterable instanceof Error;\n  ";}var conditions=[];if(support.enumPrototypes){conditions.push("!(skipProto && index == \"prototype\")");}if(support.enumErrorProps){conditions.push("!(skipErrorProps && (index == \"message\" || index == \"name\"))");}if(obj.useHas && obj.keys){__p += "\n  var ownIndex = -1,\n      ownProps = objectTypes[typeof iterable] && keys(iterable),\n      length = ownProps ? ownProps.length : 0;\n\n  while (++ownIndex < length) {\n    index = ownProps[ownIndex];\n";if(conditions.length){__p += "    if (" + conditions.join(" && ") + ") {\n  ";}__p += obj.loop + ";    ";if(conditions.length){__p += "\n    }";}__p += "\n  }  ";}else {__p += "\n  for (index in iterable) {\n";if(obj.useHas){conditions.push("hasOwnProperty.call(iterable, index)");}if(conditions.length){__p += "    if (" + conditions.join(" && ") + ") {\n  ";}__p += obj.loop + ";    ";if(conditions.length){__p += "\n    }";}__p += "\n  }    ";if(support.nonEnumShadows){__p += "\n\n  if (iterable !== objectProto) {\n    var ctor = iterable.constructor,\n        isProto = iterable === (ctor && ctor.prototype),\n        className = iterable === stringProto ? stringClass : iterable === errorProto ? errorClass : toString.call(iterable),\n        nonEnum = nonEnumProps[className];\n      ";for(k = 0; k < 7; k++) {__p += "\n    index = '" + obj.shadowedProps[k] + "';\n    if ((!(isProto && nonEnum[index]) && hasOwnProperty.call(iterable, index))";if(!obj.useHas){__p += " || (!nonEnum[index] && iterable[index] !== objectProto[index])";}__p += ") {\n      " + obj.loop + ";\n    }      ";}__p += "\n  }    ";}}if(obj.array || support.nonEnumArgs){__p += "\n}";}__p += obj.bottom + ";\nreturn result";return __p;};function baseBind(bindData){var func=bindData[0], partialArgs=bindData[2], thisArg=bindData[4];function bound(){if(partialArgs){var args=slice(partialArgs);push.apply(args, arguments);}if(this instanceof bound){var thisBinding=baseCreate(func.prototype), result=func.apply(thisBinding, args || arguments);return isObject(result)?result:thisBinding;}return func.apply(thisArg, args || arguments);}setBindData(bound, bindData);return bound;}function baseClone(value, isDeep, callback, stackA, stackB){if(callback){var result=callback(value);if(typeof result != "undefined"){return result;}}var isObj=isObject(value);if(isObj){var className=toString.call(value);if(!cloneableClasses[className] || !support.nodeClass && isNode(value)){return value;}var ctor=ctorByClass[className];switch(className){case boolClass:case dateClass:return new ctor(+value);case numberClass:case stringClass:return new ctor(value);case regexpClass:result = ctor(value.source, reFlags.exec(value));result.lastIndex = value.lastIndex;return result;}}else {return value;}var isArr=isArray(value);if(isDeep){var initedStack=!stackA;stackA || (stackA = getArray());stackB || (stackB = getArray());var length=stackA.length;while(length--) {if(stackA[length] == value){return stackB[length];}}result = isArr?ctor(value.length):{};}else {result = isArr?slice(value):assign({}, value);}if(isArr){if(hasOwnProperty.call(value, "index")){result.index = value.index;}if(hasOwnProperty.call(value, "input")){result.input = value.input;}}if(!isDeep){return result;}stackA.push(value);stackB.push(result);(isArr?baseEach:forOwn)(value, function(objValue, key){result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);});if(initedStack){releaseArray(stackA);releaseArray(stackB);}return result;}function baseCreate(prototype, properties){return isObject(prototype)?nativeCreate(prototype):{};}if(!nativeCreate){baseCreate = (function(){function Object(){}return function(prototype){if(isObject(prototype)){Object.prototype = prototype;var result=new Object();Object.prototype = null;}return result || context.Object();};})();}function baseCreateCallback(func, thisArg, argCount){if(typeof func != "function"){return identity;}if(typeof thisArg == "undefined" || !("prototype" in func)){return func;}var bindData=func.__bindData__;if(typeof bindData == "undefined"){if(support.funcNames){bindData = !func.name;}bindData = bindData || !support.funcDecomp;if(!bindData){var source=fnToString.call(func);if(!support.funcNames){bindData = !reFuncName.test(source);}if(!bindData){bindData = reThis.test(source);setBindData(func, bindData);}}}if(bindData === false || bindData !== true && bindData[1] & 1){return func;}switch(argCount){case 1:return function(value){return func.call(thisArg, value);};case 2:return function(a, b){return func.call(thisArg, a, b);};case 3:return function(value, index, collection){return func.call(thisArg, value, index, collection);};case 4:return function(accumulator, value, index, collection){return func.call(thisArg, accumulator, value, index, collection);};}return bind(func, thisArg);}function baseCreateWrapper(bindData){var func=bindData[0], bitmask=bindData[1], partialArgs=bindData[2], partialRightArgs=bindData[3], thisArg=bindData[4], arity=bindData[5];var isBind=bitmask & 1, isBindKey=bitmask & 2, isCurry=bitmask & 4, isCurryBound=bitmask & 8, key=func;function bound(){var thisBinding=isBind?thisArg:this;if(partialArgs){var args=slice(partialArgs);push.apply(args, arguments);}if(partialRightArgs || isCurry){args || (args = slice(arguments));if(partialRightArgs){push.apply(args, partialRightArgs);}if(isCurry && args.length < arity){bitmask |= 16 & ~32;return baseCreateWrapper([func, isCurryBound?bitmask:bitmask & ~3, args, null, thisArg, arity]);}}args || (args = arguments);if(isBindKey){func = thisBinding[key];}if(this instanceof bound){thisBinding = baseCreate(func.prototype);var result=func.apply(thisBinding, args);return isObject(result)?result:thisBinding;}return func.apply(thisBinding, args);}setBindData(bound, bindData);return bound;}function baseDifference(array, values){var index=-1, indexOf=getIndexOf(), length=array?array.length:0, isLarge=length >= largeArraySize && indexOf === baseIndexOf, result=[];if(isLarge){var cache=createCache(values);if(cache){indexOf = cacheIndexOf;values = cache;}else {isLarge = false;}}while(++index < length) {var value=array[index];if(indexOf(values, value) < 0){result.push(value);}}if(isLarge){releaseObject(values);}return result;}function baseFlatten(array, isShallow, isStrict, fromIndex){var index=(fromIndex || 0) - 1, length=array?array.length:0, result=[];while(++index < length) {var value=array[index];if(value && typeof value == "object" && typeof value.length == "number" && (isArray(value) || isArguments(value))){if(!isShallow){value = baseFlatten(value, isShallow, isStrict);}var valIndex=-1, valLength=value.length, resIndex=result.length;result.length += valLength;while(++valIndex < valLength) {result[resIndex++] = value[valIndex];}}else if(!isStrict){result.push(value);}}return result;}function baseIsEqual(_x, _x2, _x3, _x4, _x5, _x6){var _again=true;_function: while(_again) {_again = false;var a=_x, b=_x2, callback=_x3, isWhere=_x4, stackA=_x5, stackB=_x6;result = type = otherType = className = otherClass = isArr = aWrapped = bWrapped = ctorA = ctorB = initedStack = length = size = index = value = undefined;if(callback){var result=callback(a, b);if(typeof result != "undefined"){return !!result;}}if(a === b){return a !== 0 || 1 / a == 1 / b;}var type=typeof a, otherType=typeof b;if(a === a && !(a && objectTypes[type]) && !(b && objectTypes[otherType])){return false;}if(a == null || b == null){return a === b;}var className=toString.call(a), otherClass=toString.call(b);if(className == argsClass){className = objectClass;}if(otherClass == argsClass){otherClass = objectClass;}if(className != otherClass){return false;}switch(className){case boolClass:case dateClass:return +a == +b;case numberClass:return a != +a?b != +b:a == 0?1 / a == 1 / b:a == +b;case regexpClass:case stringClass:return a == String(b);}var isArr=className == arrayClass;if(!isArr){var aWrapped=hasOwnProperty.call(a, "__wrapped__"), bWrapped=hasOwnProperty.call(b, "__wrapped__");if(aWrapped || bWrapped){_x = aWrapped?a.__wrapped__:a;_x2 = bWrapped?b.__wrapped__:b;_x3 = callback;_x4 = isWhere;_x5 = stackA;_x6 = stackB;_again = true;continue _function;}if(className != objectClass || !support.nodeClass && (isNode(a) || isNode(b))){return false;}var ctorA=!support.argsObject && isArguments(a)?Object:a.constructor, ctorB=!support.argsObject && isArguments(b)?Object:b.constructor;if(ctorA != ctorB && !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) && ("constructor" in a && "constructor" in b)){return false;}}var initedStack=!stackA;stackA || (stackA = getArray());stackB || (stackB = getArray());var length=stackA.length;while(length--) {if(stackA[length] == a){return stackB[length] == b;}}var size=0;result = true;stackA.push(a);stackB.push(b);if(isArr){length = a.length;size = b.length;result = size == length;if(result || isWhere){while(size--) {var index=length, value=b[size];if(isWhere){while(index--) {if(result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB)){break;}}}else if(!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))){break;}}}}else {forIn(b, function(value, key, b){if(hasOwnProperty.call(b, key)){size++;return result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB);}});if(result && !isWhere){forIn(a, function(value, key, a){if(hasOwnProperty.call(a, key)){return result = --size > -1;}});}}stackA.pop();stackB.pop();if(initedStack){releaseArray(stackA);releaseArray(stackB);}return result;}}function baseMerge(object, source, callback, stackA, stackB){(isArray(source)?forEach:forOwn)(source, function(source, key){var found, isArr, result=source, value=object[key];if(source && ((isArr = isArray(source)) || isPlainObject(source))){var stackLength=stackA.length;while(stackLength--) {if(found = stackA[stackLength] == source){value = stackB[stackLength];break;}}if(!found){var isShallow;if(callback){result = callback(value, source);if(isShallow = typeof result != "undefined"){value = result;}}if(!isShallow){value = isArr?isArray(value)?value:[]:isPlainObject(value)?value:{};}stackA.push(source);stackB.push(value);if(!isShallow){baseMerge(value, source, callback, stackA, stackB);}}}else {if(callback){result = callback(value, source);if(typeof result == "undefined"){result = source;}}if(typeof result != "undefined"){value = result;}}object[key] = value;});}function baseRandom(min, max){return min + floor(nativeRandom() * (max - min + 1));}function baseUniq(array, isSorted, callback){var index=-1, indexOf=getIndexOf(), length=array?array.length:0, result=[];var isLarge=!isSorted && length >= largeArraySize && indexOf === baseIndexOf, seen=callback || isLarge?getArray():result;if(isLarge){var cache=createCache(seen);indexOf = cacheIndexOf;seen = cache;}while(++index < length) {var value=array[index], computed=callback?callback(value, index, array):value;if(isSorted?!index || seen[seen.length - 1] !== computed:indexOf(seen, computed) < 0){if(callback || isLarge){seen.push(computed);}result.push(value);}}if(isLarge){releaseArray(seen.array);releaseObject(seen);}else if(callback){releaseArray(seen);}return result;}function createAggregator(setter){return function(collection, callback, thisArg){var result={};callback = lodash.createCallback(callback, thisArg, 3);if(isArray(collection)){var index=-1, length=collection.length;while(++index < length) {var value=collection[index];setter(result, value, callback(value, index, collection), collection);}}else {baseEach(collection, function(value, key, collection){setter(result, value, callback(value, key, collection), collection);});}return result;};}function createWrapper(_x, _x2, _x3, _x4, _x5, _x6){var _arguments;var _again=true;_function: while(_again) {_again = false;var func=_x, bitmask=_x2, partialArgs=_x3, partialRightArgs=_x4, thisArg=_x5, arity=_x6;isBind = isBindKey = isCurry = isCurryBound = isPartial = isPartialRight = bindData = creater = undefined;var isBind=bitmask & 1, isBindKey=bitmask & 2, isCurry=bitmask & 4, isCurryBound=bitmask & 8, isPartial=bitmask & 16, isPartialRight=bitmask & 32;if(!isBindKey && !isFunction(func)){throw new TypeError();}if(isPartial && !partialArgs.length){bitmask &= ~16;isPartial = partialArgs = false;}if(isPartialRight && !partialRightArgs.length){bitmask &= ~32;isPartialRight = partialRightArgs = false;}var bindData=func && func.__bindData__;if(bindData && bindData !== true){bindData = slice(bindData);if(bindData[2]){bindData[2] = slice(bindData[2]);}if(bindData[3]){bindData[3] = slice(bindData[3]);}if(isBind && !(bindData[1] & 1)){bindData[4] = thisArg;}if(!isBind && bindData[1] & 1){bitmask |= 8;}if(isCurry && !(bindData[1] & 4)){bindData[5] = arity;}if(isPartial){push.apply(bindData[2] || (bindData[2] = []), partialArgs);}if(isPartialRight){unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);}bindData[1] |= bitmask;_arguments = bindData;_x = _arguments[0];_x2 = _arguments[1];_x3 = _arguments[2];_x4 = _arguments[3];_x5 = _arguments[4];_x6 = _arguments[5];_again = true;continue _function;}var creater=bitmask == 1 || bitmask === 17?baseBind:baseCreateWrapper;return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);}}function createIterator(){iteratorData.shadowedProps = shadowedProps;iteratorData.array = iteratorData.bottom = iteratorData.loop = iteratorData.top = "";iteratorData.init = "iterable";iteratorData.useHas = true;for(var object, index=0; object = arguments[index]; index++) {for(var key in object) {iteratorData[key] = object[key];}}var args=iteratorData.args;iteratorData.firstArg = /^[^,]+/.exec(args)[0];var factory=Function("baseCreateCallback, errorClass, errorProto, hasOwnProperty, " + "indicatorObject, isArguments, isArray, isString, keys, objectProto, " + "objectTypes, nonEnumProps, stringClass, stringProto, toString", "return function(" + args + ") {\n" + iteratorTemplate(iteratorData) + "\n}");return factory(baseCreateCallback, errorClass, errorProto, hasOwnProperty, indicatorObject, isArguments, isArray, isString, iteratorData.keys, objectProto, objectTypes, nonEnumProps, stringClass, stringProto, toString);}function escapeHtmlChar(match){return htmlEscapes[match];}function getIndexOf(){var result=(result = lodash.indexOf) === indexOf?baseIndexOf:result;return result;}function isNative(value){return typeof value == "function" && reNative.test(value);}var setBindData=!defineProperty?noop:function(func, value){descriptor.value = value;defineProperty(func, "__bindData__", descriptor);};function shimIsPlainObject(value){var ctor, result;if(!(value && toString.call(value) == objectClass) || (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor)) || !support.argsClass && isArguments(value) || !support.nodeClass && isNode(value)){return false;}if(support.ownLast){forIn(value, function(value, key, object){result = hasOwnProperty.call(object, key);return false;});return result !== false;}forIn(value, function(value, key){result = key;});return typeof result == "undefined" || hasOwnProperty.call(value, result);}function unescapeHtmlChar(match){return htmlUnescapes[match];}function isArguments(value){return value && typeof value == "object" && typeof value.length == "number" && toString.call(value) == argsClass || false;}if(!support.argsClass){isArguments = function(value){return value && typeof value == "object" && typeof value.length == "number" && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee") || false;};}var isArray=nativeIsArray || function(value){return value && typeof value == "object" && typeof value.length == "number" && toString.call(value) == arrayClass || false;};var shimKeys=createIterator({args:"object", init:"[]", top:"if (!(objectTypes[typeof object])) return result", loop:"result.push(index)"});var keys=!nativeKeys?shimKeys:function(object){if(!isObject(object)){return [];}if(support.enumPrototypes && typeof object == "function" || support.nonEnumArgs && object.length && isArguments(object)){return shimKeys(object);}return nativeKeys(object);};var eachIteratorOptions={args:"collection, callback, thisArg", top:"callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3)", array:"typeof length == 'number'", keys:keys, loop:"if (callback(iterable[index], index, collection) === false) return result"};var defaultsIteratorOptions={args:"object, source, guard", top:"var args = arguments,\n" + "    argsIndex = 0,\n" + "    argsLength = typeof guard == 'number' ? 2 : args.length;\n" + "while (++argsIndex < argsLength) {\n" + "  iterable = args[argsIndex];\n" + "  if (iterable && objectTypes[typeof iterable]) {", keys:keys, loop:"if (typeof result[index] == 'undefined') result[index] = iterable[index]", bottom:"  }\n}"};var forOwnIteratorOptions={top:"if (!objectTypes[typeof iterable]) return result;\n" + eachIteratorOptions.top, array:false};var htmlEscapes={"&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;"};var htmlUnescapes=invert(htmlEscapes);var reEscapedHtml=RegExp("(" + keys(htmlUnescapes).join("|") + ")", "g"), reUnescapedHtml=RegExp("[" + keys(htmlEscapes).join("") + "]", "g");var baseEach=createIterator(eachIteratorOptions);var assign=createIterator(defaultsIteratorOptions, {top:defaultsIteratorOptions.top.replace(";", ";\n" + "if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {\n" + "  var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);\n" + "} else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {\n" + "  callback = args[--argsLength];\n" + "}"), loop:"result[index] = callback ? callback(result[index], iterable[index]) : iterable[index]"});function clone(value, isDeep, callback, thisArg){if(typeof isDeep != "boolean" && isDeep != null){thisArg = callback;callback = isDeep;isDeep = false;}return baseClone(value, isDeep, typeof callback == "function" && baseCreateCallback(callback, thisArg, 1));}function cloneDeep(value, callback, thisArg){return baseClone(value, true, typeof callback == "function" && baseCreateCallback(callback, thisArg, 1));}function create(prototype, properties){var result=baseCreate(prototype);return properties?assign(result, properties):result;}var defaults=createIterator(defaultsIteratorOptions);function findKey(object, callback, thisArg){var result;callback = lodash.createCallback(callback, thisArg, 3);forOwn(object, function(value, key, object){if(callback(value, key, object)){result = key;return false;}});return result;}function findLastKey(object, callback, thisArg){var result;callback = lodash.createCallback(callback, thisArg, 3);forOwnRight(object, function(value, key, object){if(callback(value, key, object)){result = key;return false;}});return result;}var forIn=createIterator(eachIteratorOptions, forOwnIteratorOptions, {useHas:false});function forInRight(object, callback, thisArg){var pairs=[];forIn(object, function(value, key){pairs.push(key, value);});var length=pairs.length;callback = baseCreateCallback(callback, thisArg, 3);while(length--) {if(callback(pairs[length--], pairs[length], object) === false){break;}}return object;}var forOwn=createIterator(eachIteratorOptions, forOwnIteratorOptions);function forOwnRight(object, callback, thisArg){var props=keys(object), length=props.length;callback = baseCreateCallback(callback, thisArg, 3);while(length--) {var key=props[length];if(callback(object[key], key, object) === false){break;}}return object;}function functions(object){var result=[];forIn(object, function(value, key){if(isFunction(value)){result.push(key);}});return result.sort();}function has(object, key){return object?hasOwnProperty.call(object, key):false;}function invert(object){var index=-1, props=keys(object), length=props.length, result={};while(++index < length) {var key=props[index];result[object[key]] = key;}return result;}function isBoolean(value){return value === true || value === false || value && typeof value == "object" && toString.call(value) == boolClass || false;}function isDate(value){return value && typeof value == "object" && toString.call(value) == dateClass || false;}function isElement(value){return value && value.nodeType === 1 || false;}function isEmpty(value){var result=true;if(!value){return result;}var className=toString.call(value), length=value.length;if(className == arrayClass || className == stringClass || (support.argsClass?className == argsClass:isArguments(value)) || className == objectClass && typeof length == "number" && isFunction(value.splice)){return !length;}forOwn(value, function(){return result = false;});return result;}function isEqual(a, b, callback, thisArg){return baseIsEqual(a, b, typeof callback == "function" && baseCreateCallback(callback, thisArg, 2));}function isFinite(value){return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));}function isFunction(value){return typeof value == "function";}if(isFunction(/x/)){isFunction = function(value){return typeof value == "function" && toString.call(value) == funcClass;};}function isObject(value){return !!(value && objectTypes[typeof value]);}function isNaN(value){return isNumber(value) && value != +value;}function isNull(value){return value === null;}function isNumber(value){return typeof value == "number" || value && typeof value == "object" && toString.call(value) == numberClass || false;}var isPlainObject=!getPrototypeOf?shimIsPlainObject:function(value){if(!(value && toString.call(value) == objectClass) || !support.argsClass && isArguments(value)){return false;}var valueOf=value.valueOf, objProto=isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);return objProto?value == objProto || getPrototypeOf(value) == objProto:shimIsPlainObject(value);};function isRegExp(value){return value && objectTypes[typeof value] && toString.call(value) == regexpClass || false;}function isString(value){return typeof value == "string" || value && typeof value == "object" && toString.call(value) == stringClass || false;}function isUndefined(value){return typeof value == "undefined";}function mapValues(object, callback, thisArg){var result={};callback = lodash.createCallback(callback, thisArg, 3);forOwn(object, function(value, key, object){result[key] = callback(value, key, object);});return result;}function merge(object){var args=arguments, length=2;if(!isObject(object)){return object;}if(typeof args[2] != "number"){length = args.length;}if(length > 3 && typeof args[length - 2] == "function"){var callback=baseCreateCallback(args[--length - 1], args[length--], 2);}else if(length > 2 && typeof args[length - 1] == "function"){callback = args[--length];}var sources=slice(arguments, 1, length), index=-1, stackA=getArray(), stackB=getArray();while(++index < length) {baseMerge(object, sources[index], callback, stackA, stackB);}releaseArray(stackA);releaseArray(stackB);return object;}function omit(object, callback, thisArg){var result={};if(typeof callback != "function"){var props=[];forIn(object, function(value, key){props.push(key);});props = baseDifference(props, baseFlatten(arguments, true, false, 1));var index=-1, length=props.length;while(++index < length) {var key=props[index];result[key] = object[key];}}else {callback = lodash.createCallback(callback, thisArg, 3);forIn(object, function(value, key, object){if(!callback(value, key, object)){result[key] = value;}});}return result;}function pairs(object){var index=-1, props=keys(object), length=props.length, result=Array(length);while(++index < length) {var key=props[index];result[index] = [key, object[key]];}return result;}function pick(object, callback, thisArg){var result={};if(typeof callback != "function"){var index=-1, props=baseFlatten(arguments, true, false, 1), length=isObject(object)?props.length:0;while(++index < length) {var key=props[index];if(key in object){result[key] = object[key];}}}else {callback = lodash.createCallback(callback, thisArg, 3);forIn(object, function(value, key, object){if(callback(value, key, object)){result[key] = value;}});}return result;}function transform(object, callback, accumulator, thisArg){var isArr=isArray(object);if(accumulator == null){if(isArr){accumulator = [];}else {var ctor=object && object.constructor, proto=ctor && ctor.prototype;accumulator = baseCreate(proto);}}if(callback){callback = lodash.createCallback(callback, thisArg, 4);(isArr?baseEach:forOwn)(object, function(value, index, object){return callback(accumulator, value, index, object);});}return accumulator;}function values(object){var index=-1, props=keys(object), length=props.length, result=Array(length);while(++index < length) {result[index] = object[props[index]];}return result;}function at(collection){var args=arguments, index=-1, props=baseFlatten(args, true, false, 1), length=args[2] && args[2][args[1]] === collection?1:props.length, result=Array(length);if(support.unindexedChars && isString(collection)){collection = collection.split("");}while(++index < length) {result[index] = collection[props[index]];}return result;}function contains(collection, target, fromIndex){var index=-1, indexOf=getIndexOf(), length=collection?collection.length:0, result=false;fromIndex = (fromIndex < 0?nativeMax(0, length + fromIndex):fromIndex) || 0;if(isArray(collection)){result = indexOf(collection, target, fromIndex) > -1;}else if(typeof length == "number"){result = (isString(collection)?collection.indexOf(target, fromIndex):indexOf(collection, target, fromIndex)) > -1;}else {baseEach(collection, function(value){if(++index >= fromIndex){return !(result = value === target);}});}return result;}var countBy=createAggregator(function(result, value, key){hasOwnProperty.call(result, key)?result[key]++:result[key] = 1;});function every(collection, callback, thisArg){var result=true;callback = lodash.createCallback(callback, thisArg, 3);if(isArray(collection)){var index=-1, length=collection.length;while(++index < length) {if(!(result = !!callback(collection[index], index, collection))){break;}}}else {baseEach(collection, function(value, index, collection){return result = !!callback(value, index, collection);});}return result;}function filter(collection, callback, thisArg){var result=[];callback = lodash.createCallback(callback, thisArg, 3);if(isArray(collection)){var index=-1, length=collection.length;while(++index < length) {var value=collection[index];if(callback(value, index, collection)){result.push(value);}}}else {baseEach(collection, function(value, index, collection){if(callback(value, index, collection)){result.push(value);}});}return result;}function find(collection, callback, thisArg){callback = lodash.createCallback(callback, thisArg, 3);if(isArray(collection)){var index=-1, length=collection.length;while(++index < length) {var value=collection[index];if(callback(value, index, collection)){return value;}}}else {var result;baseEach(collection, function(value, index, collection){if(callback(value, index, collection)){result = value;return false;}});return result;}}function findLast(collection, callback, thisArg){var result;callback = lodash.createCallback(callback, thisArg, 3);forEachRight(collection, function(value, index, collection){if(callback(value, index, collection)){result = value;return false;}});return result;}function forEach(collection, callback, thisArg){if(callback && typeof thisArg == "undefined" && isArray(collection)){var index=-1, length=collection.length;while(++index < length) {if(callback(collection[index], index, collection) === false){break;}}}else {baseEach(collection, callback, thisArg);}return collection;}function forEachRight(collection, callback, thisArg){var iterable=collection, length=collection?collection.length:0;callback = callback && typeof thisArg == "undefined"?callback:baseCreateCallback(callback, thisArg, 3);if(isArray(collection)){while(length--) {if(callback(collection[length], length, collection) === false){break;}}}else {if(typeof length != "number"){var props=keys(collection);length = props.length;}else if(support.unindexedChars && isString(collection)){iterable = collection.split("");}baseEach(collection, function(value, key, collection){key = props?props[--length]:--length;return callback(iterable[key], key, collection);});}return collection;}var groupBy=createAggregator(function(result, value, key){(hasOwnProperty.call(result, key)?result[key]:result[key] = []).push(value);});var indexBy=createAggregator(function(result, value, key){result[key] = value;});function invoke(collection, methodName){var args=slice(arguments, 2), index=-1, isFunc=typeof methodName == "function", length=collection?collection.length:0, result=Array(typeof length == "number"?length:0);forEach(collection, function(value){result[++index] = (isFunc?methodName:value[methodName]).apply(value, args);});return result;}function map(collection, callback, thisArg){var index=-1, length=collection?collection.length:0, result=Array(typeof length == "number"?length:0);callback = lodash.createCallback(callback, thisArg, 3);if(isArray(collection)){while(++index < length) {result[index] = callback(collection[index], index, collection);}}else {baseEach(collection, function(value, key, collection){result[++index] = callback(value, key, collection);});}return result;}function max(collection, callback, thisArg){var computed=-Infinity, result=computed;if(typeof callback != "function" && thisArg && thisArg[callback] === collection){callback = null;}if(callback == null && isArray(collection)){var index=-1, length=collection.length;while(++index < length) {var value=collection[index];if(value > result){result = value;}}}else {callback = callback == null && isString(collection)?charAtCallback:lodash.createCallback(callback, thisArg, 3);baseEach(collection, function(value, index, collection){var current=callback(value, index, collection);if(current > computed){computed = current;result = value;}});}return result;}function min(collection, callback, thisArg){var computed=Infinity, result=computed;if(typeof callback != "function" && thisArg && thisArg[callback] === collection){callback = null;}if(callback == null && isArray(collection)){var index=-1, length=collection.length;while(++index < length) {var value=collection[index];if(value < result){result = value;}}}else {callback = callback == null && isString(collection)?charAtCallback:lodash.createCallback(callback, thisArg, 3);baseEach(collection, function(value, index, collection){var current=callback(value, index, collection);if(current < computed){computed = current;result = value;}});}return result;}var pluck=map;function reduce(collection, callback, accumulator, thisArg){var noaccum=arguments.length < 3;callback = lodash.createCallback(callback, thisArg, 4);if(isArray(collection)){var index=-1, length=collection.length;if(noaccum){accumulator = collection[++index];}while(++index < length) {accumulator = callback(accumulator, collection[index], index, collection);}}else {baseEach(collection, function(value, index, collection){accumulator = noaccum?(noaccum = false, value):callback(accumulator, value, index, collection);});}return accumulator;}function reduceRight(collection, callback, accumulator, thisArg){var noaccum=arguments.length < 3;callback = lodash.createCallback(callback, thisArg, 4);forEachRight(collection, function(value, index, collection){accumulator = noaccum?(noaccum = false, value):callback(accumulator, value, index, collection);});return accumulator;}function reject(collection, callback, thisArg){callback = lodash.createCallback(callback, thisArg, 3);return filter(collection, function(value, index, collection){return !callback(value, index, collection);});}function sample(collection, n, guard){if(collection && typeof collection.length != "number"){collection = values(collection);}else if(support.unindexedChars && isString(collection)){collection = collection.split("");}if(n == null || guard){return collection?collection[baseRandom(0, collection.length - 1)]:undefined;}var result=shuffle(collection);result.length = nativeMin(nativeMax(0, n), result.length);return result;}function shuffle(collection){var index=-1, length=collection?collection.length:0, result=Array(typeof length == "number"?length:0);forEach(collection, function(value){var rand=baseRandom(0, ++index);result[index] = result[rand];result[rand] = value;});return result;}function size(collection){var length=collection?collection.length:0;return typeof length == "number"?length:keys(collection).length;}function some(collection, callback, thisArg){var result;callback = lodash.createCallback(callback, thisArg, 3);if(isArray(collection)){var index=-1, length=collection.length;while(++index < length) {if(result = callback(collection[index], index, collection)){break;}}}else {baseEach(collection, function(value, index, collection){return !(result = callback(value, index, collection));});}return !!result;}function sortBy(collection, callback, thisArg){var index=-1, isArr=isArray(callback), length=collection?collection.length:0, result=Array(typeof length == "number"?length:0);if(!isArr){callback = lodash.createCallback(callback, thisArg, 3);}forEach(collection, function(value, key, collection){var object=result[++index] = getObject();if(isArr){object.criteria = map(callback, function(key){return value[key];});}else {(object.criteria = getArray())[0] = callback(value, key, collection);}object.index = index;object.value = value;});length = result.length;result.sort(compareAscending);while(length--) {var object=result[length];result[length] = object.value;if(!isArr){releaseArray(object.criteria);}releaseObject(object);}return result;}function toArray(collection){if(collection && typeof collection.length == "number"){return support.unindexedChars && isString(collection)?collection.split(""):slice(collection);}return values(collection);}var where=filter;function compact(array){var index=-1, length=array?array.length:0, result=[];while(++index < length) {var value=array[index];if(value){result.push(value);}}return result;}function difference(array){return baseDifference(array, baseFlatten(arguments, true, true, 1));}function findIndex(array, callback, thisArg){var index=-1, length=array?array.length:0;callback = lodash.createCallback(callback, thisArg, 3);while(++index < length) {if(callback(array[index], index, array)){return index;}}return -1;}function findLastIndex(array, callback, thisArg){var length=array?array.length:0;callback = lodash.createCallback(callback, thisArg, 3);while(length--) {if(callback(array[length], length, array)){return length;}}return -1;}function first(array, callback, thisArg){var n=0, length=array?array.length:0;if(typeof callback != "number" && callback != null){var index=-1;callback = lodash.createCallback(callback, thisArg, 3);while(++index < length && callback(array[index], index, array)) {n++;}}else {n = callback;if(n == null || thisArg){return array?array[0]:undefined;}}return slice(array, 0, nativeMin(nativeMax(0, n), length));}function flatten(array, isShallow, callback, thisArg){if(typeof isShallow != "boolean" && isShallow != null){thisArg = callback;callback = typeof isShallow != "function" && thisArg && thisArg[isShallow] === array?null:isShallow;isShallow = false;}if(callback != null){array = map(array, callback, thisArg);}return baseFlatten(array, isShallow);}function indexOf(array, value, fromIndex){if(typeof fromIndex == "number"){var length=array?array.length:0;fromIndex = fromIndex < 0?nativeMax(0, length + fromIndex):fromIndex || 0;}else if(fromIndex){var index=sortedIndex(array, value);return array[index] === value?index:-1;}return baseIndexOf(array, value, fromIndex);}function initial(array, callback, thisArg){var n=0, length=array?array.length:0;if(typeof callback != "number" && callback != null){var index=length;callback = lodash.createCallback(callback, thisArg, 3);while(index-- && callback(array[index], index, array)) {n++;}}else {n = callback == null || thisArg?1:callback || n;}return slice(array, 0, nativeMin(nativeMax(0, length - n), length));}function intersection(){var args=[], argsIndex=-1, argsLength=arguments.length, caches=getArray(), indexOf=getIndexOf(), trustIndexOf=indexOf === baseIndexOf, seen=getArray();while(++argsIndex < argsLength) {var value=arguments[argsIndex];if(isArray(value) || isArguments(value)){args.push(value);caches.push(trustIndexOf && value.length >= largeArraySize && createCache(argsIndex?args[argsIndex]:seen));}}var array=args[0], index=-1, length=array?array.length:0, result=[];outer: while(++index < length) {var cache=caches[0];value = array[index];if((cache?cacheIndexOf(cache, value):indexOf(seen, value)) < 0){argsIndex = argsLength;(cache || seen).push(value);while(--argsIndex) {cache = caches[argsIndex];if((cache?cacheIndexOf(cache, value):indexOf(args[argsIndex], value)) < 0){continue outer;}}result.push(value);}}while(argsLength--) {cache = caches[argsLength];if(cache){releaseObject(cache);}}releaseArray(caches);releaseArray(seen);return result;}function last(array, callback, thisArg){var n=0, length=array?array.length:0;if(typeof callback != "number" && callback != null){var index=length;callback = lodash.createCallback(callback, thisArg, 3);while(index-- && callback(array[index], index, array)) {n++;}}else {n = callback;if(n == null || thisArg){return array?array[length - 1]:undefined;}}return slice(array, nativeMax(0, length - n));}function lastIndexOf(array, value, fromIndex){var index=array?array.length:0;if(typeof fromIndex == "number"){index = (fromIndex < 0?nativeMax(0, index + fromIndex):nativeMin(fromIndex, index - 1)) + 1;}while(index--) {if(array[index] === value){return index;}}return -1;}function pull(array){var args=arguments, argsIndex=0, argsLength=args.length, length=array?array.length:0;while(++argsIndex < argsLength) {var index=-1, value=args[argsIndex];while(++index < length) {if(array[index] === value){splice.call(array, index--, 1);length--;}}}return array;}function range(start, end, step){start = +start || 0;step = typeof step == "number"?step:+step || 1;if(end == null){end = start;start = 0;}var index=-1, length=nativeMax(0, ceil((end - start) / (step || 1))), result=Array(length);while(++index < length) {result[index] = start;start += step;}return result;}function remove(array, callback, thisArg){var index=-1, length=array?array.length:0, result=[];callback = lodash.createCallback(callback, thisArg, 3);while(++index < length) {var value=array[index];if(callback(value, index, array)){result.push(value);splice.call(array, index--, 1);length--;}}return result;}function rest(array, callback, thisArg){if(typeof callback != "number" && callback != null){var n=0, index=-1, length=array?array.length:0;callback = lodash.createCallback(callback, thisArg, 3);while(++index < length && callback(array[index], index, array)) {n++;}}else {n = callback == null || thisArg?1:nativeMax(0, callback);}return slice(array, n);}function sortedIndex(array, value, callback, thisArg){var low=0, high=array?array.length:low;callback = callback?lodash.createCallback(callback, thisArg, 1):identity;value = callback(value);while(low < high) {var mid=low + high >>> 1;callback(array[mid]) < value?low = mid + 1:high = mid;}return low;}function union(){return baseUniq(baseFlatten(arguments, true, true));}function uniq(array, isSorted, callback, thisArg){if(typeof isSorted != "boolean" && isSorted != null){thisArg = callback;callback = typeof isSorted != "function" && thisArg && thisArg[isSorted] === array?null:isSorted;isSorted = false;}if(callback != null){callback = lodash.createCallback(callback, thisArg, 3);}return baseUniq(array, isSorted, callback);}function without(array){return baseDifference(array, slice(arguments, 1));}function xor(){var index=-1, length=arguments.length;while(++index < length) {var array=arguments[index];if(isArray(array) || isArguments(array)){var result=result?baseUniq(baseDifference(result, array).concat(baseDifference(array, result))):array;}}return result || [];}function zip(){var array=arguments.length > 1?arguments:arguments[0], index=-1, length=array?max(pluck(array, "length")):0, result=Array(length < 0?0:length);while(++index < length) {result[index] = pluck(array, index);}return result;}function zipObject(keys, values){var index=-1, length=keys?keys.length:0, result={};if(!values && length && !isArray(keys[0])){values = [];}while(++index < length) {var key=keys[index];if(values){result[key] = values[index];}else if(key){result[key[0]] = key[1];}}return result;}function after(n, func){if(!isFunction(func)){throw new TypeError();}return function(){if(--n < 1){return func.apply(this, arguments);}};}function bind(func, thisArg){return arguments.length > 2?createWrapper(func, 17, slice(arguments, 2), null, thisArg):createWrapper(func, 1, null, null, thisArg);}function bindAll(object){var funcs=arguments.length > 1?baseFlatten(arguments, true, false, 1):functions(object), index=-1, length=funcs.length;while(++index < length) {var key=funcs[index];object[key] = createWrapper(object[key], 1, null, null, object);}return object;}function bindKey(object, key){return arguments.length > 2?createWrapper(key, 19, slice(arguments, 2), null, object):createWrapper(key, 3, null, null, object);}function compose(){var funcs=arguments, length=funcs.length;while(length--) {if(!isFunction(funcs[length])){throw new TypeError();}}return function(){var args=arguments, length=funcs.length;while(length--) {args = [funcs[length].apply(this, args)];}return args[0];};}function curry(func, arity){arity = typeof arity == "number"?arity:+arity || func.length;return createWrapper(func, 4, null, null, null, arity);}function debounce(func, wait, options){var args, maxTimeoutId, result, stamp, thisArg, timeoutId, trailingCall, lastCalled=0, maxWait=false, trailing=true;if(!isFunction(func)){throw new TypeError();}wait = nativeMax(0, wait) || 0;if(options === true){var leading=true;trailing = false;}else if(isObject(options)){leading = options.leading;maxWait = "maxWait" in options && (nativeMax(wait, options.maxWait) || 0);trailing = "trailing" in options?options.trailing:trailing;}var delayed=(function(_delayed){var _delayedWrapper=function delayed(){return _delayed.apply(this, arguments);};_delayedWrapper.toString = function(){return _delayed.toString();};return _delayedWrapper;})(function(){var remaining=wait - (now() - stamp);if(remaining <= 0){if(maxTimeoutId){clearTimeout(maxTimeoutId);}var isCalled=trailingCall;maxTimeoutId = timeoutId = trailingCall = undefined;if(isCalled){lastCalled = now();result = func.apply(thisArg, args);if(!timeoutId && !maxTimeoutId){args = thisArg = null;}}}else {timeoutId = setTimeout(delayed, remaining);}});var maxDelayed=function maxDelayed(){if(timeoutId){clearTimeout(timeoutId);}maxTimeoutId = timeoutId = trailingCall = undefined;if(trailing || maxWait !== wait){lastCalled = now();result = func.apply(thisArg, args);if(!timeoutId && !maxTimeoutId){args = thisArg = null;}}};return function(){args = arguments;stamp = now();thisArg = this;trailingCall = trailing && (timeoutId || !leading);if(maxWait === false){var leadingCall=leading && !timeoutId;}else {if(!maxTimeoutId && !leading){lastCalled = stamp;}var remaining=maxWait - (stamp - lastCalled), isCalled=remaining <= 0;if(isCalled){if(maxTimeoutId){maxTimeoutId = clearTimeout(maxTimeoutId);}lastCalled = stamp;result = func.apply(thisArg, args);}else if(!maxTimeoutId){maxTimeoutId = setTimeout(maxDelayed, remaining);}}if(isCalled && timeoutId){timeoutId = clearTimeout(timeoutId);}else if(!timeoutId && wait !== maxWait){timeoutId = setTimeout(delayed, wait);}if(leadingCall){isCalled = true;result = func.apply(thisArg, args);}if(isCalled && !timeoutId && !maxTimeoutId){args = thisArg = null;}return result;};}function defer(func){if(!isFunction(func)){throw new TypeError();}var args=slice(arguments, 1);return setTimeout(function(){func.apply(undefined, args);}, 1);}function delay(func, wait){if(!isFunction(func)){throw new TypeError();}var args=slice(arguments, 2);return setTimeout(function(){func.apply(undefined, args);}, wait);}function memoize(func, resolver){if(!isFunction(func)){throw new TypeError();}var memoized=(function(_memoized){var _memoizedWrapper=function memoized(){return _memoized.apply(this, arguments);};_memoizedWrapper.toString = function(){return _memoized.toString();};return _memoizedWrapper;})(function(){var cache=memoized.cache, key=resolver?resolver.apply(this, arguments):keyPrefix + arguments[0];return hasOwnProperty.call(cache, key)?cache[key]:cache[key] = func.apply(this, arguments);});memoized.cache = {};return memoized;}function once(func){var ran, result;if(!isFunction(func)){throw new TypeError();}return function(){if(ran){return result;}ran = true;result = func.apply(this, arguments);func = null;return result;};}function partial(func){return createWrapper(func, 16, slice(arguments, 1));}function partialRight(func){return createWrapper(func, 32, null, slice(arguments, 1));}function throttle(func, wait, options){var leading=true, trailing=true;if(!isFunction(func)){throw new TypeError();}if(options === false){leading = false;}else if(isObject(options)){leading = "leading" in options?options.leading:leading;trailing = "trailing" in options?options.trailing:trailing;}debounceOptions.leading = leading;debounceOptions.maxWait = wait;debounceOptions.trailing = trailing;return debounce(func, wait, debounceOptions);}function wrap(value, wrapper){return createWrapper(wrapper, 16, [value]);}function constant(value){return function(){return value;};}function createCallback(func, thisArg, argCount){var type=typeof func;if(func == null || type == "function"){return baseCreateCallback(func, thisArg, argCount);}if(type != "object"){return property(func);}var props=keys(func), key=props[0], a=func[key];if(props.length == 1 && a === a && !isObject(a)){return function(object){var b=object[key];return a === b && (a !== 0 || 1 / a == 1 / b);};}return function(object){var length=props.length, result=false;while(length--) {if(!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))){break;}}return result;};}function escape(string){return string == null?"":String(string).replace(reUnescapedHtml, escapeHtmlChar);}function identity(value){return value;}function mixin(object, source, options){var chain=true, methodNames=source && functions(source);if(!source || !options && !methodNames.length){if(options == null){options = source;}ctor = lodashWrapper;source = object;object = lodash;methodNames = functions(source);}if(options === false){chain = false;}else if(isObject(options) && "chain" in options){chain = options.chain;}var ctor=object, isFunc=isFunction(ctor);forEach(methodNames, function(methodName){var func=object[methodName] = source[methodName];if(isFunc){ctor.prototype[methodName] = function(){var chainAll=this.__chain__, value=this.__wrapped__, args=[value];push.apply(args, arguments);var result=func.apply(object, args);if(chain || chainAll){if(value === result && isObject(result)){return this;}result = new ctor(result);result.__chain__ = chainAll;}return result;};}});}function noConflict(){context._ = oldDash;return this;}function noop(){}var now=isNative(now = Date.now) && now || function(){return new Date().getTime();};var parseInt=nativeParseInt(whitespace + "08") == 8?nativeParseInt:function(value, radix){return nativeParseInt(isString(value)?value.replace(reLeadingSpacesAndZeros, ""):value, radix || 0);};function property(key){return function(object){return object[key];};}function random(min, max, floating){var noMin=min == null, noMax=max == null;if(floating == null){if(typeof min == "boolean" && noMax){floating = min;min = 1;}else if(!noMax && typeof max == "boolean"){floating = max;noMax = true;}}if(noMin && noMax){max = 1;}min = +min || 0;if(noMax){max = min;min = 0;}else {max = +max || 0;}if(floating || min % 1 || max % 1){var rand=nativeRandom();return nativeMin(min + rand * (max - min + parseFloat("1e-" + ((rand + "").length - 1))), max);}return baseRandom(min, max);}function result(object, key){if(object){var value=object[key];return isFunction(value)?object[key]():value;}}function template(text, data, options){var settings=lodash.templateSettings;text = String(text || "");options = defaults({}, options, settings);var imports=defaults({}, options.imports, settings.imports), importsKeys=keys(imports), importsValues=values(imports);var isEvaluating, index=0, interpolate=options.interpolate || reNoMatch, source="__p += '";var reDelimiters=RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate?reEsTemplate:reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset){interpolateValue || (interpolateValue = esTemplateValue);source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);if(escapeValue){source += "' +\n__e(" + escapeValue + ") +\n'";}if(evaluateValue){isEvaluating = true;source += "';\n" + evaluateValue + ";\n__p += '";}if(interpolateValue){source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";}index = offset + match.length;return match;});source += "';\n";var variable=options.variable, hasVariable=variable;if(!hasVariable){variable = "obj";source = "with (" + variable + ") {\n" + source + "\n}\n";}source = (isEvaluating?source.replace(reEmptyStringLeading, ""):source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");source = "function(" + variable + ") {\n" + (hasVariable?"":variable + " || (" + variable + " = {});\n") + "var __t, __p = '', __e = _.escape" + (isEvaluating?", __j = Array.prototype.join;\n" + "function print() { __p += __j.call(arguments, '') }\n":";\n") + source + "return __p\n}";var sourceURL="\n/*\n//# sourceURL=" + (options.sourceURL || "/lodash/template/source[" + templateCounter++ + "]") + "\n*/";try{var result=Function(importsKeys, "return " + source + sourceURL).apply(undefined, importsValues);}catch(e) {e.source = source;throw e;}if(data){return result(data);}result.source = source;return result;}function times(n, callback, thisArg){n = (n = +n) > -1?n:0;var index=-1, result=Array(n);callback = baseCreateCallback(callback, thisArg, 1);while(++index < n) {result[index] = callback(index);}return result;}function unescape(string){return string == null?"":String(string).replace(reEscapedHtml, unescapeHtmlChar);}function uniqueId(prefix){var id=++idCounter;return String(prefix == null?"":prefix) + id;}function chain(value){value = new lodashWrapper(value);value.__chain__ = true;return value;}function tap(value, interceptor){interceptor(value);return value;}function wrapperChain(){this.__chain__ = true;return this;}function wrapperToString(){return String(this.__wrapped__);}function wrapperValueOf(){return this.__wrapped__;}lodash.after = after;lodash.assign = assign;lodash.at = at;lodash.bind = bind;lodash.bindAll = bindAll;lodash.bindKey = bindKey;lodash.chain = chain;lodash.compact = compact;lodash.compose = compose;lodash.constant = constant;lodash.countBy = countBy;lodash.create = create;lodash.createCallback = createCallback;lodash.curry = curry;lodash.debounce = debounce;lodash.defaults = defaults;lodash.defer = defer;lodash.delay = delay;lodash.difference = difference;lodash.filter = filter;lodash.flatten = flatten;lodash.forEach = forEach;lodash.forEachRight = forEachRight;lodash.forIn = forIn;lodash.forInRight = forInRight;lodash.forOwn = forOwn;lodash.forOwnRight = forOwnRight;lodash.functions = functions;lodash.groupBy = groupBy;lodash.indexBy = indexBy;lodash.initial = initial;lodash.intersection = intersection;lodash.invert = invert;lodash.invoke = invoke;lodash.keys = keys;lodash.map = map;lodash.mapValues = mapValues;lodash.max = max;lodash.memoize = memoize;lodash.merge = merge;lodash.min = min;lodash.omit = omit;lodash.once = once;lodash.pairs = pairs;lodash.partial = partial;lodash.partialRight = partialRight;lodash.pick = pick;lodash.pluck = pluck;lodash.property = property;lodash.pull = pull;lodash.range = range;lodash.reject = reject;lodash.remove = remove;lodash.rest = rest;lodash.shuffle = shuffle;lodash.sortBy = sortBy;lodash.tap = tap;lodash.throttle = throttle;lodash.times = times;lodash.toArray = toArray;lodash.transform = transform;lodash.union = union;lodash.uniq = uniq;lodash.values = values;lodash.where = where;lodash.without = without;lodash.wrap = wrap;lodash.xor = xor;lodash.zip = zip;lodash.zipObject = zipObject;lodash.collect = map;lodash.drop = rest;lodash.each = forEach;lodash.eachRight = forEachRight;lodash.extend = assign;lodash.methods = functions;lodash.object = zipObject;lodash.select = filter;lodash.tail = rest;lodash.unique = uniq;lodash.unzip = zip;mixin(lodash);lodash.clone = clone;lodash.cloneDeep = cloneDeep;lodash.contains = contains;lodash.escape = escape;lodash.every = every;lodash.find = find;lodash.findIndex = findIndex;lodash.findKey = findKey;lodash.findLast = findLast;lodash.findLastIndex = findLastIndex;lodash.findLastKey = findLastKey;lodash.has = has;lodash.identity = identity;lodash.indexOf = indexOf;lodash.isArguments = isArguments;lodash.isArray = isArray;lodash.isBoolean = isBoolean;lodash.isDate = isDate;lodash.isElement = isElement;lodash.isEmpty = isEmpty;lodash.isEqual = isEqual;lodash.isFinite = isFinite;lodash.isFunction = isFunction;lodash.isNaN = isNaN;lodash.isNull = isNull;lodash.isNumber = isNumber;lodash.isObject = isObject;lodash.isPlainObject = isPlainObject;lodash.isRegExp = isRegExp;lodash.isString = isString;lodash.isUndefined = isUndefined;lodash.lastIndexOf = lastIndexOf;lodash.mixin = mixin;lodash.noConflict = noConflict;lodash.noop = noop;lodash.now = now;lodash.parseInt = parseInt;lodash.random = random;lodash.reduce = reduce;lodash.reduceRight = reduceRight;lodash.result = result;lodash.runInContext = runInContext;lodash.size = size;lodash.some = some;lodash.sortedIndex = sortedIndex;lodash.template = template;lodash.unescape = unescape;lodash.uniqueId = uniqueId;lodash.all = every;lodash.any = some;lodash.detect = find;lodash.findWhere = find;lodash.foldl = reduce;lodash.foldr = reduceRight;lodash.include = contains;lodash.inject = reduce;mixin((function(){var source={};forOwn(lodash, function(func, methodName){if(!lodash.prototype[methodName]){source[methodName] = func;}});return source;})(), false);lodash.first = first;lodash.last = last;lodash.sample = sample;lodash.take = first;lodash.head = first;forOwn(lodash, function(func, methodName){var callbackable=methodName !== "sample";if(!lodash.prototype[methodName]){lodash.prototype[methodName] = function(n, guard){var chainAll=this.__chain__, result=func(this.__wrapped__, n, guard);return !chainAll && (n == null || guard && !(callbackable && typeof n == "function"))?result:new lodashWrapper(result, chainAll);};}});lodash.VERSION = "2.4.1";lodash.prototype.chain = wrapperChain;lodash.prototype.toString = wrapperToString;lodash.prototype.value = wrapperValueOf;lodash.prototype.valueOf = wrapperValueOf;baseEach(["join", "pop", "shift"], function(methodName){var func=arrayRef[methodName];lodash.prototype[methodName] = function(){var chainAll=this.__chain__, result=func.apply(this.__wrapped__, arguments);return chainAll?new lodashWrapper(result, chainAll):result;};});baseEach(["push", "reverse", "sort", "unshift"], function(methodName){var func=arrayRef[methodName];lodash.prototype[methodName] = function(){func.apply(this.__wrapped__, arguments);return this;};});baseEach(["concat", "slice", "splice"], function(methodName){var func=arrayRef[methodName];lodash.prototype[methodName] = function(){return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);};});if(!support.spliceObjects){baseEach(["pop", "shift", "splice"], function(methodName){var func=arrayRef[methodName], isSplice=methodName == "splice";lodash.prototype[methodName] = function(){var chainAll=this.__chain__, value=this.__wrapped__, result=func.apply(value, arguments);if(value.length === 0){delete value[0];}return chainAll || isSplice?new lodashWrapper(result, chainAll):result;};});}return lodash;}var _=runInContext();if(typeof define == "function" && typeof define.amd == "object" && define.amd){root._ = _;define(function(){return _;});}else if(freeExports && freeModule){if(moduleExports){(freeModule.exports = _)._ = _;}else {freeExports._ = _;}}else {root._ = _;}}).call(undefined);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
var pull = require("./../../lodash-amd/modern/arrays/pull");
'use strict';
function EventEmitter() {
    this._listeners = {};
}
EventEmitter.prototype.on = function (eventName, fn) {
    var listeners = this._listeners[eventName] || [];
    listeners.push(fn);
    this._listeners[eventName] = listeners;
};
EventEmitter.prototype.off = function (eventName, fn) {
    var listeners = this._listeners[eventName] || [];
    if (fn) {
        pull(listeners, fn);
    } else {
        delete this._listeners[eventName];
    }
};
EventEmitter.prototype.trigger = function (eventName, args) {
    var listeners = this._listeners[eventName] || [];
    listeners.forEach(function (listener) {
        listener.apply(null, args);
    });
};
module.exports = EventEmitter;
},{"./../../lodash-amd/modern/arrays/pull":1}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],6:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],7:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],8:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":7,"_process":6,"inherits":5}],9:[function(require,module,exports){
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

},{"vtree/vnode":14,"vtree/vtext":15}],10:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook && typeof hook.hook === "function" &&
        !hook.hasOwnProperty("hook")
}

},{}],11:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":13}],12:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],13:[function(require,module,exports){
module.exports = "1"

},{}],14:[function(require,module,exports){
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

},{"./is-vhook":10,"./is-vnode":11,"./is-widget":12,"./version":13}],15:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":13}],16:[function(require,module,exports){
var diff = require("vtree/diff")

module.exports = diff

},{"vtree/diff":49}],17:[function(require,module,exports){
module.exports = isObject

function isObject(x) {
    return typeof x === "object" && x !== null
}

},{}],18:[function(require,module,exports){
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

},{"is-object":17,"vtree/is-vhook":52}],19:[function(require,module,exports){
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

},{"./apply-properties":18,"global/document":21,"vtree/handle-thunk":50,"vtree/is-vnode":53,"vtree/is-vtext":54,"vtree/is-widget":55}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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
},{"min-document":4}],22:[function(require,module,exports){
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

},{"./apply-properties":18,"./create-element":19,"./update-widget":24,"vtree/is-widget":55,"vtree/vpatch":59}],23:[function(require,module,exports){
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

},{"./dom-index":20,"./patch-op":22,"global/document":21,"x-is-array":25}],24:[function(require,module,exports){
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

},{"vtree/is-widget":55}],25:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],26:[function(require,module,exports){
var patch = require("vdom/patch")

module.exports = patch

},{"vdom/patch":23}],27:[function(require,module,exports){
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

},{"data-set":32}],28:[function(require,module,exports){
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

},{"data-set":32}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{"./hooks/data-set-hook.js":27,"./hooks/ev-hook.js":28,"./hooks/soft-set-hook.js":29,"./parse-tag.js":48,"error/typed":39,"vtree/is-thunk":40,"vtree/is-vhook":41,"vtree/is-vnode":42,"vtree/is-vtext":43,"vtree/is-widget":44,"vtree/vnode.js":46,"vtree/vtext.js":47}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{"./create-hash.js":31,"individual":33,"weakmap-shim/create-store":34}],33:[function(require,module,exports){
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
},{}],34:[function(require,module,exports){
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

},{"./hidden-store.js":35}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
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

    extend(createError, args);
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


},{"camelize":36,"string-template":37,"xtend/mutable":38}],40:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],41:[function(require,module,exports){
module.exports=require(10)
},{"/Users/REdman/projects/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vhook.js":10}],42:[function(require,module,exports){
module.exports=require(11)
},{"./version":45,"/Users/REdman/projects/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vnode.js":11}],43:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":45}],44:[function(require,module,exports){
module.exports=require(12)
},{"/Users/REdman/projects/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-widget.js":12}],45:[function(require,module,exports){
module.exports=require(13)
},{"/Users/REdman/projects/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/version.js":13}],46:[function(require,module,exports){
module.exports=require(14)
},{"./is-vhook":41,"./is-vnode":42,"./is-widget":44,"./version":45,"/Users/REdman/projects/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/vnode.js":14}],47:[function(require,module,exports){
module.exports=require(15)
},{"./version":45,"/Users/REdman/projects/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/vtext.js":15}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
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

},{"./handle-thunk":50,"./is-thunk":51,"./is-vnode":53,"./is-vtext":54,"./is-widget":55,"./vpatch":59,"is-object":56,"x-is-array":57}],50:[function(require,module,exports){
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

},{"./is-thunk":51,"./is-vnode":53,"./is-vtext":54,"./is-widget":55}],51:[function(require,module,exports){
module.exports=require(40)
},{"/Users/REdman/projects/scribe-plugin-noting/node_modules/virtual-hyperscript/node_modules/vtree/is-thunk.js":40}],52:[function(require,module,exports){
module.exports=require(10)
},{"/Users/REdman/projects/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vhook.js":10}],53:[function(require,module,exports){
module.exports=require(11)
},{"./version":58,"/Users/REdman/projects/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vnode.js":11}],54:[function(require,module,exports){
module.exports=require(43)
},{"./version":58,"/Users/REdman/projects/scribe-plugin-noting/node_modules/virtual-hyperscript/node_modules/vtree/is-vtext.js":43}],55:[function(require,module,exports){
module.exports=require(12)
},{"/Users/REdman/projects/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-widget.js":12}],56:[function(require,module,exports){
module.exports=require(17)
},{"/Users/REdman/projects/scribe-plugin-noting/node_modules/virtual-dom/node_modules/is-object/index.js":17}],57:[function(require,module,exports){
module.exports=require(25)
},{"/Users/REdman/projects/scribe-plugin-noting/node_modules/virtual-dom/node_modules/x-is-array/index.js":25}],58:[function(require,module,exports){
module.exports=require(13)
},{"/Users/REdman/projects/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/version.js":13}],59:[function(require,module,exports){
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

},{"./version":58}],60:[function(require,module,exports){
module.exports=require(15)
},{"./version":58,"/Users/REdman/projects/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/vtext.js":15}],61:[function(require,module,exports){
"use strict";

// Scribe noting plugin
var generateNoteController = require("./src/generate-note-controller");
var NoteCommandFactory = require("./src/note-command-factory");
var config = require("./src/config");

// config, example:
// { user: 'Firstname Lastname',
//   scribeInstancesSelector: '.ui-rich-text-editor__input' }
module.exports = function (attrs) {

  config.set(attrs);

  return function (scribe) {
    config.get("selectors").forEach(function (selector) {
      NoteCommandFactory(scribe, selector.commandName, selector.tagName);
    });
    generateNoteController(scribe);
  };
};

},{"./src/config":86,"./src/generate-note-controller":87,"./src/note-command-factory":88}],62:[function(require,module,exports){
"use strict";

var isVFocus = require("../../utils/vfocus/is-vfocus");
var getNoteDataAttributes = require("../../utils/get-note-data-attrs");
var createVirtualScribeMarker = require("../../utils/create-virtual-scribe-marker");
var wrapInNote = require("./wrap-in-note");
var findScribeMarkers = require("../../utils/noting/find-scribe-markers");
var findEntireNote = require("../../utils/noting/find-entire-note");
var resetNoteSegmentClasses = require("./reset-note-segment-classes");
var errorHandle = require("../../utils/error-handle");
var config = require("../../config");

// We need a zero width space character to make the note selectable.
var zeroWidthSpace = "​";

module.exports = function createNoteAtCaret(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to createNoteAtCaret, you passed: %s", focus);
  }

  // To make sure the caret is placed within the note we place a scribe
  // maker within it.
  // Chrome is picky about needing the space to be before the marker
  // (otherwise the caret won't be placed within the note).
  var note = wrapInNote([zeroWidthSpace, createVirtualScribeMarker()], getNoteDataAttributes(), tagName);

  var marker = findScribeMarkers(focus)[0];
  if (!marker) {
    errorHandle("No scribe marker found within selection: %s", focus);
  }

  //inject the note
  marker.replace(note);

  //get any adjoining note segments
  var noteSegments = findEntireNote(marker, tagName);
  resetNoteSegmentClasses(noteSegments, tagName);

  return focus;
};

},{"../../config":86,"../../utils/create-virtual-scribe-marker":92,"../../utils/error-handle":94,"../../utils/get-note-data-attrs":96,"../../utils/noting/find-entire-note":101,"../../utils/noting/find-scribe-markers":108,"../../utils/vfocus/is-vfocus":133,"./reset-note-segment-classes":73,"./wrap-in-note":81}],63:[function(require,module,exports){
"use strict";

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var VText = require("vtree/vtext");
var config = require("../../config");

var isVFocus = require("../../utils/vfocus/is-vfocus");
var errorHandle = require("../../utils/error-handle");
var findTextBetweenScribeMarkers = require("../../utils/noting/find-text-between-scribe-markers");
var getNoteDataAttributes = require("../../utils/get-note-data-attrs");
var wrapInNote = require("./wrap-in-note");
var removeErroneousBrTags = require("./remove-erroneous-br-tags");
var removeScribeMarkers = require("./remove-scribe-markers");
var findLastNoteSegment = require("../../utils/noting/find-last-note-segment");
var findEntireNote = require("../../utils/noting/find-entire-note");
var resetNoteSegmentClasses = require("./reset-note-segment-classes");
var notesCache = require("../../utils/noting/note-cache");
var isNotWithinNote = require("../../utils/noting/is-not-within-note");
var isParagraph = require("../../utils/vfocus/is-paragraph");
var createVirtualScribeMarker = require("../../utils/create-virtual-scribe-marker");
var isNotEmpty = require("../../utils/vfocus/is-not-empty");
var removeEmptyNotes = require("../../actions/noting/remove-empty-notes");
var findScribeMarkers = require("../../utils/noting/find-scribe-markers");
var hasClass = require("../../utils/vdom/has-class");

// treeFocus: tree focus of tree containing two scribe markers
// Note that we will mutate the tree.
module.exports = function createNoteFromSelection(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus element can be passed to createNoteFromSelection, you passed: %s", focus);
  }
  // We want to wrap text nodes between the markers. We filter out nodes that have
  // already been wrapped.
  var toWrapAndReplace = findTextBetweenScribeMarkers(focus).filter(function (node) {
    return isNotWithinNote(node, tagName);
  });

  //wrap text nodes
  var noteDataSet = getNoteDataAttributes();
  var wrappedTextNodes = toWrapAndReplace.map(function (focus) {
    return wrapInNote(focus.vNode, noteDataSet, tagName);
  });

  // Replace the nodes in the tree with the wrapped versions.
  _.zip(toWrapAndReplace, wrappedTextNodes).forEach(function (focusAndReplacementVNode) {
    var focus = focusAndReplacementVNode[0];
    var replacementVNode = focusAndReplacementVNode[1];
    focus.replace(replacementVNode);
  });

  // If we end up with an empty note a <BR> tag would be created. We have to do
  // this before we remove the markers.
  removeErroneousBrTags(focus, tagName);

  // Update note properties (merges if necessary).
  var lastNoteSegment = findLastNoteSegment(toWrapAndReplace[0], tagName);
  var noteSegments = findEntireNote(lastNoteSegment, tagName);
  resetNoteSegmentClasses(noteSegments, tagName);

  // We need to clear the cache, and this has to be done before we place
  // our markers or we'll end up placing the cursor inside the note instead
  // of immediately after it.
  //
  // TODO: Revisit our caching strategy to make it less of a "foot gun", or
  // refactor so that we do less tree traversals and remove the caching.
  notesCache.set(focus);

  // Now let's place that caret.var
  removeScribeMarkers(focus);

  //first note barrier
  noteSegments[0].vNode.children.unshift(new VText("​"));

  var endingNoteSegment = noteSegments.slice(-1)[0];
  var nextNode = endingNoteSegment.find(function (node) {
    return isNotWithinNote(node, tagName);
  });
  //check whether the adjacent node is a child of the notes parent
  //if not the note is at the end of a paragraph and the caret needs to be placed within that paragraph
  //NOT within the adjacent node
  var isWithinSameElement = !!nextNode ? endingNoteSegment.parent.vNode.children.indexOf(nextNode.vNode) !== -1 : false;

  if (!isWithinSameElement) {
    endingNoteSegment.parent.addChild(new VText("​"));
    endingNoteSegment.parent.addChild(createVirtualScribeMarker());
  } else {
    var index = nextNode.parent.vNode.children.indexOf(nextNode.vNode);
    if (index === -1) {
      return focus;
    }
    nextNode.parent.vNode.children.splice(index, 0, new VText("​"), createVirtualScribeMarker());
  }

  removeEmptyNotes(focus, tagName);
  return focus;
};

},{"../../actions/noting/remove-empty-notes":67,"../../config":86,"../../utils/create-virtual-scribe-marker":92,"../../utils/error-handle":94,"../../utils/get-note-data-attrs":96,"../../utils/noting/find-entire-note":101,"../../utils/noting/find-last-note-segment":103,"../../utils/noting/find-scribe-markers":108,"../../utils/noting/find-text-between-scribe-markers":110,"../../utils/noting/is-not-within-note":114,"../../utils/noting/note-cache":119,"../../utils/vdom/has-class":123,"../../utils/vfocus/is-not-empty":131,"../../utils/vfocus/is-paragraph":132,"../../utils/vfocus/is-vfocus":133,"./../../../bower_components/lodash/dist/lodash.compat.js":2,"./remove-erroneous-br-tags":68,"./remove-scribe-markers":71,"./reset-note-segment-classes":73,"./wrap-in-note":81,"vtree/vtext":60}],64:[function(require,module,exports){
"use strict";

var isVFocus = require("../../utils/vfocus/is-vfocus");
var errorHandle = require("../../utils/error-handle");
var noteCache = require("../../utils/noting/note-cache");
var mergeIfNecessary = require("./merge-if-necessary");
var resetNoteBarriers = require("./reset-note-barriers");
var removeErroneousBrTags = require("./remove-erroneous-br-tags");
var config = require("../../config");

module.exports = function ensureNoteIntegrity(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorhandle("Only a valid VFocus element can be passed to ensureNoteIntegrity, you passed: %s", focus);
  }

  noteCache.set(focus);
  mergeIfNecessary(focus, tagName);
  resetNoteBarriers(focus, tagName);
  removeErroneousBrTags(focus, tagName);
};

},{"../../config":86,"../../utils/error-handle":94,"../../utils/noting/note-cache":119,"../../utils/vfocus/is-vfocus":133,"./merge-if-necessary":65,"./remove-erroneous-br-tags":68,"./reset-note-barriers":72}],65:[function(require,module,exports){
"use strict";

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var isVFocus = require("../../utils/vfocus/is-vfocus");
var errorHandle = require("../../utils/error-handle");
var findAllNotes = require("../../utils/noting/find-all-notes");
var resetNoteSegmentClasses = require("./reset-note-segment-classes");
var config = require("../../config");

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
module.exports = function mergeIfNecessary(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to mergeIfNecessary, you pased: %s", focus);
  }

  // Merging is simply a matter of updating the attributes of any notes
  // where all the segments of the note doesn't have the same timestamp,
  // or where there's no start or end property (e.g. when the user has deleted
  // the last note segment of a note).

  findAllNotes(focus, tagName)
  //find any notes that need to be reset
  .filter(function (note) {

    //find any inconsistent time stamps
    var inconsistentTimeStamps = _(note).map(function (segment) {
      return !!segment.vNode.properties.dataset.noteEditedBy;
    }).uniq().value();

    if (inconsistentTimeStamps.length > 1) {
      return true;
    }

    //check for the right data attributes
    var hasNoteStart = ("noteStart" in note[0].vNode.properties.dataset);
    var hasNoteEnd = ("noteEnd" in note[note.length - 1].vNode.properties.dataset);
    return !(hasNoteStart && hasNoteEnd);
  })
  //reset any resulting notes properties
  .forEach(function (note) {
    resetNoteSegmentClasses(note, tagName);
  });
};

},{"../../config":86,"../../utils/error-handle":94,"../../utils/noting/find-all-notes":99,"../../utils/vfocus/is-vfocus":133,"./../../../bower_components/lodash/dist/lodash.compat.js":2,"./reset-note-segment-classes":73}],66:[function(require,module,exports){
"use strict";

var VFocus = require("../../vfocus");
var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var isVFocus = require("../../utils/vfocus/is-vfocus");
var errorHandle = require("../../utils/error-handle");
var config = require("../../config");
var findScribeMarkers = require("../../utils/noting/find-scribe-markers");
var findNextNoteSegment = require("../../utils/noting/find-next-note-segment");
var isVText = require("../../utils/vfocus/is-vtext");
var findPreviousNoteSegment = require("../../utils/noting/find-previous-note-segment");
var removeScribeMarkers = require("./remove-scribe-markers");
var createVirtualScribeMarker = require("../../utils/create-virtual-scribe-marker");
var findFirstNoteSegment = require("../../utils/noting/find-first-note-segment");
var findEntireNote = require("../../utils/noting/find-entire-note");

module.exports = function removeCharacterFromAdjacentNote(focus) {
  var direction = arguments[1] === undefined ? "next" : arguments[1];
  var tagName = arguments[2] === undefined ? config.get("defaultTagName") : arguments[2];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to removeCharacterFromAdjacentNote, you passed: %s", focus);
  }

  var markers = findScribeMarkers(focus);
  if (!markers || markers.length === 2) {
    return focus;
  }

  var marker = markers[0];
  var note;
  var textNode;
  var textNodes;
  var characters;

  //TODO make this more dry WITHOUT using more if/else statements
  //jp 6-3-15
  if (direction === "next") {
    note = findNextNoteSegment(marker, tagName);
    textNodes = note.filter(isVText);
    //check the first element is a zero width space
    textNode = textNodes[0].vNode.text === "​" ? textNodes[1] : textNodes[0];

    if (!textNode) {
      return;
    }

    //remove only the first character from the next note
    characters = textNode.vNode.text.split("");
    characters.splice(1, 1);
    textNode.vNode.text = characters.join("");
    removeScribeMarkers(focus);
  } else {
    var lastNoteSegment = findPreviousNoteSegment(marker, tagName);
    var firstNoteSegment = findNextNoteSegment(lastNoteSegment, tagName);
    var note = findEntireNote(firstNoteSegment, tagName);

    //get all textnodes within the note
    var textNodes = note.map(function (noteSegment) {
      return noteSegment.children().filter(function (node) {
        return isVText(new VFocus(node));
      });
    });
    textNodes = _.flatten(textNodes);
    textNode = textNodes[textNodes.length - 1].text === "​" ? textNodes[textNodes.length - 2] : textNodes[textNodes.length - 1];

    if (!textNode) {
      return;
    }

    //remove only the previous character from the previsou note
    characters = textNode.text.split("");
    characters.splice(characters.length - 1, 1);
    textNode.text = characters.join("");
    removeScribeMarkers(focus);
    note.slice(-1)[0].addChild(createVirtualScribeMarker());
  }
};

},{"../../config":86,"../../utils/create-virtual-scribe-marker":92,"../../utils/error-handle":94,"../../utils/noting/find-entire-note":101,"../../utils/noting/find-first-note-segment":102,"../../utils/noting/find-next-note-segment":104,"../../utils/noting/find-previous-note-segment":107,"../../utils/noting/find-scribe-markers":108,"../../utils/vfocus/is-vfocus":133,"../../utils/vfocus/is-vtext":134,"../../vfocus":135,"./../../../bower_components/lodash/dist/lodash.compat.js":2,"./remove-scribe-markers":71}],67:[function(require,module,exports){
"use strict";

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var isVFocus = require("../../utils/vfocus/is-vfocus");
var isVText = require("../../utils/vfocus/is-vtext");
var isEmpty = require("../../utils/vfocus/is-empty");

var findAllNotes = require("../../utils/noting/find-all-notes");
var flattenTree = require("../../utils/vfocus/flatten-tree");

var errorHandle = require("../../utils/error-handle");
var config = require("../../config");

module.exports = function removeEmptyNotes(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to removeEmptyNotes, you passed: %s", focus);
  }

  //return all notes from the given tree
  var allNoteSegments = _.flatten(findAllNotes(focus, tagName));

  var noteSequences = allNoteSegments.map(flattenTree);

  noteSequences.forEach(function (noteSequence) {

    var noteParent = noteSequence.splice(0, 1)[0];

    //if we have a totally empty note we have an array of 1
    if (noteSequence.length <= 0) {
      noteParent.remove();
      return;
    }

    //assume we have only empty child elements
    //if one is not change the state of the check
    var childrenAreEmpty = noteSequence.reduce(function (check, childFocus) {
      return !isEmpty(childFocus) ? false : true;
    }, true);

    //if a note is totally empty remove it
    if (childrenAreEmpty) noteParent.remove();
  });
};

},{"../../config":86,"../../utils/error-handle":94,"../../utils/noting/find-all-notes":99,"../../utils/vfocus/flatten-tree":127,"../../utils/vfocus/is-empty":130,"../../utils/vfocus/is-vfocus":133,"../../utils/vfocus/is-vtext":134,"./../../../bower_components/lodash/dist/lodash.compat.js":2}],68:[function(require,module,exports){
"use strict";

var VText = require("vtree/vtext");
var VFocus = require("../../vfocus");
var isVFocus = require("../../utils/vfocus/is-vfocus");
var isVText = require("../../utils/vfocus/is-vtext");
var errorHandle = require("../../utils/error-handle");
var config = require("../../config");

var findScribeMarkers = require("../../utils/noting/find-scribe-markers");
var isNoteSegment = require("../../utils/noting/is-note-segment");
var hasOnlyEmptyTextChildren = require("../../utils/vfocus/has-only-empty-text-children");
var hasNoTextChildren = require("../../utils/vfocus/has-no-text-children");

// In a contenteditable, Scribe currently insert a <BR> tag into empty elements.
// This causes styling issues when the user deletes a part of a note,
// e.g. using backspace. This function provides a workaround and should be run
// anytime a note segment might be empty (as defined by `vdom.consideredEmpty`).
// TODO: Fix this in Scribe.
module.exports = function preventBrTags(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus element can be passed to preventBrTags, you passsed: %s", focus);
  }

  // We're only interested in when content is removed, meaning
  // there should only be one marker (a collapsed selection).
  //
  // Could possibly develop a way of knowing deletions from
  // additions, but this isn't necessary at the moment.
  var markers = findScribeMarkers(focus);

  //if we have a selection return
  if (markers.length === 2 || !markers[0]) {
    return;
  }

  var marker = markers[0];

  //find the previous and next note segment
  var segments = [marker.find(function (node) {
    return isNoteSegment(node, tagName);
  }, "prev"), marker.find(function (node) {
    return isNoteSegment(node, tagName);
  })].filter(function (o) {
    return !!o;
  });

  // Replace/delete empty notes, and parents that might have become empty.
  segments.map(function (segment) {
    if (hasOnlyEmptyTextChildren(segment)) {
      // When we delete a space we want to add a space to the previous
      // note segment.
      var prevNoteSegment = segment.prev().find(function (node) {
        return isNoteSegment(node, tagName);
      }, "prev");
      if (prevNoteSegment) {
        //get the last text node
        var lastTextNode = prevNoteSegment.children().filter(function (vNode) {
          return isVText(new VFocus(vNode));
        }).slice(-1)[0];

        if (lastTextNode) {
          lastTextNode.text = lastTextNode.text + " ";
        }
      }
    }

    if (hasNoTextChildren(segment) || hasOnlyEmptyTextChildren(segment)) {
      // In Chrome, removing causes text before the note to be deleted when
      // deleting the last note segment. Replacing with an empty node works
      // fine in Chrome and FF.
      var replaced = segment.replace(new VText("​"));

      //remove empty ancestor nodes
      while (replaced) {
        if (!replaced.canDown()) {
          replaced.remove();
        }
        replaced = replaced.up();
      }
    }
  });
};

},{"../../config":86,"../../utils/error-handle":94,"../../utils/noting/find-scribe-markers":108,"../../utils/noting/is-note-segment":115,"../../utils/vfocus/has-no-text-children":128,"../../utils/vfocus/has-only-empty-text-children":129,"../../utils/vfocus/is-vfocus":133,"../../utils/vfocus/is-vtext":134,"../../vfocus":135,"vtree/vtext":60}],69:[function(require,module,exports){
"use strict";

var isVFocus = require("../../utils/vfocus/is-vfocus");
var errorHandle = require("../../utils/error-handle");
var config = require("../../config");

var findScribeMarkers = require("../../utils/noting/find-scribe-markers");
var noteCache = require("../../utils/noting/note-cache");
var findParentNoteSegment = require("../../utils/noting/find-parent-note-segment");
var findNoteById = require("../../utils/noting/find-note-by-id");
var unWrapNote = require("./unwrap-note");
var ensureNoteIntegrity = require("./ensure-note-integrity");
var stripZeroWidthSpaces = require("./strip-zero-width-space");

// treeFocus: tree focus of tree containing two scribe markers
// Note that we will mutate the tree.
module.exports = function removeNote(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus element can be passed to removeNote, you passed: %s", focus);
  }

  // We assume the caller knows there's only one marker.
  var marker = findScribeMarkers(focus)[0];

  noteCache.set(focus);

  // We can't use findEntireNote here since it'll sometimes give us the wrong result.
  // See `findEntireNote` documentation. Instead we look the note up by its ID.

  var noteSegment = findParentNoteSegment(marker, tagName);
  var noteSegments = findNoteById(focus, noteSegment.vNode.properties.dataset.noteId, tagName);

  noteSegments.map(function (node) {
    return stripZeroWidthSpaces(node);
  }).forEach(function (node) {
    return unWrapNote(node, tagName);
  });

  ensureNoteIntegrity(focus, tagName);

  // The marker is where we want it to be (the same position) so we'll
  // just leave it.
  return focus;
};

},{"../../config":86,"../../utils/error-handle":94,"../../utils/noting/find-note-by-id":105,"../../utils/noting/find-parent-note-segment":106,"../../utils/noting/find-scribe-markers":108,"../../utils/noting/note-cache":119,"../../utils/vfocus/is-vfocus":133,"./ensure-note-integrity":64,"./strip-zero-width-space":75,"./unwrap-note":80}],70:[function(require,module,exports){
"use strict";

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var VText = require("vtree/vtext");
var config = require("../../config");

var isVFocus = require("../../utils/vfocus/is-vfocus");
var errorHandle = require("../../utils/error-handle");
var findTextBetweenScribeMarkers = require("../../utils/noting/find-text-between-scribe-markers");
var findEntireNote = require("../../utils/noting/find-entire-note");
var flattenTree = require("../../utils/vfocus/flatten-tree");
var isVText = require("../../utils/vfocus/is-vtext");
var getNoteDataAttribs = require("../../utils/get-note-data-attrs");
var wrapInNote = require("./wrap-in-note");
var unWrapNote = require("./unwrap-note");
var ensureNoteIntegrity = require("./ensure-note-integrity");
var findScribeMarkers = require("../../utils/noting/find-scribe-markers");
var removeEmptyNotes = require("./remove-empty-notes");
var stripZeroWidthSpaces = require("./strip-zero-width-space");
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
module.exports = function removePartofNote(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to unNotePartOfNote, you passed: %s", focus);
  }

  var focusesToUnnote = findTextBetweenScribeMarkers(focus);
  var entireNote = findEntireNote(focusesToUnnote[0], tagName);

  var entireNoteTextNodeFocuses = _(entireNote).map(flattenTree).flatten().value().filter(isVText);

  var entireNoteTextNodes = entireNoteTextNodeFocuses.map(function (nodeFocus) {
    return nodeFocus.vNode;
  });
  var textNodesToUnote = focusesToUnnote.map(function (nodeFocus) {
    return nodeFocus.vNode;
  });
  var toWrapAndReplace = _.difference(entireNoteTextNodes, textNodesToUnote);

  var focusesToNote = entireNoteTextNodeFocuses.filter(function (nodeFocus) {
    return textNodesToUnote.indexOf(nodeFocus.vNode) === -1;
  });

  var noteData = getNoteDataAttribs();

  // Wrap the text nodes.
  var wrappedTextNodes = toWrapAndReplace.map(function (nodeFocus) {
    return wrapInNote(nodeFocus, noteData, tagName);
  });

  // Replace the nodes in the tree with the wrapped versions.
  _.zip(focusesToNote, wrappedTextNodes).forEach(function (node) {
    return node[0].replace(node[1]);
  });

  // Unwrap previously existing note.
  entireNote.forEach(function (node) {
    return unWrapNote(node, tagName);
  });

  // Unless the user selected the entire note contents, notes to the left
  // and/or right of the selection will have been created. We need to update
  // their attributes and CSS classes.
  var onlyPartOfContentsSelected = focusesToNote[0];
  if (onlyPartOfContentsSelected) {
    ensureNoteIntegrity(onlyPartOfContentsSelected.top(), tagName);
  }

  // Place marker immediately before the note to the right (this way of doing
  // that seems to be the most reliable for some reason). Both Chrome and
  // Firefox have issues with this however. To force them to behave we insert
  // an empty span element inbetween.
  var markers = findScribeMarkers(focus.refresh());
  markers[0].remove();

  // If the user selected everything but a space (or zero width space), we remove
  // the remaining note. Most likely that's what our user intended.
  removeEmptyNotes(focus.refresh(), tagName);

  return focus;
};

},{"../../config":86,"../../utils/error-handle":94,"../../utils/get-note-data-attrs":96,"../../utils/noting/find-entire-note":101,"../../utils/noting/find-scribe-markers":108,"../../utils/noting/find-text-between-scribe-markers":110,"../../utils/vfocus/flatten-tree":127,"../../utils/vfocus/is-vfocus":133,"../../utils/vfocus/is-vtext":134,"./../../../bower_components/lodash/dist/lodash.compat.js":2,"./ensure-note-integrity":64,"./remove-empty-notes":67,"./strip-zero-width-space":75,"./unwrap-note":80,"./wrap-in-note":81,"vtree/vtext":60}],71:[function(require,module,exports){
"use strict";

var isVFocus = require("../../utils/vfocus/is-vfocus");
var isScribeMarker = require("../../utils/noting/is-scribe-marker");
var errorHandle = require("../../utils/error-handle");

module.exports = function removeScribemarkers(focus) {

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to removeScribeMarkers, you passed: %s", focus);
  }

  focus.filter(isScribeMarker).forEach(function (marker) {
    marker.remove();
  });
};

},{"../../utils/error-handle":94,"../../utils/noting/is-scribe-marker":116,"../../utils/vfocus/is-vfocus":133}],72:[function(require,module,exports){
"use strict";

var VText = require("vtree/vtext");
var isVFocus = require("../../utils/vfocus/is-vfocus");
var isVText = require("../../utils/vfocus/is-vtext");
var findAllNotes = require("../../utils/noting/find-all-notes");
var createNoteBarrier = require("../../utils/create-note-barrier");
var isNotWithinNote = require("../../utils/noting/is-not-within-note");
var isNotEmpty = require("../../utils/vfocus/is-not-empty");
var errorHandle = require("../../utils/error-handle");
var config = require("../../config");

//In order to create the correct type of caret movement we need to insert zero width spaces.
//These are placed at the beginning (within) the note and at the end (outside) of the note.
//When merging or splitting notes it is important to ensure there are no spaces within the note body
//and at the beginning and end of the note
module.exports = function resetNoteBarriers(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus element can be passed to resetNoteBarriers, you passed: ", focus);
  }

  //add new note barriers
  findAllNotes(focus, tagName).forEach(function (noteSegments) {

    //remove any note barriers that exist
    noteSegments.forEach(function (note) {
      note.filter(isVText).forEach(function (focus) {
        focus.vNode.text = focus.vNode.text.replace(/\u200B/g, "");
      });
    });

    //add zero width space to first note segment first note
    noteSegments[0].next().insertBefore(createNoteBarrier());

    //insert a note barrier after the current note
    var endingNoteSegment = noteSegments.slice(-1)[0];
    var nextNode = endingNoteSegment.find(function (node) {
      return isNotWithinNote(node, tagName);
    });

    //check whether the adjacent node is a child of the notes parent
    //if not the note is at the end of a paragraph and the caret needs to be placed within that paragraph
    //NOT within the adjacent node
    var isWithinSameElement = !!nextNode ? endingNoteSegment.parent.indexOf(nextNode.vNode) !== -1 : false;

    if (!isWithinSameElement) {
      endingNoteSegment.parent.addChild(new VText("​"));
    } else {
      var index = nextNode.parent.indexOf(nextNode);
      return index === -1 ? focus : nextNode.parent.spliceChildren(index, 0, new VText("​"));
    }
  });
};

},{"../../config":86,"../../utils/create-note-barrier":91,"../../utils/error-handle":94,"../../utils/noting/find-all-notes":99,"../../utils/noting/is-not-within-note":114,"../../utils/vfocus/is-not-empty":131,"../../utils/vfocus/is-vfocus":133,"../../utils/vfocus/is-vtext":134,"vtree/vtext":60}],73:[function(require,module,exports){
"use strict";

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var addClass = require("../../actions/vdom/add-class");
var removeClass = require("../../actions/vdom/remove-class");
var isVFocus = require("../../utils/vfocus/is-vfocus");
var generateUUID = require("../../utils/generate-uuid");
var addAttribute = require("../vdom/add-attribute");
var getUKDate = require("../../utils/get-uk-date");
var config = require("../../config");

// Ensure the first (and only the first) note segment has a
// `note--start` class and that the last (and only the last)
// note segment has a `note--end` class.
module.exports = function updateStartAndEndClasses(noteSegments) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!noteSegments) {
    return;
  }

  noteSegments = _.isArray(noteSegments) ? noteSegments : [noteSegments];

  var uuid = generateUUID();

  //get the click interaction type
  var clickInteractionType = config.get("selectors").reduce(function (last, selector) {
    return selector.tagName === tagName ? selector.clickAction : last;
  }, config.get("defaultClickInteractionType"));

  noteSegments.forEach(function (note, index) {
    var node = note.vNode || note;
    //set the interaction type on a given node
    addAttribute(node, "data-click-action", clickInteractionType);
    addAttribute(node, "data-note-id", uuid);
    removeClass(node, "note--start");
    removeClass(node, "note--end");
  });

  addClass(noteSegments[0].vNode, "note--start");
  addClass(noteSegments[noteSegments.length - 1].vNode, "note--end");

  return noteSegments;
};

},{"../../actions/vdom/add-class":83,"../../actions/vdom/remove-class":84,"../../config":86,"../../utils/generate-uuid":95,"../../utils/get-uk-date":97,"../../utils/vfocus/is-vfocus":133,"../vdom/add-attribute":82,"./../../../bower_components/lodash/dist/lodash.compat.js":2}],74:[function(require,module,exports){
"use strict";

var isVFocus = require("../../utils/vfocus/is-vfocus");
var config = require("../../config");
var errorHandle = require("../../utils/error-handle");
var findScribeMarkers = require("../../utils/noting/find-scribe-markers");
var findParentNoteSegment = require("../../utils/noting/find-parent-note-segment");
var findEntireNote = require("../../utils/noting/find-entire-note");
var removeScribeMarkers = require("./remove-scribe-markers");
var createVirtualScribeMarker = require("../../utils/create-virtual-scribe-marker");

module.exports = function selectNoteFromCaret(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus element can be passed to selectNoteFromCaret, you passed: %s", focus);
  }

  var markers = findScribeMarkers(focus);
  if (!markers.length) {
    return focus;
  }

  var parentNoteSegment = findParentNoteSegment(markers[0]);
  var note = findEntireNote(parentNoteSegment);
  removeScribeMarkers(focus);

  note[0].prependChildren(createVirtualScribeMarker());
  note.splice(-1)[0].addChild(createVirtualScribeMarker());
  return focus;
};

},{"../../config":86,"../../utils/create-virtual-scribe-marker":92,"../../utils/error-handle":94,"../../utils/noting/find-entire-note":101,"../../utils/noting/find-parent-note-segment":106,"../../utils/noting/find-scribe-markers":108,"../../utils/vfocus/is-vfocus":133,"./remove-scribe-markers":71}],75:[function(require,module,exports){
"use strict";

var isVFocus = require("../../utils/vfocus/is-vfocus");
var errorhandle = require("../../utils/error-handle");
var isVText = require("../../utils/vfocus/is-vtext");

module.exports = function stripZeroWidthSpaces(focus) {

  if (!isVFocus(focus)) {
    errorhandle("Only a valid VFocus can be passed to stripZeroWidthSpaces, you passed: %s", focus);
  }

  focus.filter(isVText).forEach(function (node) {
    node.vNode.text = node.vNode.text.replace(/\u200B/g, "");
  });

  return focus;
};

},{"../../utils/error-handle":94,"../../utils/vfocus/is-vfocus":133,"../../utils/vfocus/is-vtext":134}],76:[function(require,module,exports){
"use strict";

var isVFocus = require("../../utils/vfocus/is-vfocus");
var toggleNoteClasses = require("./toggle-note-classes");
var findAllNotes = require("../../utils/noting/find-all-notes");
var config = require("../../config");
var errorHandle = require("../../utils/error-handle");

module.exports = function toggleAllNoteCollapseState(focus) {

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to toggleAllNotesCollapseState, you passed: %s", focus);
  }

  var notes = findAllNotes(focus);
  return toggleNoteClasses(notes, config.get("noteCollapsedClass"));
};

},{"../../config":86,"../../utils/error-handle":94,"../../utils/noting/find-all-notes":99,"../../utils/vfocus/is-vfocus":133,"./toggle-note-classes":77}],77:[function(require,module,exports){
"use strict";

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var toggleClass = require("../vdom/toggle-class");
var addClass = require("../vdom/add-class");
var removeClass = require("../vdom/remove-class");
var collapseState = require("../../utils/collapse-state");
var errorHandle = require("../../utils/error-handle");

module.exports = function toggleNoteClasses(notes, className) {

  if (!notes || !className) {
    errorHandle("Only a valid VFocus can be passed to toggleNoteClasses, you passed: %s", focus);
  }

  notes = _.isArray(notes) ? notes : [notes];
  notes = _.flatten(notes);

  var action;
  if (notes.length === 1) {
    //if we have only one note we can assume that it should be toggled
    //because we assume it has been clicked
    action = toggleClass;
  } else {
    //if we have more than one note then we want them all to share state
    var state = collapseState.get();
    state ? action = removeClass : action = addClass;
  }

  notes.forEach(function (vNode) {
    vNode = vNode.vNode || vNode;
    action(vNode, className);
  });
};

},{"../../utils/collapse-state":90,"../../utils/error-handle":94,"../vdom/add-class":83,"../vdom/remove-class":84,"../vdom/toggle-class":85,"./../../../bower_components/lodash/dist/lodash.compat.js":2}],78:[function(require,module,exports){
"use strict";

var isVFocus = require("../../utils/vfocus/is-vfocus");
var toggleNoteClasses = require("./toggle-note-classes");
var findSelectedNote = require("../../utils/noting/find-selected-note");
var config = require("../../config");
var errorHandle = require("../../utils/error-handle");
var config = require("../../config");

module.exports = function toggleSelectedNoteCollapseState(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to toggleSelectedNoteCollapseState, you passed: %s", focus);
  }

  var note = findSelectedNote(focus, tagName);

  if (!note) {
    return;
  }

  return toggleNoteClasses(note, config.get("noteCollapsedClass"));
};

},{"../../config":86,"../../utils/error-handle":94,"../../utils/noting/find-selected-note":109,"../../utils/vfocus/is-vfocus":133,"./toggle-note-classes":77}],79:[function(require,module,exports){
"use strict";

var isVFocus = require("../../utils/vfocus/is-vfocus");
var VFocus = require("../../vfocus");
var errorHandle = require("../../utils/error-handle");

var findSelectedNote = require("../../utils/noting/find-selected-note");
var flattenTree = require("../../utils/vfocus/flatten-tree");
var isNoteSegment = require("../../utils/noting/is-note-segment");
var unWrapNote = require("./unwrap-note");

module.exports = function toggleSelectedNoteTagNames(focus, tagName, replacementTagName) {

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to toggleSelectedNoteTagNames, you passed: %s", focus);
  }

  var noteSegments = findSelectedNote(focus, tagName);

  if (!noteSegments) {
    return;
  }

  noteSegments.forEach(function (note) {

    //get any child notes that are now contained within our parent note
    var decendentNotes = flattenTree(note).filter(function (node) {
      return isNoteSegment(node, replacementTagName);
    });
    //if we have any child notes of the new tag type, unwrap them (like a merge)
    if (!!decendentNotes.length) {
      decendentNotes.forEach(function (node) {
        return unWrapNote(node, replacementTagName);
      });
    }

    flattenTree(note).forEach(function (vFocus) {
      if (vFocus.vNode.tagName === tagName || vFocus.vNode.tagName === tagName.toUpperCase()) {
        vFocus.vNode.tagName = replacementTagName.toUpperCase();
      }
    });
  });
};

},{"../../utils/error-handle":94,"../../utils/noting/find-selected-note":109,"../../utils/noting/is-note-segment":115,"../../utils/vfocus/flatten-tree":127,"../../utils/vfocus/is-vfocus":133,"../../vfocus":135,"./unwrap-note":80}],80:[function(require,module,exports){
"use strict";

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var isVFocus = require("../../utils/vfocus/is-vfocus");
var isNoteSegment = require("../../utils/noting/is-note-segment");
var errorHandle = require("../../utils/error-handle");
var config = require("../../config");

module.exports = function unWrapNote(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus) || !focus.parent) {
    errorHandle("Only a valid VFocus can be passed to unWrapNote, you passed: %s", focus);
  }

  if (!isNoteSegment(focus, tagName)) {
    errorHandle("Only a valid note segment can be passed to unWrapNote, you passed: %s", focus);
  }

  var note = focus.vNode;

  var tree = !!focus.parent.vNode ? focus.parent.vNode.children : focus.parent.children;

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

},{"../../config":86,"../../utils/error-handle":94,"../../utils/noting/is-note-segment":115,"../../utils/vfocus/is-vfocus":133,"./../../../bower_components/lodash/dist/lodash.compat.js":2}],81:[function(require,module,exports){
"use strict";

var config = require("../../config");
var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var h = require("virtual-hyperscript");

var getUKDate = require("../../utils/get-uk-date");
var config = require("../../config");

// Wrap in a note.
// toWrap can be a vNode, DOM node or a string. One or an array with several.
module.exports = function wrapInNote(focus, data) {
  var tagName = arguments[2] === undefined ? config.get("defaultTagName") : arguments[2];

  var notes = _.isArray(focus) ? focus : [focus];

  //data MUST be cloned as this can lead to multiple notes with the same note ID see:
  // https://github.com/guardian/scribe-plugin-noting/issues/45
  data = _.extend({}, data || {});

  tagName = tagName + "." + config.get("className");

  return h(tagName, { title: getUKDate(data), dataset: data }, notes);
};

},{"../../config":86,"../../utils/get-uk-date":97,"./../../../bower_components/lodash/dist/lodash.compat.js":2,"virtual-hyperscript":30}],82:[function(require,module,exports){
"use strict";

var toCamelCase = require("../../utils/to-camel-case");

module.exports = function addAttribute(node, key, val) {

  node = node.vNode || node;
  node.properties.dataset = node.properties.dataset || {};

  if (/^data-.+/.test(key)) {
    //remove data- part of the string
    key = toCamelCase(key.replace(/data-/, ""));
    node.properties.dataset[key] = val;
  } else {
    node.properties[key] = val;
  }
};

},{"../../utils/to-camel-case":121}],83:[function(require,module,exports){
"use strict";

var hasClass = require("../../utils/vdom/has-class");
var errorHandle = require("../../utils/error-handle");

module.exports = function addClass(vNode, className) {

  if (!vNode || !className) {
    errorHandle("A valid vNode and class name must be passed to addClass, you passed: %s, %s", vNode, className);
  }

  if (hasClass(vNode, className)) {
    return vNode;
  }

  if (!vNode.properties.className) {
    vNode.properties.className = className;
    return vNode;
  }

  vNode.properties.className = vNode.properties.className + " " + className;
  return vNode;
};

},{"../../utils/error-handle":94,"../../utils/vdom/has-class":123}],84:[function(require,module,exports){
"use strict";

var hasClass = require("../../utils/vdom/has-class");
var errorHandle = require("../../utils/error-handle");

module.exports = function removeClass(vNode, className) {

  if (!vNode || !className) {
    errorHandle("Onlu a valid vNode and class name can be passed to removeClass, you passed: %s, %s", vNode, className);
  }

  if (!hasClass(vNode, className)) {
    return vNode;
  }

  var regex = new RegExp(className, ["g"]);
  vNode.properties.className.replace(regex, "");

  var classNames = vNode.properties.className.split(" ");
  var index = classNames.indexOf(className);

  classNames.splice(index, 1);
  vNode.properties.className = classNames.join(" ");

  return vNode;
};

},{"../../utils/error-handle":94,"../../utils/vdom/has-class":123}],85:[function(require,module,exports){
"use strict";

var isVFocus = require("../../utils/vfocus/is-vfocus");
var hasClass = require("../../utils/vdom/has-class");
var addClass = require("./add-class");
var removeClass = require("./remove-class");
var errorHandle = require("../../utils/error-handle");

module.exports = function toggleClass(vNode, className) {

  if (isVFocus(vNode)) {
    vNode = vNode.vNode;
  }

  if (!vNode || !className) {
    errorHandle("A valid vNode and class name must be passed to toggleClass, you passed: %s, %s", vNode, className);
  }

  return hasClass(vNode, className) ? removeClass(vNode, className) : addClass(vNode, className);
};

},{"../../utils/error-handle":94,"../../utils/vdom/has-class":123,"../../utils/vfocus/is-vfocus":133,"./add-class":83,"./remove-class":84}],86:[function(require,module,exports){
"use strict";

var _ = require("./../../bower_components/lodash/dist/lodash.compat.js");

//defaults
var config = {
  user: "unknown",
  nodeName: "GU-NOTE",
  tagName: "gu-note",
  defaultTagName: "gu-note",
  className: "note",
  defaultClassName: "note",
  dataName: "data-note-edited-by",
  dataNameCamel: "dataNoteEditedBy",
  dataDate: "data-note-edited-date",
  dataDateCamel: "dataNoteEditedDate",
  noteBarrierTag: "gu-note-barrier",
  noteCollapsedClass: "note--collapsed",
  scribeInstanceSelector: ".scribe",
  defaultClickInteractionType: "collapse",
  selectors: [{ commandName: "note", tagName: "gu-note", clickAction: "collapse", keyCodes: [119, 121, { altKey: 8 }] }, { commandName: "flag", tagName: "gu-flag", clickAction: "toggle-tag", toggleTagTo: "gu-correct", keyCodes: [120] }, { commandName: "correct", tagName: "gu-correct", clickAction: "toggle-tag", toggleTagTo: "gu-flag", keyCodes: [] }]
};

module.exports = {

  get: function get(key) {

    if (!key) {
      return config;
    }

    return config[key] || undefined;
  },

  set: function set(key, val) {

    //if you pass an object we override ALL THE THINGS
    if (_.isObject(key)) {
      config = _.extend({}, config, key);
    }

    //else set a specific key
    config[key] = val;
  }

};

},{"./../../bower_components/lodash/dist/lodash.compat.js":2}],87:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _ = require("./../bower_components/lodash/dist/lodash.compat.js");

var config = require("./config");
var emitter = require("./utils/emitter");
var noteCollapseState = require("./utils/collapse-state");

var NoteCommandFactory = require("./note-command-factory");

var findScribeMarkers = require("./utils/noting/find-scribe-markers");
var isSelectionEntirelyWithinNote = require("./utils/noting/is-selection-entirely-within-note");
var isSelectionWithinNote = require("./utils/noting/is-selection-within-note");
var removeNote = require("./actions/noting/remove-note");
var removePartOfNote = require("./actions/noting/remove-part-of-note");
var createEmptyNoteAtCaret = require("./actions/noting/create-note-at-caret");
var createNoteFromSelection = require("./actions/noting/create-note-from-selection");
var ensureNoteIntegrity = require("./actions/noting/ensure-note-integrity");
var toggleSelectedNoteCollapseState = require("./actions/noting/toggle-selected-note-collapse-state");
var toggleAllNoteCollapseState = require("./actions/noting/toggle-all-note-collapse-state");
var findParentNoteSegment = require("./utils/noting/find-parent-note-segment");
var toggleSelectedNotesTagName = require("./actions/noting/toggle-selected-note-tag-names");
var stripZeroWidthSpaces = require("./actions/noting/strip-zero-width-space");
var isCaretNextToNote = require("./utils/noting/is-caret-next-to-note");
var removeCharacterFromNote = require("./actions/noting/remove-character-from-adjacent-note");
var selectNoteFromCaret = require("./actions/noting/select-note-from-caret");

var notingVDom = require("./noting-vdom");
var mutate = notingVDom.mutate;
var mutateScribe = notingVDom.mutateScribe;

//setup a listener for toggling ALL notes
// This command is a bit special in the sense that it will operate on all
// Scribe instances on the page.
emitter.on("command:toggle:all-notes", function (tag) {
  var state = !!noteCollapseState.get();
  var scribeInstances = document.querySelectorAll(config.get("scribeInstanceSelector"));
  scribeInstances = _.toArray(scribeInstances);
  scribeInstances.forEach(function (instance) {
    mutate(instance, function (focus) {
      return toggleAllNoteCollapseState(focus);
    });
  });
  noteCollapseState.set(!state);
});

module.exports = function (scribe) {
  var NoteController = (function () {
    function NoteController() {
      var _this = this;

      _classCallCheck(this, NoteController);

      //browser events
      scribe.el.addEventListener("keydown", function (e) {
        return _this.onNoteKeyAction(e);
      });
      scribe.el.addEventListener("click", function (e) {
        return _this.onElementClicked(e);
      });
      scribe.el.addEventListener("input", function (e) {
        return _this.validateNotes(e);
      });

      //scribe command events
      emitter.on("command:note", function (tag) {
        return _this.note(tag);
      });
      emitter.on("command:toggle:single-note", function (tag) {
        return _this.toggleSelectedNotesCollapseState(tag);
      });
      //Run ensureNoteIntegrity to place missing zero-width-spaces
      this.ensureNoteIntegrity();
    }

    _createClass(NoteController, {
      onNoteKeyAction: {

        // noteKeyAction is triggered on key press and dynamically figures out what kind of note to create
        // selectors should be passed through the config object the default selector looks like this:
        // selectors: [ commandName: 'note', tagName: 'gu-note, {'keyCodes': [ 119 , 121 , {'altKey', 8} ]} ];
        // if you need a special key (the default uses alt) specify an object within the keyCodes array
        // where the key is the modifier (expected on the event object)
        // and the val is the key code

        value: function onNoteKeyAction(e) {
          var _this = this;

          //if we press backspace
          if (e.keyCode === 8) {
            mutateScribe(scribe, function (focus) {
              config.get("selectors").forEach(function (selector) {
                //and there is an adjacent note
                if (isCaretNextToNote(focus, "prev", selector.tagName) && !isSelectionWithinNote(focus, selector.tagName)) {
                  e.preventDefault();
                  removeCharacterFromNote(focus, "prev", selector.tagName);
                }
              });
            });
          }

          //when we press delete
          if (e.keyCode === 46) {
            mutateScribe(scribe, function (focus) {
              config.get("selectors").forEach(function (selector) {
                //and there is an adjacent note
                if (isCaretNextToNote(focus, "next", selector.tagName) && !isSelectionWithinNote(focus, selector.tagName)) {
                  e.preventDefault();
                  removeCharacterFromNote(focus, "next", selector.tagName);
                }
              });
            });
          }

          //selecting notes
          if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.keyCode === 65) {
            this.selectNote();
          }

          var selectors = config.get("selectors");
          selectors.forEach(function (selector) {
            //we need to store the tagName to be passed to this.note()
            var tagName = selector.tagName;

            selector.keyCodes.forEach(function (keyCode) {
              //if we get just a number we check the keyCode
              if (!_.isObject(keyCode) && e.keyCode === keyCode) {
                e.preventDefault();
                _this.note(tagName);
              } else if (_.isObject(keyCode)) {
                //in the dynamic case we need to check for BOTH the modifier key AND keycode
                var modifier = Object.keys(keyCode)[0];
                if (e[modifier] && e.keyCode === keyCode[modifier]) {
                  e.preventDefault();
                  _this.note(tagName);
                }
              }
            });
          });
        }
      },
      onElementClicked: {

        //onElementClicked when scribe is clicked we need to figure out what kind of interaction to perform

        value: function onElementClicked(e) {

          //selecting whole notes
          if (e.detail === 2) {
            this.selectNote();
          }

          switch (e.target.getAttribute("data-click-action")) {
            case "toggle-tag":
              e.preventDefault();
              this.toggleClickedNotesTagNames(e.target);
              break;

            default:
              e.preventDefault();
              this.toggleClickedNotesCollapseState(e.target);
              break;
          }
        }
      },
      toggleClickedNotesTagNames: {

        // ------------------------------
        // TOGGLE TAG NAMES
        // ------------------------------

        //toggleSelectedNotesTagNames toggles the tag names of any notes within a given selection

        value: function toggleClickedNotesTagNames(target) {
          var _this = this;

          config.get("selectors").forEach(function (selector) {
            //if we have a valid note element
            if (target.nodeName === selector.tagName.toUpperCase()) {
              _this.selectClickedElement(target);
              _this.toggleSelectedNotesTagNames(selector.tagName, selector.toggleTagTo);
              _this.clearSelection();
            }
          });
        }
      },
      toggleSelectedNotesTagNames: {

        //toggleAllNotesTagNames will toggle the tag names of clicked notes

        value: function toggleSelectedNotesTagNames(tagName, replacementTagName) {
          mutateScribe(scribe, function (focus) {
            return toggleSelectedNotesTagName(focus, tagName, replacementTagName);
          });
        }
      },
      toggleClickedNotesCollapseState: {

        // ------------------------------
        // COLLAPSE / EXPAND NOTES
        // ------------------------------

        //toggleClickedNotesCollapseState when note is clicked we need to figure out if the target is a note
        //and set the selection so we can act on it

        value: function toggleClickedNotesCollapseState(target) {
          var _this = this;

          config.get("selectors").forEach(function (selector) {
            //if we have a valid note element
            if (target.nodeName === selector.tagName.toUpperCase()) {
              _this.selectClickedElement(target);
              _this.toggleSelectedNotesCollapseState(selector.tagName);
            }
          });
        }
      },
      toggleSelectedNotesCollapseState: {

        //toggleSelectedNotesCollapseState will collapse or expand all (or a selected) note

        value: function toggleSelectedNotesCollapseState(tagName) {
          mutateScribe(scribe, function (focus) {
            return toggleSelectedNoteCollapseState(focus, tagName);
          });
        }
      },
      toggleAllNotesCollapseState: {

        // This command is a bit special in the sense that it will operate on all
        // Scribe instances on the page.

        value: function toggleAllNotesCollapseState() {
          var state = !!noteCollapseState.get();
          var scribeInstances = document.querySelectorAll(config.get("scribeInstanceSelector"));
          scribeInstances = _.toArray(scribeInstances);
          scribeInstances.forEach(function (instance) {
            mutate(instance, function (focus) {
              return toggleAllNoteCollapseState(focus);
            });
          });
        }
      },
      selectClickedElement: {

        //selectClickedElement will create a selection around a clicked element

        value: function selectClickedElement(target) {
          var vSelection = new scribe.api.Selection();
          var range = document.createRange();
          range.selectNodeContents(target);
          vSelection.selection.removeAllRanges();
          vSelection.selection.addRange(range);
        }
      },
      clearSelection: {
        value: function clearSelection() {
          var selection = new scribe.api.Selection();
          selection.selection.removeAllRanges();
        }
      },
      selectNote: {

        // ------------------------------
        // SELECTING A WHOLE NOTE
        // ------------------------------

        value: function selectNote() {
          mutateScribe(scribe, function (focus, selection) {
            //ensure we have a selection
            var markers = findScribeMarkers(focus);
            if (markers.length >= 0) {
              //check that the selection is within a note
              config.get("selectors").forEach(function (selector) {
                if (isSelectionEntirelyWithinNote(markers, selector.tagName)) {
                  //if the selection is within a note select that note
                  window.getSelection().removeAllRanges();
                  selectNoteFromCaret(focus, selector.tagName);
                }
              });
            }
          });
        }
      },
      note: {

        // ------------------------------
        // NOTING
        // ------------------------------

        //Note function does all the heavy lifting when:
        //- creating
        //- deleting
        //- merging

        value: function note() {
          var tagName = arguments[0] === undefined ? config.get("defaultTagName") : arguments[0];

          //get scribe.el content (virtualized) and the current selection
          mutateScribe(scribe, function (focus, selection) {
            //figure out what kind of selection we have
            var markers = findScribeMarkers(focus);
            if (markers.length <= 0) {
              return;
            }
            var selectionIsCollapsed = markers.length === 1;

            /* Removed due to legitimate concern
             * you should be able to note a paragraph containing notes
             * should be removed if decided the above statement is correct jp 16/2/15
            //we need to figure out if our caret or selection is within a conflicting note
            var isWithinConflictingNote = false;
            config.get('selectors').forEach((selector)=>{
            if((selector.tagName !== tagName) && isSelectionWithinNote(markers, selector.tagName)){
            isWithinConflictingNote = true;
            }
            });
             //if we ARE within a confilicting note type bail out.
            if(isWithinConflictingNote){
            return;
            }
            */

            var isWithinNote = isSelectionEntirelyWithinNote(markers, tagName);

            //If the caret is within a note and nothing is selected
            if (selectionIsCollapsed && isWithinNote) {
              removeNote(focus, tagName);
            }
            //if we have a selection within a note
            else if (isWithinNote) {
              removePartOfNote(focus, tagName);
            }
            //if we have no selection outside of a note
            else if (selectionIsCollapsed) {
              createEmptyNoteAtCaret(focus, tagName);
            }
            //if we have a selection outside of a note
            else {
              createNoteFromSelection(focus, tagName);
            }
          });
        }
      },
      validateNotes: {

        //validateNotes makes sure all note--start note--end and data attributes are in place

        value: function validateNotes() {
          var _this = this;

          _.throttle(function () {
            _this.ensureNoteIntegrity();
          }, 1000)();
        }
      },
      ensureNoteIntegrity: {
        value: (function (_ensureNoteIntegrity) {
          var _ensureNoteIntegrityWrapper = function ensureNoteIntegrity() {
            return _ensureNoteIntegrity.apply(this, arguments);
          };

          _ensureNoteIntegrityWrapper.toString = function () {
            return _ensureNoteIntegrity.toString();
          };

          return _ensureNoteIntegrityWrapper;
        })(function () {
          mutateScribe(scribe, function (focus) {
            //strip the document of ALL zero width spaces
            stripZeroWidthSpaces(focus);
            config.get("selectors").forEach(function (selector) {
              //run through EACH kind of note and re-add the zero width spaces
              ensureNoteIntegrity(focus, selector.tagName);
            });
          });
        })
      }
    });

    return NoteController;
  })();

  return new NoteController();
};

},{"./../bower_components/lodash/dist/lodash.compat.js":2,"./actions/noting/create-note-at-caret":62,"./actions/noting/create-note-from-selection":63,"./actions/noting/ensure-note-integrity":64,"./actions/noting/remove-character-from-adjacent-note":66,"./actions/noting/remove-note":69,"./actions/noting/remove-part-of-note":70,"./actions/noting/select-note-from-caret":74,"./actions/noting/strip-zero-width-space":75,"./actions/noting/toggle-all-note-collapse-state":76,"./actions/noting/toggle-selected-note-collapse-state":78,"./actions/noting/toggle-selected-note-tag-names":79,"./config":86,"./note-command-factory":88,"./noting-vdom":89,"./utils/collapse-state":90,"./utils/emitter":93,"./utils/noting/find-parent-note-segment":106,"./utils/noting/find-scribe-markers":108,"./utils/noting/is-caret-next-to-note":112,"./utils/noting/is-selection-entirely-within-note":117,"./utils/noting/is-selection-within-note":118}],88:[function(require,module,exports){
"use strict";

var emitter = require("./utils/emitter");
var config = require("./config");

var noteCollapseState = require("./utils/collapse-state");
var isSelectionWithinANote = require("./utils/is-dom-selection-within-a-note");

//generate a note command
function generateNoteCommand(scribe, tagName) {
  var command = new scribe.api.Command("insertHTML");

  command.execute = function () {
    emitter.trigger("command:note", [tagName]);
  };

  command.queryState = function () {
    var selection = new scribe.api.Selection();
    return isSelectionWithinANote(selection.range, scribe.el);
  };

  command.queryEnabled = function () {
    return true;
  };

  return command;
}

//generate a command for toggling a sigle note
function generateToggleSingleNoteCommand(scribe, tagName) {
  var command = new scribe.api.Command("insertHTML");

  command.execute = function () {
    emitter.trigger("command:toggle:single-note", [tagName]);
  };

  return command;
}

//generate a command for toggling all notes
function generateToggleAllNotesCommand(scribe, tagName) {
  var command = new scribe.api.Command("insertHTML");

  command.execute = function () {
    emitter.trigger("command:toggle:all-notes", [tagName]);
  };

  command.queryEnabled = function () {
    return !!scribe.el.getElementsByTagName(tagName).length;
  };

  command.queryState = function () {
    return this.queryEnabled() && noteCollapseState.get();
  };

  return command;
}

module.exports = function NoteCommandFactory(scribe) {
  var commandName = arguments[1] === undefined ? "note" : arguments[1];
  var tagName = arguments[2] === undefined ? "gu-note" : arguments[2];

  //createNoteCommand
  scribe.commands[commandName] = generateNoteCommand(scribe, tagName);

  //toggle a single note i.e. when its clicked
  var toggleSingleNoteCommandName = commandName + "CollapseToggle";
  scribe.commands[toggleSingleNoteCommandName] = generateToggleSingleNoteCommand(scribe, tagName);

  //toggle ALL notes
  var toggleAllNotesCommandName = toggleSingleNoteCommandName + "All";
  scribe.commands[toggleAllNotesCommandName] = generateToggleAllNotesCommand(scribe, tagName);
};

},{"./config":86,"./utils/collapse-state":90,"./utils/emitter":93,"./utils/is-dom-selection-within-a-note":98}],89:[function(require,module,exports){
"use strict";

/**
 * Virtual DOM parser / serializer for Noting plugin.
 */

var TAG = "gu-note";

var _ = require("./../bower_components/lodash/dist/lodash.compat.js");

var diff = require("virtual-dom/diff");
var patch = require("virtual-dom/patch");

// There was a bug in vdom-virtualize that caused data attributes not
// to be virtualized. Have fixed this and got it merged upstream.
// No new release yet, however, so have specified the specific commit as
// dependency. Feel free to update to future versions when they're released.
var virtualize = require("vdom-virtualize");

var isVText = require("vtree/is-vtext");

var VFocus = require("./vfocus");

/**
 * Virtualises a DOMElement to a callback for mutation.
 * @param  {DOMElement}   domElement
 * @param  {Function} callback
 */
exports.mutate = function (domElement, callback) {

  var originalTree = virtualize(domElement);
  var tree = virtualize(domElement); // we'll mutate this one
  var treeFocus = new VFocus(tree);

  callback(treeFocus);

  // Then diff with the original tree and patch the DOM.
  var patches = diff(originalTree, tree);
  patch(domElement, patches);
};

exports.mutateScribe = function (scribe, callback) {
  var selection = new scribe.api.Selection();

  scribe.transactionManager.run(function () {
    // Place markers and create virtual trees.
    // We'll use the markers to determine where a selection starts and ends.
    selection.placeMarkers();

    exports.mutate(scribe.el, function (treeFocus) {

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

},{"./../bower_components/lodash/dist/lodash.compat.js":2,"./vfocus":135,"vdom-virtualize":9,"virtual-dom/diff":16,"virtual-dom/patch":26,"vtree/is-vtext":54}],90:[function(require,module,exports){
"use strict";

var state = false;

module.exports = {
  get: function get() {
    return state;
  },
  set: function set(val) {
    state = val;
  }
};

},{}],91:[function(require,module,exports){
"use strict";

var VText = require("vtree/vtext");

// We need these to make it possible to place the caret immediately
// inside/outside of a note.
module.exports = function createNoteBarrier() {
  return new VText("​");
};

},{"vtree/vtext":60}],92:[function(require,module,exports){
"use strict";

var h = require("virtual-hyperscript");

module.exports = function createVirtualScribeMarker() {
  return h("em.scribe-marker");
};

},{"virtual-hyperscript":30}],93:[function(require,module,exports){
"use strict";

var EventEmitter = require("./../../bower_components/scribe/src/event-emitter");
module.exports = new EventEmitter();

},{"./../../bower_components/scribe/src/event-emitter":3}],94:[function(require,module,exports){
"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var util = require("util");

module.exports = function handleSystemError(message) {
  for (var _len = arguments.length, objs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    objs[_key - 1] = arguments[_key];
  }

  var errorMsg = util.format.apply(util, [message].concat(_toConsumableArray(objs.map(function (obj) {
    return util.inspect(obj, { depth: null });
  }))));
  throw new Error(errorMsg);
};

},{"util":8}],95:[function(require,module,exports){
"use strict";

module.exports = function generateUUID() {
  /* jshint bitwise:false */
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : r & 7 | 8).toString(16);
  });
  return uuid;
};

},{}],96:[function(require,module,exports){
"use strict";

var config = require("../config");

module.exports = function userAndTimeAsDatasetAttrs() {

  var user = config.get("user");

  return {
    noteEditedBy: user,
    noteEditedDate: new Date().toISOString()
  };
};

},{"../config":86}],97:[function(require,module,exports){
"use strict";

var DATA_NAME_CAMEL = "noteEditedBy";
var DATA_DATE_CAMEL = "noteEditedDate";

var config = require("../config");

module.exports = function getUKDate(data) {

  data = data || {};

  var date = data[DATA_DATE_CAMEL] ? new Date(data[DATA_DATE_CAMEL]) : new Date();

  var name = config.get("user");

  // crude formatting avoids a "momentjs" dependency - should be adequate
  // forced UK formatted time in local timezone:  dd/MM/YYYY at hh:mm
  var formattedDate = [date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(), "at", date.getHours() + ":" + (date.getMinutes() < 9 ? "0" : "") + date.getMinutes()].join(" ");

  return name + " " + formattedDate;
};

},{"../config":86}],98:[function(require,module,exports){
"use strict";

var config = require("../config");
// TODO: Replace with `selectionEntirelyWithinNote`.
module.exports = function isSelectionInANote(selectionRange, parentContainer) {

  // Walk up the (real) DOM checking isTargetNode.
  function domWalkUpFind(_x, _x2) {
    var _again = true;

    _function: while (_again) {
      _again = false;
      var node = _x,
          isTargetNode = _x2;

      if (!node.parentNode || node === parentContainer) {
        return false;
      }

      if (isTargetNode(node)) {
        return node;
      } else {
        _x = node.parentNode;
        _x2 = isTargetNode;
        _again = true;
        continue _function;
      }
    }
  }

  // Return the note our selection is inside of, if we are inside one.
  function domFindAncestorNote(node) {
    return domWalkUpFind(node, function (node) {
      return node.tagName === config.get("nodeName");
    });
  }

  return domFindAncestorNote(selectionRange.startContainer) && domFindAncestorNote(selectionRange.endContainer) && true;
};

},{"../config":86}],99:[function(require,module,exports){
"use strict";

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var isVFocus = require("../vfocus/is-vfocus");
var isNoteSegment = require("./is-note-segment");
var findEntireNote = require("./find-entire-note");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function findAllNotes(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to findAllNotes, you passed: ", focus);
  }

  // Returns an array of arrays of note segments
  return focus.filter(function (node) {
    return isNoteSegment(node, tagName);
  }).map(function (node) {
    return findEntireNote(node, tagName);
  }).reduce(function (uniqueNotes, note) {
    // First iteration: Add the note.
    if (uniqueNotes.length === 0) return uniqueNotes.concat([note]);

    // Subsequent iterations: Add the note if it hasn't already been added.
    return _.last(uniqueNotes)[0].vNode === note[0].vNode ? uniqueNotes : uniqueNotes.concat([note]);
  }, []);
};

},{"../../config":86,"../error-handle":94,"../vfocus/is-vfocus":133,"./../../../bower_components/lodash/dist/lodash.compat.js":2,"./find-entire-note":101,"./is-note-segment":115}],100:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var isScribeMarker = require("./is-scribe-marker");
var isNotScribeMarker = require("./is-not-scribe-marker");
var errorHandle = require("../error-handle");

module.exports = function findBetweenScribeMarkers(focus) {

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to findBetweenScribeMarkers, you passed: %s", focus);
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

},{"../error-handle":94,"../vfocus/is-vfocus":133,"./is-not-scribe-marker":113,"./is-scribe-marker":116}],101:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var stillWithinNote = require("./still-within-note");
var isNoteSegment = require("./is-note-segment");
var findFirstNoteSegment = require("./find-first-note-segment");
var errorHandle = require("../error-handle");
var config = require("../../config");
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
// findFirstNoteSegmentSegment will then move backwards over a P
// and into the first note. We will then unnote the first
// note rather than the second.
//

module.exports = function findEntireNote(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to findEntireNote, you passed: %s", focus);
  }

  var firstNoteSegment = findFirstNoteSegment(focus, tagName);

  if (!firstNoteSegment) {
    return;
  }

  return firstNoteSegment.takeWhile(function (node) {
    return stillWithinNote(node, tagName);
  }).filter(function (node) {
    return isNoteSegment(node, tagName);
  });
};

},{"../../config":86,"../error-handle":94,"../vfocus/is-vfocus":133,"./find-first-note-segment":102,"./is-note-segment":115,"./still-within-note":120}],102:[function(require,module,exports){
"use strict";

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var isVFocus = require("../vfocus/is-vfocus");
var stillWithinNote = require("./still-within-note");
var isNoteSegment = require("./is-note-segment");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function findFirstNoteSegment(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to findFirstNoteSegment, you passed: %s", focus);
  }

  return _.last(focus.takeWhile(function (node) {
    return stillWithinNote(node, tagName);
  }, "prev").filter(function (node) {
    return isNoteSegment(node, tagName);
  }));
};

},{"../../config":86,"../error-handle":94,"../vfocus/is-vfocus":133,"./../../../bower_components/lodash/dist/lodash.compat.js":2,"./is-note-segment":115,"./still-within-note":120}],103:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var stillWithinNote = require("./still-within-note");
var isNoteSegment = require("./is-note-segment");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function findLastNoteSegment(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("only a valid VFocus can be passed to findFirstNoteSegment, you passed: %s", focus);
  }

  return focus.takeWhile(function (node) {
    return stillWithinNote(node, tagName);
  }).filter(function (node) {
    return isNoteSegment(node, tagName);
  }).splice(-1)[0];
};

},{"../../config":86,"../error-handle":94,"../vfocus/is-vfocus":133,"./is-note-segment":115,"./still-within-note":120}],104:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var isNoteSegment = require("./is-note-segment");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function findFirstNoteSegmentBelow(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to findFirstNoteSegmentBelow, you passed: %s", focus);
  }

  return focus.find(function (node) {
    return isNoteSegment(node, tagName);
  });
};

},{"../../config":86,"../error-handle":94,"../vfocus/is-vfocus":133,"./is-note-segment":115}],105:[function(require,module,exports){
"use strict";

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var isVFocus = require("../vfocus/is-vfocus");
var hasNoteId = require("./has-note-id");
var findAllNotes = require("./find-all-notes");
var errorHandle = require("../error-handle");
var config = require("../../config");

// Find a note based on its ID. Will not always give the same result as `findEntireNote` ,
// since that'll recognize that a note is adjacent to another one. But when a note
// covers several paragraphs we can't be sure findEntireNote
// will give us the right result (see comment for findEntireNote).
//
// TODO: Redo findEntireNote to be based on findNote and IDs? Could perhaps
// find adjacent notes with the help of focus.prev() and focus.next().
module.exports = function findNoteById(focus, noteId) {
  var tagName = arguments[2] === undefined ? config.get("defaultTagName") : arguments[2];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to findNoteById, you passed: ", focus);
  }

  var allNoteSegments = _.flatten(findAllNotes(focus, tagName));
  return allNoteSegments.filter(function (segment) {
    return hasNoteId(segment.vNode, noteId);
  });
};

},{"../../config":86,"../error-handle":94,"../vfocus/is-vfocus":133,"./../../../bower_components/lodash/dist/lodash.compat.js":2,"./find-all-notes":99,"./has-note-id":111}],106:[function(require,module,exports){
"use strict";

var isNoteSegment = require("../noting/is-note-segment");
var isVFocus = require("../vfocus/is-vfocus");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function findParentNote(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to findParentNoteSegments, you passed: %s", focus);
  }

  return focus.find(function (node) {
    return isNoteSegment(node, tagName);
  }, "up");
};

},{"../../config":86,"../error-handle":94,"../noting/is-note-segment":115,"../vfocus/is-vfocus":133}],107:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var isNoteSegment = require("./is-note-segment");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function findFirstNoteSegmentAbove(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to findFirstNoteSegmentAbove, you passed: %s", focus);
  }

  return focus.find(function (node) {
    return isNoteSegment(node, tagName);
  }, "prev");
};

},{"../../config":86,"../error-handle":94,"../vfocus/is-vfocus":133,"./is-note-segment":115}],108:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var isScribeMarker = require("./is-scribe-marker");
var errorHandle = require("../error-handle");

module.exports = function findScribeMarkers(focus) {

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to findScribeMarkers, you passed: %s", focus);
  }

  return focus.filter(isScribeMarker);
};

},{"../error-handle":94,"../vfocus/is-vfocus":133,"./is-scribe-marker":116}],109:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var VFocus = require("../../vfocus");
var findScribeMarkers = require("./find-scribe-markers");
var findParentNoteSegment = require("./find-parent-note-segment");
var findEntireNote = require("./find-entire-note");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function findSelectedNote(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to findselectedNote, you passed: %s", focus);
  }

  var markers = findScribeMarkers(focus);
  if (markers.length <= 0) {
    return;
  }

  var firstMarker = markers[0];

  var note = findParentNoteSegment(firstMarker, tagName);
  if (!note) {
    return;
  }

  return note && findEntireNote(note, tagName) || undefined;
};

},{"../../config":86,"../../vfocus":135,"../error-handle":94,"../vfocus/is-vfocus":133,"./find-entire-note":101,"./find-parent-note-segment":106,"./find-scribe-markers":108}],110:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var findBetweenScribeMarkers = require("./find-between-scribe-markers");
var findTextNodes = require("../vfocus/find-text-nodes");
var errorHandle = require("../error-handle");

module.exports = function findTextBetweenScribeMarkers(focus) {

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to findTextBetweenScribeMarkers, you passed: %s", focus);
  }

  return findTextNodes(findBetweenScribeMarkers(focus));
};

},{"../error-handle":94,"../vfocus/find-text-nodes":126,"../vfocus/is-vfocus":133,"./find-between-scribe-markers":100}],111:[function(require,module,exports){
"use strict";

var hasAttribute = require("../vdom/has-attribute");
var isVFocus = require("../vfocus/is-vfocus");

module.exports = function hasNoteId(vNode, value) {
  return hasAttribute(vNode, "data-note-id", value);
};

},{"../vdom/has-attribute":122,"../vfocus/is-vfocus":133}],112:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var errorHandle = require("../error-handle");
var config = require("../../config");
var findScribeMarkers = require("./find-scribe-markers");
var findPreviousNoteSegment = require("./find-previous-note-segment");
var isNoteSegment = require("../noting/is-note-segment");
var isScribeMarker = require("./is-scribe-marker.js");

module.exports = function isCaretNextToNote(focus) {
  var direction = arguments[1] === undefined ? "next" : arguments[1];
  var tagName = arguments[2] === undefined ? config.get("defaultTagName") : arguments[2];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to isCaretNextToNote, you passed: %s", focus);
  }

  var markers = findScribeMarkers(focus);

  if (!markers.length || markers.length === 2) {
    return false;
  }

  var marker = markers[0];

  if (direction === "next") {
    return !!marker.next() && !!marker.next().vNode && !!marker.next().vNode.tagName && marker.next().vNode.tagName.toLowerCase() === tagName;
  } else {
    var previousNoteSegment = findPreviousNoteSegment(marker, tagName);
    if (!previousNoteSegment) {
      return false;
    }
    //get the next sibling which should be a note : note -> zero width space -> caret -> note
    var zeroWidthSpace = previousNoteSegment.right();
    if (!zeroWidthSpace) {
      return false;
    }
    var marker = zeroWidthSpace.right();
    //test the marker exists
    //AND the zero width space contains ONLY a zero width space
    //AND that the marker IS a marker
    return !!marker && /^\u200B$/.test(zeroWidthSpace.vNode.text) && isScribeMarker(marker);
  }
};

},{"../../config":86,"../error-handle":94,"../noting/is-note-segment":115,"../vfocus/is-vfocus":133,"./find-previous-note-segment":107,"./find-scribe-markers":108,"./is-scribe-marker.js":116}],113:[function(require,module,exports){
"use strict";

var isScribeMarker = require("./is-scribe-marker");

module.exports = function isNotScribeMarker(focus) {
  return !isScribeMarker(focus);
};

},{"./is-scribe-marker":116}],114:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var findParentNoteSegment = require("./find-parent-note-segment");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function isNotWithinNote(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to isNotWithinNote, you passed: %s", focus);
  }

  return !findParentNoteSegment(focus, tagName);
};

},{"../../config":86,"../error-handle":94,"../vfocus/is-vfocus":133,"./find-parent-note-segment":106}],115:[function(require,module,exports){
"use strict";

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var isVFocus = require("../vfocus/is-vfocus");
var isTag = require("../vdom/is-tag");
var errorHandle = require("../error-handle");
var config = require("../../config");

// function isNote
// identifies whether a given vfocus is a note
module.exports = function isNote(vfocus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(vfocus)) {
    errorHandle("Only a valid VFocus element can be passed to isNote, you passed: %s", focus);
  }

  //if this function is placed within a iterator (takeWhile for example)
  //the index will be passed as second argument
  //as such we need to correct this or we won't get a correct result
  if (!_.isString(tagName)) {
    tagName = config.get("defaultTagName");
  }

  return isTag(vfocus.vNode, tagName);
};

},{"../../config":86,"../error-handle":94,"../vdom/is-tag":125,"../vfocus/is-vfocus":133,"./../../../bower_components/lodash/dist/lodash.compat.js":2}],116:[function(require,module,exports){
"use strict";

// is our selection not a note?
var isVFocus = require("../vfocus/is-vfocus");
var hasClass = require("../vdom/has-class");
var errorHandle = require("../error-handle");

module.exports = function isScribeMarker(vfocus) {

  if (!isVFocus(vfocus)) {
    errorHandle("Only a valid VFocus element can be passed to isNote, you passed: %s", focus);
  }

  return hasClass(vfocus.vNode, "scribe-marker");
};

},{"../error-handle":94,"../vdom/has-class":123,"../vfocus/is-vfocus":133}],117:[function(require,module,exports){
"use strict";

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var isVFocus = require("../vfocus/is-vfocus");

var findParentNoteSegment = require("./find-parent-note-segment");
var isNotScribeMarker = require("./is-not-scribe-marker");
var isVText = require("../vfocus/is-vtext");
var findScribeMarkers = require("./find-scribe-markers");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function isSelectionBetweenNotes(markers) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  //if we pass a raw VFocus
  if (isVFocus(markers)) {
    markers = findScribeMarkers(markers);
  }

  //if we get passed the wrong argument
  if (!_.isArray(markers)) {
    errorHandle("Only an array of markers or valid VFocus can be passed to isSelectionBetweenMarkers, you passed: %s", focus);
  }

  if (markers.length <= 0) {
    return;
  }

  // if we have two valid markers
  if (markers.length === 2) {
    var selection = markers[0].next().takeWhile(isNotScribeMarker)

    // We need the focusOnTextNode filter so we don't include P tags that
    // contains notes for example.
    .filter(isVText);

    return !!selection.every(function (node) {
      return findParentNoteSegment(node, tagName);
    });
  }
  //if we only have on valid marker
  //we see if it has a parent note
  else {
    return !!findParentNoteSegment(markers[0], tagName);
  }
};

},{"../../config":86,"../error-handle":94,"../vfocus/is-vfocus":133,"../vfocus/is-vtext":134,"./../../../bower_components/lodash/dist/lodash.compat.js":2,"./find-parent-note-segment":106,"./find-scribe-markers":108,"./is-not-scribe-marker":113}],118:[function(require,module,exports){
"use strict";

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var isVFocus = require("../vfocus/is-vfocus");

var findParentNoteSegment = require("./find-parent-note-segment");
var isNotScribeMarker = require("./is-not-scribe-marker");
var isVText = require("../vfocus/is-vtext");
var findScribeMarkers = require("./find-scribe-markers");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function isSelectionBetweenNotes(markers) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  //if we pass a raw VFocus
  if (isVFocus(markers)) {
    markers = findScribeMarkers(markers);
  }

  //if we get passed the wrong argument
  if (!_.isArray(markers)) {
    errorHandle("Only an array of markers or valid VFocus can be passed to isSelectionBetweenMarkers, you passed: %s", focus);
  }

  if (markers.length <= 0) {
    return;
  }

  // if we have two valid markers
  if (markers.length === 2) {
    var selection = markers[0].next().takeWhile(isNotScribeMarker)

    // We need the focusOnTextNode filter so we don't include P tags that
    // contains notes for example.
    .filter(isVText);

    return selection.reduce(function (last, node) {
      return !!findParentNoteSegment(node, tagName) || last;
    }, false);
  }
  //if we only have on valid marker
  //we see if it has a parent note
  else {
    return !!findParentNoteSegment(markers[0], tagName);
  }
};

},{"../../config":86,"../error-handle":94,"../vfocus/is-vfocus":133,"../vfocus/is-vtext":134,"./../../../bower_components/lodash/dist/lodash.compat.js":2,"./find-parent-note-segment":106,"./find-scribe-markers":108,"./is-not-scribe-marker":113}],119:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var findAllNotes = require("./find-all-notes");
var errorHandle = require("../error-handle");

// cache the notes and update them when new notes are added
// caching the existing notes prevent needless tree traversal,
// which have O(n) complexity.
var cache;

function getNotesCache(focus) {
  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to notesCache.get, you passed: %s", focus);
  }

  if (!cache || cache.length === 0) {
    cache = setNotesCache(focus);
  }

  return cache;
}

function setNotesCache(focus) {

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to notesCache.set, you passed: %s", focus);
  }

  cache = findAllNotes(focus);
  return cache;
}

module.exports = { get: getNotesCache, set: setNotesCache };

},{"../error-handle":94,"../vfocus/is-vfocus":133,"./find-all-notes":99}],120:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var isVText = require("../vfocus/is-vtext");
var isEmpty = require("../vfocus/is-empty");
var findParentNoteSegment = require("../noting/find-parent-note-segment");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function isWithinNote(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to isWithinNote, you passed: %s", focus);
  }

  return !isVText(focus) || isEmpty(focus) || !!findParentNoteSegment(focus, tagName);
};

},{"../../config":86,"../error-handle":94,"../noting/find-parent-note-segment":106,"../vfocus/is-empty":130,"../vfocus/is-vfocus":133,"../vfocus/is-vtext":134}],121:[function(require,module,exports){
"use strict";

module.exports = function toCamelCase(string) {
  return string.replace(/(\-[a-z])/g, function ($1) {
    return $1.toUpperCase().replace("-", "");
  });
};

},{}],122:[function(require,module,exports){
"use strict";

var toCamelCase = require("../to-camel-case");
var errorHandle = require("../error-handle");

module.exports = function hasAttribute(vNode, attribute, value) {

  if (!vNode || !attribute) {
    errorHandle("Incorrect arguments passed to hasAttribute, you passed: %s", arguments);
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
    if (!vNode.properties[attribute]) {
      return false;
    }if (!vNode.properties[attribute].value) {
      return vNode.properties[attribute] === value;
    }

    return vNode.properties[attribute].value === value;
  }
};

},{"../error-handle":94,"../to-camel-case":121}],123:[function(require,module,exports){
"use strict";

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
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

},{"./../../../bower_components/lodash/dist/lodash.compat.js":2}],124:[function(require,module,exports){
"use strict";

// We incude regular spaces because if we have a note tag that only
// includes a a regular space, then the browser will also insert a <BR>.
// If we consider a string containing only a regular space as empty we
// can remove the note tag to avoid the line break.
//
// Not ideal since it causes the space to be deleted even though the user
// hasn't asked for that. We compensate for this by moving any deleted
// space to the previous note segment.

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var isVText = require("vtree/is-vtext");

module.exports = function (node) {
  if (isVText(node)) {
    var text = node.text;
    return text === "" || text === "​" || text === " " || text === " ";
  } else {
    return node.children.length <= 0;
  }
};

},{"./../../../bower_components/lodash/dist/lodash.compat.js":2,"vtree/is-vtext":54}],125:[function(require,module,exports){
"use strict";

module.exports = function isTag(node, tag) {
  return node.tagName && node.tagName.toLowerCase() === tag;
};

},{}],126:[function(require,module,exports){
"use strict";

var _ = require("./../../../bower_components/lodash/dist/lodash.compat.js");
var isVFocus = require("../vfocus/is-vfocus");
var isVText = require("../vfocus/is-vtext");
var errorHandle = require("../error-handle");

module.exports = function findTextNodes(focuses) {

  focuses = _.isArray(focuses) ? focuses : [focuses];

  focuses.forEach(function (focus) {
    if (!isVFocus(focus)) {
      errorHandle("Only a valid VFocus can be passed to findTextNodes, you passed: %s", focus);
    }
  });

  return focuses.filter(isVText);
};

},{"../error-handle":94,"../vfocus/is-vfocus":133,"../vfocus/is-vtext":134,"./../../../bower_components/lodash/dist/lodash.compat.js":2}],127:[function(require,module,exports){
"use strict";

var isVFocus = require("./is-vfocus");
var errorHandle = require("../error-handle");

module.exports = function flattenTree(focus) {

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus element can be passed to flattenTree, you passed: %s", focus);
  }

  return focus.takeWhile(function (insideOfFocus) {
    return !!insideOfFocus.find(function (f) {
      return f.vNode === focus.vNode;
    }, "up");
  });
};

},{"../error-handle":94,"./is-vfocus":133}],128:[function(require,module,exports){
"use strict";

var isVFocus = require("./is-vfocus");
var flatten = require("./flatten-tree");
var isVText = require("./is-vtext");
var errorHandle = require("../error-handle");

module.exports = function hasNoTextChildren(focus) {

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus element can be passed to hasNoTextChildren, you passed: %s", focus);
  }

  return flatten(focus).filter(isVText).length === 0;
};

},{"../error-handle":94,"./flatten-tree":127,"./is-vfocus":133,"./is-vtext":134}],129:[function(require,module,exports){
"use strict";

var isVFocus = require("./is-vfocus");
var flatten = require("./flatten-tree");
var isVText = require("./is-vtext");
var isEmpty = require("./is-empty");
var errorHandle = require("../error-handle");

module.exports = function hasNoTextChildren(focus) {

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to hasNoTextChildren, you passed: %s", focus);
  }

  return flatten(focus).filter(isVText).every(isEmpty);
};

},{"../error-handle":94,"./flatten-tree":127,"./is-empty":130,"./is-vfocus":133,"./is-vtext":134}],130:[function(require,module,exports){
"use strict";

var isVFocus = require("./is-vfocus");
var isEmpty = require("../vdom/is-empty");
var errorHandle = require("../error-handle");

module.exports = function isEmptyVFocus(vfocus) {

  if (!isVFocus(vfocus)) {
    errorHandle("Onlu a valid VFocus can be passed to isEmptyVFocus, you passed: %s", focus);
  }

  return isEmpty(vfocus.vNode);
};

},{"../error-handle":94,"../vdom/is-empty":124,"./is-vfocus":133}],131:[function(require,module,exports){
"use strict";

var isVFocus = require("./is-vfocus");
var isVText = require("./is-vtext");
var isEmpty = require("./is-empty.js");
var errorHandle = require("../error-handle");

module.exports = function isNotEmpty(focus) {

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to isNotEmpty, you passed: %s", focus);
  }

  //checking if an element is text prevents empty text elements
  //containing elements like breaks being added to the dom when
  //a note is created
  return isVText(focus) && !isEmpty(focus);
};

},{"../error-handle":94,"./is-empty.js":130,"./is-vfocus":133,"./is-vtext":134}],132:[function(require,module,exports){
"use strict";

var isVFocus = require("./is-vfocus.js");
var isTag = require("../vdom/is-tag.js");
var errorHandle = require("../error-handle");

module.exports = function isParagraphVFocus(focus) {

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus element can be passed to isParagraphVFocus, you passed: %s", focus);
  }

  return isTag(focus.vNode, "p");
};

},{"../error-handle":94,"../vdom/is-tag.js":125,"./is-vfocus.js":133}],133:[function(require,module,exports){
"use strict";

var VFocus = require("../../vfocus");

module.exports = function isVFocus(vFocus) {
  return vFocus instanceof VFocus;
};

},{"../../vfocus":135}],134:[function(require,module,exports){
"use strict";

var isVText = require("vtree/is-vtext");

var VFocus = require("../../vfocus");
var isVFocus = require("../vfocus/is-vfocus");
var errorHandle = require("../error-handle");

module.exports = function isVTextVFocus(vfocus) {

  if (!isVFocus(vfocus)) {
    errorHandle("Only a valid VFocus can be pased to isVTextVFocus, you passed: %s", focus);
  }

  return isVText(vfocus.vNode);
};

},{"../../vfocus":135,"../error-handle":94,"../vfocus/is-vfocus":133,"vtree/is-vtext":54}],135:[function(require,module,exports){
"use strict";

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

VFocus.prototype.index = function () {
  return this.parent.vNode.children.indexOf(this.vNode);
};

/**
* Internally useful
*/

VFocus.prototype.rightVNode = function () {
  if (this.isRoot()) return null;

  var rightVNodeIndex = this.index() + 1;
  return this.parent.children()[rightVNodeIndex];
};

VFocus.prototype.leftVNode = function () {
  if (this.isRoot()) return null;

  var leftVNodeIndex = this.index() - 1;
  return leftVNodeIndex >= 0 ? this.parent.children()[leftVNodeIndex] : null;
};

/**
* Checks
*/

VFocus.prototype.isRoot = function () {
  return !this.parent;
};

VFocus.prototype.canRight = function () {
  return !!this.rightVNode();
};

VFocus.prototype.canLeft = function () {
  return !!this.leftVNode();
};

VFocus.prototype.canDown = function () {
  var children = this.children();
  return children && children.length ? true : false;
};

VFocus.prototype.canUp = function () {
  return !this.isRoot();
};

/**
* Movements
*/

// Focus next (pre-order)
VFocus.prototype.next = function () {
  function upThenRightWhenPossible(_x) {
    var _left;

    var _again = true;

    _function: while (_again) {
      _again = false;
      var vFocus = _x;

      // Terminate if we've visited all nodes.
      if (!vFocus) {
        return null;
      }
      if (_left = vFocus.right()) {
        return _left;
      }

      _x = vFocus.up();
      _again = true;
      continue _function;
    }
  }

  return this.down() || this.right() || upThenRightWhenPossible(this);
};

// Focus previous (pre-order)
VFocus.prototype.prev = function () {
  function downFurthestRight(_x) {
    var _again = true;

    _function: while (_again) {
      var furthestRight = function furthestRight(vFocus) {
        var focus = vFocus;
        while (focus.canRight()) {
          focus = focus.right();
        }
        return focus;
      };

      _again = false;
      var vFocus = _x;
      if (vFocus.canDown()) {
        _x = vFocus.down();
        _again = true;
        continue _function;
      } else {
        return furthestRight(vFocus);
      }
    }
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
VFocus.prototype.down = function () {
  if (!this.canDown()) return null;

  return new VFocus(this.children()[0], this);
};

// Focus parent
VFocus.prototype.up = function () {
  if (!this.canUp()) return null;

  return this.parent;
};

// Focus node to the right (on the same level)
VFocus.prototype.right = function () {
  if (!this.canRight()) return null;

  return new VFocus(this.rightVNode(), this.parent);
};

// Focus node to the left (on the same level)
VFocus.prototype.left = function () {
  if (!this.canLeft()) return null;

  return new VFocus(this.leftVNode(), this.parent);
};

VFocus.prototype.top = function () {
  return this.canUp() ? this.parent.top() : this;
};

/**
* Mutating operations
*/

// Replace `this.vNode` and return `this` to enable chaining.
// Note that this mutates the tree.
VFocus.prototype.replace = function (replacementVNode) {
  if (this.isRoot()) {
    // Replace and focus on the replacement.
    this.vNode = replacementVNode;
  } else {
    // Replace the object in the tree we're focusing on.
    var vNodeIndex = this.index();
    this.parent.spliceChildren(vNodeIndex, 1, replacementVNode);

    // And focus on the replacement.
    this.vNode = replacementVNode;
  }

  return this;
};

// Remove `this.vNode`, i.e. remove the reference from the tree.
VFocus.prototype.remove = function () {
  if (this.isRoot()) {} else {
    var vNodeIndex = this.index();
    this.parent.spliceChildren(vNodeIndex, 1);
  }

  return this;
};

VFocus.prototype.insertBefore = function (newVNodes) {
  var newVNodes = newVNodes instanceof Array ? newVNodes : [newVNodes];

  if (this.isRoot()) {} else {
    var siblings = this.parent.children();
    var vNodeIndex = this.index();

    // Insert before ourself.
    newVNodes.reverse().forEach(function (vNode) {
      siblings.splice(vNodeIndex, 0, vNode);
    });
  }

  return this;
};

VFocus.prototype.insertAfter = function (newVNodes) {
  var newVNodes = newVNodes instanceof Array ? newVNodes : [newVNodes];

  if (this.isRoot()) {} else {
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
VFocus.prototype.refresh = function () {
  var self = this;
  function myself(focus) {
    return focus.vNode === self.vNode;
  }

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

VFocus.prototype.forEach = function (fn) {
  var node = this;
  while (node) {
    fn(node);
    node = node.next();
  }
};

// Flatten `this` and all nodes after, returning a list
VFocus.prototype.flatten = function (replacementVNode) {
  var focuses = [];
  this.forEach(function (focus) {
    focuses.push(focus);
  });

  return focuses;
};

// Take while condition is true. Return list.
// predicate: function that receives the current item
//       and returns true/false.
VFocus.prototype.takeWhile = function (predicate, movement) {
  var movement = movement || "next";

  var focus = this;
  var acc = [];
  while (focus && predicate(focus)) {
    acc.push(focus);
    focus = focus[movement]();
  }
  return acc;
};

VFocus.prototype.filter = function (predicate, movement) {
  var movement = movement || "next";

  var results = [];
  this.forEach(function (focus) {
    if (predicate(focus)) results.push(focus);
  }, movement);

  return results;
};

// Find focus satisfying predicate.
// predicate: function that takes a focus and returns true/false.
// movement: string name of one of the movement functions, e.g. 'up' or 'prev'.
// If nothing is found null is returned (as we step off the tree).
VFocus.prototype.find = function (predicate, movement) {
  var movement = movement || "next";
  var focus = this;

  while (focus) {
    if (predicate(focus)) break;
    focus = focus[movement]();
  }

  return focus;
};

/**
* Managing VFocus Children
*/
VFocus.prototype.children = function () {
  return this.vNode.children || [];
};

VFocus.prototype.addChild = function (child) {
  this.vNode.children.push(child);
};

VFocus.prototype.indexOf = function (focus) {
  //if we are passing a VFocus use the vNode
  var vNode = focus.vNode || focus;
  return this.children().indexOf(vNode);
};

VFocus.prototype.spliceChildren = function () {
  return Array.prototype.splice.apply(this.children(), arguments);
};

VFocus.prototype.getChildAt = function (index) {
  if (this.vNode.children[index]) {
    return new VFocus(this.vNode.children[index], this);
  }
  return null;
};

VFocus.prototype.prependChildren = function (children) {
  var _this = this;

  children = Array.isArray(children) ? children : [children];
  children.forEach(function (child) {
    return _this.vNode.children.splice(0, 0, child);
  });
};

// No can do. Should maybe raise an exception.

// No can do. Should maybe raise an exception.

// No can do. Should maybe raise an exception.

},{}]},{},[61])(61)
});