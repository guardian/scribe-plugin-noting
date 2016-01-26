!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.scribePluginNoting=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";(function(global, factory){typeof exports === "object" && typeof module !== "undefined"?module.exports = factory():typeof define === "function" && define.amd?define(factory):global.Immutable = factory();})(undefined, function(){"use strict";var SLICE$0=Array.prototype.slice;function createClass(ctor, superClass){if(superClass){ctor.prototype = Object.create(superClass.prototype);}ctor.prototype.constructor = ctor;}var DELETE="delete";var SHIFT=5;var SIZE=1 << SHIFT;var MASK=SIZE - 1;var NOT_SET={};var CHANGE_LENGTH={value:false};var DID_ALTER={value:false};function MakeRef(ref){ref.value = false;return ref;}function SetRef(ref){ref && (ref.value = true);}function OwnerID(){}function arrCopy(arr, offset){offset = offset || 0;var len=Math.max(0, arr.length - offset);var newArr=new Array(len);for(var ii=0; ii < len; ii++) {newArr[ii] = arr[ii + offset];}return newArr;}function ensureSize(iter){if(iter.size === undefined){iter.size = iter.__iterate(returnTrue);}return iter.size;}function wrapIndex(iter, index){return index >= 0?+index:ensureSize(iter) + +index;}function returnTrue(){return true;}function wholeSlice(begin, end, size){return (begin === 0 || size !== undefined && begin <= -size) && (end === undefined || size !== undefined && end >= size);}function resolveBegin(begin, size){return resolveIndex(begin, size, 0);}function resolveEnd(end, size){return resolveIndex(end, size, size);}function resolveIndex(index, size, defaultIndex){return index === undefined?defaultIndex:index < 0?Math.max(0, size + index):size === undefined?index:Math.min(size, index);}function Iterable(value){return isIterable(value)?value:Seq(value);}createClass(KeyedIterable, Iterable);function KeyedIterable(value){return isKeyed(value)?value:KeyedSeq(value);}createClass(IndexedIterable, Iterable);function IndexedIterable(value){return isIndexed(value)?value:IndexedSeq(value);}createClass(SetIterable, Iterable);function SetIterable(value){return isIterable(value) && !isAssociative(value)?value:SetSeq(value);}function isIterable(maybeIterable){return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);}function isKeyed(maybeKeyed){return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);}function isIndexed(maybeIndexed){return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);}function isAssociative(maybeAssociative){return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);}function isOrdered(maybeOrdered){return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);}Iterable.isIterable = isIterable;Iterable.isKeyed = isKeyed;Iterable.isIndexed = isIndexed;Iterable.isAssociative = isAssociative;Iterable.isOrdered = isOrdered;Iterable.Keyed = KeyedIterable;Iterable.Indexed = IndexedIterable;Iterable.Set = SetIterable;var IS_ITERABLE_SENTINEL="@@__IMMUTABLE_ITERABLE__@@";var IS_KEYED_SENTINEL="@@__IMMUTABLE_KEYED__@@";var IS_INDEXED_SENTINEL="@@__IMMUTABLE_INDEXED__@@";var IS_ORDERED_SENTINEL="@@__IMMUTABLE_ORDERED__@@";var ITERATE_KEYS=0;var ITERATE_VALUES=1;var ITERATE_ENTRIES=2;var REAL_ITERATOR_SYMBOL=typeof Symbol === "function" && Symbol.iterator;var FAUX_ITERATOR_SYMBOL="@@iterator";var ITERATOR_SYMBOL=REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;function src_Iterator__Iterator(next){this.next = next;}src_Iterator__Iterator.prototype.toString = function(){return "[Iterator]";};src_Iterator__Iterator.KEYS = ITERATE_KEYS;src_Iterator__Iterator.VALUES = ITERATE_VALUES;src_Iterator__Iterator.ENTRIES = ITERATE_ENTRIES;src_Iterator__Iterator.prototype.inspect = src_Iterator__Iterator.prototype.toSource = function(){return this.toString();};src_Iterator__Iterator.prototype[ITERATOR_SYMBOL] = function(){return this;};function iteratorValue(type, k, v, iteratorResult){var value=type === 0?k:type === 1?v:[k, v];iteratorResult?iteratorResult.value = value:iteratorResult = {value:value, done:false};return iteratorResult;}function iteratorDone(){return {value:undefined, done:true};}function hasIterator(maybeIterable){return !!getIteratorFn(maybeIterable);}function isIterator(maybeIterator){return maybeIterator && typeof maybeIterator.next === "function";}function getIterator(iterable){var iteratorFn=getIteratorFn(iterable);return iteratorFn && iteratorFn.call(iterable);}function getIteratorFn(iterable){var iteratorFn=iterable && (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL] || iterable[FAUX_ITERATOR_SYMBOL]);if(typeof iteratorFn === "function"){return iteratorFn;}}function isArrayLike(value){return value && typeof value.length === "number";}createClass(Seq, Iterable);function Seq(value){return value === null || value === undefined?emptySequence():isIterable(value)?value.toSeq():seqFromValue(value);}Seq.of = function(){return Seq(arguments);};Seq.prototype.toSeq = function(){return this;};Seq.prototype.toString = function(){return this.__toString("Seq {", "}");};Seq.prototype.cacheResult = function(){if(!this._cache && this.__iterateUncached){this._cache = this.entrySeq().toArray();this.size = this._cache.length;}return this;};Seq.prototype.__iterate = function(fn, reverse){return seqIterate(this, fn, reverse, true);};Seq.prototype.__iterator = function(type, reverse){return seqIterator(this, type, reverse, true);};createClass(KeyedSeq, Seq);function KeyedSeq(value){return value === null || value === undefined?emptySequence().toKeyedSeq():isIterable(value)?isKeyed(value)?value.toSeq():value.fromEntrySeq():keyedSeqFromValue(value);}KeyedSeq.prototype.toKeyedSeq = function(){return this;};createClass(IndexedSeq, Seq);function IndexedSeq(value){return value === null || value === undefined?emptySequence():!isIterable(value)?indexedSeqFromValue(value):isKeyed(value)?value.entrySeq():value.toIndexedSeq();}IndexedSeq.of = function(){return IndexedSeq(arguments);};IndexedSeq.prototype.toIndexedSeq = function(){return this;};IndexedSeq.prototype.toString = function(){return this.__toString("Seq [", "]");};IndexedSeq.prototype.__iterate = function(fn, reverse){return seqIterate(this, fn, reverse, false);};IndexedSeq.prototype.__iterator = function(type, reverse){return seqIterator(this, type, reverse, false);};createClass(SetSeq, Seq);function SetSeq(value){return (value === null || value === undefined?emptySequence():!isIterable(value)?indexedSeqFromValue(value):isKeyed(value)?value.entrySeq():value).toSetSeq();}SetSeq.of = function(){return SetSeq(arguments);};SetSeq.prototype.toSetSeq = function(){return this;};Seq.isSeq = isSeq;Seq.Keyed = KeyedSeq;Seq.Set = SetSeq;Seq.Indexed = IndexedSeq;var IS_SEQ_SENTINEL="@@__IMMUTABLE_SEQ__@@";Seq.prototype[IS_SEQ_SENTINEL] = true;createClass(ArraySeq, IndexedSeq);function ArraySeq(array){this._array = array;this.size = array.length;}ArraySeq.prototype.get = function(index, notSetValue){return this.has(index)?this._array[wrapIndex(this, index)]:notSetValue;};ArraySeq.prototype.__iterate = function(fn, reverse){var array=this._array;var maxIndex=array.length - 1;for(var ii=0; ii <= maxIndex; ii++) {if(fn(array[reverse?maxIndex - ii:ii], ii, this) === false){return ii + 1;}}return ii;};ArraySeq.prototype.__iterator = function(type, reverse){var array=this._array;var maxIndex=array.length - 1;var ii=0;return new src_Iterator__Iterator(function(){return ii > maxIndex?iteratorDone():iteratorValue(type, ii, array[reverse?maxIndex - ii++:ii++]);});};createClass(ObjectSeq, KeyedSeq);function ObjectSeq(object){var keys=Object.keys(object);this._object = object;this._keys = keys;this.size = keys.length;}ObjectSeq.prototype.get = function(key, notSetValue){if(notSetValue !== undefined && !this.has(key)){return notSetValue;}return this._object[key];};ObjectSeq.prototype.has = function(key){return this._object.hasOwnProperty(key);};ObjectSeq.prototype.__iterate = function(fn, reverse){var object=this._object;var keys=this._keys;var maxIndex=keys.length - 1;for(var ii=0; ii <= maxIndex; ii++) {var key=keys[reverse?maxIndex - ii:ii];if(fn(object[key], key, this) === false){return ii + 1;}}return ii;};ObjectSeq.prototype.__iterator = function(type, reverse){var object=this._object;var keys=this._keys;var maxIndex=keys.length - 1;var ii=0;return new src_Iterator__Iterator(function(){var key=keys[reverse?maxIndex - ii:ii];return ii++ > maxIndex?iteratorDone():iteratorValue(type, key, object[key]);});};ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;createClass(IterableSeq, IndexedSeq);function IterableSeq(iterable){this._iterable = iterable;this.size = iterable.length || iterable.size;}IterableSeq.prototype.__iterateUncached = function(fn, reverse){if(reverse){return this.cacheResult().__iterate(fn, reverse);}var iterable=this._iterable;var iterator=getIterator(iterable);var iterations=0;if(isIterator(iterator)){var step;while(!(step = iterator.next()).done) {if(fn(step.value, iterations++, this) === false){break;}}}return iterations;};IterableSeq.prototype.__iteratorUncached = function(type, reverse){if(reverse){return this.cacheResult().__iterator(type, reverse);}var iterable=this._iterable;var iterator=getIterator(iterable);if(!isIterator(iterator)){return new src_Iterator__Iterator(iteratorDone);}var iterations=0;return new src_Iterator__Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type, iterations++, step.value);});};createClass(IteratorSeq, IndexedSeq);function IteratorSeq(iterator){this._iterator = iterator;this._iteratorCache = [];}IteratorSeq.prototype.__iterateUncached = function(fn, reverse){if(reverse){return this.cacheResult().__iterate(fn, reverse);}var iterator=this._iterator;var cache=this._iteratorCache;var iterations=0;while(iterations < cache.length) {if(fn(cache[iterations], iterations++, this) === false){return iterations;}}var step;while(!(step = iterator.next()).done) {var val=step.value;cache[iterations] = val;if(fn(val, iterations++, this) === false){break;}}return iterations;};IteratorSeq.prototype.__iteratorUncached = function(type, reverse){if(reverse){return this.cacheResult().__iterator(type, reverse);}var iterator=this._iterator;var cache=this._iteratorCache;var iterations=0;return new src_Iterator__Iterator(function(){if(iterations >= cache.length){var step=iterator.next();if(step.done){return step;}cache[iterations] = step.value;}return iteratorValue(type, iterations, cache[iterations++]);});};function isSeq(maybeSeq){return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);}var EMPTY_SEQ;function emptySequence(){return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));}function keyedSeqFromValue(value){var seq=Array.isArray(value)?new ArraySeq(value).fromEntrySeq():isIterator(value)?new IteratorSeq(value).fromEntrySeq():hasIterator(value)?new IterableSeq(value).fromEntrySeq():typeof value === "object"?new ObjectSeq(value):undefined;if(!seq){throw new TypeError("Expected Array or iterable object of [k, v] entries, " + "or keyed object: " + value);}return seq;}function indexedSeqFromValue(value){var seq=maybeIndexedSeqFromValue(value);if(!seq){throw new TypeError("Expected Array or iterable object of values: " + value);}return seq;}function seqFromValue(value){var seq=maybeIndexedSeqFromValue(value) || typeof value === "object" && new ObjectSeq(value);if(!seq){throw new TypeError("Expected Array or iterable object of values, or keyed object: " + value);}return seq;}function maybeIndexedSeqFromValue(value){return isArrayLike(value)?new ArraySeq(value):isIterator(value)?new IteratorSeq(value):hasIterator(value)?new IterableSeq(value):undefined;}function seqIterate(seq, fn, reverse, useKeys){var cache=seq._cache;if(cache){var maxIndex=cache.length - 1;for(var ii=0; ii <= maxIndex; ii++) {var entry=cache[reverse?maxIndex - ii:ii];if(fn(entry[1], useKeys?entry[0]:ii, seq) === false){return ii + 1;}}return ii;}return seq.__iterateUncached(fn, reverse);}function seqIterator(seq, type, reverse, useKeys){var cache=seq._cache;if(cache){var maxIndex=cache.length - 1;var ii=0;return new src_Iterator__Iterator(function(){var entry=cache[reverse?maxIndex - ii:ii];return ii++ > maxIndex?iteratorDone():iteratorValue(type, useKeys?entry[0]:ii - 1, entry[1]);});}return seq.__iteratorUncached(type, reverse);}createClass(Collection, Iterable);function Collection(){throw TypeError("Abstract");}createClass(KeyedCollection, Collection);function KeyedCollection(){}createClass(IndexedCollection, Collection);function IndexedCollection(){}createClass(SetCollection, Collection);function SetCollection(){}Collection.Keyed = KeyedCollection;Collection.Indexed = IndexedCollection;Collection.Set = SetCollection;function is(valueA, valueB){if(valueA === valueB || valueA !== valueA && valueB !== valueB){return true;}if(!valueA || !valueB){return false;}if(typeof valueA.valueOf === "function" && typeof valueB.valueOf === "function"){valueA = valueA.valueOf();valueB = valueB.valueOf();if(valueA === valueB || valueA !== valueA && valueB !== valueB){return true;}if(!valueA || !valueB){return false;}}if(typeof valueA.equals === "function" && typeof valueB.equals === "function" && valueA.equals(valueB)){return true;}return false;}function fromJS(json, converter){return converter?fromJSWith(converter, json, "", {"":json}):fromJSDefault(json);}function fromJSWith(converter, json, key, parentJSON){if(Array.isArray(json)){return converter.call(parentJSON, key, IndexedSeq(json).map(function(v, k){return fromJSWith(converter, v, k, json);}));}if(isPlainObj(json)){return converter.call(parentJSON, key, KeyedSeq(json).map(function(v, k){return fromJSWith(converter, v, k, json);}));}return json;}function fromJSDefault(json){if(Array.isArray(json)){return IndexedSeq(json).map(fromJSDefault).toList();}if(isPlainObj(json)){return KeyedSeq(json).map(fromJSDefault).toMap();}return json;}function isPlainObj(value){return value && (value.constructor === Object || value.constructor === undefined);}var src_Math__imul=typeof Math.imul === "function" && Math.imul(4294967295, 2) === -2?Math.imul:function imul(a, b){a = a | 0;b = b | 0;var c=a & 65535;var d=b & 65535;return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16 >>> 0) | 0;};function smi(i32){return i32 >>> 1 & 1073741824 | i32 & 3221225471;}function hash(o){if(o === false || o === null || o === undefined){return 0;}if(typeof o.valueOf === "function"){o = o.valueOf();if(o === false || o === null || o === undefined){return 0;}}if(o === true){return 1;}var type=typeof o;if(type === "number"){var h=o | 0;if(h !== o){h ^= o * 4294967295;}while(o > 4294967295) {o /= 4294967295;h ^= o;}return smi(h);}if(type === "string"){return o.length > STRING_HASH_CACHE_MIN_STRLEN?cachedHashString(o):hashString(o);}if(typeof o.hashCode === "function"){return o.hashCode();}return hashJSObj(o);}function cachedHashString(string){var hash=stringHashCache[string];if(hash === undefined){hash = hashString(string);if(STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE){STRING_HASH_CACHE_SIZE = 0;stringHashCache = {};}STRING_HASH_CACHE_SIZE++;stringHashCache[string] = hash;}return hash;}function hashString(string){var hash=0;for(var ii=0; ii < string.length; ii++) {hash = 31 * hash + string.charCodeAt(ii) | 0;}return smi(hash);}function hashJSObj(obj){var hash;if(usingWeakMap){hash = weakMap.get(obj);if(hash !== undefined){return hash;}}hash = obj[UID_HASH_KEY];if(hash !== undefined){return hash;}if(!canDefineProperty){hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];if(hash !== undefined){return hash;}hash = getIENodeHash(obj);if(hash !== undefined){return hash;}}hash = ++objHashUID;if(objHashUID & 1073741824){objHashUID = 0;}if(usingWeakMap){weakMap.set(obj, hash);}else if(isExtensible !== undefined && isExtensible(obj) === false){throw new Error("Non-extensible objects are not allowed as keys.");}else if(canDefineProperty){Object.defineProperty(obj, UID_HASH_KEY, {enumerable:false, configurable:false, writable:false, value:hash});}else if(obj.propertyIsEnumerable !== undefined && obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable){obj.propertyIsEnumerable = function(){return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);};obj.propertyIsEnumerable[UID_HASH_KEY] = hash;}else if(obj.nodeType !== undefined){obj[UID_HASH_KEY] = hash;}else {throw new Error("Unable to set a non-enumerable property on object.");}return hash;}var isExtensible=Object.isExtensible;var canDefineProperty=(function(){try{Object.defineProperty({}, "@", {});return true;}catch(e) {return false;}})();function getIENodeHash(node){if(node && node.nodeType > 0){switch(node.nodeType){case 1:return node.uniqueID;case 9:return node.documentElement && node.documentElement.uniqueID;}}}var usingWeakMap=typeof WeakMap === "function";var weakMap;if(usingWeakMap){weakMap = new WeakMap();}var objHashUID=0;var UID_HASH_KEY="__immutablehash__";if(typeof Symbol === "function"){UID_HASH_KEY = Symbol(UID_HASH_KEY);}var STRING_HASH_CACHE_MIN_STRLEN=16;var STRING_HASH_CACHE_MAX_SIZE=255;var STRING_HASH_CACHE_SIZE=0;var stringHashCache={};function invariant(condition, error){if(!condition)throw new Error(error);}function assertNotInfinite(size){invariant(size !== Infinity, "Cannot perform this action with an infinite size.");}createClass(ToKeyedSequence, KeyedSeq);function ToKeyedSequence(indexed, useKeys){this._iter = indexed;this._useKeys = useKeys;this.size = indexed.size;}ToKeyedSequence.prototype.get = function(key, notSetValue){return this._iter.get(key, notSetValue);};ToKeyedSequence.prototype.has = function(key){return this._iter.has(key);};ToKeyedSequence.prototype.valueSeq = function(){return this._iter.valueSeq();};ToKeyedSequence.prototype.reverse = function(){var this$0=this;var reversedSequence=reverseFactory(this, true);if(!this._useKeys){reversedSequence.valueSeq = function(){return this$0._iter.toSeq().reverse();};}return reversedSequence;};ToKeyedSequence.prototype.map = function(mapper, context){var this$0=this;var mappedSequence=mapFactory(this, mapper, context);if(!this._useKeys){mappedSequence.valueSeq = function(){return this$0._iter.toSeq().map(mapper, context);};}return mappedSequence;};ToKeyedSequence.prototype.__iterate = function(fn, reverse){var this$0=this;var ii;return this._iter.__iterate(this._useKeys?function(v, k){return fn(v, k, this$0);}:(ii = reverse?resolveSize(this):0, function(v){return fn(v, reverse?--ii:ii++, this$0);}), reverse);};ToKeyedSequence.prototype.__iterator = function(type, reverse){if(this._useKeys){return this._iter.__iterator(type, reverse);}var iterator=this._iter.__iterator(ITERATE_VALUES, reverse);var ii=reverse?resolveSize(this):0;return new src_Iterator__Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type, reverse?--ii:ii++, step.value, step);});};ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;createClass(ToIndexedSequence, IndexedSeq);function ToIndexedSequence(iter){this._iter = iter;this.size = iter.size;}ToIndexedSequence.prototype.includes = function(value){return this._iter.includes(value);};ToIndexedSequence.prototype.__iterate = function(fn, reverse){var this$0=this;var iterations=0;return this._iter.__iterate(function(v){return fn(v, iterations++, this$0);}, reverse);};ToIndexedSequence.prototype.__iterator = function(type, reverse){var iterator=this._iter.__iterator(ITERATE_VALUES, reverse);var iterations=0;return new src_Iterator__Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type, iterations++, step.value, step);});};createClass(ToSetSequence, SetSeq);function ToSetSequence(iter){this._iter = iter;this.size = iter.size;}ToSetSequence.prototype.has = function(key){return this._iter.includes(key);};ToSetSequence.prototype.__iterate = function(fn, reverse){var this$0=this;return this._iter.__iterate(function(v){return fn(v, v, this$0);}, reverse);};ToSetSequence.prototype.__iterator = function(type, reverse){var iterator=this._iter.__iterator(ITERATE_VALUES, reverse);return new src_Iterator__Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type, step.value, step.value, step);});};createClass(FromEntriesSequence, KeyedSeq);function FromEntriesSequence(entries){this._iter = entries;this.size = entries.size;}FromEntriesSequence.prototype.entrySeq = function(){return this._iter.toSeq();};FromEntriesSequence.prototype.__iterate = function(fn, reverse){var this$0=this;return this._iter.__iterate(function(entry){if(entry){validateEntry(entry);var indexedIterable=isIterable(entry);return fn(indexedIterable?entry.get(1):entry[1], indexedIterable?entry.get(0):entry[0], this$0);}}, reverse);};FromEntriesSequence.prototype.__iterator = function(type, reverse){var iterator=this._iter.__iterator(ITERATE_VALUES, reverse);return new src_Iterator__Iterator(function(){while(true) {var step=iterator.next();if(step.done){return step;}var entry=step.value;if(entry){validateEntry(entry);var indexedIterable=isIterable(entry);return iteratorValue(type, indexedIterable?entry.get(0):entry[0], indexedIterable?entry.get(1):entry[1], step);}}});};ToIndexedSequence.prototype.cacheResult = ToKeyedSequence.prototype.cacheResult = ToSetSequence.prototype.cacheResult = FromEntriesSequence.prototype.cacheResult = cacheResultThrough;function flipFactory(iterable){var flipSequence=makeSequence(iterable);flipSequence._iter = iterable;flipSequence.size = iterable.size;flipSequence.flip = function(){return iterable;};flipSequence.reverse = function(){var reversedSequence=iterable.reverse.apply(this);reversedSequence.flip = function(){return iterable.reverse();};return reversedSequence;};flipSequence.has = function(key){return iterable.includes(key);};flipSequence.includes = function(key){return iterable.has(key);};flipSequence.cacheResult = cacheResultThrough;flipSequence.__iterateUncached = function(fn, reverse){var this$0=this;return iterable.__iterate(function(v, k){return fn(k, v, this$0) !== false;}, reverse);};flipSequence.__iteratorUncached = function(type, reverse){if(type === ITERATE_ENTRIES){var iterator=iterable.__iterator(type, reverse);return new src_Iterator__Iterator(function(){var step=iterator.next();if(!step.done){var k=step.value[0];step.value[0] = step.value[1];step.value[1] = k;}return step;});}return iterable.__iterator(type === ITERATE_VALUES?ITERATE_KEYS:ITERATE_VALUES, reverse);};return flipSequence;}function mapFactory(iterable, mapper, context){var mappedSequence=makeSequence(iterable);mappedSequence.size = iterable.size;mappedSequence.has = function(key){return iterable.has(key);};mappedSequence.get = function(key, notSetValue){var v=iterable.get(key, NOT_SET);return v === NOT_SET?notSetValue:mapper.call(context, v, key, iterable);};mappedSequence.__iterateUncached = function(fn, reverse){var this$0=this;return iterable.__iterate(function(v, k, c){return fn(mapper.call(context, v, k, c), k, this$0) !== false;}, reverse);};mappedSequence.__iteratorUncached = function(type, reverse){var iterator=iterable.__iterator(ITERATE_ENTRIES, reverse);return new src_Iterator__Iterator(function(){var step=iterator.next();if(step.done){return step;}var entry=step.value;var key=entry[0];return iteratorValue(type, key, mapper.call(context, entry[1], key, iterable), step);});};return mappedSequence;}function reverseFactory(iterable, useKeys){var reversedSequence=makeSequence(iterable);reversedSequence._iter = iterable;reversedSequence.size = iterable.size;reversedSequence.reverse = function(){return iterable;};if(iterable.flip){reversedSequence.flip = function(){var flipSequence=flipFactory(iterable);flipSequence.reverse = function(){return iterable.flip();};return flipSequence;};}reversedSequence.get = function(key, notSetValue){return iterable.get(useKeys?key:-1 - key, notSetValue);};reversedSequence.has = function(key){return iterable.has(useKeys?key:-1 - key);};reversedSequence.includes = function(value){return iterable.includes(value);};reversedSequence.cacheResult = cacheResultThrough;reversedSequence.__iterate = function(fn, reverse){var this$0=this;return iterable.__iterate(function(v, k){return fn(v, k, this$0);}, !reverse);};reversedSequence.__iterator = function(type, reverse){return iterable.__iterator(type, !reverse);};return reversedSequence;}function filterFactory(iterable, predicate, context, useKeys){var filterSequence=makeSequence(iterable);if(useKeys){filterSequence.has = function(key){var v=iterable.get(key, NOT_SET);return v !== NOT_SET && !!predicate.call(context, v, key, iterable);};filterSequence.get = function(key, notSetValue){var v=iterable.get(key, NOT_SET);return v !== NOT_SET && predicate.call(context, v, key, iterable)?v:notSetValue;};}filterSequence.__iterateUncached = function(fn, reverse){var this$0=this;var iterations=0;iterable.__iterate(function(v, k, c){if(predicate.call(context, v, k, c)){iterations++;return fn(v, useKeys?k:iterations - 1, this$0);}}, reverse);return iterations;};filterSequence.__iteratorUncached = function(type, reverse){var iterator=iterable.__iterator(ITERATE_ENTRIES, reverse);var iterations=0;return new src_Iterator__Iterator(function(){while(true) {var step=iterator.next();if(step.done){return step;}var entry=step.value;var key=entry[0];var value=entry[1];if(predicate.call(context, value, key, iterable)){return iteratorValue(type, useKeys?key:iterations++, value, step);}}});};return filterSequence;}function countByFactory(iterable, grouper, context){var groups=src_Map__Map().asMutable();iterable.__iterate(function(v, k){groups.update(grouper.call(context, v, k, iterable), 0, function(a){return a + 1;});});return groups.asImmutable();}function groupByFactory(iterable, grouper, context){var isKeyedIter=isKeyed(iterable);var groups=(isOrdered(iterable)?OrderedMap():src_Map__Map()).asMutable();iterable.__iterate(function(v, k){groups.update(grouper.call(context, v, k, iterable), function(a){return (a = a || [], a.push(isKeyedIter?[k, v]:v), a);});});var coerce=iterableClass(iterable);return groups.map(function(arr){return reify(iterable, coerce(arr));});}function sliceFactory(_x, _x2, _x3, _x4){var _again=true;_function: while(_again) {_again = false;var iterable=_x, begin=_x2, end=_x3, useKeys=_x4;originalSize = resolvedBegin = resolvedEnd = resolvedSize = sliceSize = sliceSeq = undefined;var originalSize=iterable.size;if(wholeSlice(begin, end, originalSize)){return iterable;}var resolvedBegin=resolveBegin(begin, originalSize);var resolvedEnd=resolveEnd(end, originalSize);if(resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd){_x = iterable.toSeq().cacheResult();_x2 = begin;_x3 = end;_x4 = useKeys;_again = true;continue _function;}var resolvedSize=resolvedEnd - resolvedBegin;var sliceSize;if(resolvedSize === resolvedSize){sliceSize = resolvedSize < 0?0:resolvedSize;}var sliceSeq=makeSequence(iterable);sliceSeq.size = sliceSize;if(!useKeys && isSeq(iterable) && sliceSize >= 0){sliceSeq.get = function(index, notSetValue){index = wrapIndex(this, index);return index >= 0 && index < sliceSize?iterable.get(index + resolvedBegin, notSetValue):notSetValue;};}sliceSeq.__iterateUncached = function(fn, reverse){var this$0=this;if(sliceSize === 0){return 0;}if(reverse){return this.cacheResult().__iterate(fn, reverse);}var skipped=0;var isSkipping=true;var iterations=0;iterable.__iterate(function(v, k){if(!(isSkipping && (isSkipping = skipped++ < resolvedBegin))){iterations++;return fn(v, useKeys?k:iterations - 1, this$0) !== false && iterations !== sliceSize;}});return iterations;};sliceSeq.__iteratorUncached = function(type, reverse){if(sliceSize !== 0 && reverse){return this.cacheResult().__iterator(type, reverse);}var iterator=sliceSize !== 0 && iterable.__iterator(type, reverse);var skipped=0;var iterations=0;return new src_Iterator__Iterator(function(){while(skipped++ < resolvedBegin) {iterator.next();}if(++iterations > sliceSize){return iteratorDone();}var step=iterator.next();if(useKeys || type === ITERATE_VALUES){return step;}else if(type === ITERATE_KEYS){return iteratorValue(type, iterations - 1, undefined, step);}else {return iteratorValue(type, iterations - 1, step.value[1], step);}});};return sliceSeq;}}function takeWhileFactory(iterable, predicate, context){var takeSequence=makeSequence(iterable);takeSequence.__iterateUncached = function(fn, reverse){var this$0=this;if(reverse){return this.cacheResult().__iterate(fn, reverse);}var iterations=0;iterable.__iterate(function(v, k, c){return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$0);});return iterations;};takeSequence.__iteratorUncached = function(type, reverse){var this$0=this;if(reverse){return this.cacheResult().__iterator(type, reverse);}var iterator=iterable.__iterator(ITERATE_ENTRIES, reverse);var iterating=true;return new src_Iterator__Iterator(function(){if(!iterating){return iteratorDone();}var step=iterator.next();if(step.done){return step;}var entry=step.value;var k=entry[0];var v=entry[1];if(!predicate.call(context, v, k, this$0)){iterating = false;return iteratorDone();}return type === ITERATE_ENTRIES?step:iteratorValue(type, k, v, step);});};return takeSequence;}function skipWhileFactory(iterable, predicate, context, useKeys){var skipSequence=makeSequence(iterable);skipSequence.__iterateUncached = function(fn, reverse){var this$0=this;if(reverse){return this.cacheResult().__iterate(fn, reverse);}var isSkipping=true;var iterations=0;iterable.__iterate(function(v, k, c){if(!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))){iterations++;return fn(v, useKeys?k:iterations - 1, this$0);}});return iterations;};skipSequence.__iteratorUncached = function(type, reverse){var this$0=this;if(reverse){return this.cacheResult().__iterator(type, reverse);}var iterator=iterable.__iterator(ITERATE_ENTRIES, reverse);var skipping=true;var iterations=0;return new src_Iterator__Iterator(function(){var step, k, v;do{step = iterator.next();if(step.done){if(useKeys || type === ITERATE_VALUES){return step;}else if(type === ITERATE_KEYS){return iteratorValue(type, iterations++, undefined, step);}else {return iteratorValue(type, iterations++, step.value[1], step);}}var entry=step.value;k = entry[0];v = entry[1];skipping && (skipping = predicate.call(context, v, k, this$0));}while(skipping);return type === ITERATE_ENTRIES?step:iteratorValue(type, k, v, step);});};return skipSequence;}function concatFactory(iterable, values){var isKeyedIterable=isKeyed(iterable);var iters=[iterable].concat(values).map(function(v){if(!isIterable(v)){v = isKeyedIterable?keyedSeqFromValue(v):indexedSeqFromValue(Array.isArray(v)?v:[v]);}else if(isKeyedIterable){v = KeyedIterable(v);}return v;}).filter(function(v){return v.size !== 0;});if(iters.length === 0){return iterable;}if(iters.length === 1){var singleton=iters[0];if(singleton === iterable || isKeyedIterable && isKeyed(singleton) || isIndexed(iterable) && isIndexed(singleton)){return singleton;}}var concatSeq=new ArraySeq(iters);if(isKeyedIterable){concatSeq = concatSeq.toKeyedSeq();}else if(!isIndexed(iterable)){concatSeq = concatSeq.toSetSeq();}concatSeq = concatSeq.flatten(true);concatSeq.size = iters.reduce(function(sum, seq){if(sum !== undefined){var size=seq.size;if(size !== undefined){return sum + size;}}}, 0);return concatSeq;}function flattenFactory(iterable, depth, useKeys){var flatSequence=makeSequence(iterable);flatSequence.__iterateUncached = function(fn, reverse){var iterations=0;var stopped=false;function flatDeep(iter, currentDepth){var this$0=this;iter.__iterate(function(v, k){if((!depth || currentDepth < depth) && isIterable(v)){flatDeep(v, currentDepth + 1);}else if(fn(v, useKeys?k:iterations++, this$0) === false){stopped = true;}return !stopped;}, reverse);}flatDeep(iterable, 0);return iterations;};flatSequence.__iteratorUncached = function(type, reverse){var iterator=iterable.__iterator(type, reverse);var stack=[];var iterations=0;return new src_Iterator__Iterator(function(){while(iterator) {var step=iterator.next();if(step.done !== false){iterator = stack.pop();continue;}var v=step.value;if(type === ITERATE_ENTRIES){v = v[1];}if((!depth || stack.length < depth) && isIterable(v)){stack.push(iterator);iterator = v.__iterator(type, reverse);}else {return useKeys?step:iteratorValue(type, iterations++, v, step);}}return iteratorDone();});};return flatSequence;}function flatMapFactory(iterable, mapper, context){var coerce=iterableClass(iterable);return iterable.toSeq().map(function(v, k){return coerce(mapper.call(context, v, k, iterable));}).flatten(true);}function interposeFactory(iterable, separator){var interposedSequence=makeSequence(iterable);interposedSequence.size = iterable.size && iterable.size * 2 - 1;interposedSequence.__iterateUncached = function(fn, reverse){var this$0=this;var iterations=0;iterable.__iterate(function(v, k){return (!iterations || fn(separator, iterations++, this$0) !== false) && fn(v, iterations++, this$0) !== false;}, reverse);return iterations;};interposedSequence.__iteratorUncached = function(type, reverse){var iterator=iterable.__iterator(ITERATE_VALUES, reverse);var iterations=0;var step;return new src_Iterator__Iterator(function(){if(!step || iterations % 2){step = iterator.next();if(step.done){return step;}}return iterations % 2?iteratorValue(type, iterations++, separator):iteratorValue(type, iterations++, step.value, step);});};return interposedSequence;}function sortFactory(iterable, comparator, mapper){if(!comparator){comparator = defaultComparator;}var isKeyedIterable=isKeyed(iterable);var index=0;var entries=iterable.toSeq().map(function(v, k){return [k, v, index++, mapper?mapper(v, k, iterable):v];}).toArray();entries.sort(function(a, b){return comparator(a[3], b[3]) || a[2] - b[2];}).forEach(isKeyedIterable?function(v, i){entries[i].length = 2;}:function(v, i){entries[i] = v[1];});return isKeyedIterable?KeyedSeq(entries):isIndexed(iterable)?IndexedSeq(entries):SetSeq(entries);}function maxFactory(iterable, comparator, mapper){if(!comparator){comparator = defaultComparator;}if(mapper){var entry=iterable.toSeq().map(function(v, k){return [v, mapper(v, k, iterable)];}).reduce(function(a, b){return maxCompare(comparator, a[1], b[1])?b:a;});return entry && entry[0];}else {return iterable.reduce(function(a, b){return maxCompare(comparator, a, b)?b:a;});}}function maxCompare(comparator, a, b){var comp=comparator(b, a);return comp === 0 && b !== a && (b === undefined || b === null || b !== b) || comp > 0;}function zipWithFactory(keyIter, zipper, iters){var zipSequence=makeSequence(keyIter);zipSequence.size = new ArraySeq(iters).map(function(i){return i.size;}).min();zipSequence.__iterate = function(fn, reverse){var iterator=this.__iterator(ITERATE_VALUES, reverse);var step;var iterations=0;while(!(step = iterator.next()).done) {if(fn(step.value, iterations++, this) === false){break;}}return iterations;};zipSequence.__iteratorUncached = function(type, reverse){var iterators=iters.map(function(i){return (i = Iterable(i), getIterator(reverse?i.reverse():i));});var iterations=0;var isDone=false;return new src_Iterator__Iterator(function(){var steps;if(!isDone){steps = iterators.map(function(i){return i.next();});isDone = steps.some(function(s){return s.done;});}if(isDone){return iteratorDone();}return iteratorValue(type, iterations++, zipper.apply(null, steps.map(function(s){return s.value;})));});};return zipSequence;}function reify(iter, seq){return isSeq(iter)?seq:iter.constructor(seq);}function validateEntry(entry){if(entry !== Object(entry)){throw new TypeError("Expected [K, V] tuple: " + entry);}}function resolveSize(iter){assertNotInfinite(iter.size);return ensureSize(iter);}function iterableClass(iterable){return isKeyed(iterable)?KeyedIterable:isIndexed(iterable)?IndexedIterable:SetIterable;}function makeSequence(iterable){return Object.create((isKeyed(iterable)?KeyedSeq:isIndexed(iterable)?IndexedSeq:SetSeq).prototype);}function cacheResultThrough(){if(this._iter.cacheResult){this._iter.cacheResult();this.size = this._iter.size;return this;}else {return Seq.prototype.cacheResult.call(this);}}function defaultComparator(a, b){return a > b?1:a < b?-1:0;}function forceIterator(keyPath){var iter=getIterator(keyPath);if(!iter){if(!isArrayLike(keyPath)){throw new TypeError("Expected iterable or array-like: " + keyPath);}iter = getIterator(Iterable(keyPath));}return iter;}createClass(src_Map__Map, KeyedCollection);function src_Map__Map(value){return value === null || value === undefined?emptyMap():isMap(value)?value:emptyMap().withMutations(function(map){var iter=KeyedIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v, k){return map.set(k, v);});});}src_Map__Map.prototype.toString = function(){return this.__toString("Map {", "}");};src_Map__Map.prototype.get = function(k, notSetValue){return this._root?this._root.get(0, undefined, k, notSetValue):notSetValue;};src_Map__Map.prototype.set = function(k, v){return updateMap(this, k, v);};src_Map__Map.prototype.setIn = function(keyPath, v){return this.updateIn(keyPath, NOT_SET, function(){return v;});};src_Map__Map.prototype.remove = function(k){return updateMap(this, k, NOT_SET);};src_Map__Map.prototype.deleteIn = function(keyPath){return this.updateIn(keyPath, function(){return NOT_SET;});};src_Map__Map.prototype.update = function(k, notSetValue, updater){return arguments.length === 1?k(this):this.updateIn([k], notSetValue, updater);};src_Map__Map.prototype.updateIn = function(keyPath, notSetValue, updater){if(!updater){updater = notSetValue;notSetValue = undefined;}var updatedValue=updateInDeepMap(this, forceIterator(keyPath), notSetValue, updater);return updatedValue === NOT_SET?undefined:updatedValue;};src_Map__Map.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = 0;this._root = null;this.__hash = undefined;this.__altered = true;return this;}return emptyMap();};src_Map__Map.prototype.merge = function(){return mergeIntoMapWith(this, undefined, arguments);};src_Map__Map.prototype.mergeWith = function(merger){var iters=SLICE$0.call(arguments, 1);return mergeIntoMapWith(this, merger, iters);};src_Map__Map.prototype.mergeIn = function(keyPath){var iters=SLICE$0.call(arguments, 1);return this.updateIn(keyPath, emptyMap(), function(m){return typeof m.merge === "function"?m.merge.apply(m, iters):iters[iters.length - 1];});};src_Map__Map.prototype.mergeDeep = function(){return mergeIntoMapWith(this, deepMerger(undefined), arguments);};src_Map__Map.prototype.mergeDeepWith = function(merger){var iters=SLICE$0.call(arguments, 1);return mergeIntoMapWith(this, deepMerger(merger), iters);};src_Map__Map.prototype.mergeDeepIn = function(keyPath){var iters=SLICE$0.call(arguments, 1);return this.updateIn(keyPath, emptyMap(), function(m){return typeof m.mergeDeep === "function"?m.mergeDeep.apply(m, iters):iters[iters.length - 1];});};src_Map__Map.prototype.sort = function(comparator){return OrderedMap(sortFactory(this, comparator));};src_Map__Map.prototype.sortBy = function(mapper, comparator){return OrderedMap(sortFactory(this, comparator, mapper));};src_Map__Map.prototype.withMutations = function(fn){var mutable=this.asMutable();fn(mutable);return mutable.wasAltered()?mutable.__ensureOwner(this.__ownerID):this;};src_Map__Map.prototype.asMutable = function(){return this.__ownerID?this:this.__ensureOwner(new OwnerID());};src_Map__Map.prototype.asImmutable = function(){return this.__ensureOwner();};src_Map__Map.prototype.wasAltered = function(){return this.__altered;};src_Map__Map.prototype.__iterator = function(type, reverse){return new MapIterator(this, type, reverse);};src_Map__Map.prototype.__iterate = function(fn, reverse){var this$0=this;var iterations=0;this._root && this._root.iterate(function(entry){iterations++;return fn(entry[1], entry[0], this$0);}, reverse);return iterations;};src_Map__Map.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}if(!ownerID){this.__ownerID = ownerID;this.__altered = false;return this;}return makeMap(this.size, this._root, ownerID, this.__hash);};function isMap(maybeMap){return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);}src_Map__Map.isMap = isMap;var IS_MAP_SENTINEL="@@__IMMUTABLE_MAP__@@";var MapPrototype=src_Map__Map.prototype;MapPrototype[IS_MAP_SENTINEL] = true;MapPrototype[DELETE] = MapPrototype.remove;MapPrototype.removeIn = MapPrototype.deleteIn;function ArrayMapNode(ownerID, entries){this.ownerID = ownerID;this.entries = entries;}ArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue){var entries=this.entries;for(var ii=0, len=entries.length; ii < len; ii++) {if(is(key, entries[ii][0])){return entries[ii][1];}}return notSetValue;};ArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter){var removed=value === NOT_SET;var entries=this.entries;var idx=0;for(var len=entries.length; idx < len; idx++) {if(is(key, entries[idx][0])){break;}}var exists=idx < len;if(exists?entries[idx][1] === value:removed){return this;}SetRef(didAlter);(removed || !exists) && SetRef(didChangeSize);if(removed && entries.length === 1){return;}if(!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE){return createNodes(ownerID, entries, key, value);}var isEditable=ownerID && ownerID === this.ownerID;var newEntries=isEditable?entries:arrCopy(entries);if(exists){if(removed){idx === len - 1?newEntries.pop():newEntries[idx] = newEntries.pop();}else {newEntries[idx] = [key, value];}}else {newEntries.push([key, value]);}if(isEditable){this.entries = newEntries;return this;}return new ArrayMapNode(ownerID, newEntries);};function BitmapIndexedNode(ownerID, bitmap, nodes){this.ownerID = ownerID;this.bitmap = bitmap;this.nodes = nodes;}BitmapIndexedNode.prototype.get = function(shift, keyHash, key, notSetValue){if(keyHash === undefined){keyHash = hash(key);}var bit=1 << ((shift === 0?keyHash:keyHash >>> shift) & MASK);var bitmap=this.bitmap;return (bitmap & bit) === 0?notSetValue:this.nodes[popCount(bitmap & bit - 1)].get(shift + SHIFT, keyHash, key, notSetValue);};BitmapIndexedNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter){if(keyHash === undefined){keyHash = hash(key);}var keyHashFrag=(shift === 0?keyHash:keyHash >>> shift) & MASK;var bit=1 << keyHashFrag;var bitmap=this.bitmap;var exists=(bitmap & bit) !== 0;if(!exists && value === NOT_SET){return this;}var idx=popCount(bitmap & bit - 1);var nodes=this.nodes;var node=exists?nodes[idx]:undefined;var newNode=updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);if(newNode === node){return this;}if(!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE){return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);}if(exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])){return nodes[idx ^ 1];}if(exists && newNode && nodes.length === 1 && isLeafNode(newNode)){return newNode;}var isEditable=ownerID && ownerID === this.ownerID;var newBitmap=exists?newNode?bitmap:bitmap ^ bit:bitmap | bit;var newNodes=exists?newNode?setIn(nodes, idx, newNode, isEditable):spliceOut(nodes, idx, isEditable):spliceIn(nodes, idx, newNode, isEditable);if(isEditable){this.bitmap = newBitmap;this.nodes = newNodes;return this;}return new BitmapIndexedNode(ownerID, newBitmap, newNodes);};function HashArrayMapNode(ownerID, count, nodes){this.ownerID = ownerID;this.count = count;this.nodes = nodes;}HashArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue){if(keyHash === undefined){keyHash = hash(key);}var idx=(shift === 0?keyHash:keyHash >>> shift) & MASK;var node=this.nodes[idx];return node?node.get(shift + SHIFT, keyHash, key, notSetValue):notSetValue;};HashArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter){if(keyHash === undefined){keyHash = hash(key);}var idx=(shift === 0?keyHash:keyHash >>> shift) & MASK;var removed=value === NOT_SET;var nodes=this.nodes;var node=nodes[idx];if(removed && !node){return this;}var newNode=updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);if(newNode === node){return this;}var newCount=this.count;if(!node){newCount++;}else if(!newNode){newCount--;if(newCount < MIN_HASH_ARRAY_MAP_SIZE){return packNodes(ownerID, nodes, newCount, idx);}}var isEditable=ownerID && ownerID === this.ownerID;var newNodes=setIn(nodes, idx, newNode, isEditable);if(isEditable){this.count = newCount;this.nodes = newNodes;return this;}return new HashArrayMapNode(ownerID, newCount, newNodes);};function HashCollisionNode(ownerID, keyHash, entries){this.ownerID = ownerID;this.keyHash = keyHash;this.entries = entries;}HashCollisionNode.prototype.get = function(shift, keyHash, key, notSetValue){var entries=this.entries;for(var ii=0, len=entries.length; ii < len; ii++) {if(is(key, entries[ii][0])){return entries[ii][1];}}return notSetValue;};HashCollisionNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter){if(keyHash === undefined){keyHash = hash(key);}var removed=value === NOT_SET;if(keyHash !== this.keyHash){if(removed){return this;}SetRef(didAlter);SetRef(didChangeSize);return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);}var entries=this.entries;var idx=0;for(var len=entries.length; idx < len; idx++) {if(is(key, entries[idx][0])){break;}}var exists=idx < len;if(exists?entries[idx][1] === value:removed){return this;}SetRef(didAlter);(removed || !exists) && SetRef(didChangeSize);if(removed && len === 2){return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);}var isEditable=ownerID && ownerID === this.ownerID;var newEntries=isEditable?entries:arrCopy(entries);if(exists){if(removed){idx === len - 1?newEntries.pop():newEntries[idx] = newEntries.pop();}else {newEntries[idx] = [key, value];}}else {newEntries.push([key, value]);}if(isEditable){this.entries = newEntries;return this;}return new HashCollisionNode(ownerID, this.keyHash, newEntries);};function ValueNode(ownerID, keyHash, entry){this.ownerID = ownerID;this.keyHash = keyHash;this.entry = entry;}ValueNode.prototype.get = function(shift, keyHash, key, notSetValue){return is(key, this.entry[0])?this.entry[1]:notSetValue;};ValueNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter){var removed=value === NOT_SET;var keyMatch=is(key, this.entry[0]);if(keyMatch?value === this.entry[1]:removed){return this;}SetRef(didAlter);if(removed){SetRef(didChangeSize);return;}if(keyMatch){if(ownerID && ownerID === this.ownerID){this.entry[1] = value;return this;}return new ValueNode(ownerID, this.keyHash, [key, value]);}SetRef(didChangeSize);return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);};ArrayMapNode.prototype.iterate = HashCollisionNode.prototype.iterate = function(fn, reverse){var entries=this.entries;for(var ii=0, maxIndex=entries.length - 1; ii <= maxIndex; ii++) {if(fn(entries[reverse?maxIndex - ii:ii]) === false){return false;}}};BitmapIndexedNode.prototype.iterate = HashArrayMapNode.prototype.iterate = function(fn, reverse){var nodes=this.nodes;for(var ii=0, maxIndex=nodes.length - 1; ii <= maxIndex; ii++) {var node=nodes[reverse?maxIndex - ii:ii];if(node && node.iterate(fn, reverse) === false){return false;}}};ValueNode.prototype.iterate = function(fn, reverse){return fn(this.entry);};createClass(MapIterator, src_Iterator__Iterator);function MapIterator(map, type, reverse){this._type = type;this._reverse = reverse;this._stack = map._root && mapIteratorFrame(map._root);}MapIterator.prototype.next = function(){var type=this._type;var stack=this._stack;while(stack) {var node=stack.node;var index=stack.index++;var maxIndex;if(node.entry){if(index === 0){return mapIteratorValue(type, node.entry);}}else if(node.entries){maxIndex = node.entries.length - 1;if(index <= maxIndex){return mapIteratorValue(type, node.entries[this._reverse?maxIndex - index:index]);}}else {maxIndex = node.nodes.length - 1;if(index <= maxIndex){var subNode=node.nodes[this._reverse?maxIndex - index:index];if(subNode){if(subNode.entry){return mapIteratorValue(type, subNode.entry);}stack = this._stack = mapIteratorFrame(subNode, stack);}continue;}}stack = this._stack = this._stack.__prev;}return iteratorDone();};function mapIteratorValue(type, entry){return iteratorValue(type, entry[0], entry[1]);}function mapIteratorFrame(node, prev){return {node:node, index:0, __prev:prev};}function makeMap(size, root, ownerID, hash){var map=Object.create(MapPrototype);map.size = size;map._root = root;map.__ownerID = ownerID;map.__hash = hash;map.__altered = false;return map;}var EMPTY_MAP;function emptyMap(){return EMPTY_MAP || (EMPTY_MAP = makeMap(0));}function updateMap(map, k, v){var newRoot;var newSize;if(!map._root){if(v === NOT_SET){return map;}newSize = 1;newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);}else {var didChangeSize=MakeRef(CHANGE_LENGTH);var didAlter=MakeRef(DID_ALTER);newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);if(!didAlter.value){return map;}newSize = map.size + (didChangeSize.value?v === NOT_SET?-1:1:0);}if(map.__ownerID){map.size = newSize;map._root = newRoot;map.__hash = undefined;map.__altered = true;return map;}return newRoot?makeMap(newSize, newRoot):emptyMap();}function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter){if(!node){if(value === NOT_SET){return node;}SetRef(didAlter);SetRef(didChangeSize);return new ValueNode(ownerID, keyHash, [key, value]);}return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);}function isLeafNode(node){return node.constructor === ValueNode || node.constructor === HashCollisionNode;}function mergeIntoNode(node, ownerID, shift, keyHash, entry){if(node.keyHash === keyHash){return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);}var idx1=(shift === 0?node.keyHash:node.keyHash >>> shift) & MASK;var idx2=(shift === 0?keyHash:keyHash >>> shift) & MASK;var newNode;var nodes=idx1 === idx2?[mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)]:(newNode = new ValueNode(ownerID, keyHash, entry), idx1 < idx2?[node, newNode]:[newNode, node]);return new BitmapIndexedNode(ownerID, 1 << idx1 | 1 << idx2, nodes);}function createNodes(ownerID, entries, key, value){if(!ownerID){ownerID = new OwnerID();}var node=new ValueNode(ownerID, hash(key), [key, value]);for(var ii=0; ii < entries.length; ii++) {var entry=entries[ii];node = node.update(ownerID, 0, undefined, entry[0], entry[1]);}return node;}function packNodes(ownerID, nodes, count, excluding){var bitmap=0;var packedII=0;var packedNodes=new Array(count);for(var ii=0, bit=1, len=nodes.length; ii < len; ii++, bit <<= 1) {var node=nodes[ii];if(node !== undefined && ii !== excluding){bitmap |= bit;packedNodes[packedII++] = node;}}return new BitmapIndexedNode(ownerID, bitmap, packedNodes);}function expandNodes(ownerID, nodes, bitmap, including, node){var count=0;var expandedNodes=new Array(SIZE);for(var ii=0; bitmap !== 0; ii++, bitmap >>>= 1) {expandedNodes[ii] = bitmap & 1?nodes[count++]:undefined;}expandedNodes[including] = node;return new HashArrayMapNode(ownerID, count + 1, expandedNodes);}function mergeIntoMapWith(map, merger, iterables){var iters=[];for(var ii=0; ii < iterables.length; ii++) {var value=iterables[ii];var iter=KeyedIterable(value);if(!isIterable(value)){iter = iter.map(function(v){return fromJS(v);});}iters.push(iter);}return mergeIntoCollectionWith(map, merger, iters);}function deepMerger(merger){return function(existing, value, key){return existing && existing.mergeDeepWith && isIterable(value)?existing.mergeDeepWith(merger, value):merger?merger(existing, value, key):value;};}function mergeIntoCollectionWith(collection, merger, iters){iters = iters.filter(function(x){return x.size !== 0;});if(iters.length === 0){return collection;}if(collection.size === 0 && !collection.__ownerID && iters.length === 1){return collection.constructor(iters[0]);}return collection.withMutations(function(collection){var mergeIntoMap=merger?function(value, key){collection.update(key, NOT_SET, function(existing){return existing === NOT_SET?value:merger(existing, value, key);});}:function(value, key){collection.set(key, value);};for(var ii=0; ii < iters.length; ii++) {iters[ii].forEach(mergeIntoMap);}});}function updateInDeepMap(existing, keyPathIter, notSetValue, updater){var isNotSet=existing === NOT_SET;var step=keyPathIter.next();if(step.done){var existingValue=isNotSet?notSetValue:existing;var newValue=updater(existingValue);return newValue === existingValue?existing:newValue;}invariant(isNotSet || existing && existing.set, "invalid keyPath");var key=step.value;var nextExisting=isNotSet?NOT_SET:existing.get(key, NOT_SET);var nextUpdated=updateInDeepMap(nextExisting, keyPathIter, notSetValue, updater);return nextUpdated === nextExisting?existing:nextUpdated === NOT_SET?existing.remove(key):(isNotSet?emptyMap():existing).set(key, nextUpdated);}function popCount(x){x = x - (x >> 1 & 1431655765);x = (x & 858993459) + (x >> 2 & 858993459);x = x + (x >> 4) & 252645135;x = x + (x >> 8);x = x + (x >> 16);return x & 127;}function setIn(array, idx, val, canEdit){var newArray=canEdit?array:arrCopy(array);newArray[idx] = val;return newArray;}function spliceIn(array, idx, val, canEdit){var newLen=array.length + 1;if(canEdit && idx + 1 === newLen){array[idx] = val;return array;}var newArray=new Array(newLen);var after=0;for(var ii=0; ii < newLen; ii++) {if(ii === idx){newArray[ii] = val;after = -1;}else {newArray[ii] = array[ii + after];}}return newArray;}function spliceOut(array, idx, canEdit){var newLen=array.length - 1;if(canEdit && idx === newLen){array.pop();return array;}var newArray=new Array(newLen);var after=0;for(var ii=0; ii < newLen; ii++) {if(ii === idx){after = 1;}newArray[ii] = array[ii + after];}return newArray;}var MAX_ARRAY_MAP_SIZE=SIZE / 4;var MAX_BITMAP_INDEXED_SIZE=SIZE / 2;var MIN_HASH_ARRAY_MAP_SIZE=SIZE / 4;createClass(List, IndexedCollection);function List(value){var empty=emptyList();if(value === null || value === undefined){return empty;}if(isList(value)){return value;}var iter=IndexedIterable(value);var size=iter.size;if(size === 0){return empty;}assertNotInfinite(size);if(size > 0 && size < SIZE){return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));}return empty.withMutations(function(list){list.setSize(size);iter.forEach(function(v, i){return list.set(i, v);});});}List.of = function(){return this(arguments);};List.prototype.toString = function(){return this.__toString("List [", "]");};List.prototype.get = function(index, notSetValue){index = wrapIndex(this, index);if(index < 0 || index >= this.size){return notSetValue;}index += this._origin;var node=listNodeFor(this, index);return node && node.array[index & MASK];};List.prototype.set = function(index, value){return updateList(this, index, value);};List.prototype.remove = function(index){return !this.has(index)?this:index === 0?this.shift():index === this.size - 1?this.pop():this.splice(index, 1);};List.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = this._origin = this._capacity = 0;this._level = SHIFT;this._root = this._tail = null;this.__hash = undefined;this.__altered = true;return this;}return emptyList();};List.prototype.push = function(){var values=arguments;var oldSize=this.size;return this.withMutations(function(list){setListBounds(list, 0, oldSize + values.length);for(var ii=0; ii < values.length; ii++) {list.set(oldSize + ii, values[ii]);}});};List.prototype.pop = function(){return setListBounds(this, 0, -1);};List.prototype.unshift = function(){var values=arguments;return this.withMutations(function(list){setListBounds(list, -values.length);for(var ii=0; ii < values.length; ii++) {list.set(ii, values[ii]);}});};List.prototype.shift = function(){return setListBounds(this, 1);};List.prototype.merge = function(){return mergeIntoListWith(this, undefined, arguments);};List.prototype.mergeWith = function(merger){var iters=SLICE$0.call(arguments, 1);return mergeIntoListWith(this, merger, iters);};List.prototype.mergeDeep = function(){return mergeIntoListWith(this, deepMerger(undefined), arguments);};List.prototype.mergeDeepWith = function(merger){var iters=SLICE$0.call(arguments, 1);return mergeIntoListWith(this, deepMerger(merger), iters);};List.prototype.setSize = function(size){return setListBounds(this, 0, size);};List.prototype.slice = function(begin, end){var size=this.size;if(wholeSlice(begin, end, size)){return this;}return setListBounds(this, resolveBegin(begin, size), resolveEnd(end, size));};List.prototype.__iterator = function(type, reverse){var index=0;var values=iterateList(this, reverse);return new src_Iterator__Iterator(function(){var value=values();return value === DONE?iteratorDone():iteratorValue(type, index++, value);});};List.prototype.__iterate = function(fn, reverse){var index=0;var values=iterateList(this, reverse);var value;while((value = values()) !== DONE) {if(fn(value, index++, this) === false){break;}}return index;};List.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}if(!ownerID){this.__ownerID = ownerID;return this;}return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);};function isList(maybeList){return !!(maybeList && maybeList[IS_LIST_SENTINEL]);}List.isList = isList;var IS_LIST_SENTINEL="@@__IMMUTABLE_LIST__@@";var ListPrototype=List.prototype;ListPrototype[IS_LIST_SENTINEL] = true;ListPrototype[DELETE] = ListPrototype.remove;ListPrototype.setIn = MapPrototype.setIn;ListPrototype.deleteIn = ListPrototype.removeIn = MapPrototype.removeIn;ListPrototype.update = MapPrototype.update;ListPrototype.updateIn = MapPrototype.updateIn;ListPrototype.mergeIn = MapPrototype.mergeIn;ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;ListPrototype.withMutations = MapPrototype.withMutations;ListPrototype.asMutable = MapPrototype.asMutable;ListPrototype.asImmutable = MapPrototype.asImmutable;ListPrototype.wasAltered = MapPrototype.wasAltered;function VNode(array, ownerID){this.array = array;this.ownerID = ownerID;}VNode.prototype.removeBefore = function(ownerID, level, index){if(index === level?1 << level:0 || this.array.length === 0){return this;}var originIndex=index >>> level & MASK;if(originIndex >= this.array.length){return new VNode([], ownerID);}var removingFirst=originIndex === 0;var newChild;if(level > 0){var oldChild=this.array[originIndex];newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);if(newChild === oldChild && removingFirst){return this;}}if(removingFirst && !newChild){return this;}var editable=editableVNode(this, ownerID);if(!removingFirst){for(var ii=0; ii < originIndex; ii++) {editable.array[ii] = undefined;}}if(newChild){editable.array[originIndex] = newChild;}return editable;};VNode.prototype.removeAfter = function(ownerID, level, index){if(index === level?1 << level:0 || this.array.length === 0){return this;}var sizeIndex=index - 1 >>> level & MASK;if(sizeIndex >= this.array.length){return this;}var removingLast=sizeIndex === this.array.length - 1;var newChild;if(level > 0){var oldChild=this.array[sizeIndex];newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);if(newChild === oldChild && removingLast){return this;}}if(removingLast && !newChild){return this;}var editable=editableVNode(this, ownerID);if(!removingLast){editable.array.pop();}if(newChild){editable.array[sizeIndex] = newChild;}return editable;};var DONE={};function iterateList(list, reverse){var left=list._origin;var right=list._capacity;var tailPos=getTailOffset(right);var tail=list._tail;return iterateNodeOrLeaf(list._root, list._level, 0);function iterateNodeOrLeaf(node, level, offset){return level === 0?iterateLeaf(node, offset):iterateNode(node, level, offset);}function iterateLeaf(node, offset){var array=offset === tailPos?tail && tail.array:node && node.array;var from=offset > left?0:left - offset;var to=right - offset;if(to > SIZE){to = SIZE;}return function(){if(from === to){return DONE;}var idx=reverse?--to:from++;return array && array[idx];};}function iterateNode(node, level, offset){var values;var array=node && node.array;var from=offset > left?0:left - offset >> level;var to=(right - offset >> level) + 1;if(to > SIZE){to = SIZE;}return function(){do{if(values){var value=values();if(value !== DONE){return value;}values = null;}if(from === to){return DONE;}var idx=reverse?--to:from++;values = iterateNodeOrLeaf(array && array[idx], level - SHIFT, offset + (idx << level));}while(true);};}}function makeList(origin, capacity, level, root, tail, ownerID, hash){var list=Object.create(ListPrototype);list.size = capacity - origin;list._origin = origin;list._capacity = capacity;list._level = level;list._root = root;list._tail = tail;list.__ownerID = ownerID;list.__hash = hash;list.__altered = false;return list;}var EMPTY_LIST;function emptyList(){return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));}function updateList(list, index, value){index = wrapIndex(list, index);if(index >= list.size || index < 0){return list.withMutations(function(list){index < 0?setListBounds(list, index).set(0, value):setListBounds(list, 0, index + 1).set(index, value);});}index += list._origin;var newTail=list._tail;var newRoot=list._root;var didAlter=MakeRef(DID_ALTER);if(index >= getTailOffset(list._capacity)){newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);}else {newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);}if(!didAlter.value){return list;}if(list.__ownerID){list._root = newRoot;list._tail = newTail;list.__hash = undefined;list.__altered = true;return list;}return makeList(list._origin, list._capacity, list._level, newRoot, newTail);}function updateVNode(node, ownerID, level, index, value, didAlter){var idx=index >>> level & MASK;var nodeHas=node && idx < node.array.length;if(!nodeHas && value === undefined){return node;}var newNode;if(level > 0){var lowerNode=node && node.array[idx];var newLowerNode=updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);if(newLowerNode === lowerNode){return node;}newNode = editableVNode(node, ownerID);newNode.array[idx] = newLowerNode;return newNode;}if(nodeHas && node.array[idx] === value){return node;}SetRef(didAlter);newNode = editableVNode(node, ownerID);if(value === undefined && idx === newNode.array.length - 1){newNode.array.pop();}else {newNode.array[idx] = value;}return newNode;}function editableVNode(node, ownerID){if(ownerID && node && ownerID === node.ownerID){return node;}return new VNode(node?node.array.slice():[], ownerID);}function listNodeFor(list, rawIndex){if(rawIndex >= getTailOffset(list._capacity)){return list._tail;}if(rawIndex < 1 << list._level + SHIFT){var node=list._root;var level=list._level;while(node && level > 0) {node = node.array[rawIndex >>> level & MASK];level -= SHIFT;}return node;}}function setListBounds(list, begin, end){var owner=list.__ownerID || new OwnerID();var oldOrigin=list._origin;var oldCapacity=list._capacity;var newOrigin=oldOrigin + begin;var newCapacity=end === undefined?oldCapacity:end < 0?oldCapacity + end:oldOrigin + end;if(newOrigin === oldOrigin && newCapacity === oldCapacity){return list;}if(newOrigin >= newCapacity){return list.clear();}var newLevel=list._level;var newRoot=list._root;var offsetShift=0;while(newOrigin + offsetShift < 0) {newRoot = new VNode(newRoot && newRoot.array.length?[undefined, newRoot]:[], owner);newLevel += SHIFT;offsetShift += 1 << newLevel;}if(offsetShift){newOrigin += offsetShift;oldOrigin += offsetShift;newCapacity += offsetShift;oldCapacity += offsetShift;}var oldTailOffset=getTailOffset(oldCapacity);var newTailOffset=getTailOffset(newCapacity);while(newTailOffset >= 1 << newLevel + SHIFT) {newRoot = new VNode(newRoot && newRoot.array.length?[newRoot]:[], owner);newLevel += SHIFT;}var oldTail=list._tail;var newTail=newTailOffset < oldTailOffset?listNodeFor(list, newCapacity - 1):newTailOffset > oldTailOffset?new VNode([], owner):oldTail;if(oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length){newRoot = editableVNode(newRoot, owner);var node=newRoot;for(var level=newLevel; level > SHIFT; level -= SHIFT) {var idx=oldTailOffset >>> level & MASK;node = node.array[idx] = editableVNode(node.array[idx], owner);}node.array[oldTailOffset >>> SHIFT & MASK] = oldTail;}if(newCapacity < oldCapacity){newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);}if(newOrigin >= newTailOffset){newOrigin -= newTailOffset;newCapacity -= newTailOffset;newLevel = SHIFT;newRoot = null;newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);}else if(newOrigin > oldOrigin || newTailOffset < oldTailOffset){offsetShift = 0;while(newRoot) {var beginIndex=newOrigin >>> newLevel & MASK;if(beginIndex !== newTailOffset >>> newLevel & MASK){break;}if(beginIndex){offsetShift += (1 << newLevel) * beginIndex;}newLevel -= SHIFT;newRoot = newRoot.array[beginIndex];}if(newRoot && newOrigin > oldOrigin){newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);}if(newRoot && newTailOffset < oldTailOffset){newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);}if(offsetShift){newOrigin -= offsetShift;newCapacity -= offsetShift;}}if(list.__ownerID){list.size = newCapacity - newOrigin;list._origin = newOrigin;list._capacity = newCapacity;list._level = newLevel;list._root = newRoot;list._tail = newTail;list.__hash = undefined;list.__altered = true;return list;}return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);}function mergeIntoListWith(list, merger, iterables){var iters=[];var maxSize=0;for(var ii=0; ii < iterables.length; ii++) {var value=iterables[ii];var iter=IndexedIterable(value);if(iter.size > maxSize){maxSize = iter.size;}if(!isIterable(value)){iter = iter.map(function(v){return fromJS(v);});}iters.push(iter);}if(maxSize > list.size){list = list.setSize(maxSize);}return mergeIntoCollectionWith(list, merger, iters);}function getTailOffset(size){return size < SIZE?0:size - 1 >>> SHIFT << SHIFT;}createClass(OrderedMap, src_Map__Map);function OrderedMap(value){return value === null || value === undefined?emptyOrderedMap():isOrderedMap(value)?value:emptyOrderedMap().withMutations(function(map){var iter=KeyedIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v, k){return map.set(k, v);});});}OrderedMap.of = function(){return this(arguments);};OrderedMap.prototype.toString = function(){return this.__toString("OrderedMap {", "}");};OrderedMap.prototype.get = function(k, notSetValue){var index=this._map.get(k);return index !== undefined?this._list.get(index)[1]:notSetValue;};OrderedMap.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = 0;this._map.clear();this._list.clear();return this;}return emptyOrderedMap();};OrderedMap.prototype.set = function(k, v){return updateOrderedMap(this, k, v);};OrderedMap.prototype.remove = function(k){return updateOrderedMap(this, k, NOT_SET);};OrderedMap.prototype.wasAltered = function(){return this._map.wasAltered() || this._list.wasAltered();};OrderedMap.prototype.__iterate = function(fn, reverse){var this$0=this;return this._list.__iterate(function(entry){return entry && fn(entry[1], entry[0], this$0);}, reverse);};OrderedMap.prototype.__iterator = function(type, reverse){return this._list.fromEntrySeq().__iterator(type, reverse);};OrderedMap.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}var newMap=this._map.__ensureOwner(ownerID);var newList=this._list.__ensureOwner(ownerID);if(!ownerID){this.__ownerID = ownerID;this._map = newMap;this._list = newList;return this;}return makeOrderedMap(newMap, newList, ownerID, this.__hash);};function isOrderedMap(maybeOrderedMap){return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);}OrderedMap.isOrderedMap = isOrderedMap;OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;function makeOrderedMap(map, list, ownerID, hash){var omap=Object.create(OrderedMap.prototype);omap.size = map?map.size:0;omap._map = map;omap._list = list;omap.__ownerID = ownerID;omap.__hash = hash;return omap;}var EMPTY_ORDERED_MAP;function emptyOrderedMap(){return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));}function updateOrderedMap(omap, k, v){var map=omap._map;var list=omap._list;var i=map.get(k);var has=i !== undefined;var newMap;var newList;if(v === NOT_SET){if(!has){return omap;}if(list.size >= SIZE && list.size >= map.size * 2){newList = list.filter(function(entry, idx){return entry !== undefined && i !== idx;});newMap = newList.toKeyedSeq().map(function(entry){return entry[0];}).flip().toMap();if(omap.__ownerID){newMap.__ownerID = newList.__ownerID = omap.__ownerID;}}else {newMap = map.remove(k);newList = i === list.size - 1?list.pop():list.set(i, undefined);}}else {if(has){if(v === list.get(i)[1]){return omap;}newMap = map;newList = list.set(i, [k, v]);}else {newMap = map.set(k, list.size);newList = list.set(list.size, [k, v]);}}if(omap.__ownerID){omap.size = newMap.size;omap._map = newMap;omap._list = newList;omap.__hash = undefined;return omap;}return makeOrderedMap(newMap, newList);}createClass(Stack, IndexedCollection);function Stack(value){return value === null || value === undefined?emptyStack():isStack(value)?value:emptyStack().unshiftAll(value);}Stack.of = function(){return this(arguments);};Stack.prototype.toString = function(){return this.__toString("Stack [", "]");};Stack.prototype.get = function(index, notSetValue){var head=this._head;index = wrapIndex(this, index);while(head && index--) {head = head.next;}return head?head.value:notSetValue;};Stack.prototype.peek = function(){return this._head && this._head.value;};Stack.prototype.push = function(){if(arguments.length === 0){return this;}var newSize=this.size + arguments.length;var head=this._head;for(var ii=arguments.length - 1; ii >= 0; ii--) {head = {value:arguments[ii], next:head};}if(this.__ownerID){this.size = newSize;this._head = head;this.__hash = undefined;this.__altered = true;return this;}return makeStack(newSize, head);};Stack.prototype.pushAll = function(iter){iter = IndexedIterable(iter);if(iter.size === 0){return this;}assertNotInfinite(iter.size);var newSize=this.size;var head=this._head;iter.reverse().forEach(function(value){newSize++;head = {value:value, next:head};});if(this.__ownerID){this.size = newSize;this._head = head;this.__hash = undefined;this.__altered = true;return this;}return makeStack(newSize, head);};Stack.prototype.pop = function(){return this.slice(1);};Stack.prototype.unshift = function(){return this.push.apply(this, arguments);};Stack.prototype.unshiftAll = function(iter){return this.pushAll(iter);};Stack.prototype.shift = function(){return this.pop.apply(this, arguments);};Stack.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = 0;this._head = undefined;this.__hash = undefined;this.__altered = true;return this;}return emptyStack();};Stack.prototype.slice = function(begin, end){if(wholeSlice(begin, end, this.size)){return this;}var resolvedBegin=resolveBegin(begin, this.size);var resolvedEnd=resolveEnd(end, this.size);if(resolvedEnd !== this.size){return IndexedCollection.prototype.slice.call(this, begin, end);}var newSize=this.size - resolvedBegin;var head=this._head;while(resolvedBegin--) {head = head.next;}if(this.__ownerID){this.size = newSize;this._head = head;this.__hash = undefined;this.__altered = true;return this;}return makeStack(newSize, head);};Stack.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}if(!ownerID){this.__ownerID = ownerID;this.__altered = false;return this;}return makeStack(this.size, this._head, ownerID, this.__hash);};Stack.prototype.__iterate = function(fn, reverse){if(reverse){return this.reverse().__iterate(fn);}var iterations=0;var node=this._head;while(node) {if(fn(node.value, iterations++, this) === false){break;}node = node.next;}return iterations;};Stack.prototype.__iterator = function(type, reverse){if(reverse){return this.reverse().__iterator(type);}var iterations=0;var node=this._head;return new src_Iterator__Iterator(function(){if(node){var value=node.value;node = node.next;return iteratorValue(type, iterations++, value);}return iteratorDone();});};function isStack(maybeStack){return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);}Stack.isStack = isStack;var IS_STACK_SENTINEL="@@__IMMUTABLE_STACK__@@";var StackPrototype=Stack.prototype;StackPrototype[IS_STACK_SENTINEL] = true;StackPrototype.withMutations = MapPrototype.withMutations;StackPrototype.asMutable = MapPrototype.asMutable;StackPrototype.asImmutable = MapPrototype.asImmutable;StackPrototype.wasAltered = MapPrototype.wasAltered;function makeStack(size, head, ownerID, hash){var map=Object.create(StackPrototype);map.size = size;map._head = head;map.__ownerID = ownerID;map.__hash = hash;map.__altered = false;return map;}var EMPTY_STACK;function emptyStack(){return EMPTY_STACK || (EMPTY_STACK = makeStack(0));}createClass(src_Set__Set, SetCollection);function src_Set__Set(value){return value === null || value === undefined?emptySet():isSet(value)?value:emptySet().withMutations(function(set){var iter=SetIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v){return set.add(v);});});}src_Set__Set.of = function(){return this(arguments);};src_Set__Set.fromKeys = function(value){return this(KeyedIterable(value).keySeq());};src_Set__Set.prototype.toString = function(){return this.__toString("Set {", "}");};src_Set__Set.prototype.has = function(value){return this._map.has(value);};src_Set__Set.prototype.add = function(value){return updateSet(this, this._map.set(value, true));};src_Set__Set.prototype.remove = function(value){return updateSet(this, this._map.remove(value));};src_Set__Set.prototype.clear = function(){return updateSet(this, this._map.clear());};src_Set__Set.prototype.union = function(){var iters=SLICE$0.call(arguments, 0);iters = iters.filter(function(x){return x.size !== 0;});if(iters.length === 0){return this;}if(this.size === 0 && !this.__ownerID && iters.length === 1){return this.constructor(iters[0]);}return this.withMutations(function(set){for(var ii=0; ii < iters.length; ii++) {SetIterable(iters[ii]).forEach(function(value){return set.add(value);});}});};src_Set__Set.prototype.intersect = function(){var iters=SLICE$0.call(arguments, 0);if(iters.length === 0){return this;}iters = iters.map(function(iter){return SetIterable(iter);});var originalSet=this;return this.withMutations(function(set){originalSet.forEach(function(value){if(!iters.every(function(iter){return iter.includes(value);})){set.remove(value);}});});};src_Set__Set.prototype.subtract = function(){var iters=SLICE$0.call(arguments, 0);if(iters.length === 0){return this;}iters = iters.map(function(iter){return SetIterable(iter);});var originalSet=this;return this.withMutations(function(set){originalSet.forEach(function(value){if(iters.some(function(iter){return iter.includes(value);})){set.remove(value);}});});};src_Set__Set.prototype.merge = function(){return this.union.apply(this, arguments);};src_Set__Set.prototype.mergeWith = function(merger){var iters=SLICE$0.call(arguments, 1);return this.union.apply(this, iters);};src_Set__Set.prototype.sort = function(comparator){return OrderedSet(sortFactory(this, comparator));};src_Set__Set.prototype.sortBy = function(mapper, comparator){return OrderedSet(sortFactory(this, comparator, mapper));};src_Set__Set.prototype.wasAltered = function(){return this._map.wasAltered();};src_Set__Set.prototype.__iterate = function(fn, reverse){var this$0=this;return this._map.__iterate(function(_, k){return fn(k, k, this$0);}, reverse);};src_Set__Set.prototype.__iterator = function(type, reverse){return this._map.map(function(_, k){return k;}).__iterator(type, reverse);};src_Set__Set.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}var newMap=this._map.__ensureOwner(ownerID);if(!ownerID){this.__ownerID = ownerID;this._map = newMap;return this;}return this.__make(newMap, ownerID);};function isSet(maybeSet){return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);}src_Set__Set.isSet = isSet;var IS_SET_SENTINEL="@@__IMMUTABLE_SET__@@";var SetPrototype=src_Set__Set.prototype;SetPrototype[IS_SET_SENTINEL] = true;SetPrototype[DELETE] = SetPrototype.remove;SetPrototype.mergeDeep = SetPrototype.merge;SetPrototype.mergeDeepWith = SetPrototype.mergeWith;SetPrototype.withMutations = MapPrototype.withMutations;SetPrototype.asMutable = MapPrototype.asMutable;SetPrototype.asImmutable = MapPrototype.asImmutable;SetPrototype.__empty = emptySet;SetPrototype.__make = makeSet;function updateSet(set, newMap){if(set.__ownerID){set.size = newMap.size;set._map = newMap;return set;}return newMap === set._map?set:newMap.size === 0?set.__empty():set.__make(newMap);}function makeSet(map, ownerID){var set=Object.create(SetPrototype);set.size = map?map.size:0;set._map = map;set.__ownerID = ownerID;return set;}var EMPTY_SET;function emptySet(){return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));}createClass(OrderedSet, src_Set__Set);function OrderedSet(value){return value === null || value === undefined?emptyOrderedSet():isOrderedSet(value)?value:emptyOrderedSet().withMutations(function(set){var iter=SetIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v){return set.add(v);});});}OrderedSet.of = function(){return this(arguments);};OrderedSet.fromKeys = function(value){return this(KeyedIterable(value).keySeq());};OrderedSet.prototype.toString = function(){return this.__toString("OrderedSet {", "}");};function isOrderedSet(maybeOrderedSet){return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);}OrderedSet.isOrderedSet = isOrderedSet;var OrderedSetPrototype=OrderedSet.prototype;OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;OrderedSetPrototype.__empty = emptyOrderedSet;OrderedSetPrototype.__make = makeOrderedSet;function makeOrderedSet(map, ownerID){var set=Object.create(OrderedSetPrototype);set.size = map?map.size:0;set._map = map;set.__ownerID = ownerID;return set;}var EMPTY_ORDERED_SET;function emptyOrderedSet(){return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));}createClass(Record, KeyedCollection);function Record(defaultValues, name){var hasInitialized;var RecordType=function Record(values){if(values instanceof RecordType){return values;}if(!(this instanceof RecordType)){return new RecordType(values);}if(!hasInitialized){hasInitialized = true;var keys=Object.keys(defaultValues);setProps(RecordTypePrototype, keys);RecordTypePrototype.size = keys.length;RecordTypePrototype._name = name;RecordTypePrototype._keys = keys;RecordTypePrototype._defaultValues = defaultValues;}this._map = src_Map__Map(values);};var RecordTypePrototype=RecordType.prototype = Object.create(RecordPrototype);RecordTypePrototype.constructor = RecordType;return RecordType;}Record.prototype.toString = function(){return this.__toString(recordName(this) + " {", "}");};Record.prototype.has = function(k){return this._defaultValues.hasOwnProperty(k);};Record.prototype.get = function(k, notSetValue){if(!this.has(k)){return notSetValue;}var defaultVal=this._defaultValues[k];return this._map?this._map.get(k, defaultVal):defaultVal;};Record.prototype.clear = function(){if(this.__ownerID){this._map && this._map.clear();return this;}var RecordType=this.constructor;return RecordType._empty || (RecordType._empty = makeRecord(this, emptyMap()));};Record.prototype.set = function(k, v){if(!this.has(k)){throw new Error("Cannot set unknown key \"" + k + "\" on " + recordName(this));}var newMap=this._map && this._map.set(k, v);if(this.__ownerID || newMap === this._map){return this;}return makeRecord(this, newMap);};Record.prototype.remove = function(k){if(!this.has(k)){return this;}var newMap=this._map && this._map.remove(k);if(this.__ownerID || newMap === this._map){return this;}return makeRecord(this, newMap);};Record.prototype.wasAltered = function(){return this._map.wasAltered();};Record.prototype.__iterator = function(type, reverse){var this$0=this;return KeyedIterable(this._defaultValues).map(function(_, k){return this$0.get(k);}).__iterator(type, reverse);};Record.prototype.__iterate = function(fn, reverse){var this$0=this;return KeyedIterable(this._defaultValues).map(function(_, k){return this$0.get(k);}).__iterate(fn, reverse);};Record.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}var newMap=this._map && this._map.__ensureOwner(ownerID);if(!ownerID){this.__ownerID = ownerID;this._map = newMap;return this;}return makeRecord(this, newMap, ownerID);};var RecordPrototype=Record.prototype;RecordPrototype[DELETE] = RecordPrototype.remove;RecordPrototype.deleteIn = RecordPrototype.removeIn = MapPrototype.removeIn;RecordPrototype.merge = MapPrototype.merge;RecordPrototype.mergeWith = MapPrototype.mergeWith;RecordPrototype.mergeIn = MapPrototype.mergeIn;RecordPrototype.mergeDeep = MapPrototype.mergeDeep;RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;RecordPrototype.setIn = MapPrototype.setIn;RecordPrototype.update = MapPrototype.update;RecordPrototype.updateIn = MapPrototype.updateIn;RecordPrototype.withMutations = MapPrototype.withMutations;RecordPrototype.asMutable = MapPrototype.asMutable;RecordPrototype.asImmutable = MapPrototype.asImmutable;function makeRecord(likeRecord, map, ownerID){var record=Object.create(Object.getPrototypeOf(likeRecord));record._map = map;record.__ownerID = ownerID;return record;}function recordName(record){return record._name || record.constructor.name || "Record";}function setProps(prototype, names){try{names.forEach(setProp.bind(undefined, prototype));}catch(error) {}}function setProp(prototype, name){Object.defineProperty(prototype, name, {get:function get(){return this.get(name);}, set:function set(value){invariant(this.__ownerID, "Cannot set on an immutable record.");this.set(name, value);}});}function deepEqual(a, b){if(a === b){return true;}if(!isIterable(b) || a.size !== undefined && b.size !== undefined && a.size !== b.size || a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash || isKeyed(a) !== isKeyed(b) || isIndexed(a) !== isIndexed(b) || isOrdered(a) !== isOrdered(b)){return false;}if(a.size === 0 && b.size === 0){return true;}var notAssociative=!isAssociative(a);if(isOrdered(a)){var entries=a.entries();return b.every(function(v, k){var entry=entries.next().value;return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));}) && entries.next().done;}var flipped=false;if(a.size === undefined){if(b.size === undefined){if(typeof a.cacheResult === "function"){a.cacheResult();}}else {flipped = true;var _=a;a = b;b = _;}}var allEqual=true;var bSize=b.__iterate(function(v, k){if(notAssociative?!a.has(v):flipped?!is(v, a.get(k, NOT_SET)):!is(a.get(k, NOT_SET), v)){allEqual = false;return false;}});return allEqual && a.size === bSize;}createClass(Range, IndexedSeq);function Range(start, end, step){if(!(this instanceof Range)){return new Range(start, end, step);}invariant(step !== 0, "Cannot step a Range by 0");start = start || 0;if(end === undefined){end = Infinity;}step = step === undefined?1:Math.abs(step);if(end < start){step = -step;}this._start = start;this._end = end;this._step = step;this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);if(this.size === 0){if(EMPTY_RANGE){return EMPTY_RANGE;}EMPTY_RANGE = this;}}Range.prototype.toString = function(){if(this.size === 0){return "Range []";}return "Range [ " + this._start + "..." + this._end + (this._step > 1?" by " + this._step:"") + " ]";};Range.prototype.get = function(index, notSetValue){return this.has(index)?this._start + wrapIndex(this, index) * this._step:notSetValue;};Range.prototype.includes = function(searchValue){var possibleIndex=(searchValue - this._start) / this._step;return possibleIndex >= 0 && possibleIndex < this.size && possibleIndex === Math.floor(possibleIndex);};Range.prototype.slice = function(begin, end){if(wholeSlice(begin, end, this.size)){return this;}begin = resolveBegin(begin, this.size);end = resolveEnd(end, this.size);if(end <= begin){return new Range(0, 0);}return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);};Range.prototype.indexOf = function(searchValue){var offsetValue=searchValue - this._start;if(offsetValue % this._step === 0){var index=offsetValue / this._step;if(index >= 0 && index < this.size){return index;}}return -1;};Range.prototype.lastIndexOf = function(searchValue){return this.indexOf(searchValue);};Range.prototype.__iterate = function(fn, reverse){var maxIndex=this.size - 1;var step=this._step;var value=reverse?this._start + maxIndex * step:this._start;for(var ii=0; ii <= maxIndex; ii++) {if(fn(value, ii, this) === false){return ii + 1;}value += reverse?-step:step;}return ii;};Range.prototype.__iterator = function(type, reverse){var maxIndex=this.size - 1;var step=this._step;var value=reverse?this._start + maxIndex * step:this._start;var ii=0;return new src_Iterator__Iterator(function(){var v=value;value += reverse?-step:step;return ii > maxIndex?iteratorDone():iteratorValue(type, ii++, v);});};Range.prototype.equals = function(other){return other instanceof Range?this._start === other._start && this._end === other._end && this._step === other._step:deepEqual(this, other);};var EMPTY_RANGE;createClass(Repeat, IndexedSeq);function Repeat(value, times){if(!(this instanceof Repeat)){return new Repeat(value, times);}this._value = value;this.size = times === undefined?Infinity:Math.max(0, times);if(this.size === 0){if(EMPTY_REPEAT){return EMPTY_REPEAT;}EMPTY_REPEAT = this;}}Repeat.prototype.toString = function(){if(this.size === 0){return "Repeat []";}return "Repeat [ " + this._value + " " + this.size + " times ]";};Repeat.prototype.get = function(index, notSetValue){return this.has(index)?this._value:notSetValue;};Repeat.prototype.includes = function(searchValue){return is(this._value, searchValue);};Repeat.prototype.slice = function(begin, end){var size=this.size;return wholeSlice(begin, end, size)?this:new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));};Repeat.prototype.reverse = function(){return this;};Repeat.prototype.indexOf = function(searchValue){if(is(this._value, searchValue)){return 0;}return -1;};Repeat.prototype.lastIndexOf = function(searchValue){if(is(this._value, searchValue)){return this.size;}return -1;};Repeat.prototype.__iterate = function(fn, reverse){for(var ii=0; ii < this.size; ii++) {if(fn(this._value, ii, this) === false){return ii + 1;}}return ii;};Repeat.prototype.__iterator = function(type, reverse){var this$0=this;var ii=0;return new src_Iterator__Iterator(function(){return ii < this$0.size?iteratorValue(type, ii++, this$0._value):iteratorDone();});};Repeat.prototype.equals = function(other){return other instanceof Repeat?is(this._value, other._value):deepEqual(other);};var EMPTY_REPEAT;function mixin(ctor, methods){var keyCopier=function keyCopier(key){ctor.prototype[key] = methods[key];};Object.keys(methods).forEach(keyCopier);Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(methods).forEach(keyCopier);return ctor;}Iterable.Iterator = src_Iterator__Iterator;mixin(Iterable, {toArray:function toArray(){assertNotInfinite(this.size);var array=new Array(this.size || 0);this.valueSeq().__iterate(function(v, i){array[i] = v;});return array;}, toIndexedSeq:function toIndexedSeq(){return new ToIndexedSequence(this);}, toJS:function toJS(){return this.toSeq().map(function(value){return value && typeof value.toJS === "function"?value.toJS():value;}).__toJS();}, toJSON:function toJSON(){return this.toSeq().map(function(value){return value && typeof value.toJSON === "function"?value.toJSON():value;}).__toJS();}, toKeyedSeq:function toKeyedSeq(){return new ToKeyedSequence(this, true);}, toMap:function toMap(){return src_Map__Map(this.toKeyedSeq());}, toObject:function toObject(){assertNotInfinite(this.size);var object={};this.__iterate(function(v, k){object[k] = v;});return object;}, toOrderedMap:function toOrderedMap(){return OrderedMap(this.toKeyedSeq());}, toOrderedSet:function toOrderedSet(){return OrderedSet(isKeyed(this)?this.valueSeq():this);}, toSet:function toSet(){return src_Set__Set(isKeyed(this)?this.valueSeq():this);}, toSetSeq:function toSetSeq(){return new ToSetSequence(this);}, toSeq:function toSeq(){return isIndexed(this)?this.toIndexedSeq():isKeyed(this)?this.toKeyedSeq():this.toSetSeq();}, toStack:function toStack(){return Stack(isKeyed(this)?this.valueSeq():this);}, toList:function toList(){return List(isKeyed(this)?this.valueSeq():this);}, toString:function toString(){return "[Iterable]";}, __toString:function __toString(head, tail){if(this.size === 0){return head + tail;}return head + " " + this.toSeq().map(this.__toStringMapper).join(", ") + " " + tail;}, concat:function concat(){var values=SLICE$0.call(arguments, 0);return reify(this, concatFactory(this, values));}, contains:function contains(searchValue){return this.includes(searchValue);}, includes:function includes(searchValue){return this.some(function(value){return is(value, searchValue);});}, entries:function entries(){return this.__iterator(ITERATE_ENTRIES);}, every:function every(predicate, context){assertNotInfinite(this.size);var returnValue=true;this.__iterate(function(v, k, c){if(!predicate.call(context, v, k, c)){returnValue = false;return false;}});return returnValue;}, filter:function filter(predicate, context){return reify(this, filterFactory(this, predicate, context, true));}, find:function find(predicate, context, notSetValue){var entry=this.findEntry(predicate, context);return entry?entry[1]:notSetValue;}, findEntry:function findEntry(predicate, context){var found;this.__iterate(function(v, k, c){if(predicate.call(context, v, k, c)){found = [k, v];return false;}});return found;}, findLastEntry:function findLastEntry(predicate, context){return this.toSeq().reverse().findEntry(predicate, context);}, forEach:function forEach(sideEffect, context){assertNotInfinite(this.size);return this.__iterate(context?sideEffect.bind(context):sideEffect);}, join:function join(separator){assertNotInfinite(this.size);separator = separator !== undefined?"" + separator:",";var joined="";var isFirst=true;this.__iterate(function(v){isFirst?isFirst = false:joined += separator;joined += v !== null && v !== undefined?v.toString():"";});return joined;}, keys:function keys(){return this.__iterator(ITERATE_KEYS);}, map:function map(mapper, context){return reify(this, mapFactory(this, mapper, context));}, reduce:function reduce(reducer, initialReduction, context){assertNotInfinite(this.size);var reduction;var useFirst;if(arguments.length < 2){useFirst = true;}else {reduction = initialReduction;}this.__iterate(function(v, k, c){if(useFirst){useFirst = false;reduction = v;}else {reduction = reducer.call(context, reduction, v, k, c);}});return reduction;}, reduceRight:function reduceRight(reducer, initialReduction, context){var reversed=this.toKeyedSeq().reverse();return reversed.reduce.apply(reversed, arguments);}, reverse:function reverse(){return reify(this, reverseFactory(this, true));}, slice:function slice(begin, end){return reify(this, sliceFactory(this, begin, end, true));}, some:function some(predicate, context){return !this.every(not(predicate), context);}, sort:function sort(comparator){return reify(this, sortFactory(this, comparator));}, values:function values(){return this.__iterator(ITERATE_VALUES);}, butLast:function butLast(){return this.slice(0, -1);}, isEmpty:function isEmpty(){return this.size !== undefined?this.size === 0:!this.some(function(){return true;});}, count:function count(predicate, context){return ensureSize(predicate?this.toSeq().filter(predicate, context):this);}, countBy:function countBy(grouper, context){return countByFactory(this, grouper, context);}, equals:function equals(other){return deepEqual(this, other);}, entrySeq:function entrySeq(){var iterable=this;if(iterable._cache){return new ArraySeq(iterable._cache);}var entriesSequence=iterable.toSeq().map(entryMapper).toIndexedSeq();entriesSequence.fromEntrySeq = function(){return iterable.toSeq();};return entriesSequence;}, filterNot:function filterNot(predicate, context){return this.filter(not(predicate), context);}, findLast:function findLast(predicate, context, notSetValue){return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);}, first:function first(){return this.find(returnTrue);}, flatMap:function flatMap(mapper, context){return reify(this, flatMapFactory(this, mapper, context));}, flatten:function flatten(depth){return reify(this, flattenFactory(this, depth, true));}, fromEntrySeq:function fromEntrySeq(){return new FromEntriesSequence(this);}, get:function get(searchKey, notSetValue){return this.find(function(_, key){return is(key, searchKey);}, undefined, notSetValue);}, getIn:function getIn(searchKeyPath, notSetValue){var nested=this;var iter=forceIterator(searchKeyPath);var step;while(!(step = iter.next()).done) {var key=step.value;nested = nested && nested.get?nested.get(key, NOT_SET):NOT_SET;if(nested === NOT_SET){return notSetValue;}}return nested;}, groupBy:function groupBy(grouper, context){return groupByFactory(this, grouper, context);}, has:function has(searchKey){return this.get(searchKey, NOT_SET) !== NOT_SET;}, hasIn:function hasIn(searchKeyPath){return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET;}, isSubset:function isSubset(iter){iter = typeof iter.includes === "function"?iter:Iterable(iter);return this.every(function(value){return iter.includes(value);});}, isSuperset:function isSuperset(iter){return iter.isSubset(this);}, keySeq:function keySeq(){return this.toSeq().map(keyMapper).toIndexedSeq();}, last:function last(){return this.toSeq().reverse().first();}, max:function max(comparator){return maxFactory(this, comparator);}, maxBy:function maxBy(mapper, comparator){return maxFactory(this, comparator, mapper);}, min:function min(comparator){return maxFactory(this, comparator?neg(comparator):defaultNegComparator);}, minBy:function minBy(mapper, comparator){return maxFactory(this, comparator?neg(comparator):defaultNegComparator, mapper);}, rest:function rest(){return this.slice(1);}, skip:function skip(amount){return this.slice(Math.max(0, amount));}, skipLast:function skipLast(amount){return reify(this, this.toSeq().reverse().skip(amount).reverse());}, skipWhile:function skipWhile(predicate, context){return reify(this, skipWhileFactory(this, predicate, context, true));}, skipUntil:function skipUntil(predicate, context){return this.skipWhile(not(predicate), context);}, sortBy:function sortBy(mapper, comparator){return reify(this, sortFactory(this, comparator, mapper));}, take:function take(amount){return this.slice(0, Math.max(0, amount));}, takeLast:function takeLast(amount){return reify(this, this.toSeq().reverse().take(amount).reverse());}, takeWhile:function takeWhile(predicate, context){return reify(this, takeWhileFactory(this, predicate, context));}, takeUntil:function takeUntil(predicate, context){return this.takeWhile(not(predicate), context);}, valueSeq:function valueSeq(){return this.toIndexedSeq();}, hashCode:function hashCode(){return this.__hash || (this.__hash = hashIterable(this));}});var IterablePrototype=Iterable.prototype;IterablePrototype[IS_ITERABLE_SENTINEL] = true;IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;IterablePrototype.__toJS = IterablePrototype.toArray;IterablePrototype.__toStringMapper = quoteString;IterablePrototype.inspect = IterablePrototype.toSource = function(){return this.toString();};IterablePrototype.chain = IterablePrototype.flatMap;(function(){try{Object.defineProperty(IterablePrototype, "length", {get:function get(){if(!Iterable.noLengthWarning){var stack;try{throw new Error();}catch(error) {stack = error.stack;}if(stack.indexOf("_wrapObject") === -1){console && console.warn && console.warn("iterable.length has been deprecated, " + "use iterable.size or iterable.count(). " + "This warning will become a silent error in a future version. " + stack);return this.size;}}}});}catch(e) {}})();mixin(KeyedIterable, {flip:function flip(){return reify(this, flipFactory(this));}, findKey:function findKey(predicate, context){var entry=this.findEntry(predicate, context);return entry && entry[0];}, findLastKey:function findLastKey(predicate, context){return this.toSeq().reverse().findKey(predicate, context);}, keyOf:function keyOf(searchValue){return this.findKey(function(value){return is(value, searchValue);});}, lastKeyOf:function lastKeyOf(searchValue){return this.findLastKey(function(value){return is(value, searchValue);});}, mapEntries:function mapEntries(mapper, context){var this$0=this;var iterations=0;return reify(this, this.toSeq().map(function(v, k){return mapper.call(context, [k, v], iterations++, this$0);}).fromEntrySeq());}, mapKeys:function mapKeys(mapper, context){var this$0=this;return reify(this, this.toSeq().flip().map(function(k, v){return mapper.call(context, k, v, this$0);}).flip());}});var KeyedIterablePrototype=KeyedIterable.prototype;KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;KeyedIterablePrototype.__toJS = IterablePrototype.toObject;KeyedIterablePrototype.__toStringMapper = function(v, k){return JSON.stringify(k) + ": " + quoteString(v);};mixin(IndexedIterable, {toKeyedSeq:function toKeyedSeq(){return new ToKeyedSequence(this, false);}, filter:function filter(predicate, context){return reify(this, filterFactory(this, predicate, context, false));}, findIndex:function findIndex(predicate, context){var entry=this.findEntry(predicate, context);return entry?entry[0]:-1;}, indexOf:function indexOf(searchValue){var key=this.toKeyedSeq().keyOf(searchValue);return key === undefined?-1:key;}, lastIndexOf:function lastIndexOf(searchValue){return this.toSeq().reverse().indexOf(searchValue);}, reverse:function reverse(){return reify(this, reverseFactory(this, false));}, slice:function slice(begin, end){return reify(this, sliceFactory(this, begin, end, false));}, splice:function splice(index, removeNum){var numArgs=arguments.length;removeNum = Math.max(removeNum | 0, 0);if(numArgs === 0 || numArgs === 2 && !removeNum){return this;}index = resolveBegin(index, this.size);var spliced=this.slice(0, index);return reify(this, numArgs === 1?spliced:spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum)));}, findLastIndex:function findLastIndex(predicate, context){var key=this.toKeyedSeq().findLastKey(predicate, context);return key === undefined?-1:key;}, first:function first(){return this.get(0);}, flatten:function flatten(depth){return reify(this, flattenFactory(this, depth, false));}, get:function get(index, notSetValue){index = wrapIndex(this, index);return index < 0 || (this.size === Infinity || this.size !== undefined && index > this.size)?notSetValue:this.find(function(_, key){return key === index;}, undefined, notSetValue);}, has:function has(index){index = wrapIndex(this, index);return index >= 0 && (this.size !== undefined?this.size === Infinity || index < this.size:this.indexOf(index) !== -1);}, interpose:function interpose(separator){return reify(this, interposeFactory(this, separator));}, interleave:function interleave(){var iterables=[this].concat(arrCopy(arguments));var zipped=zipWithFactory(this.toSeq(), IndexedSeq.of, iterables);var interleaved=zipped.flatten(true);if(zipped.size){interleaved.size = zipped.size * iterables.length;}return reify(this, interleaved);}, last:function last(){return this.get(-1);}, skipWhile:function skipWhile(predicate, context){return reify(this, skipWhileFactory(this, predicate, context, false));}, zip:function zip(){var iterables=[this].concat(arrCopy(arguments));return reify(this, zipWithFactory(this, defaultZipper, iterables));}, zipWith:function zipWith(zipper){var iterables=arrCopy(arguments);iterables[0] = this;return reify(this, zipWithFactory(this, zipper, iterables));}});IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;mixin(SetIterable, {get:function get(value, notSetValue){return this.has(value)?value:notSetValue;}, includes:function includes(value){return this.has(value);}, keySeq:function keySeq(){return this.valueSeq();}});SetIterable.prototype.has = IterablePrototype.includes;mixin(KeyedSeq, KeyedIterable.prototype);mixin(IndexedSeq, IndexedIterable.prototype);mixin(SetSeq, SetIterable.prototype);mixin(KeyedCollection, KeyedIterable.prototype);mixin(IndexedCollection, IndexedIterable.prototype);mixin(SetCollection, SetIterable.prototype);function keyMapper(v, k){return k;}function entryMapper(v, k){return [k, v];}function not(predicate){return function(){return !predicate.apply(this, arguments);};}function neg(predicate){return function(){return -predicate.apply(this, arguments);};}function quoteString(value){return typeof value === "string"?JSON.stringify(value):value;}function defaultZipper(){return arrCopy(arguments);}function defaultNegComparator(a, b){return a < b?1:a > b?-1:0;}function hashIterable(iterable){if(iterable.size === Infinity){return 0;}var ordered=isOrdered(iterable);var keyed=isKeyed(iterable);var h=ordered?1:0;var size=iterable.__iterate(keyed?ordered?function(v, k){h = 31 * h + hashMerge(hash(v), hash(k)) | 0;}:function(v, k){h = h + hashMerge(hash(v), hash(k)) | 0;}:ordered?function(v){h = 31 * h + hash(v) | 0;}:function(v){h = h + hash(v) | 0;});return murmurHashOfSize(size, h);}function murmurHashOfSize(size, h){h = src_Math__imul(h, 3432918353);h = src_Math__imul(h << 15 | h >>> -15, 461845907);h = src_Math__imul(h << 13 | h >>> -13, 5);h = (h + 3864292196 | 0) ^ size;h = src_Math__imul(h ^ h >>> 16, 2246822507);h = src_Math__imul(h ^ h >>> 13, 3266489909);h = smi(h ^ h >>> 16);return h;}function hashMerge(a, b){return a ^ b + 2654435769 + (a << 6) + (a >> 2) | 0;}var Immutable={Iterable:Iterable, Seq:Seq, Collection:Collection, Map:src_Map__Map, OrderedMap:OrderedMap, List:List, Stack:Stack, Set:src_Set__Set, OrderedSet:OrderedSet, Record:Record, Range:Range, Repeat:Repeat, is:is, fromJS:fromJS};return Immutable;});

},{}],2:[function(require,module,exports){
var Immutable = require("./../../immutable/dist/immutable.js");
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
        this._listeners[eventName] = listeners['delete'](fn);
    } else {
        this._listeners[eventName] = listeners.clear();
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
},{"./../../immutable/dist/immutable.js":1}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"./create-hash.js":6,"individual":10,"weakmap-shim/create-store":86}],8:[function(require,module,exports){
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


},{"camelize":5,"string-template":45,"xtend/mutable":89}],9:[function(require,module,exports){
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
},{"min-document":3}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
module.exports = isObject

function isObject(x) {
    return typeof x === "object" && x !== null
}

},{}],13:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function arrayCopy(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = arrayCopy;

},{}],14:[function(require,module,exports){
/**
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseCopy = require('lodash._basecopy'),
    keys = require('lodash.keys');

/**
 * The base implementation of `_.assign` without support for argument juggling,
 * multiple sources, and `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return source == null
    ? object
    : baseCopy(source, keys(source), object);
}

module.exports = baseAssign;

},{"lodash._basecopy":16,"lodash.keys":40}],15:[function(require,module,exports){
/**
 * lodash 3.3.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseIsEqual = require('lodash._baseisequal'),
    bindCallback = require('lodash._bindcallback'),
    isArray = require('lodash.isarray'),
    pairs = require('lodash.pairs');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

/**
 * The base implementation of `_.callback` which supports specifying the
 * number of arguments to provide to `func`.
 *
 * @private
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function baseCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (type == 'function') {
    return thisArg === undefined
      ? func
      : bindCallback(func, thisArg, argCount);
  }
  if (func == null) {
    return identity;
  }
  if (type == 'object') {
    return baseMatches(func);
  }
  return thisArg === undefined
    ? property(func)
    : baseMatchesProperty(func, thisArg);
}

/**
 * The base implementation of `get` without support for string paths
 * and default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path of the property to get.
 * @param {string} [pathKey] The key representation of path.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path, pathKey) {
  if (object == null) {
    return;
  }
  if (pathKey !== undefined && pathKey in toObject(object)) {
    path = [pathKey];
  }
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[path[index++]];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isMatch` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Array} matchData The propery names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = toObject(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var result = customizer ? customizer(objValue, srcValue, key) : undefined;
      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * The base implementation of `_.matches` which does not clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    var key = matchData[0][0],
        value = matchData[0][1];

    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === value && (value !== undefined || (key in toObject(object)));
    };
  }
  return function(object) {
    return baseIsMatch(object, matchData);
  };
}

/**
 * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to compare.
 * @returns {Function} Returns the new function.
 */
function baseMatchesProperty(path, srcValue) {
  var isArr = isArray(path),
      isCommon = isKey(path) && isStrictComparable(srcValue),
      pathKey = (path + '');

  path = toPath(path);
  return function(object) {
    if (object == null) {
      return false;
    }
    var key = pathKey;
    object = toObject(object);
    if ((isArr || !isCommon) && !(key in object)) {
      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
      if (object == null) {
        return false;
      }
      key = last(path);
      object = toObject(object);
    }
    return object[key] === srcValue
      ? (srcValue !== undefined || (key in object))
      : baseIsEqual(srcValue, object[key], undefined, true);
  };
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 */
function basePropertyDeep(path) {
  var pathKey = (path + '');
  path = toPath(path);
  return function(object) {
    return baseGet(object, path, pathKey);
  };
}

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  start = start == null ? 0 : (+start || 0);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : (+end || 0);
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/**
 * Gets the propery names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = pairs(object),
      length = result.length;

  while (length--) {
    result[length][2] = isStrictComparable(result[length][1]);
  }
  return result;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  var type = typeof value;
  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
    return true;
  }
  if (isArray(value)) {
    return false;
  }
  var result = !reIsDeepProp.test(value);
  return result || (object != null && value in toObject(object));
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

/**
 * Converts `value` to property path array if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Array} Returns the property path array.
 */
function toPath(value) {
  if (isArray(value)) {
    return value;
  }
  var result = [];
  baseToString(value).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
}

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * Creates a function that returns the property value at `path` on a
 * given object.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': { 'c': 2 } } },
 *   { 'a': { 'b': { 'c': 1 } } }
 * ];
 *
 * _.map(objects, _.property('a.b.c'));
 * // => [2, 1]
 *
 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
}

module.exports = baseCallback;

},{"lodash._baseisequal":23,"lodash._bindcallback":25,"lodash.isarray":37,"lodash.pairs":41}],16:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @returns {Object} Returns `object`.
 */
function baseCopy(source, props, object) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    object[key] = source[key];
  }
  return object;
}

module.exports = baseCopy;

},{}],17:[function(require,module,exports){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseIndexOf = require('lodash._baseindexof'),
    cacheIndexOf = require('lodash._cacheindexof'),
    createCache = require('lodash._createcache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.difference` which accepts a single array
 * of values to exclude.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values) {
  var length = array ? array.length : 0,
      result = [];

  if (!length) {
    return result;
  }
  var index = -1,
      indexOf = baseIndexOf,
      isCommon = true,
      cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
      valuesLength = values.length;

  if (cache) {
    indexOf = cacheIndexOf;
    isCommon = false;
    values = cache;
  }
  outer:
  while (++index < length) {
    var value = array[index];

    if (isCommon && value === value) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === value) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (indexOf(values, value, 0) < 0) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;

},{"lodash._baseindexof":22,"lodash._cacheindexof":26,"lodash._createcache":28}],18:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var keys = require('lodash.keys');

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.forEach` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object|string} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    var length = collection ? getLength(collection) : 0;
    if (!isLength(length)) {
      return eachFunc(collection, iteratee);
    }
    var index = fromRight ? length : -1,
        iterable = toObject(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = baseEach;

},{"lodash.keys":40}],19:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
 * without support for callback shorthands and `this` binding, which iterates
 * over `collection` using the provided `eachFunc`.
 *
 * @private
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @param {boolean} [retKey] Specify returning the key of the found element
 *  instead of the element itself.
 * @returns {*} Returns the found element or its key, else `undefined`.
 */
function baseFind(collection, predicate, eachFunc, retKey) {
  var result;
  eachFunc(collection, function(value, key, collection) {
    if (predicate(value, key, collection)) {
      result = retKey ? key : value;
      return false;
    }
  });
  return result;
}

module.exports = baseFind;

},{}],20:[function(require,module,exports){
/**
 * lodash 3.6.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for callback shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromRight) {
  var length = array.length,
      index = fromRight ? length : -1;

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],21:[function(require,module,exports){
/**
 * lodash 3.1.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray');

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * The base implementation of `_.flatten` with added support for restricting
 * flattening and specifying the start index.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, isDeep, isStrict, result) {
  result || (result = []);

  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index];
    if (isObjectLike(value) && isArrayLike(value) &&
        (isStrict || isArray(value) || isArguments(value))) {
      if (isDeep) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, isDeep, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = baseFlatten;

},{"lodash.isarguments":36,"lodash.isarray":37}],22:[function(require,module,exports){
/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.indexOf` without support for binary searches.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return indexOfNaN(array, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * Gets the index at which the first occurrence of `NaN` is found in `array`.
 * If `fromRight` is provided elements of `array` are iterated from right to left.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
 */
function indexOfNaN(array, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 0 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    var other = array[index];
    if (other !== other) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{}],23:[function(require,module,exports){
/**
 * lodash 3.0.7 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArray = require('lodash.isarray'),
    isTypedArray = require('lodash.istypedarray'),
    keys = require('lodash.keys');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * A specialized version of `_.some` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.isEqual` without support for `this` binding
 * `customizer` functions.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = objToString.call(object);
    if (objTag == argsTag) {
      objTag = objectTag;
    } else if (objTag != objectTag) {
      objIsArr = isTypedArray(object);
    }
  }
  if (!othIsArr) {
    othTag = objToString.call(other);
    if (othTag == argsTag) {
      othTag = objectTag;
    } else if (othTag != objectTag) {
      othIsArr = isTypedArray(other);
    }
  }
  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && !(objIsArr || objIsObj)) {
    return equalByTag(object, other, objTag);
  }
  if (!isLoose) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
    }
  }
  if (!isSameTag) {
    return false;
  }
  // Assume cyclic values are equal.
  // For more information on detecting circular references see https://es5.github.io/#JO.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == object) {
      return stackB[length] == other;
    }
  }
  // Add `object` and `other` to the stack of traversed objects.
  stackA.push(object);
  stackB.push(other);

  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

  stackA.pop();
  stackB.pop();

  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing arrays.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var index = -1,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
    return false;
  }
  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index],
        result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

    if (result !== undefined) {
      if (result) {
        continue;
      }
      return false;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (isLoose) {
      if (!arraySome(other, function(othValue) {
            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
          })) {
        return false;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
      return false;
    }
  }
  return true;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} value The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag) {
  switch (tag) {
    case boolTag:
    case dateTag:
      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      // Treat `NaN` vs. `NaN` as equal.
      return (object != +object)
        ? other != +other
        : object == +other;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings primitives and string
      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
      return object == (other + '');
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isLoose) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  var skipCtor = isLoose;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key],
        result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;

    // Recursively compare objects (susceptible to call stack limits).
    if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
      return false;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (!skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = baseIsEqual;

},{"lodash.isarray":37,"lodash.istypedarray":39,"lodash.keys":40}],24:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * returned by `keysFunc`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  var index = -1,
      length = props.length,
      result = Array(length);

  while (++index < length) {
    result[index] = object[props[index]];
  }
  return result;
}

module.exports = baseValues;

},{}],25:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = bindCallback;

},{}],26:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is in `cache` mimicking the return signature of
 * `_.indexOf` by returning `0` if the value is found, else `-1`.
 *
 * @private
 * @param {Object} cache The cache to search.
 * @param {*} value The value to search for.
 * @returns {number} Returns `0` if `value` is found, else `-1`.
 */
function cacheIndexOf(cache, value) {
  var data = cache.data,
      result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

  return result ? 0 : -1;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = cacheIndexOf;

},{}],27:[function(require,module,exports){
/**
 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var bindCallback = require('lodash._bindcallback'),
    isIterateeCall = require('lodash._isiterateecall'),
    restParam = require('lodash.restparam');

/**
 * Creates a function that assigns properties of source object(s) to a given
 * destination object.
 *
 * **Note:** This function is used to create `_.assign`, `_.defaults`, and `_.merge`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return restParam(function(object, sources) {
    var index = -1,
        length = object == null ? 0 : sources.length,
        customizer = length > 2 ? sources[length - 2] : undefined,
        guard = length > 2 ? sources[2] : undefined,
        thisArg = length > 1 ? sources[length - 1] : undefined;

    if (typeof customizer == 'function') {
      customizer = bindCallback(customizer, thisArg, 5);
      length -= 2;
    } else {
      customizer = typeof thisArg == 'function' ? thisArg : undefined;
      length -= (customizer ? 1 : 0);
    }
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"lodash._bindcallback":25,"lodash._isiterateecall":30,"lodash.restparam":42}],28:[function(require,module,exports){
(function (global){
/**
 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var getNative = require('lodash._getnative');

/** Native method references. */
var Set = getNative(global, 'Set');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeCreate = getNative(Object, 'create');

/**
 *
 * Creates a cache object to store unique values.
 *
 * @private
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var length = values ? values.length : 0;

  this.data = { 'hash': nativeCreate(null), 'set': new Set };
  while (length--) {
    this.push(values[length]);
  }
}

/**
 * Adds `value` to the cache.
 *
 * @private
 * @name push
 * @memberOf SetCache
 * @param {*} value The value to cache.
 */
function cachePush(value) {
  var data = this.data;
  if (typeof value == 'string' || isObject(value)) {
    data.set.add(value);
  } else {
    data.hash[value] = true;
  }
}

/**
 * Creates a `Set` cache object to optimize linear searches of large arrays.
 *
 * @private
 * @param {Array} [values] The values to cache.
 * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
 */
function createCache(values) {
  return (nativeCreate && Set) ? new SetCache(values) : null;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

// Add functions to the `Set` cache.
SetCache.prototype.push = cachePush;

module.exports = createCache;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"lodash._getnative":29}],29:[function(require,module,exports){
/**
 * lodash 3.9.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = getNative;

},{}],30:[function(require,module,exports){
/**
 * lodash 3.0.9 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isIterateeCall;

},{}],31:[function(require,module,exports){
/**
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseAssign = require('lodash._baseassign'),
    createAssigner = require('lodash._createassigner'),
    keys = require('lodash.keys');

/**
 * A specialized version of `_.assign` for customizing assigned values without
 * support for argument juggling, multiple sources, and `this` binding `customizer`
 * functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 */
function assignWith(object, source, customizer) {
  var index = -1,
      props = keys(source),
      length = props.length;

  while (++index < length) {
    var key = props[index],
        value = object[key],
        result = customizer(value, source[key], key, object, source);

    if ((result === result ? (result !== value) : (value === value)) ||
        (value === undefined && !(key in object))) {
      object[key] = result;
    }
  }
  return object;
}

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object. Subsequent sources overwrite property assignments of previous sources.
 * If `customizer` is provided it is invoked to produce the assigned values.
 * The `customizer` is bound to `thisArg` and invoked with five arguments:
 * (objectValue, sourceValue, key, object, source).
 *
 * **Note:** This method mutates `object` and is based on
 * [`Object.assign`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign).
 *
 * @static
 * @memberOf _
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
 * // => { 'user': 'fred', 'age': 40 }
 *
 * // using a customizer callback
 * var defaults = _.partialRight(_.assign, function(value, other) {
 *   return _.isUndefined(value) ? other : value;
 * });
 *
 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var assign = createAssigner(function(object, source, customizer) {
  return customizer
    ? assignWith(object, source, customizer)
    : baseAssign(object, source);
});

module.exports = assign;

},{"lodash._baseassign":14,"lodash._createassigner":27,"lodash.keys":40}],32:[function(require,module,exports){
/**
 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var getNative = require('lodash._getnative');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeNow = getNative(Date, 'now');

/**
 * Gets the number of milliseconds that have elapsed since the Unix epoch
 * (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @category Date
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => logs the number of milliseconds it took for the deferred function to be invoked
 */
var now = nativeNow || function() {
  return new Date().getTime();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed invocations. Provide an options object to indicate that `func`
 * should be invoked on the leading and/or trailing edge of the `wait` timeout.
 * Subsequent calls to the debounced function return the result of the last
 * `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
 * on the trailing edge of the timeout only if the the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=false] Specify invoking on the leading
 *  edge of the timeout.
 * @param {number} [options.maxWait] The maximum time `func` is allowed to be
 *  delayed before it is invoked.
 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
 *  edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // avoid costly calculations while the window size is in flux
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // ensure `batchLog` is invoked once after 1 second of debounced calls
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', _.debounce(batchLog, 250, {
 *   'maxWait': 1000
 * }));
 *
 * // cancel a debounced call
 * var todoChanges = _.debounce(batchLog, 1000);
 * Object.observe(models.todo, todoChanges);
 *
 * Object.observe(models, function(changes) {
 *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
 *     todoChanges.cancel();
 *   }
 * }, ['delete']);
 *
 * // ...at some point `models.todo` is changed
 * models.todo.completed = true;
 *
 * // ...before 1 second has passed `models.todo` is deleted
 * // which cancels the debounced `todoChanges` call
 * delete models.todo;
 */
function debounce(func, wait, options) {
  var args,
      maxTimeoutId,
      result,
      stamp,
      thisArg,
      timeoutId,
      trailingCall,
      lastCalled = 0,
      maxWait = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = wait < 0 ? 0 : (+wait || 0);
  if (options === true) {
    var leading = true;
    trailing = false;
  } else if (isObject(options)) {
    leading = !!options.leading;
    maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId) {
      clearTimeout(maxTimeoutId);
    }
    lastCalled = 0;
    maxTimeoutId = timeoutId = trailingCall = undefined;
  }

  function complete(isCalled, id) {
    if (id) {
      clearTimeout(id);
    }
    maxTimeoutId = timeoutId = trailingCall = undefined;
    if (isCalled) {
      lastCalled = now();
      result = func.apply(thisArg, args);
      if (!timeoutId && !maxTimeoutId) {
        args = thisArg = undefined;
      }
    }
  }

  function delayed() {
    var remaining = wait - (now() - stamp);
    if (remaining <= 0 || remaining > wait) {
      complete(trailingCall, maxTimeoutId);
    } else {
      timeoutId = setTimeout(delayed, remaining);
    }
  }

  function maxDelayed() {
    complete(trailing, timeoutId);
  }

  function debounced() {
    args = arguments;
    stamp = now();
    thisArg = this;
    trailingCall = trailing && (timeoutId || !leading);

    if (maxWait === false) {
      var leadingCall = leading && !timeoutId;
    } else {
      if (!maxTimeoutId && !leading) {
        lastCalled = stamp;
      }
      var remaining = maxWait - (stamp - lastCalled),
          isCalled = remaining <= 0 || remaining > maxWait;

      if (isCalled) {
        if (maxTimeoutId) {
          maxTimeoutId = clearTimeout(maxTimeoutId);
        }
        lastCalled = stamp;
        result = func.apply(thisArg, args);
      }
      else if (!maxTimeoutId) {
        maxTimeoutId = setTimeout(maxDelayed, remaining);
      }
    }
    if (isCalled && timeoutId) {
      timeoutId = clearTimeout(timeoutId);
    }
    else if (!timeoutId && wait !== maxWait) {
      timeoutId = setTimeout(delayed, wait);
    }
    if (leadingCall) {
      isCalled = true;
      result = func.apply(thisArg, args);
    }
    if (isCalled && !timeoutId && !maxTimeoutId) {
      args = thisArg = undefined;
    }
    return result;
  }
  debounced.cancel = cancel;
  return debounced;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = debounce;

},{"lodash._getnative":29}],33:[function(require,module,exports){
/**
 * lodash 3.2.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseDifference = require('lodash._basedifference'),
    baseFlatten = require('lodash._baseflatten'),
    restParam = require('lodash.restparam');

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Creates an array of unique `array` values not included in the other
 * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The arrays of values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.difference([1, 2, 3], [4, 2]);
 * // => [1, 3]
 */
var difference = restParam(function(array, values) {
  return (isObjectLike(array) && isArrayLike(array))
    ? baseDifference(array, baseFlatten(values, false, true))
    : [];
});

module.exports = difference;

},{"lodash._basedifference":17,"lodash._baseflatten":21,"lodash.restparam":42}],34:[function(require,module,exports){
/**
 * lodash 3.2.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseCallback = require('lodash._basecallback'),
    baseEach = require('lodash._baseeach'),
    baseFind = require('lodash._basefind'),
    baseFindIndex = require('lodash._basefindindex'),
    isArray = require('lodash.isarray');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new find function.
 */
function createFind(eachFunc, fromRight) {
  return function(collection, predicate, thisArg) {
    predicate = baseCallback(predicate, thisArg, 3);
    if (isArray(collection)) {
      var index = baseFindIndex(collection, predicate, fromRight);
      return index > -1 ? collection[index] : undefined;
    }
    return baseFind(collection, predicate, eachFunc);
  };
}

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
 * invoked with three arguments: (value, index|key, collection).
 *
 * If a property name is provided for `predicate` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `predicate` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * @static
 * @memberOf _
 * @alias detect
 * @category Collection
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function|Object|string} [predicate=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.result(_.find(users, function(chr) {
 *   return chr.age < 40;
 * }), 'user');
 * // => 'barney'
 *
 * // using the `_.matches` callback shorthand
 * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
 * // => 'pebbles'
 *
 * // using the `_.matchesProperty` callback shorthand
 * _.result(_.find(users, 'active', false), 'user');
 * // => 'fred'
 *
 * // using the `_.property` callback shorthand
 * _.result(_.find(users, 'active'), 'user');
 * // => 'barney'
 */
var find = createFind(baseEach);

module.exports = find;

},{"lodash._basecallback":15,"lodash._baseeach":18,"lodash._basefind":19,"lodash._basefindindex":20,"lodash.isarray":37}],35:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseFlatten = require('lodash._baseflatten'),
    isIterateeCall = require('lodash._isiterateecall');

/**
 * Flattens a nested array. If `isDeep` is `true` the array is recursively
 * flattened, otherwise it is only flattened a single level.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, 3, [4]]]);
 * // => [1, 2, 3, [4]]
 *
 * // using `isDeep`
 * _.flatten([1, [2, 3, [4]]], true);
 * // => [1, 2, 3, 4]
 */
function flatten(array, isDeep, guard) {
  var length = array ? array.length : 0;
  if (guard && isIterateeCall(array, isDeep, guard)) {
    isDeep = false;
  }
  return length ? baseFlatten(array, isDeep) : [];
}

module.exports = flatten;

},{"lodash._baseflatten":21,"lodash._isiterateecall":30}],36:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.5 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = global.Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null &&
    !(typeof value == 'function' && isFunction(value)) && isLength(getLength(value));
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object, else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array constructors, and
  // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isArguments;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],37:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var arrayTag = '[object Array]',
    funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isArray;

},{}],38:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],39:[function(require,module,exports){
(function (global){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Used for built-in method references. */
var objectProto = global.Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

module.exports = isTypedArray;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],40:[function(require,module,exports){
/**
 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var getNative = require('lodash._getnative'),
    isArguments = require('lodash.isarguments'),
    isArray = require('lodash.isarray');

/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = getNative(Object, 'keys');

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = !!length && isLength(length) &&
    (isArray(object) || isArguments(object));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object == null ? undefined : object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;

},{"lodash._getnative":29,"lodash.isarguments":36,"lodash.isarray":37}],41:[function(require,module,exports){
/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var keys = require('lodash.keys');

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Creates a two dimensional array of the key-value pairs for `object`,
 * e.g. `[[key1, value1], [key2, value2]]`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the new array of key-value pairs.
 * @example
 *
 * _.pairs({ 'barney': 36, 'fred': 40 });
 * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
 */
function pairs(object) {
  object = toObject(object);

  var index = -1,
      props = keys(object),
      length = props.length,
      result = Array(length);

  while (++index < length) {
    var key = props[index];
    result[index] = [key, object[key]];
  }
  return result;
}

module.exports = pairs;

},{"lodash.keys":40}],42:[function(require,module,exports){
/**
 * lodash 3.6.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;

},{}],43:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var debounce = require('lodash.debounce');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed invocations. Provide an options object to indicate
 * that `func` should be invoked on the leading and/or trailing edge of the
 * `wait` timeout. Subsequent calls to the throttled function return the
 * result of the last `func` call.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
 * on the trailing edge of the timeout only if the the throttled function is
 * invoked more than once during the `wait` timeout.
 *
 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=true] Specify invoking on the leading
 *  edge of the timeout.
 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
 *  edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // avoid excessively updating the position while scrolling
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
 * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
 *   'trailing': false
 * }));
 *
 * // cancel a trailing throttled call
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (options === false) {
    leading = false;
  } else if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, { 'leading': leading, 'maxWait': +wait, 'trailing': trailing });
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = throttle;

},{"lodash.debounce":32}],44:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var arrayCopy = require('lodash._arraycopy'),
    baseValues = require('lodash._basevalues'),
    keys = require('lodash.keys');

/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Converts `value` to an array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Array} Returns the converted array.
 * @example
 *
 * (function() {
 *   return _.toArray(arguments).slice(1);
 * }(1, 2, 3));
 * // => [2, 3]
 */
function toArray(value) {
  var length = value ? getLength(value) : 0;
  if (!isLength(length)) {
    return values(value);
  }
  if (!length) {
    return [];
  }
  return arrayCopy(value);
}

/**
 * Creates an array of the own enumerable property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return baseValues(object, keys(object));
}

module.exports = toArray;

},{"lodash._arraycopy":13,"lodash._basevalues":24,"lodash.keys":40}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],47:[function(require,module,exports){
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
},{"./support/isBuffer":46,"_process":4,"inherits":11}],48:[function(require,module,exports){
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

},{"vtree/vnode":53,"vtree/vtext":54}],49:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook && typeof hook.hook === "function" &&
        !hook.hasOwnProperty("hook")
}

},{}],50:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":52}],51:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],52:[function(require,module,exports){
module.exports = "1"

},{}],53:[function(require,module,exports){
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

},{"./is-vhook":49,"./is-vnode":50,"./is-widget":51,"./version":52}],54:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":52}],55:[function(require,module,exports){
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

},{"is-object":12,"vtree/is-vhook":79}],56:[function(require,module,exports){
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

},{"./apply-properties":55,"global/document":9,"vtree/handle-thunk":77,"vtree/is-vnode":80,"vtree/is-vtext":81,"vtree/is-widget":82}],57:[function(require,module,exports){
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

},{}],58:[function(require,module,exports){
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

},{"./apply-properties":55,"./create-element":56,"./update-widget":60,"vtree/is-widget":82,"vtree/vpatch":84}],59:[function(require,module,exports){
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

},{"./dom-index":57,"./patch-op":58,"global/document":9,"x-is-array":88}],60:[function(require,module,exports){
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

},{"vtree/is-widget":82}],61:[function(require,module,exports){
var diff = require("vtree/diff")

module.exports = diff

},{"vtree/diff":76}],62:[function(require,module,exports){
var patch = require("vdom/patch")

module.exports = patch

},{"vdom/patch":59}],63:[function(require,module,exports){
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

},{"data-set":7}],64:[function(require,module,exports){
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

},{"data-set":7}],65:[function(require,module,exports){
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

},{}],66:[function(require,module,exports){
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

},{"./hooks/data-set-hook.js":63,"./hooks/ev-hook.js":64,"./hooks/soft-set-hook.js":65,"./parse-tag.js":75,"error/typed":8,"vtree/is-thunk":67,"vtree/is-vhook":68,"vtree/is-vnode":69,"vtree/is-vtext":70,"vtree/is-widget":71,"vtree/vnode.js":73,"vtree/vtext.js":74}],67:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],68:[function(require,module,exports){
module.exports=require(49)
},{"/Users/charles_szilagyi/code/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vhook.js":49}],69:[function(require,module,exports){
module.exports=require(50)
},{"./version":72,"/Users/charles_szilagyi/code/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vnode.js":50}],70:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":72}],71:[function(require,module,exports){
module.exports=require(51)
},{"/Users/charles_szilagyi/code/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-widget.js":51}],72:[function(require,module,exports){
module.exports=require(52)
},{"/Users/charles_szilagyi/code/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/version.js":52}],73:[function(require,module,exports){
module.exports=require(53)
},{"./is-vhook":68,"./is-vnode":69,"./is-widget":71,"./version":72,"/Users/charles_szilagyi/code/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/vnode.js":53}],74:[function(require,module,exports){
module.exports=require(54)
},{"./version":72,"/Users/charles_szilagyi/code/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/vtext.js":54}],75:[function(require,module,exports){
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

},{}],76:[function(require,module,exports){
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

},{"./handle-thunk":77,"./is-thunk":78,"./is-vnode":80,"./is-vtext":81,"./is-widget":82,"./vpatch":84,"is-object":12,"x-is-array":88}],77:[function(require,module,exports){
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

},{"./is-thunk":78,"./is-vnode":80,"./is-vtext":81,"./is-widget":82}],78:[function(require,module,exports){
module.exports=require(67)
},{"/Users/charles_szilagyi/code/scribe-plugin-noting/node_modules/virtual-hyperscript/node_modules/vtree/is-thunk.js":67}],79:[function(require,module,exports){
module.exports=require(49)
},{"/Users/charles_szilagyi/code/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vhook.js":49}],80:[function(require,module,exports){
module.exports=require(50)
},{"./version":83,"/Users/charles_szilagyi/code/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-vnode.js":50}],81:[function(require,module,exports){
module.exports=require(70)
},{"./version":83,"/Users/charles_szilagyi/code/scribe-plugin-noting/node_modules/virtual-hyperscript/node_modules/vtree/is-vtext.js":70}],82:[function(require,module,exports){
module.exports=require(51)
},{"/Users/charles_szilagyi/code/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/is-widget.js":51}],83:[function(require,module,exports){
module.exports=require(52)
},{"/Users/charles_szilagyi/code/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/version.js":52}],84:[function(require,module,exports){
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

},{"./version":83}],85:[function(require,module,exports){
module.exports=require(54)
},{"./version":83,"/Users/charles_szilagyi/code/scribe-plugin-noting/node_modules/vdom-virtualize/node_modules/vtree/vtext.js":54}],86:[function(require,module,exports){
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

},{"./hidden-store.js":87}],87:[function(require,module,exports){
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

},{}],88:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],89:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],90:[function(require,module,exports){
// Scribe noting plugin
"use strict";

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

},{"./src/config":116,"./src/generate-note-controller":117,"./src/note-command-factory":118}],91:[function(require,module,exports){
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

},{"../../config":116,"../../utils/create-virtual-scribe-marker":122,"../../utils/error-handle":124,"../../utils/get-note-data-attrs":126,"../../utils/noting/find-entire-note":131,"../../utils/noting/find-scribe-markers":138,"../../utils/vfocus/is-vfocus":163,"./reset-note-segment-classes":102,"./wrap-in-note":111}],92:[function(require,module,exports){
"use strict";

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
  var isAtLeastPartiallyWithinAnotherNote = arguments[2] === undefined ? false : arguments[2];

  var isStandaloneNote = !isAtLeastPartiallyWithinAnotherNote;

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
  toWrapAndReplace.forEach(function (focus, i) {
    return focus.replace(wrappedTextNodes[i]);
  });

  // If we end up with an empty note a <BR> tag would be created. We have to do
  // this before we remove the markers.
  removeErroneousBrTags(focus, tagName);

  // Update note properties (merges if necessary).
  var lastNoteSegment = findLastNoteSegment(toWrapAndReplace[0], tagName, isStandaloneNote);

  // Note segments are the ones selected by the user, except if the selection overlaps
  // with an existing note. NB if the selection was completely inside another note,
  // removeNote or removePartOfNote would be called.
  var noteSegments = toWrapAndReplace;
  if (!isStandaloneNote) {
    noteSegments = findEntireNote(lastNoteSegment, tagName, isStandaloneNote);
  }

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

},{"../../actions/noting/remove-empty-notes":96,"../../config":116,"../../utils/create-virtual-scribe-marker":122,"../../utils/error-handle":124,"../../utils/get-note-data-attrs":126,"../../utils/noting/find-entire-note":131,"../../utils/noting/find-last-note-segment":133,"../../utils/noting/find-scribe-markers":138,"../../utils/noting/find-text-between-scribe-markers":140,"../../utils/noting/is-not-within-note":144,"../../utils/noting/note-cache":149,"../../utils/vdom/has-class":153,"../../utils/vfocus/is-not-empty":161,"../../utils/vfocus/is-paragraph":162,"../../utils/vfocus/is-vfocus":163,"./remove-erroneous-br-tags":97,"./remove-scribe-markers":100,"./reset-note-segment-classes":102,"./wrap-in-note":111,"vtree/vtext":85}],93:[function(require,module,exports){
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

},{"../../config":116,"../../utils/error-handle":124,"../../utils/noting/note-cache":149,"../../utils/vfocus/is-vfocus":163,"./merge-if-necessary":94,"./remove-erroneous-br-tags":97,"./reset-note-barriers":101}],94:[function(require,module,exports){
"use strict";

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
    var inconsistentTimeStamps = new Set(note.map(function (segment) {
      return !!segment.vNode.properties.dataset.noteEditedBy;
    }));

    if (inconsistentTimeStamps.size > 1) {
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

},{"../../config":116,"../../utils/error-handle":124,"../../utils/noting/find-all-notes":129,"../../utils/vfocus/is-vfocus":163,"./reset-note-segment-classes":102}],95:[function(require,module,exports){
"use strict";

var VFocus = require("../../vfocus");
var flatten = require("lodash.flatten");
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
    textNodes = flatten(textNodes);
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

},{"../../config":116,"../../utils/create-virtual-scribe-marker":122,"../../utils/error-handle":124,"../../utils/noting/find-entire-note":131,"../../utils/noting/find-first-note-segment":132,"../../utils/noting/find-next-note-segment":134,"../../utils/noting/find-previous-note-segment":137,"../../utils/noting/find-scribe-markers":138,"../../utils/vfocus/is-vfocus":163,"../../utils/vfocus/is-vtext":164,"../../vfocus":165,"./remove-scribe-markers":100,"lodash.flatten":35}],96:[function(require,module,exports){
"use strict";

var flatten = require("lodash.flatten");
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
  var allNoteSegments = flatten(findAllNotes(focus, tagName));

  var noteSequences = allNoteSegments.map(flattenTree);

  noteSequences.forEach(function (noteSequence) {

    var noteParent = noteSequence.splice(0, 1)[0];

    //if we have a totally empty note we have an array of 1
    if (noteSequence.length <= 0) {
      noteParent.remove();
      return;
    }

    var childrenAreEmpty = noteSequence.every(isEmpty);

    //if a note is totally empty remove it
    if (childrenAreEmpty) noteParent.remove();
  });
};

},{"../../config":116,"../../utils/error-handle":124,"../../utils/noting/find-all-notes":129,"../../utils/vfocus/flatten-tree":157,"../../utils/vfocus/is-empty":160,"../../utils/vfocus/is-vfocus":163,"../../utils/vfocus/is-vtext":164,"lodash.flatten":35}],97:[function(require,module,exports){
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

},{"../../config":116,"../../utils/error-handle":124,"../../utils/noting/find-scribe-markers":138,"../../utils/noting/is-note-segment":145,"../../utils/vfocus/has-no-text-children":158,"../../utils/vfocus/has-only-empty-text-children":159,"../../utils/vfocus/is-vfocus":163,"../../utils/vfocus/is-vtext":164,"../../vfocus":165,"vtree/vtext":85}],98:[function(require,module,exports){
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

},{"../../config":116,"../../utils/error-handle":124,"../../utils/noting/find-note-by-id":135,"../../utils/noting/find-parent-note-segment":136,"../../utils/noting/find-scribe-markers":138,"../../utils/noting/note-cache":149,"../../utils/vfocus/is-vfocus":163,"./ensure-note-integrity":93,"./strip-zero-width-space":104,"./unwrap-note":109}],99:[function(require,module,exports){
"use strict";

var difference = require("lodash.difference");
var flatten = require("lodash.flatten");

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

  var entireNoteTextNodeFocuses = flatten(entireNote.map(flattenTree)).filter(isVText);

  var entireNoteTextNodes = entireNoteTextNodeFocuses.map(function (nodeFocus) {
    return nodeFocus.vNode;
  });
  var textNodesToUnote = focusesToUnnote.map(function (nodeFocus) {
    return nodeFocus.vNode;
  });
  var toWrapAndReplace = difference(entireNoteTextNodes, textNodesToUnote);

  var focusesToNote = entireNoteTextNodeFocuses.filter(function (nodeFocus) {
    return textNodesToUnote.indexOf(nodeFocus.vNode) === -1;
  });

  var noteData = getNoteDataAttribs();

  // Wrap the text nodes.
  var wrappedTextNodes = toWrapAndReplace.map(function (nodeFocus) {
    return wrapInNote(nodeFocus, noteData, tagName);
  });

  // Replace the nodes in the tree with the wrapped versions.
  focusesToNote.forEach(function (focus, i) {
    return focus.replace(wrappedTextNodes[i]);
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

},{"../../config":116,"../../utils/error-handle":124,"../../utils/get-note-data-attrs":126,"../../utils/noting/find-entire-note":131,"../../utils/noting/find-scribe-markers":138,"../../utils/noting/find-text-between-scribe-markers":140,"../../utils/vfocus/flatten-tree":157,"../../utils/vfocus/is-vfocus":163,"../../utils/vfocus/is-vtext":164,"./ensure-note-integrity":93,"./remove-empty-notes":96,"./strip-zero-width-space":104,"./unwrap-note":109,"./wrap-in-note":111,"lodash.difference":33,"lodash.flatten":35,"vtree/vtext":85}],100:[function(require,module,exports){
"use strict";

var isVFocus = require("../../utils/vfocus/is-vfocus");
var isScribeMarker = require("../../utils/noting/is-scribe-marker");
var errorHandle = require("../../utils/error-handle");

/**
 * Iterates through the entire tree from the top and removes all the scribe markers.
 * @param  {VFocus} focus Any focus within the tree.
 */
module.exports = function removeScribeMarkers(focus) {

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to removeScribeMarkers, you passed: %s", focus);
  }

  focus.top().filter(isScribeMarker).forEach(function (marker) {
    marker.remove();
  });
};

},{"../../utils/error-handle":124,"../../utils/noting/is-scribe-marker":146,"../../utils/vfocus/is-vfocus":163}],101:[function(require,module,exports){
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

},{"../../config":116,"../../utils/create-note-barrier":121,"../../utils/error-handle":124,"../../utils/noting/find-all-notes":129,"../../utils/noting/is-not-within-note":144,"../../utils/vfocus/is-not-empty":161,"../../utils/vfocus/is-vfocus":163,"../../utils/vfocus/is-vtext":164,"vtree/vtext":85}],102:[function(require,module,exports){
"use strict";

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

  noteSegments = Array.isArray(noteSegments) ? noteSegments : [noteSegments];

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

},{"../../actions/vdom/add-class":113,"../../actions/vdom/remove-class":114,"../../config":116,"../../utils/generate-uuid":125,"../../utils/get-uk-date":127,"../../utils/vfocus/is-vfocus":163,"../vdom/add-attribute":112}],103:[function(require,module,exports){
"use strict";

var isVFocus = require("../../utils/vfocus/is-vfocus");
var config = require("../../config");
var errorHandle = require("../../utils/error-handle");
var findEntireNote = require("../../utils/noting/find-entire-note");
var removeScribeMarkers = require("./remove-scribe-markers");
var createVirtualScribeMarker = require("../../utils/create-virtual-scribe-marker");

/**
 * Selects a whole note.
 *
 * Keep in mind that selection is an action that modifies the virtual DOM.
 * Make sure you don't keep references to old selections after calling this function,
 * as running this will clear any existing selection and instead select the note.
 * @param  {VFocus} noteSegment
 * @param  {String} tagName
 */
module.exports = function selectNote(noteSegment) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(noteSegment)) {
    errorHandle("Only a valid VFocus element can be passed to selectNote, you passed: %s", noteSegment);
  }

  var noteSegments = findEntireNote(noteSegment, tagName);
  removeScribeMarkers(noteSegment);

  noteSegments[0].prependChildren(createVirtualScribeMarker());
  noteSegments.splice(-1)[0].addChild(createVirtualScribeMarker());
};

},{"../../config":116,"../../utils/create-virtual-scribe-marker":122,"../../utils/error-handle":124,"../../utils/noting/find-entire-note":131,"../../utils/vfocus/is-vfocus":163,"./remove-scribe-markers":100}],104:[function(require,module,exports){
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

},{"../../utils/error-handle":124,"../../utils/vfocus/is-vfocus":163,"../../utils/vfocus/is-vtext":164}],105:[function(require,module,exports){
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

},{"../../config":116,"../../utils/error-handle":124,"../../utils/noting/find-all-notes":129,"../../utils/vfocus/is-vfocus":163,"./toggle-note-classes":106}],106:[function(require,module,exports){
"use strict";

var flatten = require("lodash.flatten");
var toggleClass = require("../vdom/toggle-class");
var addClass = require("../vdom/add-class");
var removeClass = require("../vdom/remove-class");
var errorHandle = require("../../utils/error-handle");
var hasClass = require("../../utils/vdom/has-class");
var isVFocus = require("../../utils/vfocus/is-vfocus");

module.exports = function toggleNoteClasses(notes, className) {
  notes = Array.isArray(notes) ? notes : [notes];
  notes = flatten(notes);

  if (notes.some(function (focus) {
    return !isVFocus(focus);
  }) || !className) {
    errorHandle("Only a valid VFocus(es) can be passed to toggleNoteClasses, you passed: %s", notes);
  }

  var action;
  if (notes.length === 1) {
    //if we have only one note we can assume that it should be toggled
    //because we assume it has been clicked
    action = toggleClass;
  } else {
    //if we have more than one note then we want them all to share state
    var state = notes.every(function (noteSegment) {
      return hasClass(noteSegment.vNode, className);
    });
    state ? action = removeClass : action = addClass;
  }

  notes.forEach(function (vNode) {
    vNode = vNode.vNode || vNode;
    action(vNode, className);
  });
};

},{"../../utils/error-handle":124,"../../utils/vdom/has-class":153,"../../utils/vfocus/is-vfocus":163,"../vdom/add-class":113,"../vdom/remove-class":114,"../vdom/toggle-class":115,"lodash.flatten":35}],107:[function(require,module,exports){
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

},{"../../config":116,"../../utils/error-handle":124,"../../utils/noting/find-selected-note":139,"../../utils/vfocus/is-vfocus":163,"./toggle-note-classes":106}],108:[function(require,module,exports){
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

},{"../../utils/error-handle":124,"../../utils/noting/find-selected-note":139,"../../utils/noting/is-note-segment":145,"../../utils/vfocus/flatten-tree":157,"../../utils/vfocus/is-vfocus":163,"../../vfocus":165,"./unwrap-note":109}],109:[function(require,module,exports){
"use strict";

var flatten = require("lodash.flatten");
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

  focus.parent.vNode.children = flatten(tree);

  // We want the note contents to now have their grandparent as parent.
  // The safest way we can ensure this is by changing the VFocus object
  // that previously focused on the note to instead focus on its parent.
  focus.vNode = focus.parent.vNode;
  focus.parent = focus.parent.parent;
  return focus;
};

},{"../../config":116,"../../utils/error-handle":124,"../../utils/noting/is-note-segment":145,"../../utils/vfocus/is-vfocus":163,"lodash.flatten":35}],110:[function(require,module,exports){
"use strict";

var isScribeMarker = require("../../utils/noting/is-scribe-marker");
var findPreviousNoteSegment = require("../../utils/noting/find-previous-note-segment");
var findNextNoteSegment = require("../../utils/noting/find-next-note-segment");
var removeScribeMarkers = require("./remove-scribe-markers");
var createVirtualScribeMarker = require("../../utils/create-virtual-scribe-marker");
var createNoteFromSelection = require("./create-note-from-selection");

var notingVDom = require("../../noting-vdom");
var mutate = notingVDom.mutate;
var mutateScribe = notingVDom.mutateScribe;

// Function to handle the case of pasting inside a note. Without these steps,
// we would end up with the pasted content surrounded by two separate notes.
// It finds the marker (current cursor position), the previous and next notes
// (the ones we need to sew together) and wraps them into a new note.
module.exports = function wrapInNoteAroundPaste(focus) {
  var marker = focus.find(isScribeMarker);
  var prevNote = findPreviousNoteSegment(marker);
  var nextNote = findNextNoteSegment(marker);

  removeScribeMarkers(focus);

  prevNote.prependChildren(createVirtualScribeMarker());
  nextNote.addChild(createVirtualScribeMarker());

  createNoteFromSelection(focus, undefined, true);
};

},{"../../noting-vdom":119,"../../utils/create-virtual-scribe-marker":122,"../../utils/noting/find-next-note-segment":134,"../../utils/noting/find-previous-note-segment":137,"../../utils/noting/is-scribe-marker":146,"./create-note-from-selection":92,"./remove-scribe-markers":100}],111:[function(require,module,exports){
"use strict";

var assign = require("lodash.assign");

var config = require("../../config");
var h = require("virtual-hyperscript");

var getUKDate = require("../../utils/get-uk-date");

// Wrap in a note.
// toWrap can be a vNode, DOM node or a string. One or an array with several.
module.exports = function wrapInNote(focus, data) {
  var tagName = arguments[2] === undefined ? config.get("defaultTagName") : arguments[2];

  var notes = Array.isArray(focus) ? focus : [focus];

  //data MUST be cloned as this can lead to multiple notes with the same note ID see:
  // https://github.com/guardian/scribe-plugin-noting/issues/45
  data = assign({}, data || {});

  tagName = tagName + "." + config.get("className");

  return h(tagName, { title: getUKDate(data), dataset: data }, notes);
};

},{"../../config":116,"../../utils/get-uk-date":127,"lodash.assign":31,"virtual-hyperscript":66}],112:[function(require,module,exports){
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

},{"../../utils/to-camel-case":151}],113:[function(require,module,exports){
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

},{"../../utils/error-handle":124,"../../utils/vdom/has-class":153}],114:[function(require,module,exports){
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

},{"../../utils/error-handle":124,"../../utils/vdom/has-class":153}],115:[function(require,module,exports){
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

},{"../../utils/error-handle":124,"../../utils/vdom/has-class":153,"../../utils/vfocus/is-vfocus":163,"./add-class":113,"./remove-class":114}],116:[function(require,module,exports){
"use strict";

var assign = require("lodash.assign");
var isObject = require("lodash.isobject");

//defaults
var config = {
  user: "unknown",
  nodeName: "GU-NOTE",
  tagName: "gu-note",
  defaultTagName: "gu-note",
  className: "note",
  defaultClassName: "note",
  noteStartClassName: "note--start",
  noteEndClassName: "note--end",
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
    if (isObject(key)) {
      config = assign({}, config, key);
    }

    //else set a specific key
    config[key] = val;
  }

};

},{"lodash.assign":31,"lodash.isobject":38}],117:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var toArray = require("lodash.toarray");
var isObject = require("lodash.isobject");
var throttle = require("lodash.throttle");
var find = require("lodash.find");

var config = require("./config");
var emitter = require("./utils/emitter");
var noteCollapseState = require("./utils/collapse-state");

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
var selectNote = require("./actions/noting/select-note");
var wrapInNoteAroundPaste = require("./actions/noting/wrap-in-note-around-paste");

var notingVDom = require("./noting-vdom");
var mutate = notingVDom.mutate;
var mutateScribe = notingVDom.mutateScribe;

//setup a listener for toggling ALL notes
// This command is a bit special in the sense that it will operate on all
// Scribe instances on the page.
emitter.on("command:toggle:all-notes", function (tag) {
  var state = !!noteCollapseState.get();
  var scribeInstances = document.querySelectorAll(config.get("scribeInstanceSelector"));
  scribeInstances = toArray(scribeInstances);
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

      // Browser event listeners
      scribe.el.addEventListener("keydown", function (e) {
        return _this.onNoteKeyAction(e);
      });
      scribe.el.addEventListener("click", function (e) {
        return _this.onElementClicked(e);
      });
      scribe.el.addEventListener("input", function (e) {
        return _this.validateNotes(e);
      });
      scribe.el.addEventListener("paste", function (e) {
        return _this.onPaste();
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

          // selecting notes (CTRL/META + SHIFT + A)
          if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.keyCode === 65) {
            // e.g. Firefox uses this keyboard combination to open the Add-ons Manager.
            e.preventDefault();

            this.selectNote();
          }

          var selectors = config.get("selectors");
          selectors.forEach(function (selector) {
            //we need to store the tagName to be passed to this.note()
            var tagName = selector.tagName;

            selector.keyCodes.forEach(function (keyCode) {
              //if we get just a number we check the keyCode
              if (!isObject(keyCode) && e.keyCode === keyCode) {
                e.preventDefault();
                _this.note(tagName);
              } else if (isObject(keyCode)) {
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
          if (e.metaKey || e.ctrlKey) {
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
      onPaste: {
        value: function onPaste() {
          if (this.isPasteInsideNote()) {
            mutateScribe(scribe, function (focus) {
              return wrapInNoteAroundPaste(focus);
            });
          }
        }
      },
      isPasteInsideNote: {

        // We assume user pasted inside a note if the number of notes changed.

        value: function isPasteInsideNote() {
          var pos = scribe.undoManager.position;
          var item = scribe.undoManager.item(pos)[0];

          var notesBeforePaste = countNotes(item.previousItem.content);
          var notesAfterPaste = countNotes(item.content);

          return notesAfterPaste != notesBeforePaste;

          // The number of notes in an HTML is the sum of number of note tags and start/end classes.
          function countNotes(html) {
            var hints = [config.get("defaultTagName"), config.get("noteStartClassName"), config.get("noteEndClassName")];

            // split is the fastest way
            // http://jsperf.com/find-number-of-occurrences-using-split-and-match
            return hints.reduce(function (p, c) {
              return p + html.split(c).length;
            }, 0);
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
          this.clearSelection();
        }
      },
      toggleAllNotesCollapseState: {

        // This command is a bit special in the sense that it will operate on all
        // Scribe instances on the page.

        value: function toggleAllNotesCollapseState() {
          var state = !!noteCollapseState.get();
          var scribeInstances = document.querySelectorAll(config.get("scribeInstanceSelector"));
          scribeInstances = toArray(scribeInstances);
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

        value: (function (_selectNote) {
          var _selectNoteWrapper = function selectNote() {
            return _selectNote.apply(this, arguments);
          };

          _selectNoteWrapper.toString = function () {
            return _selectNote.toString();
          };

          return _selectNoteWrapper;
        })(function () {
          mutateScribe(scribe, function (focus, selection) {
            var markers = findScribeMarkers(focus);

            //ensure we have a selection, return otherwise
            if (markers.length === 0) {
              return;
            }

            //check that the selection is within a note
            var selector = find(config.get("selectors"), function (selector) {
              // isSelectionWithinNote rather than isSelectionEntirelyWithinNote
              // since we want to allow all clicks within a note, even if it
              // selects the note and some text to the left or right of the note.
              return isSelectionWithinNote(markers, selector.tagName);
            });

            //if the selection is within a note select that note
            if (selector) {
              window.getSelection().removeAllRanges();
              // we rely on the fact that markers[0] is within a note.
              var noteSegment = findParentNoteSegment(markers[0], selector.tagName);
              selectNote(noteSegment, selector.tagName);
            }
          });
        })
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
            var isPartiallyWithinNote = isSelectionWithinNote(markers, tagName);

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
              createNoteFromSelection(focus, tagName, isPartiallyWithinNote);
            }
          });
        }
      },
      validateNotes: {

        //validateNotes makes sure all note--start note--end and data attributes are in place

        value: function validateNotes() {
          var _this = this;

          throttle(function () {
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
          });

          mutateScribe(scribe, function (focus) {
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

},{"./actions/noting/create-note-at-caret":91,"./actions/noting/create-note-from-selection":92,"./actions/noting/ensure-note-integrity":93,"./actions/noting/remove-character-from-adjacent-note":95,"./actions/noting/remove-note":98,"./actions/noting/remove-part-of-note":99,"./actions/noting/select-note":103,"./actions/noting/strip-zero-width-space":104,"./actions/noting/toggle-all-note-collapse-state":105,"./actions/noting/toggle-selected-note-collapse-state":107,"./actions/noting/toggle-selected-note-tag-names":108,"./actions/noting/wrap-in-note-around-paste":110,"./config":116,"./noting-vdom":119,"./utils/collapse-state":120,"./utils/emitter":123,"./utils/noting/find-parent-note-segment":136,"./utils/noting/find-scribe-markers":138,"./utils/noting/is-caret-next-to-note":142,"./utils/noting/is-selection-entirely-within-note":147,"./utils/noting/is-selection-within-note":148,"lodash.find":34,"lodash.isobject":38,"lodash.throttle":43,"lodash.toarray":44}],118:[function(require,module,exports){
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

},{"./config":116,"./utils/collapse-state":120,"./utils/emitter":123,"./utils/is-dom-selection-within-a-note":128}],119:[function(require,module,exports){
/**
 * Virtual DOM parser / serializer for Noting plugin.
 */

"use strict";

var TAG = "gu-note";

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

},{"./vfocus":165,"vdom-virtualize":48,"virtual-dom/diff":61,"virtual-dom/patch":62,"vtree/is-vtext":81}],120:[function(require,module,exports){
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

},{}],121:[function(require,module,exports){
"use strict";

var VText = require("vtree/vtext");

// We need these to make it possible to place the caret immediately
// inside/outside of a note.
module.exports = function createNoteBarrier() {
  return new VText("​");
};

},{"vtree/vtext":85}],122:[function(require,module,exports){
"use strict";

var h = require("virtual-hyperscript");

module.exports = function createVirtualScribeMarker() {
  return h("em.scribe-marker");
};

},{"virtual-hyperscript":66}],123:[function(require,module,exports){
"use strict";

var EventEmitter = require("./../../bower_components/scribe/src/event-emitter");
module.exports = new EventEmitter();

},{"./../../bower_components/scribe/src/event-emitter":2}],124:[function(require,module,exports){
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

},{"util":47}],125:[function(require,module,exports){
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

},{}],126:[function(require,module,exports){
"use strict";

var config = require("../config");

module.exports = function userAndTimeAsDatasetAttrs() {

  var user = config.get("user");

  return {
    noteEditedBy: user,
    noteEditedDate: new Date().toISOString()
  };
};

},{"../config":116}],127:[function(require,module,exports){
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

},{"../config":116}],128:[function(require,module,exports){
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

},{"../config":116}],129:[function(require,module,exports){
"use strict";

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
    var lastUniqueNote = uniqueNotes[uniqueNotes.length - 1];
    return lastUniqueNote[0].vNode === note[0].vNode ? uniqueNotes : uniqueNotes.concat([note]);
  }, []);
};

},{"../../config":116,"../error-handle":124,"../vfocus/is-vfocus":163,"./find-entire-note":131,"./is-note-segment":145}],130:[function(require,module,exports){
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

},{"../error-handle":124,"../vfocus/is-vfocus":163,"./is-not-scribe-marker":143,"./is-scribe-marker":146}],131:[function(require,module,exports){
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
  var isStandaloneNote = arguments[2] === undefined ? false : arguments[2];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to findEntireNote, you passed: %s", focus);
  }

  var firstNoteSegment = findFirstNoteSegment(focus, tagName);

  if (!firstNoteSegment) {
    return;
  }

  return firstNoteSegment.takeWhile(function (node) {
    return stillWithinNote(node, tagName, isStandaloneNote);
  }).filter(function (node) {
    return isNoteSegment(node, tagName);
  });
};

},{"../../config":116,"../error-handle":124,"../vfocus/is-vfocus":163,"./find-first-note-segment":132,"./is-note-segment":145,"./still-within-note":150}],132:[function(require,module,exports){
"use strict";

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

  return focus.takeWhile(function (node) {
    return stillWithinNote(node, tagName);
  }, "prev").filter(function (node) {
    return isNoteSegment(node, tagName);
  }).pop();
};

},{"../../config":116,"../error-handle":124,"../vfocus/is-vfocus":163,"./is-note-segment":145,"./still-within-note":150}],133:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var stillWithinNote = require("./still-within-note");
var isNoteSegment = require("./is-note-segment");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function findLastNoteSegment(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];
  var isStandaloneNote = arguments[2] === undefined ? false : arguments[2];

  if (!isVFocus(focus)) {
    errorHandle("only a valid VFocus can be passed to findFirstNoteSegment, you passed: %s", focus);
  }

  return focus.takeWhile(function (node) {
    return stillWithinNote(node, tagName, isStandaloneNote);
  }).filter(function (node) {
    return isNoteSegment(node, tagName);
  }).splice(-1)[0];
};

},{"../../config":116,"../error-handle":124,"../vfocus/is-vfocus":163,"./is-note-segment":145,"./still-within-note":150}],134:[function(require,module,exports){
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

},{"../../config":116,"../error-handle":124,"../vfocus/is-vfocus":163,"./is-note-segment":145}],135:[function(require,module,exports){
"use strict";

var flatten = require("lodash.flatten");
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

  var allNoteSegments = flatten(findAllNotes(focus, tagName));
  return allNoteSegments.filter(function (segment) {
    return hasNoteId(segment.vNode, noteId);
  });
};

},{"../../config":116,"../error-handle":124,"../vfocus/is-vfocus":163,"./find-all-notes":129,"./has-note-id":141,"lodash.flatten":35}],136:[function(require,module,exports){
"use strict";

var isNoteSegment = require("../noting/is-note-segment");
var isVFocus = require("../vfocus/is-vfocus");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function findParentNoteSegment(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to findParentNoteSegment, you passed: %s", focus);
  }

  return focus.find(function (node) {
    return isNoteSegment(node, tagName);
  }, "up");
};

},{"../../config":116,"../error-handle":124,"../noting/is-note-segment":145,"../vfocus/is-vfocus":163}],137:[function(require,module,exports){
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

},{"../../config":116,"../error-handle":124,"../vfocus/is-vfocus":163,"./is-note-segment":145}],138:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var isScribeMarker = require("./is-scribe-marker");
var errorHandle = require("../error-handle");

module.exports = function findScribeMarkers(focus) {

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to findScribeMarkers, you passed: %s", focus);
  }

  return focus.top().filter(isScribeMarker);
};

},{"../error-handle":124,"../vfocus/is-vfocus":163,"./is-scribe-marker":146}],139:[function(require,module,exports){
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

},{"../../config":116,"../../vfocus":165,"../error-handle":124,"../vfocus/is-vfocus":163,"./find-entire-note":131,"./find-parent-note-segment":136,"./find-scribe-markers":138}],140:[function(require,module,exports){
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

},{"../error-handle":124,"../vfocus/find-text-nodes":156,"../vfocus/is-vfocus":163,"./find-between-scribe-markers":130}],141:[function(require,module,exports){
"use strict";

var hasAttribute = require("../vdom/has-attribute");
var isVFocus = require("../vfocus/is-vfocus");

module.exports = function hasNoteId(vNode, value) {
  return hasAttribute(vNode, "data-note-id", value);
};

},{"../vdom/has-attribute":152,"../vfocus/is-vfocus":163}],142:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var errorHandle = require("../error-handle");
var config = require("../../config");
var findScribeMarkers = require("./find-scribe-markers");
var findPreviousNoteSegment = require("./find-previous-note-segment");
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

},{"../../config":116,"../error-handle":124,"../vfocus/is-vfocus":163,"./find-previous-note-segment":137,"./find-scribe-markers":138,"./is-scribe-marker.js":146}],143:[function(require,module,exports){
"use strict";

var isScribeMarker = require("./is-scribe-marker");

module.exports = function isNotScribeMarker(focus) {
  return !isScribeMarker(focus);
};

},{"./is-scribe-marker":146}],144:[function(require,module,exports){
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

},{"../../config":116,"../error-handle":124,"../vfocus/is-vfocus":163,"./find-parent-note-segment":136}],145:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var isTag = require("../vdom/is-tag");
var errorHandle = require("../error-handle");
var config = require("../../config");

// function isNote
// identifies whether a given vfocus is a note
module.exports = function isNoteSegment(focus, tagName) {

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus element can be passed to isNote, you passed: %s", focus);
  }

  //if this function is placed within a iterator (takeWhile for example)
  //the index will be passed as second argument
  //as such we it's a good idea to check this.
  if (! typeof tagName === "string") {
    errorHandle("tagName has to be passed to isNote as the second parameter, you passed: %s", tagName);
  }

  return isTag(focus.vNode, tagName);
};

},{"../../config":116,"../error-handle":124,"../vdom/is-tag":155,"../vfocus/is-vfocus":163}],146:[function(require,module,exports){
// is our selection not a note?
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var hasClass = require("../vdom/has-class");
var errorHandle = require("../error-handle");

module.exports = function isScribeMarker(vfocus) {

  if (!isVFocus(vfocus)) {
    errorHandle("Only a valid VFocus element can be passed to isNote, you passed: %s", focus);
  }

  return hasClass(vfocus.vNode, "scribe-marker");
};

},{"../error-handle":124,"../vdom/has-class":153,"../vfocus/is-vfocus":163}],147:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");

var findParentNoteSegment = require("./find-parent-note-segment");
var isNotScribeMarker = require("./is-not-scribe-marker");
var isVText = require("../vfocus/is-vtext");
var findScribeMarkers = require("./find-scribe-markers");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function isSelectionEntirelyWithinNote(markers) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  //if we pass a raw VFocus
  if (isVFocus(markers)) {
    markers = findScribeMarkers(markers);
  }

  //if we get passed the wrong argument
  if (!Array.isArray(markers)) {
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

    if (selection.length <= 0) {
      errorHandle("Error retrieving selection. Probably means the selection\n" + "has been modified and the markers don't reflect the new selection.");
    }

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

},{"../../config":116,"../error-handle":124,"../vfocus/is-vfocus":163,"../vfocus/is-vtext":164,"./find-parent-note-segment":136,"./find-scribe-markers":138,"./is-not-scribe-marker":143}],148:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");

var findParentNoteSegment = require("./find-parent-note-segment");
var isNotScribeMarker = require("./is-not-scribe-marker");
var isVText = require("../vfocus/is-vtext");
var findScribeMarkers = require("./find-scribe-markers");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function isSelectionWithinNote(markers) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];

  //if we pass a raw VFocus
  if (isVFocus(markers)) {
    markers = findScribeMarkers(markers);
  }

  //if we get passed the wrong argument
  if (!Array.isArray(markers)) {
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

    if (selection.length <= 0) {
      errorHandle("Error retrieving selection. Probably means the selection\n" + "has been modified and the markers don't reflect the new selection.");
    }

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

},{"../../config":116,"../error-handle":124,"../vfocus/is-vfocus":163,"../vfocus/is-vtext":164,"./find-parent-note-segment":136,"./find-scribe-markers":138,"./is-not-scribe-marker":143}],149:[function(require,module,exports){
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

},{"../error-handle":124,"../vfocus/is-vfocus":163,"./find-all-notes":129}],150:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var isVText = require("../vfocus/is-vtext");
var isEmpty = require("../vfocus/is-empty");
var isScribeMarker = require("./is-scribe-marker");
var findParentNoteSegment = require("../noting/find-parent-note-segment");
var errorHandle = require("../error-handle");
var config = require("../../config");

module.exports = function isWithinNote(focus) {
  var tagName = arguments[1] === undefined ? config.get("defaultTagName") : arguments[1];
  var isStandaloneNote = arguments[2] === undefined ? false : arguments[2];

  if (!isVFocus(focus)) {
    errorHandle("Only a valid VFocus can be passed to isWithinNote, you passed: %s", focus);
  }

  // We consider selection marker as the end of note when the note is not overlaping other note(s)
  if (isStandaloneNote && isScribeMarker(focus)) {
    return false;
  }

  return !isVText(focus) || isEmpty(focus) || !!findParentNoteSegment(focus, tagName);
};

},{"../../config":116,"../error-handle":124,"../noting/find-parent-note-segment":136,"../vfocus/is-empty":160,"../vfocus/is-vfocus":163,"../vfocus/is-vtext":164,"./is-scribe-marker":146}],151:[function(require,module,exports){
"use strict";

module.exports = function toCamelCase(string) {
  return string.replace(/(\-[a-z])/g, function ($1) {
    return $1.toUpperCase().replace("-", "");
  });
};

},{}],152:[function(require,module,exports){
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

},{"../error-handle":124,"../to-camel-case":151}],153:[function(require,module,exports){
// Check if VNode has class
"use strict";

module.exports = function hasClass(vNode, value) {

  if (!vNode || !vNode.properties || !vNode.properties.className) {
    return false;
  }

  var classes = vNode.properties.className.split(" ");
  return classes.some(function (cl) {
    return value === cl;
  });
};

},{}],154:[function(require,module,exports){
// We incude regular spaces because if we have a note tag that only
// includes a a regular space, then the browser will also insert a <BR>.
// If we consider a string containing only a regular space as empty we
// can remove the note tag to avoid the line break.
//
// Not ideal since it causes the space to be deleted even though the user
// hasn't asked for that. We compensate for this by moving any deleted
// space to the previous note segment.

"use strict";

var isVText = require("vtree/is-vtext");

module.exports = function (node) {
  if (isVText(node)) {
    var text = node.text;
    return text === "" || text === "​" || text === " " || text === " ";
  } else {
    return node.children.length <= 0;
  }
};

},{"vtree/is-vtext":81}],155:[function(require,module,exports){
"use strict";

module.exports = function isTag(node, tag) {
  return node.tagName && node.tagName.toLowerCase() === tag;
};

},{}],156:[function(require,module,exports){
"use strict";

var isVFocus = require("../vfocus/is-vfocus");
var isVText = require("../vfocus/is-vtext");
var errorHandle = require("../error-handle");

module.exports = function findTextNodes(focuses) {

  focuses = Array.isArray(focuses) ? focuses : [focuses];

  focuses.forEach(function (focus) {
    if (!isVFocus(focus)) {
      errorHandle("Only a valid VFocus can be passed to findTextNodes, you passed: %s", focus);
    }
  });

  return focuses.filter(isVText);
};

},{"../error-handle":124,"../vfocus/is-vfocus":163,"../vfocus/is-vtext":164}],157:[function(require,module,exports){
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

},{"../error-handle":124,"./is-vfocus":163}],158:[function(require,module,exports){
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

},{"../error-handle":124,"./flatten-tree":157,"./is-vfocus":163,"./is-vtext":164}],159:[function(require,module,exports){
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

},{"../error-handle":124,"./flatten-tree":157,"./is-empty":160,"./is-vfocus":163,"./is-vtext":164}],160:[function(require,module,exports){
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

},{"../error-handle":124,"../vdom/is-empty":154,"./is-vfocus":163}],161:[function(require,module,exports){
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

},{"../error-handle":124,"./is-empty.js":160,"./is-vfocus":163,"./is-vtext":164}],162:[function(require,module,exports){
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

},{"../error-handle":124,"../vdom/is-tag.js":155,"./is-vfocus.js":163}],163:[function(require,module,exports){
"use strict";

var VFocus = require("../../vfocus");

module.exports = function isVFocus(vFocus) {
  return vFocus instanceof VFocus;
};

},{"../../vfocus":165}],164:[function(require,module,exports){
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

},{"../../vfocus":165,"../error-handle":124,"../vfocus/is-vfocus":163,"vtree/is-vtext":81}],165:[function(require,module,exports){
/**
* VFocus: Wrap virtual node in a Focus node.
*
* Makes it possible to move around as you wish in the tree.
*
* vNode: the vNode to focus on
* parent: parent vFocus
*/

"use strict";

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
  function downRightmostLoop(focus) {
    var f = focus;
    while (f && f.canDown()) {
      f = f.down().rightmost();
    }
    return f;
  }

  return downRightmostLoop(this.left()) || this.left() || this.up();
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

VFocus.prototype.rightmost = function () {
  var siblingVNodes = this.up().vNode.children;
  var lastSiblingVNode = siblingVNodes[siblingVNodes.length - 1];

  return new VFocus(lastSiblingVNode, this.parent);
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

},{}]},{},[90])(90)
});