!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.scribePluginNoting=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";(function(global, factory){typeof exports === "object" && typeof module !== "undefined"?module.exports = factory():typeof define === "function" && define.amd?define(factory):global.Immutable = factory();})(undefined, function(){"use strict";var SLICE$0=Array.prototype.slice;function createClass(ctor, superClass){if(superClass){ctor.prototype = Object.create(superClass.prototype);}ctor.prototype.constructor = ctor;}var DELETE="delete";var SHIFT=5;var SIZE=1 << SHIFT;var MASK=SIZE - 1;var NOT_SET={};var CHANGE_LENGTH={value:false};var DID_ALTER={value:false};function MakeRef(ref){ref.value = false;return ref;}function SetRef(ref){ref && (ref.value = true);}function OwnerID(){}function arrCopy(arr, offset){offset = offset || 0;var len=Math.max(0, arr.length - offset);var newArr=new Array(len);for(var ii=0; ii < len; ii++) {newArr[ii] = arr[ii + offset];}return newArr;}function ensureSize(iter){if(iter.size === undefined){iter.size = iter.__iterate(returnTrue);}return iter.size;}function wrapIndex(iter, index){return index >= 0?+index:ensureSize(iter) + +index;}function returnTrue(){return true;}function wholeSlice(begin, end, size){return (begin === 0 || size !== undefined && begin <= -size) && (end === undefined || size !== undefined && end >= size);}function resolveBegin(begin, size){return resolveIndex(begin, size, 0);}function resolveEnd(end, size){return resolveIndex(end, size, size);}function resolveIndex(index, size, defaultIndex){return index === undefined?defaultIndex:index < 0?Math.max(0, size + index):size === undefined?index:Math.min(size, index);}function Iterable(value){return isIterable(value)?value:Seq(value);}createClass(KeyedIterable, Iterable);function KeyedIterable(value){return isKeyed(value)?value:KeyedSeq(value);}createClass(IndexedIterable, Iterable);function IndexedIterable(value){return isIndexed(value)?value:IndexedSeq(value);}createClass(SetIterable, Iterable);function SetIterable(value){return isIterable(value) && !isAssociative(value)?value:SetSeq(value);}function isIterable(maybeIterable){return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);}function isKeyed(maybeKeyed){return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);}function isIndexed(maybeIndexed){return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);}function isAssociative(maybeAssociative){return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);}function isOrdered(maybeOrdered){return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);}Iterable.isIterable = isIterable;Iterable.isKeyed = isKeyed;Iterable.isIndexed = isIndexed;Iterable.isAssociative = isAssociative;Iterable.isOrdered = isOrdered;Iterable.Keyed = KeyedIterable;Iterable.Indexed = IndexedIterable;Iterable.Set = SetIterable;var IS_ITERABLE_SENTINEL="@@__IMMUTABLE_ITERABLE__@@";var IS_KEYED_SENTINEL="@@__IMMUTABLE_KEYED__@@";var IS_INDEXED_SENTINEL="@@__IMMUTABLE_INDEXED__@@";var IS_ORDERED_SENTINEL="@@__IMMUTABLE_ORDERED__@@";var ITERATE_KEYS=0;var ITERATE_VALUES=1;var ITERATE_ENTRIES=2;var REAL_ITERATOR_SYMBOL=typeof Symbol === "function" && Symbol.iterator;var FAUX_ITERATOR_SYMBOL="@@iterator";var ITERATOR_SYMBOL=REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;function Iterator(next){this.next = next;}Iterator.prototype.toString = function(){return "[Iterator]";};Iterator.KEYS = ITERATE_KEYS;Iterator.VALUES = ITERATE_VALUES;Iterator.ENTRIES = ITERATE_ENTRIES;Iterator.prototype.inspect = Iterator.prototype.toSource = function(){return this.toString();};Iterator.prototype[ITERATOR_SYMBOL] = function(){return this;};function iteratorValue(type, k, v, iteratorResult){var value=type === 0?k:type === 1?v:[k, v];iteratorResult?iteratorResult.value = value:iteratorResult = {value:value, done:false};return iteratorResult;}function iteratorDone(){return {value:undefined, done:true};}function hasIterator(maybeIterable){return !!getIteratorFn(maybeIterable);}function isIterator(maybeIterator){return maybeIterator && typeof maybeIterator.next === "function";}function getIterator(iterable){var iteratorFn=getIteratorFn(iterable);return iteratorFn && iteratorFn.call(iterable);}function getIteratorFn(iterable){var iteratorFn=iterable && (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL] || iterable[FAUX_ITERATOR_SYMBOL]);if(typeof iteratorFn === "function"){return iteratorFn;}}function isArrayLike(value){return value && typeof value.length === "number";}createClass(Seq, Iterable);function Seq(value){return value === null || value === undefined?emptySequence():isIterable(value)?value.toSeq():seqFromValue(value);}Seq.of = function(){return Seq(arguments);};Seq.prototype.toSeq = function(){return this;};Seq.prototype.toString = function(){return this.__toString("Seq {", "}");};Seq.prototype.cacheResult = function(){if(!this._cache && this.__iterateUncached){this._cache = this.entrySeq().toArray();this.size = this._cache.length;}return this;};Seq.prototype.__iterate = function(fn, reverse){return seqIterate(this, fn, reverse, true);};Seq.prototype.__iterator = function(type, reverse){return seqIterator(this, type, reverse, true);};createClass(KeyedSeq, Seq);function KeyedSeq(value){return value === null || value === undefined?emptySequence().toKeyedSeq():isIterable(value)?isKeyed(value)?value.toSeq():value.fromEntrySeq():keyedSeqFromValue(value);}KeyedSeq.of = function(){return KeyedSeq(arguments);};KeyedSeq.prototype.toKeyedSeq = function(){return this;};KeyedSeq.prototype.toSeq = function(){return this;};createClass(IndexedSeq, Seq);function IndexedSeq(value){return value === null || value === undefined?emptySequence():!isIterable(value)?indexedSeqFromValue(value):isKeyed(value)?value.entrySeq():value.toIndexedSeq();}IndexedSeq.of = function(){return IndexedSeq(arguments);};IndexedSeq.prototype.toIndexedSeq = function(){return this;};IndexedSeq.prototype.toString = function(){return this.__toString("Seq [", "]");};IndexedSeq.prototype.__iterate = function(fn, reverse){return seqIterate(this, fn, reverse, false);};IndexedSeq.prototype.__iterator = function(type, reverse){return seqIterator(this, type, reverse, false);};createClass(SetSeq, Seq);function SetSeq(value){return (value === null || value === undefined?emptySequence():!isIterable(value)?indexedSeqFromValue(value):isKeyed(value)?value.entrySeq():value).toSetSeq();}SetSeq.of = function(){return SetSeq(arguments);};SetSeq.prototype.toSetSeq = function(){return this;};Seq.isSeq = isSeq;Seq.Keyed = KeyedSeq;Seq.Set = SetSeq;Seq.Indexed = IndexedSeq;var IS_SEQ_SENTINEL="@@__IMMUTABLE_SEQ__@@";Seq.prototype[IS_SEQ_SENTINEL] = true;createClass(ArraySeq, IndexedSeq);function ArraySeq(array){this._array = array;this.size = array.length;}ArraySeq.prototype.get = function(index, notSetValue){return this.has(index)?this._array[wrapIndex(this, index)]:notSetValue;};ArraySeq.prototype.__iterate = function(fn, reverse){var array=this._array;var maxIndex=array.length - 1;for(var ii=0; ii <= maxIndex; ii++) {if(fn(array[reverse?maxIndex - ii:ii], ii, this) === false){return ii + 1;}}return ii;};ArraySeq.prototype.__iterator = function(type, reverse){var array=this._array;var maxIndex=array.length - 1;var ii=0;return new Iterator(function(){return ii > maxIndex?iteratorDone():iteratorValue(type, ii, array[reverse?maxIndex - ii++:ii++]);});};createClass(ObjectSeq, KeyedSeq);function ObjectSeq(object){var keys=Object.keys(object);this._object = object;this._keys = keys;this.size = keys.length;}ObjectSeq.prototype.get = function(key, notSetValue){if(notSetValue !== undefined && !this.has(key)){return notSetValue;}return this._object[key];};ObjectSeq.prototype.has = function(key){return this._object.hasOwnProperty(key);};ObjectSeq.prototype.__iterate = function(fn, reverse){var object=this._object;var keys=this._keys;var maxIndex=keys.length - 1;for(var ii=0; ii <= maxIndex; ii++) {var key=keys[reverse?maxIndex - ii:ii];if(fn(object[key], key, this) === false){return ii + 1;}}return ii;};ObjectSeq.prototype.__iterator = function(type, reverse){var object=this._object;var keys=this._keys;var maxIndex=keys.length - 1;var ii=0;return new Iterator(function(){var key=keys[reverse?maxIndex - ii:ii];return ii++ > maxIndex?iteratorDone():iteratorValue(type, key, object[key]);});};ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;createClass(IterableSeq, IndexedSeq);function IterableSeq(iterable){this._iterable = iterable;this.size = iterable.length || iterable.size;}IterableSeq.prototype.__iterateUncached = function(fn, reverse){if(reverse){return this.cacheResult().__iterate(fn, reverse);}var iterable=this._iterable;var iterator=getIterator(iterable);var iterations=0;if(isIterator(iterator)){var step;while(!(step = iterator.next()).done) {if(fn(step.value, iterations++, this) === false){break;}}}return iterations;};IterableSeq.prototype.__iteratorUncached = function(type, reverse){if(reverse){return this.cacheResult().__iterator(type, reverse);}var iterable=this._iterable;var iterator=getIterator(iterable);if(!isIterator(iterator)){return new Iterator(iteratorDone);}var iterations=0;return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type, iterations++, step.value);});};createClass(IteratorSeq, IndexedSeq);function IteratorSeq(iterator){this._iterator = iterator;this._iteratorCache = [];}IteratorSeq.prototype.__iterateUncached = function(fn, reverse){if(reverse){return this.cacheResult().__iterate(fn, reverse);}var iterator=this._iterator;var cache=this._iteratorCache;var iterations=0;while(iterations < cache.length) {if(fn(cache[iterations], iterations++, this) === false){return iterations;}}var step;while(!(step = iterator.next()).done) {var val=step.value;cache[iterations] = val;if(fn(val, iterations++, this) === false){break;}}return iterations;};IteratorSeq.prototype.__iteratorUncached = function(type, reverse){if(reverse){return this.cacheResult().__iterator(type, reverse);}var iterator=this._iterator;var cache=this._iteratorCache;var iterations=0;return new Iterator(function(){if(iterations >= cache.length){var step=iterator.next();if(step.done){return step;}cache[iterations] = step.value;}return iteratorValue(type, iterations, cache[iterations++]);});};function isSeq(maybeSeq){return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);}var EMPTY_SEQ;function emptySequence(){return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));}function keyedSeqFromValue(value){var seq=Array.isArray(value)?new ArraySeq(value).fromEntrySeq():isIterator(value)?new IteratorSeq(value).fromEntrySeq():hasIterator(value)?new IterableSeq(value).fromEntrySeq():typeof value === "object"?new ObjectSeq(value):undefined;if(!seq){throw new TypeError("Expected Array or iterable object of [k, v] entries, " + "or keyed object: " + value);}return seq;}function indexedSeqFromValue(value){var seq=maybeIndexedSeqFromValue(value);if(!seq){throw new TypeError("Expected Array or iterable object of values: " + value);}return seq;}function seqFromValue(value){var seq=maybeIndexedSeqFromValue(value) || typeof value === "object" && new ObjectSeq(value);if(!seq){throw new TypeError("Expected Array or iterable object of values, or keyed object: " + value);}return seq;}function maybeIndexedSeqFromValue(value){return isArrayLike(value)?new ArraySeq(value):isIterator(value)?new IteratorSeq(value):hasIterator(value)?new IterableSeq(value):undefined;}function seqIterate(seq, fn, reverse, useKeys){var cache=seq._cache;if(cache){var maxIndex=cache.length - 1;for(var ii=0; ii <= maxIndex; ii++) {var entry=cache[reverse?maxIndex - ii:ii];if(fn(entry[1], useKeys?entry[0]:ii, seq) === false){return ii + 1;}}return ii;}return seq.__iterateUncached(fn, reverse);}function seqIterator(seq, type, reverse, useKeys){var cache=seq._cache;if(cache){var maxIndex=cache.length - 1;var ii=0;return new Iterator(function(){var entry=cache[reverse?maxIndex - ii:ii];return ii++ > maxIndex?iteratorDone():iteratorValue(type, useKeys?entry[0]:ii - 1, entry[1]);});}return seq.__iteratorUncached(type, reverse);}createClass(Collection, Iterable);function Collection(){throw TypeError("Abstract");}createClass(KeyedCollection, Collection);function KeyedCollection(){}createClass(IndexedCollection, Collection);function IndexedCollection(){}createClass(SetCollection, Collection);function SetCollection(){}Collection.Keyed = KeyedCollection;Collection.Indexed = IndexedCollection;Collection.Set = SetCollection;function is(valueA, valueB){if(valueA === valueB || valueA !== valueA && valueB !== valueB){return true;}if(!valueA || !valueB){return false;}if(typeof valueA.valueOf === "function" && typeof valueB.valueOf === "function"){valueA = valueA.valueOf();valueB = valueB.valueOf();}return typeof valueA.equals === "function" && typeof valueB.equals === "function"?valueA.equals(valueB):valueA === valueB || valueA !== valueA && valueB !== valueB;}function fromJS(json, converter){return converter?fromJSWith(converter, json, "", {"":json}):fromJSDefault(json);}function fromJSWith(converter, json, key, parentJSON){if(Array.isArray(json)){return converter.call(parentJSON, key, IndexedSeq(json).map(function(v, k){return fromJSWith(converter, v, k, json);}));}if(isPlainObj(json)){return converter.call(parentJSON, key, KeyedSeq(json).map(function(v, k){return fromJSWith(converter, v, k, json);}));}return json;}function fromJSDefault(json){if(Array.isArray(json)){return IndexedSeq(json).map(fromJSDefault).toList();}if(isPlainObj(json)){return KeyedSeq(json).map(fromJSDefault).toMap();}return json;}function isPlainObj(value){return value && value.constructor === Object;}var Math__imul=typeof Math.imul === "function" && Math.imul(4294967295, 2) === -2?Math.imul:function Math__imul(a, b){a = a | 0;b = b | 0;var c=a & 65535;var d=b & 65535;return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16 >>> 0) | 0;};function smi(i32){return i32 >>> 1 & 1073741824 | i32 & 3221225471;}function hash(o){if(o === false || o === null || o === undefined){return 0;}if(typeof o.valueOf === "function"){o = o.valueOf();if(o === false || o === null || o === undefined){return 0;}}if(o === true){return 1;}var type=typeof o;if(type === "number"){var h=o | 0;if(h !== o){h ^= o * 4294967295;}while(o > 4294967295) {o /= 4294967295;h ^= o;}return smi(h);}if(type === "string"){return o.length > STRING_HASH_CACHE_MIN_STRLEN?cachedHashString(o):hashString(o);}if(typeof o.hashCode === "function"){return o.hashCode();}return hashJSObj(o);}function cachedHashString(string){var hash=stringHashCache[string];if(hash === undefined){hash = hashString(string);if(STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE){STRING_HASH_CACHE_SIZE = 0;stringHashCache = {};}STRING_HASH_CACHE_SIZE++;stringHashCache[string] = hash;}return hash;}function hashString(string){var hash=0;for(var ii=0; ii < string.length; ii++) {hash = 31 * hash + string.charCodeAt(ii) | 0;}return smi(hash);}function hashJSObj(obj){var hash=weakMap && weakMap.get(obj);if(hash){return hash;}hash = obj[UID_HASH_KEY];if(hash){return hash;}if(!canDefineProperty){hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];if(hash){return hash;}hash = getIENodeHash(obj);if(hash){return hash;}}if(Object.isExtensible && !Object.isExtensible(obj)){throw new Error("Non-extensible objects are not allowed as keys.");}hash = ++objHashUID;if(objHashUID & 1073741824){objHashUID = 0;}if(weakMap){weakMap.set(obj, hash);}else if(canDefineProperty){Object.defineProperty(obj, UID_HASH_KEY, {enumerable:false, configurable:false, writable:false, value:hash});}else if(obj.propertyIsEnumerable && obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable){obj.propertyIsEnumerable = function(){return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);};obj.propertyIsEnumerable[UID_HASH_KEY] = hash;}else if(obj.nodeType){obj[UID_HASH_KEY] = hash;}else {throw new Error("Unable to set a non-enumerable property on object.");}return hash;}var canDefineProperty=(function(){try{Object.defineProperty({}, "x", {});return true;}catch(e) {return false;}})();function getIENodeHash(node){if(node && node.nodeType > 0){switch(node.nodeType){case 1:return node.uniqueID;case 9:return node.documentElement && node.documentElement.uniqueID;}}}var weakMap=typeof WeakMap === "function" && new WeakMap();var objHashUID=0;var UID_HASH_KEY="__immutablehash__";if(typeof Symbol === "function"){UID_HASH_KEY = Symbol(UID_HASH_KEY);}var STRING_HASH_CACHE_MIN_STRLEN=16;var STRING_HASH_CACHE_MAX_SIZE=255;var STRING_HASH_CACHE_SIZE=0;var stringHashCache={};function invariant(condition, error){if(!condition)throw new Error(error);}function assertNotInfinite(size){invariant(size !== Infinity, "Cannot perform this action with an infinite size.");}createClass(ToKeyedSequence, KeyedSeq);function ToKeyedSequence(indexed, useKeys){this._iter = indexed;this._useKeys = useKeys;this.size = indexed.size;}ToKeyedSequence.prototype.get = function(key, notSetValue){return this._iter.get(key, notSetValue);};ToKeyedSequence.prototype.has = function(key){return this._iter.has(key);};ToKeyedSequence.prototype.valueSeq = function(){return this._iter.valueSeq();};ToKeyedSequence.prototype.reverse = function(){var this$0=this;var reversedSequence=reverseFactory(this, true);if(!this._useKeys){reversedSequence.valueSeq = function(){return this$0._iter.toSeq().reverse();};}return reversedSequence;};ToKeyedSequence.prototype.map = function(mapper, context){var this$0=this;var mappedSequence=mapFactory(this, mapper, context);if(!this._useKeys){mappedSequence.valueSeq = function(){return this$0._iter.toSeq().map(mapper, context);};}return mappedSequence;};ToKeyedSequence.prototype.__iterate = function(fn, reverse){var this$0=this;var ii;return this._iter.__iterate(this._useKeys?function(v, k){return fn(v, k, this$0);}:(ii = reverse?resolveSize(this):0, function(v){return fn(v, reverse?--ii:ii++, this$0);}), reverse);};ToKeyedSequence.prototype.__iterator = function(type, reverse){if(this._useKeys){return this._iter.__iterator(type, reverse);}var iterator=this._iter.__iterator(ITERATE_VALUES, reverse);var ii=reverse?resolveSize(this):0;return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type, reverse?--ii:ii++, step.value, step);});};ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;createClass(ToIndexedSequence, IndexedSeq);function ToIndexedSequence(iter){this._iter = iter;this.size = iter.size;}ToIndexedSequence.prototype.contains = function(value){return this._iter.contains(value);};ToIndexedSequence.prototype.__iterate = function(fn, reverse){var this$0=this;var iterations=0;return this._iter.__iterate(function(v){return fn(v, iterations++, this$0);}, reverse);};ToIndexedSequence.prototype.__iterator = function(type, reverse){var iterator=this._iter.__iterator(ITERATE_VALUES, reverse);var iterations=0;return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type, iterations++, step.value, step);});};createClass(ToSetSequence, SetSeq);function ToSetSequence(iter){this._iter = iter;this.size = iter.size;}ToSetSequence.prototype.has = function(key){return this._iter.contains(key);};ToSetSequence.prototype.__iterate = function(fn, reverse){var this$0=this;return this._iter.__iterate(function(v){return fn(v, v, this$0);}, reverse);};ToSetSequence.prototype.__iterator = function(type, reverse){var iterator=this._iter.__iterator(ITERATE_VALUES, reverse);return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type, step.value, step.value, step);});};createClass(FromEntriesSequence, KeyedSeq);function FromEntriesSequence(entries){this._iter = entries;this.size = entries.size;}FromEntriesSequence.prototype.entrySeq = function(){return this._iter.toSeq();};FromEntriesSequence.prototype.__iterate = function(fn, reverse){var this$0=this;return this._iter.__iterate(function(entry){if(entry){validateEntry(entry);return fn(entry[1], entry[0], this$0);}}, reverse);};FromEntriesSequence.prototype.__iterator = function(type, reverse){var iterator=this._iter.__iterator(ITERATE_VALUES, reverse);return new Iterator(function(){while(true) {var step=iterator.next();if(step.done){return step;}var entry=step.value;if(entry){validateEntry(entry);return type === ITERATE_ENTRIES?step:iteratorValue(type, entry[0], entry[1], step);}}});};ToIndexedSequence.prototype.cacheResult = ToKeyedSequence.prototype.cacheResult = ToSetSequence.prototype.cacheResult = FromEntriesSequence.prototype.cacheResult = cacheResultThrough;function flipFactory(iterable){var flipSequence=makeSequence(iterable);flipSequence._iter = iterable;flipSequence.size = iterable.size;flipSequence.flip = function(){return iterable;};flipSequence.reverse = function(){var reversedSequence=iterable.reverse.apply(this);reversedSequence.flip = function(){return iterable.reverse();};return reversedSequence;};flipSequence.has = function(key){return iterable.contains(key);};flipSequence.contains = function(key){return iterable.has(key);};flipSequence.cacheResult = cacheResultThrough;flipSequence.__iterateUncached = function(fn, reverse){var this$0=this;return iterable.__iterate(function(v, k){return fn(k, v, this$0) !== false;}, reverse);};flipSequence.__iteratorUncached = function(type, reverse){if(type === ITERATE_ENTRIES){var iterator=iterable.__iterator(type, reverse);return new Iterator(function(){var step=iterator.next();if(!step.done){var k=step.value[0];step.value[0] = step.value[1];step.value[1] = k;}return step;});}return iterable.__iterator(type === ITERATE_VALUES?ITERATE_KEYS:ITERATE_VALUES, reverse);};return flipSequence;}function mapFactory(iterable, mapper, context){var mappedSequence=makeSequence(iterable);mappedSequence.size = iterable.size;mappedSequence.has = function(key){return iterable.has(key);};mappedSequence.get = function(key, notSetValue){var v=iterable.get(key, NOT_SET);return v === NOT_SET?notSetValue:mapper.call(context, v, key, iterable);};mappedSequence.__iterateUncached = function(fn, reverse){var this$0=this;return iterable.__iterate(function(v, k, c){return fn(mapper.call(context, v, k, c), k, this$0) !== false;}, reverse);};mappedSequence.__iteratorUncached = function(type, reverse){var iterator=iterable.__iterator(ITERATE_ENTRIES, reverse);return new Iterator(function(){var step=iterator.next();if(step.done){return step;}var entry=step.value;var key=entry[0];return iteratorValue(type, key, mapper.call(context, entry[1], key, iterable), step);});};return mappedSequence;}function reverseFactory(iterable, useKeys){var reversedSequence=makeSequence(iterable);reversedSequence._iter = iterable;reversedSequence.size = iterable.size;reversedSequence.reverse = function(){return iterable;};if(iterable.flip){reversedSequence.flip = function(){var flipSequence=flipFactory(iterable);flipSequence.reverse = function(){return iterable.flip();};return flipSequence;};}reversedSequence.get = function(key, notSetValue){return iterable.get(useKeys?key:-1 - key, notSetValue);};reversedSequence.has = function(key){return iterable.has(useKeys?key:-1 - key);};reversedSequence.contains = function(value){return iterable.contains(value);};reversedSequence.cacheResult = cacheResultThrough;reversedSequence.__iterate = function(fn, reverse){var this$0=this;return iterable.__iterate(function(v, k){return fn(v, k, this$0);}, !reverse);};reversedSequence.__iterator = function(type, reverse){return iterable.__iterator(type, !reverse);};return reversedSequence;}function filterFactory(iterable, predicate, context, useKeys){var filterSequence=makeSequence(iterable);if(useKeys){filterSequence.has = function(key){var v=iterable.get(key, NOT_SET);return v !== NOT_SET && !!predicate.call(context, v, key, iterable);};filterSequence.get = function(key, notSetValue){var v=iterable.get(key, NOT_SET);return v !== NOT_SET && predicate.call(context, v, key, iterable)?v:notSetValue;};}filterSequence.__iterateUncached = function(fn, reverse){var this$0=this;var iterations=0;iterable.__iterate(function(v, k, c){if(predicate.call(context, v, k, c)){iterations++;return fn(v, useKeys?k:iterations - 1, this$0);}}, reverse);return iterations;};filterSequence.__iteratorUncached = function(type, reverse){var iterator=iterable.__iterator(ITERATE_ENTRIES, reverse);var iterations=0;return new Iterator(function(){while(true) {var step=iterator.next();if(step.done){return step;}var entry=step.value;var key=entry[0];var value=entry[1];if(predicate.call(context, value, key, iterable)){return iteratorValue(type, useKeys?key:iterations++, value, step);}}});};return filterSequence;}function countByFactory(iterable, grouper, context){var groups=Map().asMutable();iterable.__iterate(function(v, k){groups.update(grouper.call(context, v, k, iterable), 0, function(a){return a + 1;});});return groups.asImmutable();}function groupByFactory(iterable, grouper, context){var isKeyedIter=isKeyed(iterable);var groups=(isOrdered(iterable)?OrderedMap():Map()).asMutable();iterable.__iterate(function(v, k){groups.update(grouper.call(context, v, k, iterable), function(a){return (a = a || [], a.push(isKeyedIter?[k, v]:v), a);});});var coerce=iterableClass(iterable);return groups.map(function(arr){return reify(iterable, coerce(arr));});}function sliceFactory(_x, _x2, _x3, _x4){var _again=true;_function: while(_again) {_again = false;var iterable=_x, begin=_x2, end=_x3, useKeys=_x4;originalSize = resolvedBegin = resolvedEnd = sliceSize = sliceSeq = undefined;var originalSize=iterable.size;if(wholeSlice(begin, end, originalSize)){return iterable;}var resolvedBegin=resolveBegin(begin, originalSize);var resolvedEnd=resolveEnd(end, originalSize);if(resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd){_x = iterable.toSeq().cacheResult();_x2 = begin;_x3 = end;_x4 = useKeys;_again = true;continue _function;}var sliceSize=resolvedEnd - resolvedBegin;if(sliceSize < 0){sliceSize = 0;}var sliceSeq=makeSequence(iterable);sliceSeq.size = sliceSize === 0?sliceSize:iterable.size && sliceSize || undefined;if(!useKeys && isSeq(iterable) && sliceSize >= 0){sliceSeq.get = function(index, notSetValue){index = wrapIndex(this, index);return index >= 0 && index < sliceSize?iterable.get(index + resolvedBegin, notSetValue):notSetValue;};}sliceSeq.__iterateUncached = function(fn, reverse){var this$0=this;if(sliceSize === 0){return 0;}if(reverse){return this.cacheResult().__iterate(fn, reverse);}var skipped=0;var isSkipping=true;var iterations=0;iterable.__iterate(function(v, k){if(!(isSkipping && (isSkipping = skipped++ < resolvedBegin))){iterations++;return fn(v, useKeys?k:iterations - 1, this$0) !== false && iterations !== sliceSize;}});return iterations;};sliceSeq.__iteratorUncached = function(type, reverse){if(sliceSize && reverse){return this.cacheResult().__iterator(type, reverse);}var iterator=sliceSize && iterable.__iterator(type, reverse);var skipped=0;var iterations=0;return new Iterator(function(){while(skipped++ !== resolvedBegin) {iterator.next();}if(++iterations > sliceSize){return iteratorDone();}var step=iterator.next();if(useKeys || type === ITERATE_VALUES){return step;}else if(type === ITERATE_KEYS){return iteratorValue(type, iterations - 1, undefined, step);}else {return iteratorValue(type, iterations - 1, step.value[1], step);}});};return sliceSeq;}}function takeWhileFactory(iterable, predicate, context){var takeSequence=makeSequence(iterable);takeSequence.__iterateUncached = function(fn, reverse){var this$0=this;if(reverse){return this.cacheResult().__iterate(fn, reverse);}var iterations=0;iterable.__iterate(function(v, k, c){return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$0);});return iterations;};takeSequence.__iteratorUncached = function(type, reverse){var this$0=this;if(reverse){return this.cacheResult().__iterator(type, reverse);}var iterator=iterable.__iterator(ITERATE_ENTRIES, reverse);var iterating=true;return new Iterator(function(){if(!iterating){return iteratorDone();}var step=iterator.next();if(step.done){return step;}var entry=step.value;var k=entry[0];var v=entry[1];if(!predicate.call(context, v, k, this$0)){iterating = false;return iteratorDone();}return type === ITERATE_ENTRIES?step:iteratorValue(type, k, v, step);});};return takeSequence;}function skipWhileFactory(iterable, predicate, context, useKeys){var skipSequence=makeSequence(iterable);skipSequence.__iterateUncached = function(fn, reverse){var this$0=this;if(reverse){return this.cacheResult().__iterate(fn, reverse);}var isSkipping=true;var iterations=0;iterable.__iterate(function(v, k, c){if(!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))){iterations++;return fn(v, useKeys?k:iterations - 1, this$0);}});return iterations;};skipSequence.__iteratorUncached = function(type, reverse){var this$0=this;if(reverse){return this.cacheResult().__iterator(type, reverse);}var iterator=iterable.__iterator(ITERATE_ENTRIES, reverse);var skipping=true;var iterations=0;return new Iterator(function(){var step, k, v;do{step = iterator.next();if(step.done){if(useKeys || type === ITERATE_VALUES){return step;}else if(type === ITERATE_KEYS){return iteratorValue(type, iterations++, undefined, step);}else {return iteratorValue(type, iterations++, step.value[1], step);}}var entry=step.value;k = entry[0];v = entry[1];skipping && (skipping = predicate.call(context, v, k, this$0));}while(skipping);return type === ITERATE_ENTRIES?step:iteratorValue(type, k, v, step);});};return skipSequence;}function concatFactory(iterable, values){var isKeyedIterable=isKeyed(iterable);var iters=[iterable].concat(values).map(function(v){if(!isIterable(v)){v = isKeyedIterable?keyedSeqFromValue(v):indexedSeqFromValue(Array.isArray(v)?v:[v]);}else if(isKeyedIterable){v = KeyedIterable(v);}return v;}).filter(function(v){return v.size !== 0;});if(iters.length === 0){return iterable;}if(iters.length === 1){var singleton=iters[0];if(singleton === iterable || isKeyedIterable && isKeyed(singleton) || isIndexed(iterable) && isIndexed(singleton)){return singleton;}}var concatSeq=new ArraySeq(iters);if(isKeyedIterable){concatSeq = concatSeq.toKeyedSeq();}else if(!isIndexed(iterable)){concatSeq = concatSeq.toSetSeq();}concatSeq = concatSeq.flatten(true);concatSeq.size = iters.reduce(function(sum, seq){if(sum !== undefined){var size=seq.size;if(size !== undefined){return sum + size;}}}, 0);return concatSeq;}function flattenFactory(iterable, depth, useKeys){var flatSequence=makeSequence(iterable);flatSequence.__iterateUncached = function(fn, reverse){var iterations=0;var stopped=false;function flatDeep(iter, currentDepth){var this$0=this;iter.__iterate(function(v, k){if((!depth || currentDepth < depth) && isIterable(v)){flatDeep(v, currentDepth + 1);}else if(fn(v, useKeys?k:iterations++, this$0) === false){stopped = true;}return !stopped;}, reverse);}flatDeep(iterable, 0);return iterations;};flatSequence.__iteratorUncached = function(type, reverse){var iterator=iterable.__iterator(type, reverse);var stack=[];var iterations=0;return new Iterator(function(){while(iterator) {var step=iterator.next();if(step.done !== false){iterator = stack.pop();continue;}var v=step.value;if(type === ITERATE_ENTRIES){v = v[1];}if((!depth || stack.length < depth) && isIterable(v)){stack.push(iterator);iterator = v.__iterator(type, reverse);}else {return useKeys?step:iteratorValue(type, iterations++, v, step);}}return iteratorDone();});};return flatSequence;}function flatMapFactory(iterable, mapper, context){var coerce=iterableClass(iterable);return iterable.toSeq().map(function(v, k){return coerce(mapper.call(context, v, k, iterable));}).flatten(true);}function interposeFactory(iterable, separator){var interposedSequence=makeSequence(iterable);interposedSequence.size = iterable.size && iterable.size * 2 - 1;interposedSequence.__iterateUncached = function(fn, reverse){var this$0=this;var iterations=0;iterable.__iterate(function(v, k){return (!iterations || fn(separator, iterations++, this$0) !== false) && fn(v, iterations++, this$0) !== false;}, reverse);return iterations;};interposedSequence.__iteratorUncached = function(type, reverse){var iterator=iterable.__iterator(ITERATE_VALUES, reverse);var iterations=0;var step;return new Iterator(function(){if(!step || iterations % 2){step = iterator.next();if(step.done){return step;}}return iterations % 2?iteratorValue(type, iterations++, separator):iteratorValue(type, iterations++, step.value, step);});};return interposedSequence;}function sortFactory(iterable, comparator, mapper){if(!comparator){comparator = defaultComparator;}var isKeyedIterable=isKeyed(iterable);var index=0;var entries=iterable.toSeq().map(function(v, k){return [k, v, index++, mapper?mapper(v, k, iterable):v];}).toArray();entries.sort(function(a, b){return comparator(a[3], b[3]) || a[2] - b[2];}).forEach(isKeyedIterable?function(v, i){entries[i].length = 2;}:function(v, i){entries[i] = v[1];});return isKeyedIterable?KeyedSeq(entries):isIndexed(iterable)?IndexedSeq(entries):SetSeq(entries);}function maxFactory(iterable, comparator, mapper){if(!comparator){comparator = defaultComparator;}if(mapper){var entry=iterable.toSeq().map(function(v, k){return [v, mapper(v, k, iterable)];}).reduce(function(a, b){return maxCompare(comparator, a[1], b[1])?b:a;});return entry && entry[0];}else {return iterable.reduce(function(a, b){return maxCompare(comparator, a, b)?b:a;});}}function maxCompare(comparator, a, b){var comp=comparator(b, a);return comp === 0 && b !== a && (b === undefined || b === null || b !== b) || comp > 0;}function zipWithFactory(keyIter, zipper, iters){var zipSequence=makeSequence(keyIter);zipSequence.size = new ArraySeq(iters).map(function(i){return i.size;}).min();zipSequence.__iterate = function(fn, reverse){var iterator=this.__iterator(ITERATE_VALUES, reverse);var step;var iterations=0;while(!(step = iterator.next()).done) {if(fn(step.value, iterations++, this) === false){break;}}return iterations;};zipSequence.__iteratorUncached = function(type, reverse){var iterators=iters.map(function(i){return (i = Iterable(i), getIterator(reverse?i.reverse():i));});var iterations=0;var isDone=false;return new Iterator(function(){var steps;if(!isDone){steps = iterators.map(function(i){return i.next();});isDone = steps.some(function(s){return s.done;});}if(isDone){return iteratorDone();}return iteratorValue(type, iterations++, zipper.apply(null, steps.map(function(s){return s.value;})));});};return zipSequence;}function reify(iter, seq){return isSeq(iter)?seq:iter.constructor(seq);}function validateEntry(entry){if(entry !== Object(entry)){throw new TypeError("Expected [K, V] tuple: " + entry);}}function resolveSize(iter){assertNotInfinite(iter.size);return ensureSize(iter);}function iterableClass(iterable){return isKeyed(iterable)?KeyedIterable:isIndexed(iterable)?IndexedIterable:SetIterable;}function makeSequence(iterable){return Object.create((isKeyed(iterable)?KeyedSeq:isIndexed(iterable)?IndexedSeq:SetSeq).prototype);}function cacheResultThrough(){if(this._iter.cacheResult){this._iter.cacheResult();this.size = this._iter.size;return this;}else {return Seq.prototype.cacheResult.call(this);}}function defaultComparator(a, b){return a > b?1:a < b?-1:0;}function forceIterator(keyPath){var iter=getIterator(keyPath);if(!iter){if(!isArrayLike(keyPath)){throw new TypeError("Expected iterable or array-like: " + keyPath);}iter = getIterator(Iterable(keyPath));}return iter;}createClass(Map, KeyedCollection);function Map(value){return value === null || value === undefined?emptyMap():isMap(value)?value:emptyMap().withMutations(function(map){var iter=KeyedIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v, k){return map.set(k, v);});});}Map.prototype.toString = function(){return this.__toString("Map {", "}");};Map.prototype.get = function(k, notSetValue){return this._root?this._root.get(0, undefined, k, notSetValue):notSetValue;};Map.prototype.set = function(k, v){return updateMap(this, k, v);};Map.prototype.setIn = function(keyPath, v){return this.updateIn(keyPath, NOT_SET, function(){return v;});};Map.prototype.remove = function(k){return updateMap(this, k, NOT_SET);};Map.prototype.deleteIn = function(keyPath){return this.updateIn(keyPath, function(){return NOT_SET;});};Map.prototype.update = function(k, notSetValue, updater){return arguments.length === 1?k(this):this.updateIn([k], notSetValue, updater);};Map.prototype.updateIn = function(keyPath, notSetValue, updater){if(!updater){updater = notSetValue;notSetValue = undefined;}var updatedValue=updateInDeepMap(this, forceIterator(keyPath), notSetValue, updater);return updatedValue === NOT_SET?undefined:updatedValue;};Map.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = 0;this._root = null;this.__hash = undefined;this.__altered = true;return this;}return emptyMap();};Map.prototype.merge = function(){return mergeIntoMapWith(this, undefined, arguments);};Map.prototype.mergeWith = function(merger){var iters=SLICE$0.call(arguments, 1);return mergeIntoMapWith(this, merger, iters);};Map.prototype.mergeIn = function(keyPath){var iters=SLICE$0.call(arguments, 1);return this.updateIn(keyPath, emptyMap(), function(m){return m.merge.apply(m, iters);});};Map.prototype.mergeDeep = function(){return mergeIntoMapWith(this, deepMerger(undefined), arguments);};Map.prototype.mergeDeepWith = function(merger){var iters=SLICE$0.call(arguments, 1);return mergeIntoMapWith(this, deepMerger(merger), iters);};Map.prototype.mergeDeepIn = function(keyPath){var iters=SLICE$0.call(arguments, 1);return this.updateIn(keyPath, emptyMap(), function(m){return m.mergeDeep.apply(m, iters);});};Map.prototype.sort = function(comparator){return OrderedMap(sortFactory(this, comparator));};Map.prototype.sortBy = function(mapper, comparator){return OrderedMap(sortFactory(this, comparator, mapper));};Map.prototype.withMutations = function(fn){var mutable=this.asMutable();fn(mutable);return mutable.wasAltered()?mutable.__ensureOwner(this.__ownerID):this;};Map.prototype.asMutable = function(){return this.__ownerID?this:this.__ensureOwner(new OwnerID());};Map.prototype.asImmutable = function(){return this.__ensureOwner();};Map.prototype.wasAltered = function(){return this.__altered;};Map.prototype.__iterator = function(type, reverse){return new MapIterator(this, type, reverse);};Map.prototype.__iterate = function(fn, reverse){var this$0=this;var iterations=0;this._root && this._root.iterate(function(entry){iterations++;return fn(entry[1], entry[0], this$0);}, reverse);return iterations;};Map.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}if(!ownerID){this.__ownerID = ownerID;this.__altered = false;return this;}return makeMap(this.size, this._root, ownerID, this.__hash);};function isMap(maybeMap){return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);}Map.isMap = isMap;var IS_MAP_SENTINEL="@@__IMMUTABLE_MAP__@@";var MapPrototype=Map.prototype;MapPrototype[IS_MAP_SENTINEL] = true;MapPrototype[DELETE] = MapPrototype.remove;MapPrototype.removeIn = MapPrototype.deleteIn;function ArrayMapNode(ownerID, entries){this.ownerID = ownerID;this.entries = entries;}ArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue){var entries=this.entries;for(var ii=0, len=entries.length; ii < len; ii++) {if(is(key, entries[ii][0])){return entries[ii][1];}}return notSetValue;};ArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter){var removed=value === NOT_SET;var entries=this.entries;var idx=0;for(var len=entries.length; idx < len; idx++) {if(is(key, entries[idx][0])){break;}}var exists=idx < len;if(exists?entries[idx][1] === value:removed){return this;}SetRef(didAlter);(removed || !exists) && SetRef(didChangeSize);if(removed && entries.length === 1){return;}if(!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE){return createNodes(ownerID, entries, key, value);}var isEditable=ownerID && ownerID === this.ownerID;var newEntries=isEditable?entries:arrCopy(entries);if(exists){if(removed){idx === len - 1?newEntries.pop():newEntries[idx] = newEntries.pop();}else {newEntries[idx] = [key, value];}}else {newEntries.push([key, value]);}if(isEditable){this.entries = newEntries;return this;}return new ArrayMapNode(ownerID, newEntries);};function BitmapIndexedNode(ownerID, bitmap, nodes){this.ownerID = ownerID;this.bitmap = bitmap;this.nodes = nodes;}BitmapIndexedNode.prototype.get = function(shift, keyHash, key, notSetValue){if(keyHash === undefined){keyHash = hash(key);}var bit=1 << ((shift === 0?keyHash:keyHash >>> shift) & MASK);var bitmap=this.bitmap;return (bitmap & bit) === 0?notSetValue:this.nodes[popCount(bitmap & bit - 1)].get(shift + SHIFT, keyHash, key, notSetValue);};BitmapIndexedNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter){if(keyHash === undefined){keyHash = hash(key);}var keyHashFrag=(shift === 0?keyHash:keyHash >>> shift) & MASK;var bit=1 << keyHashFrag;var bitmap=this.bitmap;var exists=(bitmap & bit) !== 0;if(!exists && value === NOT_SET){return this;}var idx=popCount(bitmap & bit - 1);var nodes=this.nodes;var node=exists?nodes[idx]:undefined;var newNode=updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);if(newNode === node){return this;}if(!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE){return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);}if(exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])){return nodes[idx ^ 1];}if(exists && newNode && nodes.length === 1 && isLeafNode(newNode)){return newNode;}var isEditable=ownerID && ownerID === this.ownerID;var newBitmap=exists?newNode?bitmap:bitmap ^ bit:bitmap | bit;var newNodes=exists?newNode?setIn(nodes, idx, newNode, isEditable):spliceOut(nodes, idx, isEditable):spliceIn(nodes, idx, newNode, isEditable);if(isEditable){this.bitmap = newBitmap;this.nodes = newNodes;return this;}return new BitmapIndexedNode(ownerID, newBitmap, newNodes);};function HashArrayMapNode(ownerID, count, nodes){this.ownerID = ownerID;this.count = count;this.nodes = nodes;}HashArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue){if(keyHash === undefined){keyHash = hash(key);}var idx=(shift === 0?keyHash:keyHash >>> shift) & MASK;var node=this.nodes[idx];return node?node.get(shift + SHIFT, keyHash, key, notSetValue):notSetValue;};HashArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter){if(keyHash === undefined){keyHash = hash(key);}var idx=(shift === 0?keyHash:keyHash >>> shift) & MASK;var removed=value === NOT_SET;var nodes=this.nodes;var node=nodes[idx];if(removed && !node){return this;}var newNode=updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);if(newNode === node){return this;}var newCount=this.count;if(!node){newCount++;}else if(!newNode){newCount--;if(newCount < MIN_HASH_ARRAY_MAP_SIZE){return packNodes(ownerID, nodes, newCount, idx);}}var isEditable=ownerID && ownerID === this.ownerID;var newNodes=setIn(nodes, idx, newNode, isEditable);if(isEditable){this.count = newCount;this.nodes = newNodes;return this;}return new HashArrayMapNode(ownerID, newCount, newNodes);};function HashCollisionNode(ownerID, keyHash, entries){this.ownerID = ownerID;this.keyHash = keyHash;this.entries = entries;}HashCollisionNode.prototype.get = function(shift, keyHash, key, notSetValue){var entries=this.entries;for(var ii=0, len=entries.length; ii < len; ii++) {if(is(key, entries[ii][0])){return entries[ii][1];}}return notSetValue;};HashCollisionNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter){if(keyHash === undefined){keyHash = hash(key);}var removed=value === NOT_SET;if(keyHash !== this.keyHash){if(removed){return this;}SetRef(didAlter);SetRef(didChangeSize);return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);}var entries=this.entries;var idx=0;for(var len=entries.length; idx < len; idx++) {if(is(key, entries[idx][0])){break;}}var exists=idx < len;if(exists?entries[idx][1] === value:removed){return this;}SetRef(didAlter);(removed || !exists) && SetRef(didChangeSize);if(removed && len === 2){return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);}var isEditable=ownerID && ownerID === this.ownerID;var newEntries=isEditable?entries:arrCopy(entries);if(exists){if(removed){idx === len - 1?newEntries.pop():newEntries[idx] = newEntries.pop();}else {newEntries[idx] = [key, value];}}else {newEntries.push([key, value]);}if(isEditable){this.entries = newEntries;return this;}return new HashCollisionNode(ownerID, this.keyHash, newEntries);};function ValueNode(ownerID, keyHash, entry){this.ownerID = ownerID;this.keyHash = keyHash;this.entry = entry;}ValueNode.prototype.get = function(shift, keyHash, key, notSetValue){return is(key, this.entry[0])?this.entry[1]:notSetValue;};ValueNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter){var removed=value === NOT_SET;var keyMatch=is(key, this.entry[0]);if(keyMatch?value === this.entry[1]:removed){return this;}SetRef(didAlter);if(removed){SetRef(didChangeSize);return;}if(keyMatch){if(ownerID && ownerID === this.ownerID){this.entry[1] = value;return this;}return new ValueNode(ownerID, this.keyHash, [key, value]);}SetRef(didChangeSize);return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);};ArrayMapNode.prototype.iterate = HashCollisionNode.prototype.iterate = function(fn, reverse){var entries=this.entries;for(var ii=0, maxIndex=entries.length - 1; ii <= maxIndex; ii++) {if(fn(entries[reverse?maxIndex - ii:ii]) === false){return false;}}};BitmapIndexedNode.prototype.iterate = HashArrayMapNode.prototype.iterate = function(fn, reverse){var nodes=this.nodes;for(var ii=0, maxIndex=nodes.length - 1; ii <= maxIndex; ii++) {var node=nodes[reverse?maxIndex - ii:ii];if(node && node.iterate(fn, reverse) === false){return false;}}};ValueNode.prototype.iterate = function(fn, reverse){return fn(this.entry);};createClass(MapIterator, Iterator);function MapIterator(map, type, reverse){this._type = type;this._reverse = reverse;this._stack = map._root && mapIteratorFrame(map._root);}MapIterator.prototype.next = function(){var type=this._type;var stack=this._stack;while(stack) {var node=stack.node;var index=stack.index++;var maxIndex;if(node.entry){if(index === 0){return mapIteratorValue(type, node.entry);}}else if(node.entries){maxIndex = node.entries.length - 1;if(index <= maxIndex){return mapIteratorValue(type, node.entries[this._reverse?maxIndex - index:index]);}}else {maxIndex = node.nodes.length - 1;if(index <= maxIndex){var subNode=node.nodes[this._reverse?maxIndex - index:index];if(subNode){if(subNode.entry){return mapIteratorValue(type, subNode.entry);}stack = this._stack = mapIteratorFrame(subNode, stack);}continue;}}stack = this._stack = this._stack.__prev;}return iteratorDone();};function mapIteratorValue(type, entry){return iteratorValue(type, entry[0], entry[1]);}function mapIteratorFrame(node, prev){return {node:node, index:0, __prev:prev};}function makeMap(size, root, ownerID, hash){var map=Object.create(MapPrototype);map.size = size;map._root = root;map.__ownerID = ownerID;map.__hash = hash;map.__altered = false;return map;}var EMPTY_MAP;function emptyMap(){return EMPTY_MAP || (EMPTY_MAP = makeMap(0));}function updateMap(map, k, v){var newRoot;var newSize;if(!map._root){if(v === NOT_SET){return map;}newSize = 1;newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);}else {var didChangeSize=MakeRef(CHANGE_LENGTH);var didAlter=MakeRef(DID_ALTER);newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);if(!didAlter.value){return map;}newSize = map.size + (didChangeSize.value?v === NOT_SET?-1:1:0);}if(map.__ownerID){map.size = newSize;map._root = newRoot;map.__hash = undefined;map.__altered = true;return map;}return newRoot?makeMap(newSize, newRoot):emptyMap();}function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter){if(!node){if(value === NOT_SET){return node;}SetRef(didAlter);SetRef(didChangeSize);return new ValueNode(ownerID, keyHash, [key, value]);}return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);}function isLeafNode(node){return node.constructor === ValueNode || node.constructor === HashCollisionNode;}function mergeIntoNode(node, ownerID, shift, keyHash, entry){if(node.keyHash === keyHash){return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);}var idx1=(shift === 0?node.keyHash:node.keyHash >>> shift) & MASK;var idx2=(shift === 0?keyHash:keyHash >>> shift) & MASK;var newNode;var nodes=idx1 === idx2?[mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)]:(newNode = new ValueNode(ownerID, keyHash, entry), idx1 < idx2?[node, newNode]:[newNode, node]);return new BitmapIndexedNode(ownerID, 1 << idx1 | 1 << idx2, nodes);}function createNodes(ownerID, entries, key, value){if(!ownerID){ownerID = new OwnerID();}var node=new ValueNode(ownerID, hash(key), [key, value]);for(var ii=0; ii < entries.length; ii++) {var entry=entries[ii];node = node.update(ownerID, 0, undefined, entry[0], entry[1]);}return node;}function packNodes(ownerID, nodes, count, excluding){var bitmap=0;var packedII=0;var packedNodes=new Array(count);for(var ii=0, bit=1, len=nodes.length; ii < len; ii++, bit <<= 1) {var node=nodes[ii];if(node !== undefined && ii !== excluding){bitmap |= bit;packedNodes[packedII++] = node;}}return new BitmapIndexedNode(ownerID, bitmap, packedNodes);}function expandNodes(ownerID, nodes, bitmap, including, node){var count=0;var expandedNodes=new Array(SIZE);for(var ii=0; bitmap !== 0; ii++, bitmap >>>= 1) {expandedNodes[ii] = bitmap & 1?nodes[count++]:undefined;}expandedNodes[including] = node;return new HashArrayMapNode(ownerID, count + 1, expandedNodes);}function mergeIntoMapWith(map, merger, iterables){var iters=[];for(var ii=0; ii < iterables.length; ii++) {var value=iterables[ii];var iter=KeyedIterable(value);if(!isIterable(value)){iter = iter.map(function(v){return fromJS(v);});}iters.push(iter);}return mergeIntoCollectionWith(map, merger, iters);}function deepMerger(merger){return function(existing, value){return existing && existing.mergeDeepWith && isIterable(value)?existing.mergeDeepWith(merger, value):merger?merger(existing, value):value;};}function mergeIntoCollectionWith(collection, merger, iters){iters = iters.filter(function(x){return x.size !== 0;});if(iters.length === 0){return collection;}if(collection.size === 0 && iters.length === 1){return collection.constructor(iters[0]);}return collection.withMutations(function(collection){var mergeIntoMap=merger?function(value, key){collection.update(key, NOT_SET, function(existing){return existing === NOT_SET?value:merger(existing, value);});}:function(value, key){collection.set(key, value);};for(var ii=0; ii < iters.length; ii++) {iters[ii].forEach(mergeIntoMap);}});}function updateInDeepMap(existing, keyPathIter, notSetValue, updater){var isNotSet=existing === NOT_SET;var step=keyPathIter.next();if(step.done){var existingValue=isNotSet?notSetValue:existing;var newValue=updater(existingValue);return newValue === existingValue?existing:newValue;}invariant(isNotSet || existing && existing.set, "invalid keyPath");var key=step.value;var nextExisting=isNotSet?NOT_SET:existing.get(key, NOT_SET);var nextUpdated=updateInDeepMap(nextExisting, keyPathIter, notSetValue, updater);return nextUpdated === nextExisting?existing:nextUpdated === NOT_SET?existing.remove(key):(isNotSet?emptyMap():existing).set(key, nextUpdated);}function popCount(x){x = x - (x >> 1 & 1431655765);x = (x & 858993459) + (x >> 2 & 858993459);x = x + (x >> 4) & 252645135;x = x + (x >> 8);x = x + (x >> 16);return x & 127;}function setIn(array, idx, val, canEdit){var newArray=canEdit?array:arrCopy(array);newArray[idx] = val;return newArray;}function spliceIn(array, idx, val, canEdit){var newLen=array.length + 1;if(canEdit && idx + 1 === newLen){array[idx] = val;return array;}var newArray=new Array(newLen);var after=0;for(var ii=0; ii < newLen; ii++) {if(ii === idx){newArray[ii] = val;after = -1;}else {newArray[ii] = array[ii + after];}}return newArray;}function spliceOut(array, idx, canEdit){var newLen=array.length - 1;if(canEdit && idx === newLen){array.pop();return array;}var newArray=new Array(newLen);var after=0;for(var ii=0; ii < newLen; ii++) {if(ii === idx){after = 1;}newArray[ii] = array[ii + after];}return newArray;}var MAX_ARRAY_MAP_SIZE=SIZE / 4;var MAX_BITMAP_INDEXED_SIZE=SIZE / 2;var MIN_HASH_ARRAY_MAP_SIZE=SIZE / 4;createClass(List, IndexedCollection);function List(value){var empty=emptyList();if(value === null || value === undefined){return empty;}if(isList(value)){return value;}var iter=IndexedIterable(value);var size=iter.size;if(size === 0){return empty;}assertNotInfinite(size);if(size > 0 && size < SIZE){return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));}return empty.withMutations(function(list){list.setSize(size);iter.forEach(function(v, i){return list.set(i, v);});});}List.of = function(){return this(arguments);};List.prototype.toString = function(){return this.__toString("List [", "]");};List.prototype.get = function(index, notSetValue){index = wrapIndex(this, index);if(index < 0 || index >= this.size){return notSetValue;}index += this._origin;var node=listNodeFor(this, index);return node && node.array[index & MASK];};List.prototype.set = function(index, value){return updateList(this, index, value);};List.prototype.remove = function(index){return !this.has(index)?this:index === 0?this.shift():index === this.size - 1?this.pop():this.splice(index, 1);};List.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = this._origin = this._capacity = 0;this._level = SHIFT;this._root = this._tail = null;this.__hash = undefined;this.__altered = true;return this;}return emptyList();};List.prototype.push = function(){var values=arguments;var oldSize=this.size;return this.withMutations(function(list){setListBounds(list, 0, oldSize + values.length);for(var ii=0; ii < values.length; ii++) {list.set(oldSize + ii, values[ii]);}});};List.prototype.pop = function(){return setListBounds(this, 0, -1);};List.prototype.unshift = function(){var values=arguments;return this.withMutations(function(list){setListBounds(list, -values.length);for(var ii=0; ii < values.length; ii++) {list.set(ii, values[ii]);}});};List.prototype.shift = function(){return setListBounds(this, 1);};List.prototype.merge = function(){return mergeIntoListWith(this, undefined, arguments);};List.prototype.mergeWith = function(merger){var iters=SLICE$0.call(arguments, 1);return mergeIntoListWith(this, merger, iters);};List.prototype.mergeDeep = function(){return mergeIntoListWith(this, deepMerger(undefined), arguments);};List.prototype.mergeDeepWith = function(merger){var iters=SLICE$0.call(arguments, 1);return mergeIntoListWith(this, deepMerger(merger), iters);};List.prototype.setSize = function(size){return setListBounds(this, 0, size);};List.prototype.slice = function(begin, end){var size=this.size;if(wholeSlice(begin, end, size)){return this;}return setListBounds(this, resolveBegin(begin, size), resolveEnd(end, size));};List.prototype.__iterator = function(type, reverse){var index=0;var values=iterateList(this, reverse);return new Iterator(function(){var value=values();return value === DONE?iteratorDone():iteratorValue(type, index++, value);});};List.prototype.__iterate = function(fn, reverse){var index=0;var values=iterateList(this, reverse);var value;while((value = values()) !== DONE) {if(fn(value, index++, this) === false){break;}}return index;};List.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}if(!ownerID){this.__ownerID = ownerID;return this;}return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);};function isList(maybeList){return !!(maybeList && maybeList[IS_LIST_SENTINEL]);}List.isList = isList;var IS_LIST_SENTINEL="@@__IMMUTABLE_LIST__@@";var ListPrototype=List.prototype;ListPrototype[IS_LIST_SENTINEL] = true;ListPrototype[DELETE] = ListPrototype.remove;ListPrototype.setIn = MapPrototype.setIn;ListPrototype.deleteIn = ListPrototype.removeIn = MapPrototype.removeIn;ListPrototype.update = MapPrototype.update;ListPrototype.updateIn = MapPrototype.updateIn;ListPrototype.mergeIn = MapPrototype.mergeIn;ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;ListPrototype.withMutations = MapPrototype.withMutations;ListPrototype.asMutable = MapPrototype.asMutable;ListPrototype.asImmutable = MapPrototype.asImmutable;ListPrototype.wasAltered = MapPrototype.wasAltered;function VNode(array, ownerID){this.array = array;this.ownerID = ownerID;}VNode.prototype.removeBefore = function(ownerID, level, index){if(index === level?1 << level:0 || this.array.length === 0){return this;}var originIndex=index >>> level & MASK;if(originIndex >= this.array.length){return new VNode([], ownerID);}var removingFirst=originIndex === 0;var newChild;if(level > 0){var oldChild=this.array[originIndex];newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);if(newChild === oldChild && removingFirst){return this;}}if(removingFirst && !newChild){return this;}var editable=editableVNode(this, ownerID);if(!removingFirst){for(var ii=0; ii < originIndex; ii++) {editable.array[ii] = undefined;}}if(newChild){editable.array[originIndex] = newChild;}return editable;};VNode.prototype.removeAfter = function(ownerID, level, index){if(index === level?1 << level:0 || this.array.length === 0){return this;}var sizeIndex=index - 1 >>> level & MASK;if(sizeIndex >= this.array.length){return this;}var removingLast=sizeIndex === this.array.length - 1;var newChild;if(level > 0){var oldChild=this.array[sizeIndex];newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);if(newChild === oldChild && removingLast){return this;}}if(removingLast && !newChild){return this;}var editable=editableVNode(this, ownerID);if(!removingLast){editable.array.pop();}if(newChild){editable.array[sizeIndex] = newChild;}return editable;};var DONE={};function iterateList(list, reverse){var left=list._origin;var right=list._capacity;var tailPos=getTailOffset(right);var tail=list._tail;return iterateNodeOrLeaf(list._root, list._level, 0);function iterateNodeOrLeaf(node, level, offset){return level === 0?iterateLeaf(node, offset):iterateNode(node, level, offset);}function iterateLeaf(node, offset){var array=offset === tailPos?tail && tail.array:node && node.array;var from=offset > left?0:left - offset;var to=right - offset;if(to > SIZE){to = SIZE;}return function(){if(from === to){return DONE;}var idx=reverse?--to:from++;return array && array[idx];};}function iterateNode(node, level, offset){var values;var array=node && node.array;var from=offset > left?0:left - offset >> level;var to=(right - offset >> level) + 1;if(to > SIZE){to = SIZE;}return function(){do{if(values){var value=values();if(value !== DONE){return value;}values = null;}if(from === to){return DONE;}var idx=reverse?--to:from++;values = iterateNodeOrLeaf(array && array[idx], level - SHIFT, offset + (idx << level));}while(true);};}}function makeList(origin, capacity, level, root, tail, ownerID, hash){var list=Object.create(ListPrototype);list.size = capacity - origin;list._origin = origin;list._capacity = capacity;list._level = level;list._root = root;list._tail = tail;list.__ownerID = ownerID;list.__hash = hash;list.__altered = false;return list;}var EMPTY_LIST;function emptyList(){return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));}function updateList(list, index, value){index = wrapIndex(list, index);if(index >= list.size || index < 0){return list.withMutations(function(list){index < 0?setListBounds(list, index).set(0, value):setListBounds(list, 0, index + 1).set(index, value);});}index += list._origin;var newTail=list._tail;var newRoot=list._root;var didAlter=MakeRef(DID_ALTER);if(index >= getTailOffset(list._capacity)){newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);}else {newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);}if(!didAlter.value){return list;}if(list.__ownerID){list._root = newRoot;list._tail = newTail;list.__hash = undefined;list.__altered = true;return list;}return makeList(list._origin, list._capacity, list._level, newRoot, newTail);}function updateVNode(node, ownerID, level, index, value, didAlter){var idx=index >>> level & MASK;var nodeHas=node && idx < node.array.length;if(!nodeHas && value === undefined){return node;}var newNode;if(level > 0){var lowerNode=node && node.array[idx];var newLowerNode=updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);if(newLowerNode === lowerNode){return node;}newNode = editableVNode(node, ownerID);newNode.array[idx] = newLowerNode;return newNode;}if(nodeHas && node.array[idx] === value){return node;}SetRef(didAlter);newNode = editableVNode(node, ownerID);if(value === undefined && idx === newNode.array.length - 1){newNode.array.pop();}else {newNode.array[idx] = value;}return newNode;}function editableVNode(node, ownerID){if(ownerID && node && ownerID === node.ownerID){return node;}return new VNode(node?node.array.slice():[], ownerID);}function listNodeFor(list, rawIndex){if(rawIndex >= getTailOffset(list._capacity)){return list._tail;}if(rawIndex < 1 << list._level + SHIFT){var node=list._root;var level=list._level;while(node && level > 0) {node = node.array[rawIndex >>> level & MASK];level -= SHIFT;}return node;}}function setListBounds(list, begin, end){var owner=list.__ownerID || new OwnerID();var oldOrigin=list._origin;var oldCapacity=list._capacity;var newOrigin=oldOrigin + begin;var newCapacity=end === undefined?oldCapacity:end < 0?oldCapacity + end:oldOrigin + end;if(newOrigin === oldOrigin && newCapacity === oldCapacity){return list;}if(newOrigin >= newCapacity){return list.clear();}var newLevel=list._level;var newRoot=list._root;var offsetShift=0;while(newOrigin + offsetShift < 0) {newRoot = new VNode(newRoot && newRoot.array.length?[undefined, newRoot]:[], owner);newLevel += SHIFT;offsetShift += 1 << newLevel;}if(offsetShift){newOrigin += offsetShift;oldOrigin += offsetShift;newCapacity += offsetShift;oldCapacity += offsetShift;}var oldTailOffset=getTailOffset(oldCapacity);var newTailOffset=getTailOffset(newCapacity);while(newTailOffset >= 1 << newLevel + SHIFT) {newRoot = new VNode(newRoot && newRoot.array.length?[newRoot]:[], owner);newLevel += SHIFT;}var oldTail=list._tail;var newTail=newTailOffset < oldTailOffset?listNodeFor(list, newCapacity - 1):newTailOffset > oldTailOffset?new VNode([], owner):oldTail;if(oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length){newRoot = editableVNode(newRoot, owner);var node=newRoot;for(var level=newLevel; level > SHIFT; level -= SHIFT) {var idx=oldTailOffset >>> level & MASK;node = node.array[idx] = editableVNode(node.array[idx], owner);}node.array[oldTailOffset >>> SHIFT & MASK] = oldTail;}if(newCapacity < oldCapacity){newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);}if(newOrigin >= newTailOffset){newOrigin -= newTailOffset;newCapacity -= newTailOffset;newLevel = SHIFT;newRoot = null;newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);}else if(newOrigin > oldOrigin || newTailOffset < oldTailOffset){offsetShift = 0;while(newRoot) {var beginIndex=newOrigin >>> newLevel & MASK;if(beginIndex !== newTailOffset >>> newLevel & MASK){break;}if(beginIndex){offsetShift += (1 << newLevel) * beginIndex;}newLevel -= SHIFT;newRoot = newRoot.array[beginIndex];}if(newRoot && newOrigin > oldOrigin){newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);}if(newRoot && newTailOffset < oldTailOffset){newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);}if(offsetShift){newOrigin -= offsetShift;newCapacity -= offsetShift;}}if(list.__ownerID){list.size = newCapacity - newOrigin;list._origin = newOrigin;list._capacity = newCapacity;list._level = newLevel;list._root = newRoot;list._tail = newTail;list.__hash = undefined;list.__altered = true;return list;}return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);}function mergeIntoListWith(list, merger, iterables){var iters=[];var maxSize=0;for(var ii=0; ii < iterables.length; ii++) {var value=iterables[ii];var iter=IndexedIterable(value);if(iter.size > maxSize){maxSize = iter.size;}if(!isIterable(value)){iter = iter.map(function(v){return fromJS(v);});}iters.push(iter);}if(maxSize > list.size){list = list.setSize(maxSize);}return mergeIntoCollectionWith(list, merger, iters);}function getTailOffset(size){return size < SIZE?0:size - 1 >>> SHIFT << SHIFT;}createClass(OrderedMap, Map);function OrderedMap(value){return value === null || value === undefined?emptyOrderedMap():isOrderedMap(value)?value:emptyOrderedMap().withMutations(function(map){var iter=KeyedIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v, k){return map.set(k, v);});});}OrderedMap.of = function(){return this(arguments);};OrderedMap.prototype.toString = function(){return this.__toString("OrderedMap {", "}");};OrderedMap.prototype.get = function(k, notSetValue){var index=this._map.get(k);return index !== undefined?this._list.get(index)[1]:notSetValue;};OrderedMap.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = 0;this._map.clear();this._list.clear();return this;}return emptyOrderedMap();};OrderedMap.prototype.set = function(k, v){return updateOrderedMap(this, k, v);};OrderedMap.prototype.remove = function(k){return updateOrderedMap(this, k, NOT_SET);};OrderedMap.prototype.wasAltered = function(){return this._map.wasAltered() || this._list.wasAltered();};OrderedMap.prototype.__iterate = function(fn, reverse){var this$0=this;return this._list.__iterate(function(entry){return entry && fn(entry[1], entry[0], this$0);}, reverse);};OrderedMap.prototype.__iterator = function(type, reverse){return this._list.fromEntrySeq().__iterator(type, reverse);};OrderedMap.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}var newMap=this._map.__ensureOwner(ownerID);var newList=this._list.__ensureOwner(ownerID);if(!ownerID){this.__ownerID = ownerID;this._map = newMap;this._list = newList;return this;}return makeOrderedMap(newMap, newList, ownerID, this.__hash);};function isOrderedMap(maybeOrderedMap){return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);}OrderedMap.isOrderedMap = isOrderedMap;OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;function makeOrderedMap(map, list, ownerID, hash){var omap=Object.create(OrderedMap.prototype);omap.size = map?map.size:0;omap._map = map;omap._list = list;omap.__ownerID = ownerID;omap.__hash = hash;return omap;}var EMPTY_ORDERED_MAP;function emptyOrderedMap(){return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));}function updateOrderedMap(omap, k, v){var map=omap._map;var list=omap._list;var i=map.get(k);var has=i !== undefined;var newMap;var newList;if(v === NOT_SET){if(!has){return omap;}if(list.size >= SIZE && list.size >= map.size * 2){newList = list.filter(function(entry, idx){return entry !== undefined && i !== idx;});newMap = newList.toKeyedSeq().map(function(entry){return entry[0];}).flip().toMap();if(omap.__ownerID){newMap.__ownerID = newList.__ownerID = omap.__ownerID;}}else {newMap = map.remove(k);newList = i === list.size - 1?list.pop():list.set(i, undefined);}}else {if(has){if(v === list.get(i)[1]){return omap;}newMap = map;newList = list.set(i, [k, v]);}else {newMap = map.set(k, list.size);newList = list.set(list.size, [k, v]);}}if(omap.__ownerID){omap.size = newMap.size;omap._map = newMap;omap._list = newList;omap.__hash = undefined;return omap;}return makeOrderedMap(newMap, newList);}createClass(Stack, IndexedCollection);function Stack(value){return value === null || value === undefined?emptyStack():isStack(value)?value:emptyStack().unshiftAll(value);}Stack.of = function(){return this(arguments);};Stack.prototype.toString = function(){return this.__toString("Stack [", "]");};Stack.prototype.get = function(index, notSetValue){var head=this._head;while(head && index--) {head = head.next;}return head?head.value:notSetValue;};Stack.prototype.peek = function(){return this._head && this._head.value;};Stack.prototype.push = function(){if(arguments.length === 0){return this;}var newSize=this.size + arguments.length;var head=this._head;for(var ii=arguments.length - 1; ii >= 0; ii--) {head = {value:arguments[ii], next:head};}if(this.__ownerID){this.size = newSize;this._head = head;this.__hash = undefined;this.__altered = true;return this;}return makeStack(newSize, head);};Stack.prototype.pushAll = function(iter){iter = IndexedIterable(iter);if(iter.size === 0){return this;}assertNotInfinite(iter.size);var newSize=this.size;var head=this._head;iter.reverse().forEach(function(value){newSize++;head = {value:value, next:head};});if(this.__ownerID){this.size = newSize;this._head = head;this.__hash = undefined;this.__altered = true;return this;}return makeStack(newSize, head);};Stack.prototype.pop = function(){return this.slice(1);};Stack.prototype.unshift = function(){return this.push.apply(this, arguments);};Stack.prototype.unshiftAll = function(iter){return this.pushAll(iter);};Stack.prototype.shift = function(){return this.pop.apply(this, arguments);};Stack.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = 0;this._head = undefined;this.__hash = undefined;this.__altered = true;return this;}return emptyStack();};Stack.prototype.slice = function(begin, end){if(wholeSlice(begin, end, this.size)){return this;}var resolvedBegin=resolveBegin(begin, this.size);var resolvedEnd=resolveEnd(end, this.size);if(resolvedEnd !== this.size){return IndexedCollection.prototype.slice.call(this, begin, end);}var newSize=this.size - resolvedBegin;var head=this._head;while(resolvedBegin--) {head = head.next;}if(this.__ownerID){this.size = newSize;this._head = head;this.__hash = undefined;this.__altered = true;return this;}return makeStack(newSize, head);};Stack.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}if(!ownerID){this.__ownerID = ownerID;this.__altered = false;return this;}return makeStack(this.size, this._head, ownerID, this.__hash);};Stack.prototype.__iterate = function(fn, reverse){if(reverse){return this.toSeq().cacheResult.__iterate(fn, reverse);}var iterations=0;var node=this._head;while(node) {if(fn(node.value, iterations++, this) === false){break;}node = node.next;}return iterations;};Stack.prototype.__iterator = function(type, reverse){if(reverse){return this.toSeq().cacheResult().__iterator(type, reverse);}var iterations=0;var node=this._head;return new Iterator(function(){if(node){var value=node.value;node = node.next;return iteratorValue(type, iterations++, value);}return iteratorDone();});};function isStack(maybeStack){return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);}Stack.isStack = isStack;var IS_STACK_SENTINEL="@@__IMMUTABLE_STACK__@@";var StackPrototype=Stack.prototype;StackPrototype[IS_STACK_SENTINEL] = true;StackPrototype.withMutations = MapPrototype.withMutations;StackPrototype.asMutable = MapPrototype.asMutable;StackPrototype.asImmutable = MapPrototype.asImmutable;StackPrototype.wasAltered = MapPrototype.wasAltered;function makeStack(size, head, ownerID, hash){var map=Object.create(StackPrototype);map.size = size;map._head = head;map.__ownerID = ownerID;map.__hash = hash;map.__altered = false;return map;}var EMPTY_STACK;function emptyStack(){return EMPTY_STACK || (EMPTY_STACK = makeStack(0));}createClass(Set, SetCollection);function Set(value){return value === null || value === undefined?emptySet():isSet(value)?value:emptySet().withMutations(function(set){var iter=SetIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v){return set.add(v);});});}Set.of = function(){return this(arguments);};Set.fromKeys = function(value){return this(KeyedIterable(value).keySeq());};Set.prototype.toString = function(){return this.__toString("Set {", "}");};Set.prototype.has = function(value){return this._map.has(value);};Set.prototype.add = function(value){return updateSet(this, this._map.set(value, true));};Set.prototype.remove = function(value){return updateSet(this, this._map.remove(value));};Set.prototype.clear = function(){return updateSet(this, this._map.clear());};Set.prototype.union = function(){var iters=SLICE$0.call(arguments, 0);iters = iters.filter(function(x){return x.size !== 0;});if(iters.length === 0){return this;}if(this.size === 0 && iters.length === 1){return this.constructor(iters[0]);}return this.withMutations(function(set){for(var ii=0; ii < iters.length; ii++) {SetIterable(iters[ii]).forEach(function(value){return set.add(value);});}});};Set.prototype.intersect = function(){var iters=SLICE$0.call(arguments, 0);if(iters.length === 0){return this;}iters = iters.map(function(iter){return SetIterable(iter);});var originalSet=this;return this.withMutations(function(set){originalSet.forEach(function(value){if(!iters.every(function(iter){return iter.contains(value);})){set.remove(value);}});});};Set.prototype.subtract = function(){var iters=SLICE$0.call(arguments, 0);if(iters.length === 0){return this;}iters = iters.map(function(iter){return SetIterable(iter);});var originalSet=this;return this.withMutations(function(set){originalSet.forEach(function(value){if(iters.some(function(iter){return iter.contains(value);})){set.remove(value);}});});};Set.prototype.merge = function(){return this.union.apply(this, arguments);};Set.prototype.mergeWith = function(merger){var iters=SLICE$0.call(arguments, 1);return this.union.apply(this, iters);};Set.prototype.sort = function(comparator){return OrderedSet(sortFactory(this, comparator));};Set.prototype.sortBy = function(mapper, comparator){return OrderedSet(sortFactory(this, comparator, mapper));};Set.prototype.wasAltered = function(){return this._map.wasAltered();};Set.prototype.__iterate = function(fn, reverse){var this$0=this;return this._map.__iterate(function(_, k){return fn(k, k, this$0);}, reverse);};Set.prototype.__iterator = function(type, reverse){return this._map.map(function(_, k){return k;}).__iterator(type, reverse);};Set.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}var newMap=this._map.__ensureOwner(ownerID);if(!ownerID){this.__ownerID = ownerID;this._map = newMap;return this;}return this.__make(newMap, ownerID);};function isSet(maybeSet){return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);}Set.isSet = isSet;var IS_SET_SENTINEL="@@__IMMUTABLE_SET__@@";var SetPrototype=Set.prototype;SetPrototype[IS_SET_SENTINEL] = true;SetPrototype[DELETE] = SetPrototype.remove;SetPrototype.mergeDeep = SetPrototype.merge;SetPrototype.mergeDeepWith = SetPrototype.mergeWith;SetPrototype.withMutations = MapPrototype.withMutations;SetPrototype.asMutable = MapPrototype.asMutable;SetPrototype.asImmutable = MapPrototype.asImmutable;SetPrototype.__empty = emptySet;SetPrototype.__make = makeSet;function updateSet(set, newMap){if(set.__ownerID){set.size = newMap.size;set._map = newMap;return set;}return newMap === set._map?set:newMap.size === 0?set.__empty():set.__make(newMap);}function makeSet(map, ownerID){var set=Object.create(SetPrototype);set.size = map?map.size:0;set._map = map;set.__ownerID = ownerID;return set;}var EMPTY_SET;function emptySet(){return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));}createClass(OrderedSet, Set);function OrderedSet(value){return value === null || value === undefined?emptyOrderedSet():isOrderedSet(value)?value:emptyOrderedSet().withMutations(function(set){var iter=SetIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v){return set.add(v);});});}OrderedSet.of = function(){return this(arguments);};OrderedSet.fromKeys = function(value){return this(KeyedIterable(value).keySeq());};OrderedSet.prototype.toString = function(){return this.__toString("OrderedSet {", "}");};function isOrderedSet(maybeOrderedSet){return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);}OrderedSet.isOrderedSet = isOrderedSet;var OrderedSetPrototype=OrderedSet.prototype;OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;OrderedSetPrototype.__empty = emptyOrderedSet;OrderedSetPrototype.__make = makeOrderedSet;function makeOrderedSet(map, ownerID){var set=Object.create(OrderedSetPrototype);set.size = map?map.size:0;set._map = map;set.__ownerID = ownerID;return set;}var EMPTY_ORDERED_SET;function emptyOrderedSet(){return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));}createClass(Record, KeyedCollection);function Record(defaultValues, name){var RecordType=function Record(values){if(!(this instanceof RecordType)){return new RecordType(values);}this._map = Map(values);};var keys=Object.keys(defaultValues);var RecordTypePrototype=RecordType.prototype = Object.create(RecordPrototype);RecordTypePrototype.constructor = RecordType;name && (RecordTypePrototype._name = name);RecordTypePrototype._defaultValues = defaultValues;RecordTypePrototype._keys = keys;RecordTypePrototype.size = keys.length;try{keys.forEach(function(key){Object.defineProperty(RecordType.prototype, key, {get:function get(){return this.get(key);}, set:function set(value){invariant(this.__ownerID, "Cannot set on an immutable record.");this.set(key, value);}});});}catch(error) {}return RecordType;}Record.prototype.toString = function(){return this.__toString(recordName(this) + " {", "}");};Record.prototype.has = function(k){return this._defaultValues.hasOwnProperty(k);};Record.prototype.get = function(k, notSetValue){if(!this.has(k)){return notSetValue;}var defaultVal=this._defaultValues[k];return this._map?this._map.get(k, defaultVal):defaultVal;};Record.prototype.clear = function(){if(this.__ownerID){this._map && this._map.clear();return this;}var SuperRecord=Object.getPrototypeOf(this).constructor;return SuperRecord._empty || (SuperRecord._empty = makeRecord(this, emptyMap()));};Record.prototype.set = function(k, v){if(!this.has(k)){throw new Error("Cannot set unknown key \"" + k + "\" on " + recordName(this));}var newMap=this._map && this._map.set(k, v);if(this.__ownerID || newMap === this._map){return this;}return makeRecord(this, newMap);};Record.prototype.remove = function(k){if(!this.has(k)){return this;}var newMap=this._map && this._map.remove(k);if(this.__ownerID || newMap === this._map){return this;}return makeRecord(this, newMap);};Record.prototype.wasAltered = function(){return this._map.wasAltered();};Record.prototype.__iterator = function(type, reverse){var this$0=this;return KeyedIterable(this._defaultValues).map(function(_, k){return this$0.get(k);}).__iterator(type, reverse);};Record.prototype.__iterate = function(fn, reverse){var this$0=this;return KeyedIterable(this._defaultValues).map(function(_, k){return this$0.get(k);}).__iterate(fn, reverse);};Record.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}var newMap=this._map && this._map.__ensureOwner(ownerID);if(!ownerID){this.__ownerID = ownerID;this._map = newMap;return this;}return makeRecord(this, newMap, ownerID);};var RecordPrototype=Record.prototype;RecordPrototype[DELETE] = RecordPrototype.remove;RecordPrototype.deleteIn = RecordPrototype.removeIn = MapPrototype.removeIn;RecordPrototype.merge = MapPrototype.merge;RecordPrototype.mergeWith = MapPrototype.mergeWith;RecordPrototype.mergeIn = MapPrototype.mergeIn;RecordPrototype.mergeDeep = MapPrototype.mergeDeep;RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;RecordPrototype.setIn = MapPrototype.setIn;RecordPrototype.update = MapPrototype.update;RecordPrototype.updateIn = MapPrototype.updateIn;RecordPrototype.withMutations = MapPrototype.withMutations;RecordPrototype.asMutable = MapPrototype.asMutable;RecordPrototype.asImmutable = MapPrototype.asImmutable;function makeRecord(likeRecord, map, ownerID){var record=Object.create(Object.getPrototypeOf(likeRecord));record._map = map;record.__ownerID = ownerID;return record;}function recordName(record){return record._name || record.constructor.name;}function deepEqual(a, b){if(a === b){return true;}if(!isIterable(b) || a.size !== undefined && b.size !== undefined && a.size !== b.size || a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash || isKeyed(a) !== isKeyed(b) || isIndexed(a) !== isIndexed(b) || isOrdered(a) !== isOrdered(b)){return false;}if(a.size === 0 && b.size === 0){return true;}var notAssociative=!isAssociative(a);if(isOrdered(a)){var entries=a.entries();return b.every(function(v, k){var entry=entries.next().value;return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));}) && entries.next().done;}var flipped=false;if(a.size === undefined){if(b.size === undefined){a.cacheResult();}else {flipped = true;var _=a;a = b;b = _;}}var allEqual=true;var bSize=b.__iterate(function(v, k){if(notAssociative?!a.has(v):flipped?!is(v, a.get(k, NOT_SET)):!is(a.get(k, NOT_SET), v)){allEqual = false;return false;}});return allEqual && a.size === bSize;}createClass(Range, IndexedSeq);function Range(start, end, step){if(!(this instanceof Range)){return new Range(start, end, step);}invariant(step !== 0, "Cannot step a Range by 0");start = start || 0;if(end === undefined){end = Infinity;}step = step === undefined?1:Math.abs(step);if(end < start){step = -step;}this._start = start;this._end = end;this._step = step;this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);if(this.size === 0){if(EMPTY_RANGE){return EMPTY_RANGE;}EMPTY_RANGE = this;}}Range.prototype.toString = function(){if(this.size === 0){return "Range []";}return "Range [ " + this._start + "..." + this._end + (this._step > 1?" by " + this._step:"") + " ]";};Range.prototype.get = function(index, notSetValue){return this.has(index)?this._start + wrapIndex(this, index) * this._step:notSetValue;};Range.prototype.contains = function(searchValue){var possibleIndex=(searchValue - this._start) / this._step;return possibleIndex >= 0 && possibleIndex < this.size && possibleIndex === Math.floor(possibleIndex);};Range.prototype.slice = function(begin, end){if(wholeSlice(begin, end, this.size)){return this;}begin = resolveBegin(begin, this.size);end = resolveEnd(end, this.size);if(end <= begin){return new Range(0, 0);}return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);};Range.prototype.indexOf = function(searchValue){var offsetValue=searchValue - this._start;if(offsetValue % this._step === 0){var index=offsetValue / this._step;if(index >= 0 && index < this.size){return index;}}return -1;};Range.prototype.lastIndexOf = function(searchValue){return this.indexOf(searchValue);};Range.prototype.__iterate = function(fn, reverse){var maxIndex=this.size - 1;var step=this._step;var value=reverse?this._start + maxIndex * step:this._start;for(var ii=0; ii <= maxIndex; ii++) {if(fn(value, ii, this) === false){return ii + 1;}value += reverse?-step:step;}return ii;};Range.prototype.__iterator = function(type, reverse){var maxIndex=this.size - 1;var step=this._step;var value=reverse?this._start + maxIndex * step:this._start;var ii=0;return new Iterator(function(){var v=value;value += reverse?-step:step;return ii > maxIndex?iteratorDone():iteratorValue(type, ii++, v);});};Range.prototype.equals = function(other){return other instanceof Range?this._start === other._start && this._end === other._end && this._step === other._step:deepEqual(this, other);};var EMPTY_RANGE;createClass(Repeat, IndexedSeq);function Repeat(value, times){if(!(this instanceof Repeat)){return new Repeat(value, times);}this._value = value;this.size = times === undefined?Infinity:Math.max(0, times);if(this.size === 0){if(EMPTY_REPEAT){return EMPTY_REPEAT;}EMPTY_REPEAT = this;}}Repeat.prototype.toString = function(){if(this.size === 0){return "Repeat []";}return "Repeat [ " + this._value + " " + this.size + " times ]";};Repeat.prototype.get = function(index, notSetValue){return this.has(index)?this._value:notSetValue;};Repeat.prototype.contains = function(searchValue){return is(this._value, searchValue);};Repeat.prototype.slice = function(begin, end){var size=this.size;return wholeSlice(begin, end, size)?this:new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));};Repeat.prototype.reverse = function(){return this;};Repeat.prototype.indexOf = function(searchValue){if(is(this._value, searchValue)){return 0;}return -1;};Repeat.prototype.lastIndexOf = function(searchValue){if(is(this._value, searchValue)){return this.size;}return -1;};Repeat.prototype.__iterate = function(fn, reverse){for(var ii=0; ii < this.size; ii++) {if(fn(this._value, ii, this) === false){return ii + 1;}}return ii;};Repeat.prototype.__iterator = function(type, reverse){var this$0=this;var ii=0;return new Iterator(function(){return ii < this$0.size?iteratorValue(type, ii++, this$0._value):iteratorDone();});};Repeat.prototype.equals = function(other){return other instanceof Repeat?is(this._value, other._value):deepEqual(other);};var EMPTY_REPEAT;function mixin(ctor, methods){var keyCopier=function keyCopier(key){ctor.prototype[key] = methods[key];};Object.keys(methods).forEach(keyCopier);Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(methods).forEach(keyCopier);return ctor;}Iterable.Iterator = Iterator;mixin(Iterable, {toArray:function toArray(){assertNotInfinite(this.size);var array=new Array(this.size || 0);this.valueSeq().__iterate(function(v, i){array[i] = v;});return array;}, toIndexedSeq:function toIndexedSeq(){return new ToIndexedSequence(this);}, toJS:function toJS(){return this.toSeq().map(function(value){return value && typeof value.toJS === "function"?value.toJS():value;}).__toJS();}, toJSON:function toJSON(){return this.toSeq().map(function(value){return value && typeof value.toJSON === "function"?value.toJSON():value;}).__toJS();}, toKeyedSeq:function toKeyedSeq(){return new ToKeyedSequence(this, true);}, toMap:function toMap(){return Map(this.toKeyedSeq());}, toObject:function toObject(){assertNotInfinite(this.size);var object={};this.__iterate(function(v, k){object[k] = v;});return object;}, toOrderedMap:function toOrderedMap(){return OrderedMap(this.toKeyedSeq());}, toOrderedSet:function toOrderedSet(){return OrderedSet(isKeyed(this)?this.valueSeq():this);}, toSet:function toSet(){return Set(isKeyed(this)?this.valueSeq():this);}, toSetSeq:function toSetSeq(){return new ToSetSequence(this);}, toSeq:function toSeq(){return isIndexed(this)?this.toIndexedSeq():isKeyed(this)?this.toKeyedSeq():this.toSetSeq();}, toStack:function toStack(){return Stack(isKeyed(this)?this.valueSeq():this);}, toList:function toList(){return List(isKeyed(this)?this.valueSeq():this);}, toString:function toString(){return "[Iterable]";}, __toString:function __toString(head, tail){if(this.size === 0){return head + tail;}return head + " " + this.toSeq().map(this.__toStringMapper).join(", ") + " " + tail;}, concat:function concat(){var values=SLICE$0.call(arguments, 0);return reify(this, concatFactory(this, values));}, contains:function contains(searchValue){return this.some(function(value){return is(value, searchValue);});}, entries:function entries(){return this.__iterator(ITERATE_ENTRIES);}, every:function every(predicate, context){assertNotInfinite(this.size);var returnValue=true;this.__iterate(function(v, k, c){if(!predicate.call(context, v, k, c)){returnValue = false;return false;}});return returnValue;}, filter:function filter(predicate, context){return reify(this, filterFactory(this, predicate, context, true));}, find:function find(predicate, context, notSetValue){var entry=this.findEntry(predicate, context);return entry?entry[1]:notSetValue;}, findEntry:function findEntry(predicate, context){var found;this.__iterate(function(v, k, c){if(predicate.call(context, v, k, c)){found = [k, v];return false;}});return found;}, findLastEntry:function findLastEntry(predicate, context){return this.toSeq().reverse().findEntry(predicate, context);}, forEach:function forEach(sideEffect, context){assertNotInfinite(this.size);return this.__iterate(context?sideEffect.bind(context):sideEffect);}, join:function join(separator){assertNotInfinite(this.size);separator = separator !== undefined?"" + separator:",";var joined="";var isFirst=true;this.__iterate(function(v){isFirst?isFirst = false:joined += separator;joined += v !== null && v !== undefined?v:"";});return joined;}, keys:function keys(){return this.__iterator(ITERATE_KEYS);}, map:function map(mapper, context){return reify(this, mapFactory(this, mapper, context));}, reduce:function reduce(reducer, initialReduction, context){assertNotInfinite(this.size);var reduction;var useFirst;if(arguments.length < 2){useFirst = true;}else {reduction = initialReduction;}this.__iterate(function(v, k, c){if(useFirst){useFirst = false;reduction = v;}else {reduction = reducer.call(context, reduction, v, k, c);}});return reduction;}, reduceRight:function reduceRight(reducer, initialReduction, context){var reversed=this.toKeyedSeq().reverse();return reversed.reduce.apply(reversed, arguments);}, reverse:function reverse(){return reify(this, reverseFactory(this, true));}, slice:function slice(begin, end){return reify(this, sliceFactory(this, begin, end, true));}, some:function some(predicate, context){return !this.every(not(predicate), context);}, sort:function sort(comparator){return reify(this, sortFactory(this, comparator));}, values:function values(){return this.__iterator(ITERATE_VALUES);}, butLast:function butLast(){return this.slice(0, -1);}, isEmpty:function isEmpty(){return this.size !== undefined?this.size === 0:!this.some(function(){return true;});}, count:function count(predicate, context){return ensureSize(predicate?this.toSeq().filter(predicate, context):this);}, countBy:function countBy(grouper, context){return countByFactory(this, grouper, context);}, equals:function equals(other){return deepEqual(this, other);}, entrySeq:function entrySeq(){var iterable=this;if(iterable._cache){return new ArraySeq(iterable._cache);}var entriesSequence=iterable.toSeq().map(entryMapper).toIndexedSeq();entriesSequence.fromEntrySeq = function(){return iterable.toSeq();};return entriesSequence;}, filterNot:function filterNot(predicate, context){return this.filter(not(predicate), context);}, findLast:function findLast(predicate, context, notSetValue){return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);}, first:function first(){return this.find(returnTrue);}, flatMap:function flatMap(mapper, context){return reify(this, flatMapFactory(this, mapper, context));}, flatten:function flatten(depth){return reify(this, flattenFactory(this, depth, true));}, fromEntrySeq:function fromEntrySeq(){return new FromEntriesSequence(this);}, get:function get(searchKey, notSetValue){return this.find(function(_, key){return is(key, searchKey);}, undefined, notSetValue);}, getIn:function getIn(searchKeyPath, notSetValue){var nested=this;var iter=forceIterator(searchKeyPath);var step;while(!(step = iter.next()).done) {var key=step.value;nested = nested && nested.get?nested.get(key, NOT_SET):NOT_SET;if(nested === NOT_SET){return notSetValue;}}return nested;}, groupBy:function groupBy(grouper, context){return groupByFactory(this, grouper, context);}, has:function has(searchKey){return this.get(searchKey, NOT_SET) !== NOT_SET;}, hasIn:function hasIn(searchKeyPath){return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET;}, isSubset:function isSubset(iter){iter = typeof iter.contains === "function"?iter:Iterable(iter);return this.every(function(value){return iter.contains(value);});}, isSuperset:function isSuperset(iter){return iter.isSubset(this);}, keySeq:function keySeq(){return this.toSeq().map(keyMapper).toIndexedSeq();}, last:function last(){return this.toSeq().reverse().first();}, max:function max(comparator){return maxFactory(this, comparator);}, maxBy:function maxBy(mapper, comparator){return maxFactory(this, comparator, mapper);}, min:function min(comparator){return maxFactory(this, comparator?neg(comparator):defaultNegComparator);}, minBy:function minBy(mapper, comparator){return maxFactory(this, comparator?neg(comparator):defaultNegComparator, mapper);}, rest:function rest(){return this.slice(1);}, skip:function skip(amount){return this.slice(Math.max(0, amount));}, skipLast:function skipLast(amount){return reify(this, this.toSeq().reverse().skip(amount).reverse());}, skipWhile:function skipWhile(predicate, context){return reify(this, skipWhileFactory(this, predicate, context, true));}, skipUntil:function skipUntil(predicate, context){return this.skipWhile(not(predicate), context);}, sortBy:function sortBy(mapper, comparator){return reify(this, sortFactory(this, comparator, mapper));}, take:function take(amount){return this.slice(0, Math.max(0, amount));}, takeLast:function takeLast(amount){return reify(this, this.toSeq().reverse().take(amount).reverse());}, takeWhile:function takeWhile(predicate, context){return reify(this, takeWhileFactory(this, predicate, context));}, takeUntil:function takeUntil(predicate, context){return this.takeWhile(not(predicate), context);}, valueSeq:function valueSeq(){return this.toIndexedSeq();}, hashCode:function hashCode(){return this.__hash || (this.__hash = hashIterable(this));}});var IterablePrototype=Iterable.prototype;IterablePrototype[IS_ITERABLE_SENTINEL] = true;IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;IterablePrototype.__toJS = IterablePrototype.toArray;IterablePrototype.__toStringMapper = quoteString;IterablePrototype.inspect = IterablePrototype.toSource = function(){return this.toString();};IterablePrototype.chain = IterablePrototype.flatMap;(function(){try{Object.defineProperty(IterablePrototype, "length", {get:function get(){if(!Iterable.noLengthWarning){var stack;try{throw new Error();}catch(error) {stack = error.stack;}if(stack.indexOf("_wrapObject") === -1){console && console.warn && console.warn("iterable.length has been deprecated, " + "use iterable.size or iterable.count(). " + "This warning will become a silent error in a future version. " + stack);return this.size;}}}});}catch(e) {}})();mixin(KeyedIterable, {flip:function flip(){return reify(this, flipFactory(this));}, findKey:function findKey(predicate, context){var entry=this.findEntry(predicate, context);return entry && entry[0];}, findLastKey:function findLastKey(predicate, context){return this.toSeq().reverse().findKey(predicate, context);}, keyOf:function keyOf(searchValue){return this.findKey(function(value){return is(value, searchValue);});}, lastKeyOf:function lastKeyOf(searchValue){return this.findLastKey(function(value){return is(value, searchValue);});}, mapEntries:function mapEntries(mapper, context){var this$0=this;var iterations=0;return reify(this, this.toSeq().map(function(v, k){return mapper.call(context, [k, v], iterations++, this$0);}).fromEntrySeq());}, mapKeys:function mapKeys(mapper, context){var this$0=this;return reify(this, this.toSeq().flip().map(function(k, v){return mapper.call(context, k, v, this$0);}).flip());}});var KeyedIterablePrototype=KeyedIterable.prototype;KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;KeyedIterablePrototype.__toJS = IterablePrototype.toObject;KeyedIterablePrototype.__toStringMapper = function(v, k){return k + ": " + quoteString(v);};mixin(IndexedIterable, {toKeyedSeq:function toKeyedSeq(){return new ToKeyedSequence(this, false);}, filter:function filter(predicate, context){return reify(this, filterFactory(this, predicate, context, false));}, findIndex:function findIndex(predicate, context){var entry=this.findEntry(predicate, context);return entry?entry[0]:-1;}, indexOf:function indexOf(searchValue){var key=this.toKeyedSeq().keyOf(searchValue);return key === undefined?-1:key;}, lastIndexOf:function lastIndexOf(searchValue){return this.toSeq().reverse().indexOf(searchValue);}, reverse:function reverse(){return reify(this, reverseFactory(this, false));}, slice:function slice(begin, end){return reify(this, sliceFactory(this, begin, end, false));}, splice:function splice(index, removeNum){var numArgs=arguments.length;removeNum = Math.max(removeNum | 0, 0);if(numArgs === 0 || numArgs === 2 && !removeNum){return this;}index = resolveBegin(index, this.size);var spliced=this.slice(0, index);return reify(this, numArgs === 1?spliced:spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum)));}, findLastIndex:function findLastIndex(predicate, context){var key=this.toKeyedSeq().findLastKey(predicate, context);return key === undefined?-1:key;}, first:function first(){return this.get(0);}, flatten:function flatten(depth){return reify(this, flattenFactory(this, depth, false));}, get:function get(index, notSetValue){index = wrapIndex(this, index);return index < 0 || (this.size === Infinity || this.size !== undefined && index > this.size)?notSetValue:this.find(function(_, key){return key === index;}, undefined, notSetValue);}, has:function has(index){index = wrapIndex(this, index);return index >= 0 && (this.size !== undefined?this.size === Infinity || index < this.size:this.indexOf(index) !== -1);}, interpose:function interpose(separator){return reify(this, interposeFactory(this, separator));}, interleave:function interleave(){var iterables=[this].concat(arrCopy(arguments));var zipped=zipWithFactory(this.toSeq(), IndexedSeq.of, iterables);var interleaved=zipped.flatten(true);if(zipped.size){interleaved.size = zipped.size * iterables.length;}return reify(this, interleaved);}, last:function last(){return this.get(-1);}, skipWhile:function skipWhile(predicate, context){return reify(this, skipWhileFactory(this, predicate, context, false));}, zip:function zip(){var iterables=[this].concat(arrCopy(arguments));return reify(this, zipWithFactory(this, defaultZipper, iterables));}, zipWith:function zipWith(zipper){var iterables=arrCopy(arguments);iterables[0] = this;return reify(this, zipWithFactory(this, zipper, iterables));}});IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;mixin(SetIterable, {get:function get(value, notSetValue){return this.has(value)?value:notSetValue;}, contains:function contains(value){return this.has(value);}, keySeq:function keySeq(){return this.valueSeq();}});SetIterable.prototype.has = IterablePrototype.contains;mixin(KeyedSeq, KeyedIterable.prototype);mixin(IndexedSeq, IndexedIterable.prototype);mixin(SetSeq, SetIterable.prototype);mixin(KeyedCollection, KeyedIterable.prototype);mixin(IndexedCollection, IndexedIterable.prototype);mixin(SetCollection, SetIterable.prototype);function keyMapper(v, k){return k;}function entryMapper(v, k){return [k, v];}function not(predicate){return function(){return !predicate.apply(this, arguments);};}function neg(predicate){return function(){return -predicate.apply(this, arguments);};}function quoteString(value){return typeof value === "string"?JSON.stringify(value):value;}function defaultZipper(){return arrCopy(arguments);}function defaultNegComparator(a, b){return a < b?1:a > b?-1:0;}function hashIterable(iterable){if(iterable.size === Infinity){return 0;}var ordered=isOrdered(iterable);var keyed=isKeyed(iterable);var h=ordered?1:0;var size=iterable.__iterate(keyed?ordered?function(v, k){h = 31 * h + hashMerge(hash(v), hash(k)) | 0;}:function(v, k){h = h + hashMerge(hash(v), hash(k)) | 0;}:ordered?function(v){h = 31 * h + hash(v) | 0;}:function(v){h = h + hash(v) | 0;});return murmurHashOfSize(size, h);}function murmurHashOfSize(size, h){h = Math__imul(h, 3432918353);h = Math__imul(h << 15 | h >>> -15, 461845907);h = Math__imul(h << 13 | h >>> -13, 5);h = (h + 3864292196 | 0) ^ size;h = Math__imul(h ^ h >>> 16, 2246822507);h = Math__imul(h ^ h >>> 13, 3266489909);h = smi(h ^ h >>> 16);return h;}function hashMerge(a, b){return a ^ b + 2654435769 + (a << 6) + (a >> 2) | 0;}var Immutable={Iterable:Iterable, Seq:Seq, Collection:Collection, Map:Map, OrderedMap:OrderedMap, List:List, Stack:Stack, Set:Set, OrderedSet:OrderedSet, Record:Record, Range:Range, Repeat:Repeat, is:is, fromJS:fromJS};return Immutable;});

},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
(function (global){
"use strict";;(function(){var undefined;var arrayPool=[], objectPool=[];var idCounter=0;var indicatorObject={};var keyPrefix=+new Date() + "";var largeArraySize=75;var maxPoolSize=40;var whitespace=" \t\u000b\f ﻿" + "\n\r\u2028\u2029" + " ᠎             　";var reEmptyStringLeading=/\b__p \+= '';/g, reEmptyStringMiddle=/\b(__p \+=) '' \+/g, reEmptyStringTrailing=/(__e\(.*?\)|\b__t\)) \+\n'';/g;var reEsTemplate=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;var reFlags=/\w*$/;var reFuncName=/^\s*function[ \n\r\t]+\w/;var reInterpolate=/<%=([\s\S]+?)%>/g;var reLeadingSpacesAndZeros=RegExp("^[" + whitespace + "]*0+(?=.$)");var reNoMatch=/($^)/;var reThis=/\bthis\b/;var reUnescapedString=/['\n\r\t\u2028\u2029\\]/g;var contextProps=["Array", "Boolean", "Date", "Error", "Function", "Math", "Number", "Object", "RegExp", "String", "_", "attachEvent", "clearTimeout", "isFinite", "isNaN", "parseInt", "setTimeout"];var shadowedProps=["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];var templateCounter=0;var argsClass="[object Arguments]", arrayClass="[object Array]", boolClass="[object Boolean]", dateClass="[object Date]", errorClass="[object Error]", funcClass="[object Function]", numberClass="[object Number]", objectClass="[object Object]", regexpClass="[object RegExp]", stringClass="[object String]";var cloneableClasses={};cloneableClasses[funcClass] = false;cloneableClasses[argsClass] = cloneableClasses[arrayClass] = cloneableClasses[boolClass] = cloneableClasses[dateClass] = cloneableClasses[numberClass] = cloneableClasses[objectClass] = cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;var debounceOptions={leading:false, maxWait:0, trailing:false};var descriptor={configurable:false, enumerable:false, value:null, writable:false};var iteratorData={args:"", array:null, bottom:"", firstArg:"", init:"", keys:null, loop:"", shadowedProps:null, support:null, top:"", useHas:false};var objectTypes={boolean:false, "function":true, object:true, number:false, string:false, undefined:false};var stringEscapes={"\\":"\\", "'":"'", "\n":"n", "\r":"r", "\t":"t", "\u2028":"u2028", "\u2029":"u2029"};var root=objectTypes[typeof window] && window || this;var freeExports=objectTypes[typeof exports] && exports && !exports.nodeType && exports;var freeModule=objectTypes[typeof module] && module && !module.nodeType && module;var moduleExports=freeModule && freeModule.exports === freeExports && freeExports;var freeGlobal=objectTypes[typeof global] && global;if(freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)){root = freeGlobal;}function baseIndexOf(array, value, fromIndex){var index=(fromIndex || 0) - 1, length=array?array.length:0;while(++index < length) {if(array[index] === value){return index;}}return -1;}function cacheIndexOf(cache, value){var type=typeof value;cache = cache.cache;if(type == "boolean" || value == null){return cache[value]?0:-1;}if(type != "number" && type != "string"){type = "object";}var key=type == "number"?value:keyPrefix + value;cache = (cache = cache[type]) && cache[key];return type == "object"?cache && baseIndexOf(cache, value) > -1?0:-1:cache?0:-1;}function cachePush(value){var cache=this.cache, type=typeof value;if(type == "boolean" || value == null){cache[value] = true;}else {if(type != "number" && type != "string"){type = "object";}var key=type == "number"?value:keyPrefix + value, typeCache=cache[type] || (cache[type] = {});if(type == "object"){(typeCache[key] || (typeCache[key] = [])).push(value);}else {typeCache[key] = true;}}}function charAtCallback(value){return value.charCodeAt(0);}function compareAscending(a, b){var ac=a.criteria, bc=b.criteria, index=-1, length=ac.length;while(++index < length) {var value=ac[index], other=bc[index];if(value !== other){if(value > other || typeof value == "undefined"){return 1;}if(value < other || typeof other == "undefined"){return -1;}}}return a.index - b.index;}function createCache(array){var index=-1, length=array.length, first=array[0], mid=array[length / 2 | 0], last=array[length - 1];if(first && typeof first == "object" && mid && typeof mid == "object" && last && typeof last == "object"){return false;}var cache=getObject();cache["false"] = cache["null"] = cache["true"] = cache.undefined = false;var result=getObject();result.array = array;result.cache = cache;result.push = cachePush;while(++index < length) {result.push(array[index]);}return result;}function escapeStringChar(match){return "\\" + stringEscapes[match];}function getArray(){return arrayPool.pop() || [];}function getObject(){return objectPool.pop() || {array:null, cache:null, criteria:null, "false":false, index:0, "null":false, number:null, object:null, push:null, string:null, "true":false, undefined:false, value:null};}function isNode(value){return typeof value.toString != "function" && typeof (value + "") == "string";}function releaseArray(array){array.length = 0;if(arrayPool.length < maxPoolSize){arrayPool.push(array);}}function releaseObject(object){var cache=object.cache;if(cache){releaseObject(cache);}object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;if(objectPool.length < maxPoolSize){objectPool.push(object);}}function slice(array, start, end){start || (start = 0);if(typeof end == "undefined"){end = array?array.length:0;}var index=-1, length=end - start || 0, result=Array(length < 0?0:length);while(++index < length) {result[index] = array[start + index];}return result;}function runInContext(context){context = context?_.defaults(root.Object(), context, _.pick(root, contextProps)):root;var Array=context.Array, Boolean=context.Boolean, Date=context.Date, Error=context.Error, Function=context.Function, Math=context.Math, Number=context.Number, Object=context.Object, RegExp=context.RegExp, String=context.String, TypeError=context.TypeError;var arrayRef=[];var errorProto=Error.prototype, objectProto=Object.prototype, stringProto=String.prototype;var oldDash=context._;var toString=objectProto.toString;var reNative=RegExp("^" + String(toString).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/toString| for [^\]]+/g, ".*?") + "$");var ceil=Math.ceil, clearTimeout=context.clearTimeout, floor=Math.floor, fnToString=Function.prototype.toString, getPrototypeOf=isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf, hasOwnProperty=objectProto.hasOwnProperty, push=arrayRef.push, propertyIsEnumerable=objectProto.propertyIsEnumerable, setTimeout=context.setTimeout, splice=arrayRef.splice, unshift=arrayRef.unshift;var defineProperty=(function(){try{var o={}, func=isNative(func = Object.defineProperty) && func, result=func(o, o, o) && func;}catch(e) {}return result;})();var nativeCreate=isNative(nativeCreate = Object.create) && nativeCreate, nativeIsArray=isNative(nativeIsArray = Array.isArray) && nativeIsArray, nativeIsFinite=context.isFinite, nativeIsNaN=context.isNaN, nativeKeys=isNative(nativeKeys = Object.keys) && nativeKeys, nativeMax=Math.max, nativeMin=Math.min, nativeParseInt=context.parseInt, nativeRandom=Math.random;var ctorByClass={};ctorByClass[arrayClass] = Array;ctorByClass[boolClass] = Boolean;ctorByClass[dateClass] = Date;ctorByClass[funcClass] = Function;ctorByClass[objectClass] = Object;ctorByClass[numberClass] = Number;ctorByClass[regexpClass] = RegExp;ctorByClass[stringClass] = String;var nonEnumProps={};nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = {constructor:true, toLocaleString:true, toString:true, valueOf:true};nonEnumProps[boolClass] = nonEnumProps[stringClass] = {constructor:true, toString:true, valueOf:true};nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = {constructor:true, toString:true};nonEnumProps[objectClass] = {constructor:true};(function(){var length=shadowedProps.length;while(length--) {var key=shadowedProps[length];for(var className in nonEnumProps) {if(hasOwnProperty.call(nonEnumProps, className) && !hasOwnProperty.call(nonEnumProps[className], key)){nonEnumProps[className][key] = false;}}}})();function lodash(value){return value && typeof value == "object" && !isArray(value) && hasOwnProperty.call(value, "__wrapped__")?value:new lodashWrapper(value);}function lodashWrapper(value, chainAll){this.__chain__ = !!chainAll;this.__wrapped__ = value;}lodashWrapper.prototype = lodash.prototype;var support=lodash.support = {};(function(){var ctor=function ctor(){this.x = 1;}, object={"0":1, length:1}, props=[];ctor.prototype = {valueOf:1, y:1};for(var key in new ctor()) {props.push(key);}for(key in arguments) {}support.argsClass = toString.call(arguments) == argsClass;support.argsObject = arguments.constructor == Object && !(arguments instanceof Array);support.enumErrorProps = propertyIsEnumerable.call(errorProto, "message") || propertyIsEnumerable.call(errorProto, "name");support.enumPrototypes = propertyIsEnumerable.call(ctor, "prototype");support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);support.funcNames = typeof Function.name == "string";support.nonEnumArgs = key != 0;support.nonEnumShadows = !/valueOf/.test(props);support.ownLast = props[0] != "x";support.spliceObjects = (arrayRef.splice.call(object, 0, 1), !object[0]);support.unindexedChars = "x"[0] + Object("x")[0] != "xx";try{support.nodeClass = !(toString.call(document) == objectClass && !({toString:0} + ""));}catch(e) {support.nodeClass = true;}})(1);lodash.templateSettings = {escape:/<%-([\s\S]+?)%>/g, evaluate:/<%([\s\S]+?)%>/g, interpolate:reInterpolate, variable:"", imports:{_:lodash}};var iteratorTemplate=function iteratorTemplate(obj){var __p="var index, iterable = " + obj.firstArg + ", result = " + obj.init + ";\nif (!iterable) return result;\n" + obj.top + ";";if(obj.array){__p += "\nvar length = iterable.length; index = -1;\nif (" + obj.array + ") {  ";if(support.unindexedChars){__p += "\n  if (isString(iterable)) {\n    iterable = iterable.split('')\n  }  ";}__p += "\n  while (++index < length) {\n    " + obj.loop + ";\n  }\n}\nelse {  ";}else if(support.nonEnumArgs){__p += "\n  var length = iterable.length; index = -1;\n  if (length && isArguments(iterable)) {\n    while (++index < length) {\n      index += '';\n      " + obj.loop + ";\n    }\n  } else {  ";}if(support.enumPrototypes){__p += "\n  var skipProto = typeof iterable == 'function';\n  ";}if(support.enumErrorProps){__p += "\n  var skipErrorProps = iterable === errorProto || iterable instanceof Error;\n  ";}var conditions=[];if(support.enumPrototypes){conditions.push("!(skipProto && index == \"prototype\")");}if(support.enumErrorProps){conditions.push("!(skipErrorProps && (index == \"message\" || index == \"name\"))");}if(obj.useHas && obj.keys){__p += "\n  var ownIndex = -1,\n      ownProps = objectTypes[typeof iterable] && keys(iterable),\n      length = ownProps ? ownProps.length : 0;\n\n  while (++ownIndex < length) {\n    index = ownProps[ownIndex];\n";if(conditions.length){__p += "    if (" + conditions.join(" && ") + ") {\n  ";}__p += obj.loop + ";    ";if(conditions.length){__p += "\n    }";}__p += "\n  }  ";}else {__p += "\n  for (index in iterable) {\n";if(obj.useHas){conditions.push("hasOwnProperty.call(iterable, index)");}if(conditions.length){__p += "    if (" + conditions.join(" && ") + ") {\n  ";}__p += obj.loop + ";    ";if(conditions.length){__p += "\n    }";}__p += "\n  }    ";if(support.nonEnumShadows){__p += "\n\n  if (iterable !== objectProto) {\n    var ctor = iterable.constructor,\n        isProto = iterable === (ctor && ctor.prototype),\n        className = iterable === stringProto ? stringClass : iterable === errorProto ? errorClass : toString.call(iterable),\n        nonEnum = nonEnumProps[className];\n      ";for(k = 0; k < 7; k++) {__p += "\n    index = '" + obj.shadowedProps[k] + "';\n    if ((!(isProto && nonEnum[index]) && hasOwnProperty.call(iterable, index))";if(!obj.useHas){__p += " || (!nonEnum[index] && iterable[index] !== objectProto[index])";}__p += ") {\n      " + obj.loop + ";\n    }      ";}__p += "\n  }    ";}}if(obj.array || support.nonEnumArgs){__p += "\n}";}__p += obj.bottom + ";\nreturn result";return __p;};function baseBind(bindData){var func=bindData[0], partialArgs=bindData[2], thisArg=bindData[4];function bound(){if(partialArgs){var args=slice(partialArgs);push.apply(args, arguments);}if(this instanceof bound){var thisBinding=baseCreate(func.prototype), result=func.apply(thisBinding, args || arguments);return isObject(result)?result:thisBinding;}return func.apply(thisArg, args || arguments);}setBindData(bound, bindData);return bound;}function baseClone(value, isDeep, callback, stackA, stackB){if(callback){var result=callback(value);if(typeof result != "undefined"){return result;}}var isObj=isObject(value);if(isObj){var className=toString.call(value);if(!cloneableClasses[className] || !support.nodeClass && isNode(value)){return value;}var ctor=ctorByClass[className];switch(className){case boolClass:case dateClass:return new ctor(+value);case numberClass:case stringClass:return new ctor(value);case regexpClass:result = ctor(value.source, reFlags.exec(value));result.lastIndex = value.lastIndex;return result;}}else {return value;}var isArr=isArray(value);if(isDeep){var initedStack=!stackA;stackA || (stackA = getArray());stackB || (stackB = getArray());var length=stackA.length;while(length--) {if(stackA[length] == value){return stackB[length];}}result = isArr?ctor(value.length):{};}else {result = isArr?slice(value):assign({}, value);}if(isArr){if(hasOwnProperty.call(value, "index")){result.index = value.index;}if(hasOwnProperty.call(value, "input")){result.input = value.input;}}if(!isDeep){return result;}stackA.push(value);stackB.push(result);(isArr?baseEach:forOwn)(value, function(objValue, key){result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);});if(initedStack){releaseArray(stackA);releaseArray(stackB);}return result;}function baseCreate(prototype, properties){return isObject(prototype)?nativeCreate(prototype):{};}if(!nativeCreate){baseCreate = (function(){function Object(){}return function(prototype){if(isObject(prototype)){Object.prototype = prototype;var result=new Object();Object.prototype = null;}return result || context.Object();};})();}function baseCreateCallback(func, thisArg, argCount){if(typeof func != "function"){return identity;}if(typeof thisArg == "undefined" || !("prototype" in func)){return func;}var bindData=func.__bindData__;if(typeof bindData == "undefined"){if(support.funcNames){bindData = !func.name;}bindData = bindData || !support.funcDecomp;if(!bindData){var source=fnToString.call(func);if(!support.funcNames){bindData = !reFuncName.test(source);}if(!bindData){bindData = reThis.test(source);setBindData(func, bindData);}}}if(bindData === false || bindData !== true && bindData[1] & 1){return func;}switch(argCount){case 1:return function(value){return func.call(thisArg, value);};case 2:return function(a, b){return func.call(thisArg, a, b);};case 3:return function(value, index, collection){return func.call(thisArg, value, index, collection);};case 4:return function(accumulator, value, index, collection){return func.call(thisArg, accumulator, value, index, collection);};}return bind(func, thisArg);}function baseCreateWrapper(bindData){var func=bindData[0], bitmask=bindData[1], partialArgs=bindData[2], partialRightArgs=bindData[3], thisArg=bindData[4], arity=bindData[5];var isBind=bitmask & 1, isBindKey=bitmask & 2, isCurry=bitmask & 4, isCurryBound=bitmask & 8, key=func;function bound(){var thisBinding=isBind?thisArg:this;if(partialArgs){var args=slice(partialArgs);push.apply(args, arguments);}if(partialRightArgs || isCurry){args || (args = slice(arguments));if(partialRightArgs){push.apply(args, partialRightArgs);}if(isCurry && args.length < arity){bitmask |= 16 & ~32;return baseCreateWrapper([func, isCurryBound?bitmask:bitmask & ~3, args, null, thisArg, arity]);}}args || (args = arguments);if(isBindKey){func = thisBinding[key];}if(this instanceof bound){thisBinding = baseCreate(func.prototype);var result=func.apply(thisBinding, args);return isObject(result)?result:thisBinding;}return func.apply(thisBinding, args);}setBindData(bound, bindData);return bound;}function baseDifference(array, values){var index=-1, indexOf=getIndexOf(), length=array?array.length:0, isLarge=length >= largeArraySize && indexOf === baseIndexOf, result=[];if(isLarge){var cache=createCache(values);if(cache){indexOf = cacheIndexOf;values = cache;}else {isLarge = false;}}while(++index < length) {var value=array[index];if(indexOf(values, value) < 0){result.push(value);}}if(isLarge){releaseObject(values);}return result;}function baseFlatten(array, isShallow, isStrict, fromIndex){var index=(fromIndex || 0) - 1, length=array?array.length:0, result=[];while(++index < length) {var value=array[index];if(value && typeof value == "object" && typeof value.length == "number" && (isArray(value) || isArguments(value))){if(!isShallow){value = baseFlatten(value, isShallow, isStrict);}var valIndex=-1, valLength=value.length, resIndex=result.length;result.length += valLength;while(++valIndex < valLength) {result[resIndex++] = value[valIndex];}}else if(!isStrict){result.push(value);}}return result;}function baseIsEqual(_x, _x2, _x3, _x4, _x5, _x6){var _again=true;_function: while(_again) {_again = false;var a=_x, b=_x2, callback=_x3, isWhere=_x4, stackA=_x5, stackB=_x6;result = type = otherType = className = otherClass = isArr = aWrapped = bWrapped = ctorA = ctorB = initedStack = length = size = index = value = undefined;if(callback){var result=callback(a, b);if(typeof result != "undefined"){return !!result;}}if(a === b){return a !== 0 || 1 / a == 1 / b;}var type=typeof a, otherType=typeof b;if(a === a && !(a && objectTypes[type]) && !(b && objectTypes[otherType])){return false;}if(a == null || b == null){return a === b;}var className=toString.call(a), otherClass=toString.call(b);if(className == argsClass){className = objectClass;}if(otherClass == argsClass){otherClass = objectClass;}if(className != otherClass){return false;}switch(className){case boolClass:case dateClass:return +a == +b;case numberClass:return a != +a?b != +b:a == 0?1 / a == 1 / b:a == +b;case regexpClass:case stringClass:return a == String(b);}var isArr=className == arrayClass;if(!isArr){var aWrapped=hasOwnProperty.call(a, "__wrapped__"), bWrapped=hasOwnProperty.call(b, "__wrapped__");if(aWrapped || bWrapped){_x = aWrapped?a.__wrapped__:a;_x2 = bWrapped?b.__wrapped__:b;_x3 = callback;_x4 = isWhere;_x5 = stackA;_x6 = stackB;_again = true;continue _function;}if(className != objectClass || !support.nodeClass && (isNode(a) || isNode(b))){return false;}var ctorA=!support.argsObject && isArguments(a)?Object:a.constructor, ctorB=!support.argsObject && isArguments(b)?Object:b.constructor;if(ctorA != ctorB && !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) && ("constructor" in a && "constructor" in b)){return false;}}var initedStack=!stackA;stackA || (stackA = getArray());stackB || (stackB = getArray());var length=stackA.length;while(length--) {if(stackA[length] == a){return stackB[length] == b;}}var size=0;result = true;stackA.push(a);stackB.push(b);if(isArr){length = a.length;size = b.length;result = size == length;if(result || isWhere){while(size--) {var index=length, value=b[size];if(isWhere){while(index--) {if(result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB)){break;}}}else if(!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))){break;}}}}else {forIn(b, function(value, key, b){if(hasOwnProperty.call(b, key)){size++;return result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB);}});if(result && !isWhere){forIn(a, function(value, key, a){if(hasOwnProperty.call(a, key)){return result = --size > -1;}});}}stackA.pop();stackB.pop();if(initedStack){releaseArray(stackA);releaseArray(stackB);}return result;}}function baseMerge(object, source, callback, stackA, stackB){(isArray(source)?forEach:forOwn)(source, function(source, key){var found, isArr, result=source, value=object[key];if(source && ((isArr = isArray(source)) || isPlainObject(source))){var stackLength=stackA.length;while(stackLength--) {if(found = stackA[stackLength] == source){value = stackB[stackLength];break;}}if(!found){var isShallow;if(callback){result = callback(value, source);if(isShallow = typeof result != "undefined"){value = result;}}if(!isShallow){value = isArr?isArray(value)?value:[]:isPlainObject(value)?value:{};}stackA.push(source);stackB.push(value);if(!isShallow){baseMerge(value, source, callback, stackA, stackB);}}}else {if(callback){result = callback(value, source);if(typeof result == "undefined"){result = source;}}if(typeof result != "undefined"){value = result;}}object[key] = value;});}function baseRandom(min, max){return min + floor(nativeRandom() * (max - min + 1));}function baseUniq(array, isSorted, callback){var index=-1, indexOf=getIndexOf(), length=array?array.length:0, result=[];var isLarge=!isSorted && length >= largeArraySize && indexOf === baseIndexOf, seen=callback || isLarge?getArray():result;if(isLarge){var cache=createCache(seen);indexOf = cacheIndexOf;seen = cache;}while(++index < length) {var value=array[index], computed=callback?callback(value, index, array):value;if(isSorted?!index || seen[seen.length - 1] !== computed:indexOf(seen, computed) < 0){if(callback || isLarge){seen.push(computed);}result.push(value);}}if(isLarge){releaseArray(seen.array);releaseObject(seen);}else if(callback){releaseArray(seen);}return result;}function createAggregator(setter){return function(collection, callback, thisArg){var result={};callback = lodash.createCallback(callback, thisArg, 3);if(isArray(collection)){var index=-1, length=collection.length;while(++index < length) {var value=collection[index];setter(result, value, callback(value, index, collection), collection);}}else {baseEach(collection, function(value, key, collection){setter(result, value, callback(value, key, collection), collection);});}return result;};}function createWrapper(_x, _x2, _x3, _x4, _x5, _x6){var _arguments;var _again=true;_function: while(_again) {_again = false;var func=_x, bitmask=_x2, partialArgs=_x3, partialRightArgs=_x4, thisArg=_x5, arity=_x6;isBind = isBindKey = isCurry = isCurryBound = isPartial = isPartialRight = bindData = creater = undefined;var isBind=bitmask & 1, isBindKey=bitmask & 2, isCurry=bitmask & 4, isCurryBound=bitmask & 8, isPartial=bitmask & 16, isPartialRight=bitmask & 32;if(!isBindKey && !isFunction(func)){throw new TypeError();}if(isPartial && !partialArgs.length){bitmask &= ~16;isPartial = partialArgs = false;}if(isPartialRight && !partialRightArgs.length){bitmask &= ~32;isPartialRight = partialRightArgs = false;}var bindData=func && func.__bindData__;if(bindData && bindData !== true){bindData = slice(bindData);if(bindData[2]){bindData[2] = slice(bindData[2]);}if(bindData[3]){bindData[3] = slice(bindData[3]);}if(isBind && !(bindData[1] & 1)){bindData[4] = thisArg;}if(!isBind && bindData[1] & 1){bitmask |= 8;}if(isCurry && !(bindData[1] & 4)){bindData[5] = arity;}if(isPartial){push.apply(bindData[2] || (bindData[2] = []), partialArgs);}if(isPartialRight){unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);}bindData[1] |= bitmask;_arguments = bindData;_x = _arguments[0];_x2 = _arguments[1];_x3 = _arguments[2];_x4 = _arguments[3];_x5 = _arguments[4];_x6 = _arguments[5];_again = true;continue _function;}var creater=bitmask == 1 || bitmask === 17?baseBind:baseCreateWrapper;return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);}}function createIterator(){iteratorData.shadowedProps = shadowedProps;iteratorData.array = iteratorData.bottom = iteratorData.loop = iteratorData.top = "";iteratorData.init = "iterable";iteratorData.useHas = true;for(var object, index=0; object = arguments[index]; index++) {for(var key in object) {iteratorData[key] = object[key];}}var args=iteratorData.args;iteratorData.firstArg = /^[^,]+/.exec(args)[0];var factory=Function("baseCreateCallback, errorClass, errorProto, hasOwnProperty, " + "indicatorObject, isArguments, isArray, isString, keys, objectProto, " + "objectTypes, nonEnumProps, stringClass, stringProto, toString", "return function(" + args + ") {\n" + iteratorTemplate(iteratorData) + "\n}");return factory(baseCreateCallback, errorClass, errorProto, hasOwnProperty, indicatorObject, isArguments, isArray, isString, iteratorData.keys, objectProto, objectTypes, nonEnumProps, stringClass, stringProto, toString);}function escapeHtmlChar(match){return htmlEscapes[match];}function getIndexOf(){var result=(result = lodash.indexOf) === indexOf?baseIndexOf:result;return result;}function isNative(value){return typeof value == "function" && reNative.test(value);}var setBindData=!defineProperty?noop:function(func, value){descriptor.value = value;defineProperty(func, "__bindData__", descriptor);};function shimIsPlainObject(value){var ctor, result;if(!(value && toString.call(value) == objectClass) || (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor)) || !support.argsClass && isArguments(value) || !support.nodeClass && isNode(value)){return false;}if(support.ownLast){forIn(value, function(value, key, object){result = hasOwnProperty.call(object, key);return false;});return result !== false;}forIn(value, function(value, key){result = key;});return typeof result == "undefined" || hasOwnProperty.call(value, result);}function unescapeHtmlChar(match){return htmlUnescapes[match];}function isArguments(value){return value && typeof value == "object" && typeof value.length == "number" && toString.call(value) == argsClass || false;}if(!support.argsClass){isArguments = function(value){return value && typeof value == "object" && typeof value.length == "number" && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee") || false;};}var isArray=nativeIsArray || function(value){return value && typeof value == "object" && typeof value.length == "number" && toString.call(value) == arrayClass || false;};var shimKeys=createIterator({args:"object", init:"[]", top:"if (!(objectTypes[typeof object])) return result", loop:"result.push(index)"});var keys=!nativeKeys?shimKeys:function(object){if(!isObject(object)){return [];}if(support.enumPrototypes && typeof object == "function" || support.nonEnumArgs && object.length && isArguments(object)){return shimKeys(object);}return nativeKeys(object);};var eachIteratorOptions={args:"collection, callback, thisArg", top:"callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3)", array:"typeof length == 'number'", keys:keys, loop:"if (callback(iterable[index], index, collection) === false) return result"};var defaultsIteratorOptions={args:"object, source, guard", top:"var args = arguments,\n" + "    argsIndex = 0,\n" + "    argsLength = typeof guard == 'number' ? 2 : args.length;\n" + "while (++argsIndex < argsLength) {\n" + "  iterable = args[argsIndex];\n" + "  if (iterable && objectTypes[typeof iterable]) {", keys:keys, loop:"if (typeof result[index] == 'undefined') result[index] = iterable[index]", bottom:"  }\n}"};var forOwnIteratorOptions={top:"if (!objectTypes[typeof iterable]) return result;\n" + eachIteratorOptions.top, array:false};var htmlEscapes={"&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;"};var htmlUnescapes=invert(htmlEscapes);var reEscapedHtml=RegExp("(" + keys(htmlUnescapes).join("|") + ")", "g"), reUnescapedHtml=RegExp("[" + keys(htmlEscapes).join("") + "]", "g");var baseEach=createIterator(eachIteratorOptions);var assign=createIterator(defaultsIteratorOptions, {top:defaultsIteratorOptions.top.replace(";", ";\n" + "if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {\n" + "  var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);\n" + "} else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {\n" + "  callback = args[--argsLength];\n" + "}"), loop:"result[index] = callback ? callback(result[index], iterable[index]) : iterable[index]"});function clone(value, isDeep, callback, thisArg){if(typeof isDeep != "boolean" && isDeep != null){thisArg = callback;callback = isDeep;isDeep = false;}return baseClone(value, isDeep, typeof callback == "function" && baseCreateCallback(callback, thisArg, 1));}function cloneDeep(value, callback, thisArg){return baseClone(value, true, typeof callback == "function" && baseCreateCallback(callback, thisArg, 1));}function create(prototype, properties){var result=baseCreate(prototype);return properties?assign(result, properties):result;}var defaults=createIterator(defaultsIteratorOptions);function findKey(object, callback, thisArg){var result;callback = lodash.createCallback(callback, thisArg, 3);forOwn(object, function(value, key, object){if(callback(value, key, object)){result = key;return false;}});return result;}function findLastKey(object, callback, thisArg){var result;callback = lodash.createCallback(callback, thisArg, 3);forOwnRight(object, function(value, key, object){if(callback(value, key, object)){result = key;return false;}});return result;}var forIn=createIterator(eachIteratorOptions, forOwnIteratorOptions, {useHas:false});function forInRight(object, callback, thisArg){var pairs=[];forIn(object, function(value, key){pairs.push(key, value);});var length=pairs.length;callback = baseCreateCallback(callback, thisArg, 3);while(length--) {if(callback(pairs[length--], pairs[length], object) === false){break;}}return object;}var forOwn=createIterator(eachIteratorOptions, forOwnIteratorOptions);function forOwnRight(object, callback, thisArg){var props=keys(object), length=props.length;callback = baseCreateCallback(callback, thisArg, 3);while(length--) {var key=props[length];if(callback(object[key], key, object) === false){break;}}return object;}function functions(object){var result=[];forIn(object, function(value, key){if(isFunction(value)){result.push(key);}});return result.sort();}function has(object, key){return object?hasOwnProperty.call(object, key):false;}function invert(object){var index=-1, props=keys(object), length=props.length, result={};while(++index < length) {var key=props[index];result[object[key]] = key;}return result;}function isBoolean(value){return value === true || value === false || value && typeof value == "object" && toString.call(value) == boolClass || false;}function isDate(value){return value && typeof value == "object" && toString.call(value) == dateClass || false;}function isElement(value){return value && value.nodeType === 1 || false;}function isEmpty(value){var result=true;if(!value){return result;}var className=toString.call(value), length=value.length;if(className == arrayClass || className == stringClass || (support.argsClass?className == argsClass:isArguments(value)) || className == objectClass && typeof length == "number" && isFunction(value.splice)){return !length;}forOwn(value, function(){return result = false;});return result;}function isEqual(a, b, callback, thisArg){return baseIsEqual(a, b, typeof callback == "function" && baseCreateCallback(callback, thisArg, 2));}function isFinite(value){return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));}function isFunction(value){return typeof value == "function";}if(isFunction(/x/)){isFunction = function(value){return typeof value == "function" && toString.call(value) == funcClass;};}function isObject(value){return !!(value && objectTypes[typeof value]);}function isNaN(value){return isNumber(value) && value != +value;}function isNull(value){return value === null;}function isNumber(value){return typeof value == "number" || value && typeof value == "object" && toString.call(value) == numberClass || false;}var isPlainObject=!getPrototypeOf?shimIsPlainObject:function(value){if(!(value && toString.call(value) == objectClass) || !support.argsClass && isArguments(value)){return false;}var valueOf=value.valueOf, objProto=isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);return objProto?value == objProto || getPrototypeOf(value) == objProto:shimIsPlainObject(value);};function isRegExp(value){return value && objectTypes[typeof value] && toString.call(value) == regexpClass || false;}function isString(value){return typeof value == "string" || value && typeof value == "object" && toString.call(value) == stringClass || false;}function isUndefined(value){return typeof value == "undefined";}function mapValues(object, callback, thisArg){var result={};callback = lodash.createCallback(callback, thisArg, 3);forOwn(object, function(value, key, object){result[key] = callback(value, key, object);});return result;}function merge(object){var args=arguments, length=2;if(!isObject(object)){return object;}if(typeof args[2] != "number"){length = args.length;}if(length > 3 && typeof args[length - 2] == "function"){var callback=baseCreateCallback(args[--length - 1], args[length--], 2);}else if(length > 2 && typeof args[length - 1] == "function"){callback = args[--length];}var sources=slice(arguments, 1, length), index=-1, stackA=getArray(), stackB=getArray();while(++index < length) {baseMerge(object, sources[index], callback, stackA, stackB);}releaseArray(stackA);releaseArray(stackB);return object;}function omit(object, callback, thisArg){var result={};if(typeof callback != "function"){var props=[];forIn(object, function(value, key){props.push(key);});props = baseDifference(props, baseFlatten(arguments, true, false, 1));var index=-1, length=props.length;while(++index < length) {var key=props[index];result[key] = object[key];}}else {callback = lodash.createCallback(callback, thisArg, 3);forIn(object, function(value, key, object){if(!callback(value, key, object)){result[key] = value;}});}return result;}function pairs(object){var index=-1, props=keys(object), length=props.length, result=Array(length);while(++index < length) {var key=props[index];result[index] = [key, object[key]];}return result;}function pick(object, callback, thisArg){var result={};if(typeof callback != "function"){var index=-1, props=baseFlatten(arguments, true, false, 1), length=isObject(object)?props.length:0;while(++index < length) {var key=props[index];if(key in object){result[key] = object[key];}}}else {callback = lodash.createCallback(callback, thisArg, 3);forIn(object, function(value, key, object){if(callback(value, key, object)){result[key] = value;}});}return result;}function transform(object, callback, accumulator, thisArg){var isArr=isArray(object);if(accumulator == null){if(isArr){accumulator = [];}else {var ctor=object && object.constructor, proto=ctor && ctor.prototype;accumulator = baseCreate(proto);}}if(callback){callback = lodash.createCallback(callback, thisArg, 4);(isArr?baseEach:forOwn)(object, function(value, index, object){return callback(accumulator, value, index, object);});}return accumulator;}function values(object){var index=-1, props=keys(object), length=props.length, result=Array(length);while(++index < length) {result[index] = object[props[index]];}return result;}function at(collection){var args=arguments, index=-1, props=baseFlatten(args, true, false, 1), length=args[2] && args[2][args[1]] === collection?1:props.length, result=Array(length);if(support.unindexedChars && isString(collection)){collection = collection.split("");}while(++index < length) {result[index] = collection[props[index]];}return result;}function contains(collection, target, fromIndex){var index=-1, indexOf=getIndexOf(), length=collection?collection.length:0, result=false;fromIndex = (fromIndex < 0?nativeMax(0, length + fromIndex):fromIndex) || 0;if(isArray(collection)){result = indexOf(collection, target, fromIndex) > -1;}else if(typeof length == "number"){result = (isString(collection)?collection.indexOf(target, fromIndex):indexOf(collection, target, fromIndex)) > -1;}else {baseEach(collection, function(value){if(++index >= fromIndex){return !(result = value === target);}});}return result;}var countBy=createAggregator(function(result, value, key){hasOwnProperty.call(result, key)?result[key]++:result[key] = 1;});function every(collection, callback, thisArg){var result=true;callback = lodash.createCallback(callback, thisArg, 3);if(isArray(collection)){var index=-1, length=collection.length;while(++index < length) {if(!(result = !!callback(collection[index], index, collection))){break;}}}else {baseEach(collection, function(value, index, collection){return result = !!callback(value, index, collection);});}return result;}function filter(collection, callback, thisArg){var result=[];callback = lodash.createCallback(callback, thisArg, 3);if(isArray(collection)){var index=-1, length=collection.length;while(++index < length) {var value=collection[index];if(callback(value, index, collection)){result.push(value);}}}else {baseEach(collection, function(value, index, collection){if(callback(value, index, collection)){result.push(value);}});}return result;}function find(collection, callback, thisArg){callback = lodash.createCallback(callback, thisArg, 3);if(isArray(collection)){var index=-1, length=collection.length;while(++index < length) {var value=collection[index];if(callback(value, index, collection)){return value;}}}else {var result;baseEach(collection, function(value, index, collection){if(callback(value, index, collection)){result = value;return false;}});return result;}}function findLast(collection, callback, thisArg){var result;callback = lodash.createCallback(callback, thisArg, 3);forEachRight(collection, function(value, index, collection){if(callback(value, index, collection)){result = value;return false;}});return result;}function forEach(collection, callback, thisArg){if(callback && typeof thisArg == "undefined" && isArray(collection)){var index=-1, length=collection.length;while(++index < length) {if(callback(collection[index], index, collection) === false){break;}}}else {baseEach(collection, callback, thisArg);}return collection;}function forEachRight(collection, callback, thisArg){var iterable=collection, length=collection?collection.length:0;callback = callback && typeof thisArg == "undefined"?callback:baseCreateCallback(callback, thisArg, 3);if(isArray(collection)){while(length--) {if(callback(collection[length], length, collection) === false){break;}}}else {if(typeof length != "number"){var props=keys(collection);length = props.length;}else if(support.unindexedChars && isString(collection)){iterable = collection.split("");}baseEach(collection, function(value, key, collection){key = props?props[--length]:--length;return callback(iterable[key], key, collection);});}return collection;}var groupBy=createAggregator(function(result, value, key){(hasOwnProperty.call(result, key)?result[key]:result[key] = []).push(value);});var indexBy=createAggregator(function(result, value, key){result[key] = value;});function invoke(collection, methodName){var args=slice(arguments, 2), index=-1, isFunc=typeof methodName == "function", length=collection?collection.length:0, result=Array(typeof length == "number"?length:0);forEach(collection, function(value){result[++index] = (isFunc?methodName:value[methodName]).apply(value, args);});return result;}function map(collection, callback, thisArg){var index=-1, length=collection?collection.length:0, result=Array(typeof length == "number"?length:0);callback = lodash.createCallback(callback, thisArg, 3);if(isArray(collection)){while(++index < length) {result[index] = callback(collection[index], index, collection);}}else {baseEach(collection, function(value, key, collection){result[++index] = callback(value, key, collection);});}return result;}function max(collection, callback, thisArg){var computed=-Infinity, result=computed;if(typeof callback != "function" && thisArg && thisArg[callback] === collection){callback = null;}if(callback == null && isArray(collection)){var index=-1, length=collection.length;while(++index < length) {var value=collection[index];if(value > result){result = value;}}}else {callback = callback == null && isString(collection)?charAtCallback:lodash.createCallback(callback, thisArg, 3);baseEach(collection, function(value, index, collection){var current=callback(value, index, collection);if(current > computed){computed = current;result = value;}});}return result;}function min(collection, callback, thisArg){var computed=Infinity, result=computed;if(typeof callback != "function" && thisArg && thisArg[callback] === collection){callback = null;}if(callback == null && isArray(collection)){var index=-1, length=collection.length;while(++index < length) {var value=collection[index];if(value < result){result = value;}}}else {callback = callback == null && isString(collection)?charAtCallback:lodash.createCallback(callback, thisArg, 3);baseEach(collection, function(value, index, collection){var current=callback(value, index, collection);if(current < computed){computed = current;result = value;}});}return result;}var pluck=map;function reduce(collection, callback, accumulator, thisArg){var noaccum=arguments.length < 3;callback = lodash.createCallback(callback, thisArg, 4);if(isArray(collection)){var index=-1, length=collection.length;if(noaccum){accumulator = collection[++index];}while(++index < length) {accumulator = callback(accumulator, collection[index], index, collection);}}else {baseEach(collection, function(value, index, collection){accumulator = noaccum?(noaccum = false, value):callback(accumulator, value, index, collection);});}return accumulator;}function reduceRight(collection, callback, accumulator, thisArg){var noaccum=arguments.length < 3;callback = lodash.createCallback(callback, thisArg, 4);forEachRight(collection, function(value, index, collection){accumulator = noaccum?(noaccum = false, value):callback(accumulator, value, index, collection);});return accumulator;}function reject(collection, callback, thisArg){callback = lodash.createCallback(callback, thisArg, 3);return filter(collection, function(value, index, collection){return !callback(value, index, collection);});}function sample(collection, n, guard){if(collection && typeof collection.length != "number"){collection = values(collection);}else if(support.unindexedChars && isString(collection)){collection = collection.split("");}if(n == null || guard){return collection?collection[baseRandom(0, collection.length - 1)]:undefined;}var result=shuffle(collection);result.length = nativeMin(nativeMax(0, n), result.length);return result;}function shuffle(collection){var index=-1, length=collection?collection.length:0, result=Array(typeof length == "number"?length:0);forEach(collection, function(value){var rand=baseRandom(0, ++index);result[index] = result[rand];result[rand] = value;});return result;}function size(collection){var length=collection?collection.length:0;return typeof length == "number"?length:keys(collection).length;}function some(collection, callback, thisArg){var result;callback = lodash.createCallback(callback, thisArg, 3);if(isArray(collection)){var index=-1, length=collection.length;while(++index < length) {if(result = callback(collection[index], index, collection)){break;}}}else {baseEach(collection, function(value, index, collection){return !(result = callback(value, index, collection));});}return !!result;}function sortBy(collection, callback, thisArg){var index=-1, isArr=isArray(callback), length=collection?collection.length:0, result=Array(typeof length == "number"?length:0);if(!isArr){callback = lodash.createCallback(callback, thisArg, 3);}forEach(collection, function(value, key, collection){var object=result[++index] = getObject();if(isArr){object.criteria = map(callback, function(key){return value[key];});}else {(object.criteria = getArray())[0] = callback(value, key, collection);}object.index = index;object.value = value;});length = result.length;result.sort(compareAscending);while(length--) {var object=result[length];result[length] = object.value;if(!isArr){releaseArray(object.criteria);}releaseObject(object);}return result;}function toArray(collection){if(collection && typeof collection.length == "number"){return support.unindexedChars && isString(collection)?collection.split(""):slice(collection);}return values(collection);}var where=filter;function compact(array){var index=-1, length=array?array.length:0, result=[];while(++index < length) {var value=array[index];if(value){result.push(value);}}return result;}function difference(array){return baseDifference(array, baseFlatten(arguments, true, true, 1));}function findIndex(array, callback, thisArg){var index=-1, length=array?array.length:0;callback = lodash.createCallback(callback, thisArg, 3);while(++index < length) {if(callback(array[index], index, array)){return index;}}return -1;}function findLastIndex(array, callback, thisArg){var length=array?array.length:0;callback = lodash.createCallback(callback, thisArg, 3);while(length--) {if(callback(array[length], length, array)){return length;}}return -1;}function first(array, callback, thisArg){var n=0, length=array?array.length:0;if(typeof callback != "number" && callback != null){var index=-1;callback = lodash.createCallback(callback, thisArg, 3);while(++index < length && callback(array[index], index, array)) {n++;}}else {n = callback;if(n == null || thisArg){return array?array[0]:undefined;}}return slice(array, 0, nativeMin(nativeMax(0, n), length));}function flatten(array, isShallow, callback, thisArg){if(typeof isShallow != "boolean" && isShallow != null){thisArg = callback;callback = typeof isShallow != "function" && thisArg && thisArg[isShallow] === array?null:isShallow;isShallow = false;}if(callback != null){array = map(array, callback, thisArg);}return baseFlatten(array, isShallow);}function indexOf(array, value, fromIndex){if(typeof fromIndex == "number"){var length=array?array.length:0;fromIndex = fromIndex < 0?nativeMax(0, length + fromIndex):fromIndex || 0;}else if(fromIndex){var index=sortedIndex(array, value);return array[index] === value?index:-1;}return baseIndexOf(array, value, fromIndex);}function initial(array, callback, thisArg){var n=0, length=array?array.length:0;if(typeof callback != "number" && callback != null){var index=length;callback = lodash.createCallback(callback, thisArg, 3);while(index-- && callback(array[index], index, array)) {n++;}}else {n = callback == null || thisArg?1:callback || n;}return slice(array, 0, nativeMin(nativeMax(0, length - n), length));}function intersection(){var args=[], argsIndex=-1, argsLength=arguments.length, caches=getArray(), indexOf=getIndexOf(), trustIndexOf=indexOf === baseIndexOf, seen=getArray();while(++argsIndex < argsLength) {var value=arguments[argsIndex];if(isArray(value) || isArguments(value)){args.push(value);caches.push(trustIndexOf && value.length >= largeArraySize && createCache(argsIndex?args[argsIndex]:seen));}}var array=args[0], index=-1, length=array?array.length:0, result=[];outer: while(++index < length) {var cache=caches[0];value = array[index];if((cache?cacheIndexOf(cache, value):indexOf(seen, value)) < 0){argsIndex = argsLength;(cache || seen).push(value);while(--argsIndex) {cache = caches[argsIndex];if((cache?cacheIndexOf(cache, value):indexOf(args[argsIndex], value)) < 0){continue outer;}}result.push(value);}}while(argsLength--) {cache = caches[argsLength];if(cache){releaseObject(cache);}}releaseArray(caches);releaseArray(seen);return result;}function last(array, callback, thisArg){var n=0, length=array?array.length:0;if(typeof callback != "number" && callback != null){var index=length;callback = lodash.createCallback(callback, thisArg, 3);while(index-- && callback(array[index], index, array)) {n++;}}else {n = callback;if(n == null || thisArg){return array?array[length - 1]:undefined;}}return slice(array, nativeMax(0, length - n));}function lastIndexOf(array, value, fromIndex){var index=array?array.length:0;if(typeof fromIndex == "number"){index = (fromIndex < 0?nativeMax(0, index + fromIndex):nativeMin(fromIndex, index - 1)) + 1;}while(index--) {if(array[index] === value){return index;}}return -1;}function pull(array){var args=arguments, argsIndex=0, argsLength=args.length, length=array?array.length:0;while(++argsIndex < argsLength) {var index=-1, value=args[argsIndex];while(++index < length) {if(array[index] === value){splice.call(array, index--, 1);length--;}}}return array;}function range(start, end, step){start = +start || 0;step = typeof step == "number"?step:+step || 1;if(end == null){end = start;start = 0;}var index=-1, length=nativeMax(0, ceil((end - start) / (step || 1))), result=Array(length);while(++index < length) {result[index] = start;start += step;}return result;}function remove(array, callback, thisArg){var index=-1, length=array?array.length:0, result=[];callback = lodash.createCallback(callback, thisArg, 3);while(++index < length) {var value=array[index];if(callback(value, index, array)){result.push(value);splice.call(array, index--, 1);length--;}}return result;}function rest(array, callback, thisArg){if(typeof callback != "number" && callback != null){var n=0, index=-1, length=array?array.length:0;callback = lodash.createCallback(callback, thisArg, 3);while(++index < length && callback(array[index], index, array)) {n++;}}else {n = callback == null || thisArg?1:nativeMax(0, callback);}return slice(array, n);}function sortedIndex(array, value, callback, thisArg){var low=0, high=array?array.length:low;callback = callback?lodash.createCallback(callback, thisArg, 1):identity;value = callback(value);while(low < high) {var mid=low + high >>> 1;callback(array[mid]) < value?low = mid + 1:high = mid;}return low;}function union(){return baseUniq(baseFlatten(arguments, true, true));}function uniq(array, isSorted, callback, thisArg){if(typeof isSorted != "boolean" && isSorted != null){thisArg = callback;callback = typeof isSorted != "function" && thisArg && thisArg[isSorted] === array?null:isSorted;isSorted = false;}if(callback != null){callback = lodash.createCallback(callback, thisArg, 3);}return baseUniq(array, isSorted, callback);}function without(array){return baseDifference(array, slice(arguments, 1));}function xor(){var index=-1, length=arguments.length;while(++index < length) {var array=arguments[index];if(isArray(array) || isArguments(array)){var result=result?baseUniq(baseDifference(result, array).concat(baseDifference(array, result))):array;}}return result || [];}function zip(){var array=arguments.length > 1?arguments:arguments[0], index=-1, length=array?max(pluck(array, "length")):0, result=Array(length < 0?0:length);while(++index < length) {result[index] = pluck(array, index);}return result;}function zipObject(keys, values){var index=-1, length=keys?keys.length:0, result={};if(!values && length && !isArray(keys[0])){values = [];}while(++index < length) {var key=keys[index];if(values){result[key] = values[index];}else if(key){result[key[0]] = key[1];}}return result;}function after(n, func){if(!isFunction(func)){throw new TypeError();}return function(){if(--n < 1){return func.apply(this, arguments);}};}function bind(func, thisArg){return arguments.length > 2?createWrapper(func, 17, slice(arguments, 2), null, thisArg):createWrapper(func, 1, null, null, thisArg);}function bindAll(object){var funcs=arguments.length > 1?baseFlatten(arguments, true, false, 1):functions(object), index=-1, length=funcs.length;while(++index < length) {var key=funcs[index];object[key] = createWrapper(object[key], 1, null, null, object);}return object;}function bindKey(object, key){return arguments.length > 2?createWrapper(key, 19, slice(arguments, 2), null, object):createWrapper(key, 3, null, null, object);}function compose(){var funcs=arguments, length=funcs.length;while(length--) {if(!isFunction(funcs[length])){throw new TypeError();}}return function(){var args=arguments, length=funcs.length;while(length--) {args = [funcs[length].apply(this, args)];}return args[0];};}function curry(func, arity){arity = typeof arity == "number"?arity:+arity || func.length;return createWrapper(func, 4, null, null, null, arity);}function debounce(func, wait, options){var args, maxTimeoutId, result, stamp, thisArg, timeoutId, trailingCall, lastCalled=0, maxWait=false, trailing=true;if(!isFunction(func)){throw new TypeError();}wait = nativeMax(0, wait) || 0;if(options === true){var leading=true;trailing = false;}else if(isObject(options)){leading = options.leading;maxWait = "maxWait" in options && (nativeMax(wait, options.maxWait) || 0);trailing = "trailing" in options?options.trailing:trailing;}var delayed=(function(_delayed){var _delayedWrapper=function delayed(){return _delayed.apply(this, arguments);};_delayedWrapper.toString = function(){return _delayed.toString();};return _delayedWrapper;})(function(){var remaining=wait - (now() - stamp);if(remaining <= 0){if(maxTimeoutId){clearTimeout(maxTimeoutId);}var isCalled=trailingCall;maxTimeoutId = timeoutId = trailingCall = undefined;if(isCalled){lastCalled = now();result = func.apply(thisArg, args);if(!timeoutId && !maxTimeoutId){args = thisArg = null;}}}else {timeoutId = setTimeout(delayed, remaining);}});var maxDelayed=function maxDelayed(){if(timeoutId){clearTimeout(timeoutId);}maxTimeoutId = timeoutId = trailingCall = undefined;if(trailing || maxWait !== wait){lastCalled = now();result = func.apply(thisArg, args);if(!timeoutId && !maxTimeoutId){args = thisArg = null;}}};return function(){args = arguments;stamp = now();thisArg = this;trailingCall = trailing && (timeoutId || !leading);if(maxWait === false){var leadingCall=leading && !timeoutId;}else {if(!maxTimeoutId && !leading){lastCalled = stamp;}var remaining=maxWait - (stamp - lastCalled), isCalled=remaining <= 0;if(isCalled){if(maxTimeoutId){maxTimeoutId = clearTimeout(maxTimeoutId);}lastCalled = stamp;result = func.apply(thisArg, args);}else if(!maxTimeoutId){maxTimeoutId = setTimeout(maxDelayed, remaining);}}if(isCalled && timeoutId){timeoutId = clearTimeout(timeoutId);}else if(!timeoutId && wait !== maxWait){timeoutId = setTimeout(delayed, wait);}if(leadingCall){isCalled = true;result = func.apply(thisArg, args);}if(isCalled && !timeoutId && !maxTimeoutId){args = thisArg = null;}return result;};}function defer(func){if(!isFunction(func)){throw new TypeError();}var args=slice(arguments, 1);return setTimeout(function(){func.apply(undefined, args);}, 1);}function delay(func, wait){if(!isFunction(func)){throw new TypeError();}var args=slice(arguments, 2);return setTimeout(function(){func.apply(undefined, args);}, wait);}function memoize(func, resolver){if(!isFunction(func)){throw new TypeError();}var memoized=(function(_memoized){var _memoizedWrapper=function memoized(){return _memoized.apply(this, arguments);};_memoizedWrapper.toString = function(){return _memoized.toString();};return _memoizedWrapper;})(function(){var cache=memoized.cache, key=resolver?resolver.apply(this, arguments):keyPrefix + arguments[0];return hasOwnProperty.call(cache, key)?cache[key]:cache[key] = func.apply(this, arguments);});memoized.cache = {};return memoized;}function once(func){var ran, result;if(!isFunction(func)){throw new TypeError();}return function(){if(ran){return result;}ran = true;result = func.apply(this, arguments);func = null;return result;};}function partial(func){return createWrapper(func, 16, slice(arguments, 1));}function partialRight(func){return createWrapper(func, 32, null, slice(arguments, 1));}function throttle(func, wait, options){var leading=true, trailing=true;if(!isFunction(func)){throw new TypeError();}if(options === false){leading = false;}else if(isObject(options)){leading = "leading" in options?options.leading:leading;trailing = "trailing" in options?options.trailing:trailing;}debounceOptions.leading = leading;debounceOptions.maxWait = wait;debounceOptions.trailing = trailing;return debounce(func, wait, debounceOptions);}function wrap(value, wrapper){return createWrapper(wrapper, 16, [value]);}function constant(value){return function(){return value;};}function createCallback(func, thisArg, argCount){var type=typeof func;if(func == null || type == "function"){return baseCreateCallback(func, thisArg, argCount);}if(type != "object"){return property(func);}var props=keys(func), key=props[0], a=func[key];if(props.length == 1 && a === a && !isObject(a)){return function(object){var b=object[key];return a === b && (a !== 0 || 1 / a == 1 / b);};}return function(object){var length=props.length, result=false;while(length--) {if(!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))){break;}}return result;};}function escape(string){return string == null?"":String(string).replace(reUnescapedHtml, escapeHtmlChar);}function identity(value){return value;}function mixin(object, source, options){var chain=true, methodNames=source && functions(source);if(!source || !options && !methodNames.length){if(options == null){options = source;}ctor = lodashWrapper;source = object;object = lodash;methodNames = functions(source);}if(options === false){chain = false;}else if(isObject(options) && "chain" in options){chain = options.chain;}var ctor=object, isFunc=isFunction(ctor);forEach(methodNames, function(methodName){var func=object[methodName] = source[methodName];if(isFunc){ctor.prototype[methodName] = function(){var chainAll=this.__chain__, value=this.__wrapped__, args=[value];push.apply(args, arguments);var result=func.apply(object, args);if(chain || chainAll){if(value === result && isObject(result)){return this;}result = new ctor(result);result.__chain__ = chainAll;}return result;};}});}function noConflict(){context._ = oldDash;return this;}function noop(){}var now=isNative(now = Date.now) && now || function(){return new Date().getTime();};var parseInt=nativeParseInt(whitespace + "08") == 8?nativeParseInt:function(value, radix){return nativeParseInt(isString(value)?value.replace(reLeadingSpacesAndZeros, ""):value, radix || 0);};function property(key){return function(object){return object[key];};}function random(min, max, floating){var noMin=min == null, noMax=max == null;if(floating == null){if(typeof min == "boolean" && noMax){floating = min;min = 1;}else if(!noMax && typeof max == "boolean"){floating = max;noMax = true;}}if(noMin && noMax){max = 1;}min = +min || 0;if(noMax){max = min;min = 0;}else {max = +max || 0;}if(floating || min % 1 || max % 1){var rand=nativeRandom();return nativeMin(min + rand * (max - min + parseFloat("1e-" + ((rand + "").length - 1))), max);}return baseRandom(min, max);}function result(object, key){if(object){var value=object[key];return isFunction(value)?object[key]():value;}}function template(text, data, options){var settings=lodash.templateSettings;text = String(text || "");options = defaults({}, options, settings);var imports=defaults({}, options.imports, settings.imports), importsKeys=keys(imports), importsValues=values(imports);var isEvaluating, index=0, interpolate=options.interpolate || reNoMatch, source="__p += '";var reDelimiters=RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate?reEsTemplate:reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset){interpolateValue || (interpolateValue = esTemplateValue);source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);if(escapeValue){source += "' +\n__e(" + escapeValue + ") +\n'";}if(evaluateValue){isEvaluating = true;source += "';\n" + evaluateValue + ";\n__p += '";}if(interpolateValue){source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";}index = offset + match.length;return match;});source += "';\n";var variable=options.variable, hasVariable=variable;if(!hasVariable){variable = "obj";source = "with (" + variable + ") {\n" + source + "\n}\n";}source = (isEvaluating?source.replace(reEmptyStringLeading, ""):source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");source = "function(" + variable + ") {\n" + (hasVariable?"":variable + " || (" + variable + " = {});\n") + "var __t, __p = '', __e = _.escape" + (isEvaluating?", __j = Array.prototype.join;\n" + "function print() { __p += __j.call(arguments, '') }\n":";\n") + source + "return __p\n}";var sourceURL="\n/*\n//# sourceURL=" + (options.sourceURL || "/lodash/template/source[" + templateCounter++ + "]") + "\n*/";try{var result=Function(importsKeys, "return " + source + sourceURL).apply(undefined, importsValues);}catch(e) {e.source = source;throw e;}if(data){return result(data);}result.source = source;return result;}function times(n, callback, thisArg){n = (n = +n) > -1?n:0;var index=-1, result=Array(n);callback = baseCreateCallback(callback, thisArg, 1);while(++index < n) {result[index] = callback(index);}return result;}function unescape(string){return string == null?"":String(string).replace(reEscapedHtml, unescapeHtmlChar);}function uniqueId(prefix){var id=++idCounter;return String(prefix == null?"":prefix) + id;}function chain(value){value = new lodashWrapper(value);value.__chain__ = true;return value;}function tap(value, interceptor){interceptor(value);return value;}function wrapperChain(){this.__chain__ = true;return this;}function wrapperToString(){return String(this.__wrapped__);}function wrapperValueOf(){return this.__wrapped__;}lodash.after = after;lodash.assign = assign;lodash.at = at;lodash.bind = bind;lodash.bindAll = bindAll;lodash.bindKey = bindKey;lodash.chain = chain;lodash.compact = compact;lodash.compose = compose;lodash.constant = constant;lodash.countBy = countBy;lodash.create = create;lodash.createCallback = createCallback;lodash.curry = curry;lodash.debounce = debounce;lodash.defaults = defaults;lodash.defer = defer;lodash.delay = delay;lodash.difference = difference;lodash.filter = filter;lodash.flatten = flatten;lodash.forEach = forEach;lodash.forEachRight = forEachRight;lodash.forIn = forIn;lodash.forInRight = forInRight;lodash.forOwn = forOwn;lodash.forOwnRight = forOwnRight;lodash.functions = functions;lodash.groupBy = groupBy;lodash.indexBy = indexBy;lodash.initial = initial;lodash.intersection = intersection;lodash.invert = invert;lodash.invoke = invoke;lodash.keys = keys;lodash.map = map;lodash.mapValues = mapValues;lodash.max = max;lodash.memoize = memoize;lodash.merge = merge;lodash.min = min;lodash.omit = omit;lodash.once = once;lodash.pairs = pairs;lodash.partial = partial;lodash.partialRight = partialRight;lodash.pick = pick;lodash.pluck = pluck;lodash.property = property;lodash.pull = pull;lodash.range = range;lodash.reject = reject;lodash.remove = remove;lodash.rest = rest;lodash.shuffle = shuffle;lodash.sortBy = sortBy;lodash.tap = tap;lodash.throttle = throttle;lodash.times = times;lodash.toArray = toArray;lodash.transform = transform;lodash.union = union;lodash.uniq = uniq;lodash.values = values;lodash.where = where;lodash.without = without;lodash.wrap = wrap;lodash.xor = xor;lodash.zip = zip;lodash.zipObject = zipObject;lodash.collect = map;lodash.drop = rest;lodash.each = forEach;lodash.eachRight = forEachRight;lodash.extend = assign;lodash.methods = functions;lodash.object = zipObject;lodash.select = filter;lodash.tail = rest;lodash.unique = uniq;lodash.unzip = zip;mixin(lodash);lodash.clone = clone;lodash.cloneDeep = cloneDeep;lodash.contains = contains;lodash.escape = escape;lodash.every = every;lodash.find = find;lodash.findIndex = findIndex;lodash.findKey = findKey;lodash.findLast = findLast;lodash.findLastIndex = findLastIndex;lodash.findLastKey = findLastKey;lodash.has = has;lodash.identity = identity;lodash.indexOf = indexOf;lodash.isArguments = isArguments;lodash.isArray = isArray;lodash.isBoolean = isBoolean;lodash.isDate = isDate;lodash.isElement = isElement;lodash.isEmpty = isEmpty;lodash.isEqual = isEqual;lodash.isFinite = isFinite;lodash.isFunction = isFunction;lodash.isNaN = isNaN;lodash.isNull = isNull;lodash.isNumber = isNumber;lodash.isObject = isObject;lodash.isPlainObject = isPlainObject;lodash.isRegExp = isRegExp;lodash.isString = isString;lodash.isUndefined = isUndefined;lodash.lastIndexOf = lastIndexOf;lodash.mixin = mixin;lodash.noConflict = noConflict;lodash.noop = noop;lodash.now = now;lodash.parseInt = parseInt;lodash.random = random;lodash.reduce = reduce;lodash.reduceRight = reduceRight;lodash.result = result;lodash.runInContext = runInContext;lodash.size = size;lodash.some = some;lodash.sortedIndex = sortedIndex;lodash.template = template;lodash.unescape = unescape;lodash.uniqueId = uniqueId;lodash.all = every;lodash.any = some;lodash.detect = find;lodash.findWhere = find;lodash.foldl = reduce;lodash.foldr = reduceRight;lodash.include = contains;lodash.inject = reduce;mixin((function(){var source={};forOwn(lodash, function(func, methodName){if(!lodash.prototype[methodName]){source[methodName] = func;}});return source;})(), false);lodash.first = first;lodash.last = last;lodash.sample = sample;lodash.take = first;lodash.head = first;forOwn(lodash, function(func, methodName){var callbackable=methodName !== "sample";if(!lodash.prototype[methodName]){lodash.prototype[methodName] = function(n, guard){var chainAll=this.__chain__, result=func(this.__wrapped__, n, guard);return !chainAll && (n == null || guard && !(callbackable && typeof n == "function"))?result:new lodashWrapper(result, chainAll);};}});lodash.VERSION = "2.4.1";lodash.prototype.chain = wrapperChain;lodash.prototype.toString = wrapperToString;lodash.prototype.value = wrapperValueOf;lodash.prototype.valueOf = wrapperValueOf;baseEach(["join", "pop", "shift"], function(methodName){var func=arrayRef[methodName];lodash.prototype[methodName] = function(){var chainAll=this.__chain__, result=func.apply(this.__wrapped__, arguments);return chainAll?new lodashWrapper(result, chainAll):result;};});baseEach(["push", "reverse", "sort", "unshift"], function(methodName){var func=arrayRef[methodName];lodash.prototype[methodName] = function(){func.apply(this.__wrapped__, arguments);return this;};});baseEach(["concat", "slice", "splice"], function(methodName){var func=arrayRef[methodName];lodash.prototype[methodName] = function(){return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);};});if(!support.spliceObjects){baseEach(["pop", "shift", "splice"], function(methodName){var func=arrayRef[methodName], isSplice=methodName == "splice";lodash.prototype[methodName] = function(){var chainAll=this.__chain__, value=this.__wrapped__, result=func.apply(value, arguments);if(value.length === 0){delete value[0];}return chainAll || isSplice?new lodashWrapper(result, chainAll):result;};});}return lodash;}var _=runInContext();if(typeof define == "function" && typeof define.amd == "object" && define.amd){root._ = _;define(function(){return _;});}else if(freeExports && freeModule){if(moduleExports){(freeModule.exports = _)._ = _;}else {freeExports._ = _;}}else {root._ = _;}}).call(undefined);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
var pull = require("./../../lodash-amd/modern/arrays/pull"), Immutable = require("./../../immutable/dist/immutable");
'use strict';
function EventEmitter() {
    this._listeners = {};
}
EventEmitter.prototype.on = function (eventName, fn) {
    var listeners = this._listeners[eventName] || Immutable.Set();
    this._listeners[eventName] = listeners.add(fn);
};
EventEmitter.prototype.off = function (eventName, fn) {
    var listeners = this._listeners[eventName] || Immutable.Set();
    if (fn) {
        listeners = listeners['delete'](fn);
    } else {
        listeners = listeners.clear();
    }
};
EventEmitter.prototype.trigger = function (eventName, args) {
    var events = eventName.split(':');
    while (!!events.length) {
        var currentEvent = events.join(':');
        var listeners = this._listeners[currentEvent] || Immutable.Set();
        listeners.forEach(function (listener) {
            listener.apply(null, args);
        });
        events.splice(events.length - 1, 1);
    }
};
module.exports = EventEmitter;
},{"./../../immutable/dist/immutable":1,"./../../lodash-amd/modern/arrays/pull":2}],5:[function(require,module,exports){

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],9:[function(require,module,exports){
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
},{"./support/isBuffer":8,"_process":7,"inherits":6}],10:[function(require,module,exports){
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

},{"vtree/vnode":15,"vtree/vtext":16}],11:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook && typeof hook.hook === "function" &&
        !hook.hasOwnProperty("hook")
}

},{}],12:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":14}],13:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],14:[function(require,module,exports){
module.exports = "1"

},{}],15:[function(require,module,exports){
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

},{"./is-vhook":11,"./is-vnode":12,"./is-widget":13,"./version":14}],16:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":14}],17:[function(require,module,exports){
var diff = require("vtree/diff")

module.exports = diff

},{"vtree/diff":50}],18:[function(require,module,exports){
module.exports = isObject

function isObject(x) {
    return typeof x === "object" && x !== null
}

},{}],19:[function(require,module,exports){
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

},{"is-object":18,"vtree/is-vhook":53}],20:[function(require,module,exports){
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

},{"./apply-properties":19,"global/document":22,"vtree/handle-thunk":51,"vtree/is-vnode":54,"vtree/is-vtext":55,"vtree/is-widget":56}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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
},{"min-document":5}],23:[function(require,module,exports){
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

},{"./apply-properties":19,"./create-element":20,"./update-widget":25,"vtree/is-widget":56,"vtree/vpatch":60}],24:[function(require,module,exports){
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

},{"./dom-index":21,"./patch-op":23,"global/document":22,"x-is-array":26}],25:[function(require,module,exports){
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

},{"vtree/is-widget":56}],26:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],27:[function(require,module,exports){
var patch = require("vdom/patch")

module.exports = patch

},{"vdom/patch":24}],28:[function(require,module,exports){
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

},{"data-set":33}],29:[function(require,module,exports){
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

},{"data-set":33}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{"./hooks/data-set-hook.js":28,"./hooks/ev-hook.js":29,"./hooks/soft-set-hook.js":30,"./parse-tag.js":49,"error/typed":40,"vtree/is-thunk":41,"vtree/is-vhook":42,"vtree/is-vnode":43,"vtree/is-vtext":44,"vtree/is-widget":45,"vtree/vnode.js":47,"vtree/vtext.js":48}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{"./create-hash.js":32,"individual":34,"weakmap-shim/create-store":35}],34:[function(require,module,exports){
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
},{}],35:[function(require,module,exports){
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

},{"./hidden-store.js":36}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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


},{"camelize":37,"string-template":38,"xtend/mutable":39}],41:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],42:[function(require,module,exports){
module.exports=require(11)
},{"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vhook.js":11}],43:[function(require,module,exports){
module.exports=require(12)
},{"./version":46,"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vnode.js":12}],44:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":46}],45:[function(require,module,exports){
module.exports=require(13)
},{"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-widget.js":13}],46:[function(require,module,exports){
module.exports=require(14)
},{"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/version.js":14}],47:[function(require,module,exports){
module.exports=require(15)
},{"./is-vhook":42,"./is-vnode":43,"./is-widget":45,"./version":46,"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/vnode.js":15}],48:[function(require,module,exports){
module.exports=require(16)
},{"./version":46,"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/vtext.js":16}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
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

},{"./handle-thunk":51,"./is-thunk":52,"./is-vnode":54,"./is-vtext":55,"./is-widget":56,"./vpatch":60,"is-object":57,"x-is-array":58}],51:[function(require,module,exports){
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

},{"./is-thunk":52,"./is-vnode":54,"./is-vtext":55,"./is-widget":56}],52:[function(require,module,exports){
module.exports=require(41)
},{"/web/scribe-plugin-noting/node_modules/virtual-hyperscript/node_modules/vtree/is-thunk.js":41}],53:[function(require,module,exports){
module.exports=require(11)
},{"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vhook.js":11}],54:[function(require,module,exports){
module.exports=require(12)
},{"./version":59,"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vnode.js":12}],55:[function(require,module,exports){
module.exports=require(44)
},{"./version":59,"/web/scribe-plugin-noting/node_modules/virtual-hyperscript/node_modules/vtree/is-vtext.js":44}],56:[function(require,module,exports){
module.exports=require(13)
},{"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-widget.js":13}],57:[function(require,module,exports){
module.exports=require(18)
},{"/web/scribe-plugin-noting/node_modules/virtual-dom/node_modules/is-object/index.js":18}],58:[function(require,module,exports){
module.exports=require(26)
},{"/web/scribe-plugin-noting/node_modules/virtual-dom/node_modules/x-is-array/index.js":26}],59:[function(require,module,exports){
module.exports=require(14)
},{"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/version.js":14}],60:[function(require,module,exports){
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

},{"./version":59}],61:[function(require,module,exports){
module.exports=require(16)
},{"./version":59,"/web/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/vtext.js":16}],62:[function(require,module,exports){
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

},{"./src/config":87,"./src/generate-note-controller":88,"./src/note-command-factory":89}],63:[function(require,module,exports){
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

},{"../../config":87,"../../utils/create-virtual-scribe-marker":93,"../../utils/error-handle":95,"../../utils/get-note-data-attrs":97,"../../utils/noting/find-entire-note":102,"../../utils/noting/find-scribe-markers":109,"../../utils/vfocus/is-vfocus":134,"./reset-note-segment-classes":74,"./wrap-in-note":82}],64:[function(require,module,exports){
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

},{"../../actions/noting/remove-empty-notes":68,"../../config":87,"../../utils/create-virtual-scribe-marker":93,"../../utils/error-handle":95,"../../utils/get-note-data-attrs":97,"../../utils/noting/find-entire-note":102,"../../utils/noting/find-last-note-segment":104,"../../utils/noting/find-scribe-markers":109,"../../utils/noting/find-text-between-scribe-markers":111,"../../utils/noting/is-not-within-note":115,"../../utils/noting/note-cache":120,"../../utils/vdom/has-class":124,"../../utils/vfocus/is-not-empty":132,"../../utils/vfocus/is-paragraph":133,"../../utils/vfocus/is-vfocus":134,"./../../../bower_components/lodash/dist/lodash.compat.js":3,"./remove-erroneous-br-tags":69,"./remove-scribe-markers":72,"./reset-note-segment-classes":74,"./wrap-in-note":82,"vtree/vtext":61}],65:[function(require,module,exports){
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

},{"../../config":87,"../../utils/error-handle":95,"../../utils/noting/note-cache":120,"../../utils/vfocus/is-vfocus":134,"./merge-if-necessary":66,"./remove-erroneous-br-tags":69,"./reset-note-barriers":73}],66:[function(require,module,exports){
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

},{"../../config":87,"../../utils/error-handle":95,"../../utils/noting/find-all-notes":100,"../../utils/vfocus/is-vfocus":134,"./../../../bower_components/lodash/dist/lodash.compat.js":3,"./reset-note-segment-classes":74}],67:[function(require,module,exports){
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

},{"../../config":87,"../../utils/create-virtual-scribe-marker":93,"../../utils/error-handle":95,"../../utils/noting/find-entire-note":102,"../../utils/noting/find-first-note-segment":103,"../../utils/noting/find-next-note-segment":105,"../../utils/noting/find-previous-note-segment":108,"../../utils/noting/find-scribe-markers":109,"../../utils/vfocus/is-vfocus":134,"../../utils/vfocus/is-vtext":135,"../../vfocus":136,"./../../../bower_components/lodash/dist/lodash.compat.js":3,"./remove-scribe-markers":72}],68:[function(require,module,exports){
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

},{"../../config":87,"../../utils/error-handle":95,"../../utils/noting/find-all-notes":100,"../../utils/vfocus/flatten-tree":128,"../../utils/vfocus/is-empty":131,"../../utils/vfocus/is-vfocus":134,"../../utils/vfocus/is-vtext":135,"./../../../bower_components/lodash/dist/lodash.compat.js":3}],69:[function(require,module,exports){
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

},{"../../config":87,"../../utils/error-handle":95,"../../utils/noting/find-scribe-markers":109,"../../utils/noting/is-note-segment":116,"../../utils/vfocus/has-no-text-children":129,"../../utils/vfocus/has-only-empty-text-children":130,"../../utils/vfocus/is-vfocus":134,"../../utils/vfocus/is-vtext":135,"../../vfocus":136,"vtree/vtext":61}],70:[function(require,module,exports){
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

},{"../../config":87,"../../utils/error-handle":95,"../../utils/noting/find-note-by-id":106,"../../utils/noting/find-parent-note-segment":107,"../../utils/noting/find-scribe-markers":109,"../../utils/noting/note-cache":120,"../../utils/vfocus/is-vfocus":134,"./ensure-note-integrity":65,"./strip-zero-width-space":76,"./unwrap-note":81}],71:[function(require,module,exports){
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

},{"../../config":87,"../../utils/error-handle":95,"../../utils/get-note-data-attrs":97,"../../utils/noting/find-entire-note":102,"../../utils/noting/find-scribe-markers":109,"../../utils/noting/find-text-between-scribe-markers":111,"../../utils/vfocus/flatten-tree":128,"../../utils/vfocus/is-vfocus":134,"../../utils/vfocus/is-vtext":135,"./../../../bower_components/lodash/dist/lodash.compat.js":3,"./ensure-note-integrity":65,"./remove-empty-notes":68,"./strip-zero-width-space":76,"./unwrap-note":81,"./wrap-in-note":82,"vtree/vtext":61}],72:[function(require,module,exports){
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

},{"../../utils/error-handle":95,"../../utils/noting/is-scribe-marker":117,"../../utils/vfocus/is-vfocus":134}],73:[function(require,module,exports){
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

},{"../../config":87,"../../utils/create-note-barrier":92,"../../utils/error-handle":95,"../../utils/noting/find-all-notes":100,"../../utils/noting/is-not-within-note":115,"../../utils/vfocus/is-not-empty":132,"../../utils/vfocus/is-vfocus":134,"../../utils/vfocus/is-vtext":135,"vtree/vtext":61}],74:[function(require,module,exports){
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

},{"../../actions/vdom/add-class":84,"../../actions/vdom/remove-class":85,"../../config":87,"../../utils/generate-uuid":96,"../../utils/get-uk-date":98,"../../utils/vfocus/is-vfocus":134,"../vdom/add-attribute":83,"./../../../bower_components/lodash/dist/lodash.compat.js":3}],75:[function(require,module,exports){
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

},{"../../config":87,"../../utils/create-virtual-scribe-marker":93,"../../utils/error-handle":95,"../../utils/noting/find-entire-note":102,"../../utils/noting/find-parent-note-segment":107,"../../utils/noting/find-scribe-markers":109,"../../utils/vfocus/is-vfocus":134,"./remove-scribe-markers":72}],76:[function(require,module,exports){
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

},{"../../utils/error-handle":95,"../../utils/vfocus/is-vfocus":134,"../../utils/vfocus/is-vtext":135}],77:[function(require,module,exports){
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

},{"../../config":87,"../../utils/error-handle":95,"../../utils/noting/find-all-notes":100,"../../utils/vfocus/is-vfocus":134,"./toggle-note-classes":78}],78:[function(require,module,exports){
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

},{"../../utils/collapse-state":91,"../../utils/error-handle":95,"../vdom/add-class":84,"../vdom/remove-class":85,"../vdom/toggle-class":86,"./../../../bower_components/lodash/dist/lodash.compat.js":3}],79:[function(require,module,exports){
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

},{"../../config":87,"../../utils/error-handle":95,"../../utils/noting/find-selected-note":110,"../../utils/vfocus/is-vfocus":134,"./toggle-note-classes":78}],80:[function(require,module,exports){
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

},{"../../utils/error-handle":95,"../../utils/noting/find-selected-note":110,"../../utils/noting/is-note-segment":116,"../../utils/vfocus/flatten-tree":128,"../../utils/vfocus/is-vfocus":134,"../../vfocus":136,"./unwrap-note":81}],81:[function(require,module,exports){
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

},{"../../config":87,"../../utils/error-handle":95,"../../utils/noting/is-note-segment":116,"../../utils/vfocus/is-vfocus":134,"./../../../bower_components/lodash/dist/lodash.compat.js":3}],82:[function(require,module,exports){
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

},{"../../config":87,"../../utils/get-uk-date":98,"./../../../bower_components/lodash/dist/lodash.compat.js":3,"virtual-hyperscript":31}],83:[function(require,module,exports){
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

},{"../../utils/to-camel-case":122}],84:[function(require,module,exports){
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

},{"../../utils/error-handle":95,"../../utils/vdom/has-class":124}],85:[function(require,module,exports){
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

},{"../../utils/error-handle":95,"../../utils/vdom/has-class":124}],86:[function(require,module,exports){
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

},{"../../utils/error-handle":95,"../../utils/vdom/has-class":124,"../../utils/vfocus/is-vfocus":134,"./add-class":84,"./remove-class":85}],87:[function(require,module,exports){
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

},{"./../../bower_components/lodash/dist/lodash.compat.js":3}],88:[function(require,module,exports){
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

},{"./../bower_components/lodash/dist/lodash.compat.js":3,"./actions/noting/create-note-at-caret":63,"./actions/noting/create-note-from-selection":64,"./actions/noting/ensure-note-integrity":65,"./actions/noting/remove-character-from-adjacent-note":67,"./actions/noting/remove-note":70,"./actions/noting/remove-part-of-note":71,"./actions/noting/select-note-from-caret":75,"./actions/noting/strip-zero-width-space":76,"./actions/noting/toggle-all-note-collapse-state":77,"./actions/noting/toggle-selected-note-collapse-state":79,"./actions/noting/toggle-selected-note-tag-names":80,"./config":87,"./note-command-factory":89,"./noting-vdom":90,"./utils/collapse-state":91,"./utils/emitter":94,"./utils/noting/find-parent-note-segment":107,"./utils/noting/find-scribe-markers":109,"./utils/noting/is-caret-next-to-note":113,"./utils/noting/is-selection-entirely-within-note":118,"./utils/noting/is-selection-within-note":119}],89:[function(require,module,exports){
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

},{"./config":87,"./utils/collapse-state":91,"./utils/emitter":94,"./utils/is-dom-selection-within-a-note":99}],90:[function(require,module,exports){
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

},{"./../bower_components/lodash/dist/lodash.compat.js":3,"./vfocus":136,"vdom-virtualize":10,"virtual-dom/diff":17,"virtual-dom/patch":27,"vtree/is-vtext":55}],91:[function(require,module,exports){
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

},{}],92:[function(require,module,exports){
"use strict";

var VText = require("vtree/vtext");

// We need these to make it possible to place the caret immediately
// inside/outside of a note.
module.exports = function createNoteBarrier() {
  return new VText("​");
};

},{"vtree/vtext":61}],93:[function(require,module,exports){
"use strict";

var h = require("virtual-hyperscript");

module.exports = function createVirtualScribeMarker() {
  return h("em.scribe-marker");
};

},{"virtual-hyperscript":31}],94:[function(require,module,exports){
"use strict";

var EventEmitter = require("./../../bower_components/scribe/src/event-emitter");
module.exports = new EventEmitter();

},{"./../../bower_components/scribe/src/event-emitter":4}],95:[function(require,module,exports){
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

},{"util":9}],96:[function(require,module,exports){
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

},{}],97:[function(require,module,exports){
"use strict";

var config = require("../config");

module.exports = function userAndTimeAsDatasetAttrs() {

  var user = config.get("user");

  return {
    noteEditedBy: user,
    noteEditedDate: new Date().toISOString()
  };
};

},{"../config":87}],98:[function(require,module,exports){
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

},{"../config":87}],99:[function(require,module,exports){
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

},{"../config":87}],100:[function(require,module,exports){
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

},{"../../config":87,"../error-handle":95,"../vfocus/is-vfocus":134,"./../../../bower_components/lodash/dist/lodash.compat.js":3,"./find-entire-note":102,"./is-note-segment":116}],101:[function(require,module,exports){
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

},{"../error-handle":95,"../vfocus/is-vfocus":134,"./is-not-scribe-marker":114,"./is-scribe-marker":117}],102:[function(require,module,exports){
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

},{"../../config":87,"../error-handle":95,"../vfocus/is-vfocus":134,"./find-first-note-segment":103,"./is-note-segment":116,"./still-within-note":121}],103:[function(require,module,exports){
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

},{"../../config":87,"../error-handle":95,"../vfocus/is-vfocus":134,"./../../../bower_components/lodash/dist/lodash.compat.js":3,"./is-note-segment":116,"./still-within-note":121}],104:[function(require,module,exports){
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

},{"../../config":87,"../error-handle":95,"../vfocus/is-vfocus":134,"./is-note-segment":116,"./still-within-note":121}],105:[function(require,module,exports){
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

},{"../../config":87,"../error-handle":95,"../vfocus/is-vfocus":134,"./is-note-segment":116}],106:[function(require,module,exports){
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

},{"../../config":87,"../error-handle":95,"../vfocus/is-vfocus":134,"./../../../bower_components/lodash/dist/lodash.compat.js":3,"./find-all-notes":100,"./has-note-id":112}],107:[function(require,module,exports){
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

},{"../../config":87,"../error-handle":95,"../noting/is-note-segment":116,"../vfocus/is-vfocus":134}],108:[function(require,module,exports){
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

},{"../../config":87,"../error-handle":95,"../vfocus/is-vfocus":134,"./is-note-segment":116}],109:[function(require,module,exports){
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

},{"../error-handle":95,"../vfocus/is-vfocus":134,"./is-scribe-marker":117}],110:[function(require,module,exports){
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

},{"../../config":87,"../../vfocus":136,"../error-handle":95,"../vfocus/is-vfocus":134,"./find-entire-note":102,"./find-parent-note-segment":107,"./find-scribe-markers":109}],111:[function(require,module,exports){
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

},{"../error-handle":95,"../vfocus/find-text-nodes":127,"../vfocus/is-vfocus":134,"./find-between-scribe-markers":101}],112:[function(require,module,exports){
"use strict";

var hasAttribute = require("../vdom/has-attribute");
var isVFocus = require("../vfocus/is-vfocus");

module.exports = function hasNoteId(vNode, value) {
  return hasAttribute(vNode, "data-note-id", value);
};

},{"../vdom/has-attribute":123,"../vfocus/is-vfocus":134}],113:[function(require,module,exports){
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

},{"../../config":87,"../error-handle":95,"../noting/is-note-segment":116,"../vfocus/is-vfocus":134,"./find-previous-note-segment":108,"./find-scribe-markers":109,"./is-scribe-marker.js":117}],114:[function(require,module,exports){
"use strict";

var isScribeMarker = require("./is-scribe-marker");

module.exports = function isNotScribeMarker(focus) {
  return !isScribeMarker(focus);
};

},{"./is-scribe-marker":117}],115:[function(require,module,exports){
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

},{"../../config":87,"../error-handle":95,"../vfocus/is-vfocus":134,"./find-parent-note-segment":107}],116:[function(require,module,exports){
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

},{"../../config":87,"../error-handle":95,"../vdom/is-tag":126,"../vfocus/is-vfocus":134,"./../../../bower_components/lodash/dist/lodash.compat.js":3}],117:[function(require,module,exports){
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

},{"../error-handle":95,"../vdom/has-class":124,"../vfocus/is-vfocus":134}],118:[function(require,module,exports){
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

},{"../../config":87,"../error-handle":95,"../vfocus/is-vfocus":134,"../vfocus/is-vtext":135,"./../../../bower_components/lodash/dist/lodash.compat.js":3,"./find-parent-note-segment":107,"./find-scribe-markers":109,"./is-not-scribe-marker":114}],119:[function(require,module,exports){
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

},{"../../config":87,"../error-handle":95,"../vfocus/is-vfocus":134,"../vfocus/is-vtext":135,"./../../../bower_components/lodash/dist/lodash.compat.js":3,"./find-parent-note-segment":107,"./find-scribe-markers":109,"./is-not-scribe-marker":114}],120:[function(require,module,exports){
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

},{"../error-handle":95,"../vfocus/is-vfocus":134,"./find-all-notes":100}],121:[function(require,module,exports){
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

},{"../../config":87,"../error-handle":95,"../noting/find-parent-note-segment":107,"../vfocus/is-empty":131,"../vfocus/is-vfocus":134,"../vfocus/is-vtext":135}],122:[function(require,module,exports){
"use strict";

module.exports = function toCamelCase(string) {
  return string.replace(/(\-[a-z])/g, function ($1) {
    return $1.toUpperCase().replace("-", "");
  });
};

},{}],123:[function(require,module,exports){
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

},{"../error-handle":95,"../to-camel-case":122}],124:[function(require,module,exports){
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

},{"./../../../bower_components/lodash/dist/lodash.compat.js":3}],125:[function(require,module,exports){
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

},{"./../../../bower_components/lodash/dist/lodash.compat.js":3,"vtree/is-vtext":55}],126:[function(require,module,exports){
"use strict";

module.exports = function isTag(node, tag) {
  return node.tagName && node.tagName.toLowerCase() === tag;
};

},{}],127:[function(require,module,exports){
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

},{"../error-handle":95,"../vfocus/is-vfocus":134,"../vfocus/is-vtext":135,"./../../../bower_components/lodash/dist/lodash.compat.js":3}],128:[function(require,module,exports){
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

},{"../error-handle":95,"./is-vfocus":134}],129:[function(require,module,exports){
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

},{"../error-handle":95,"./flatten-tree":128,"./is-vfocus":134,"./is-vtext":135}],130:[function(require,module,exports){
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

},{"../error-handle":95,"./flatten-tree":128,"./is-empty":131,"./is-vfocus":134,"./is-vtext":135}],131:[function(require,module,exports){
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

},{"../error-handle":95,"../vdom/is-empty":125,"./is-vfocus":134}],132:[function(require,module,exports){
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

},{"../error-handle":95,"./is-empty.js":131,"./is-vfocus":134,"./is-vtext":135}],133:[function(require,module,exports){
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

},{"../error-handle":95,"../vdom/is-tag.js":126,"./is-vfocus.js":134}],134:[function(require,module,exports){
"use strict";

var VFocus = require("../../vfocus");

module.exports = function isVFocus(vFocus) {
  return vFocus instanceof VFocus;
};

},{"../../vfocus":136}],135:[function(require,module,exports){
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

},{"../../vfocus":136,"../error-handle":95,"../vfocus/is-vfocus":134,"vtree/is-vtext":55}],136:[function(require,module,exports){
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

},{}]},{},[62])(62)
});