/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global names:false*/
(function($) {

    /*
     ======== A Handy Little QUnit Reference ========
     http://docs.jquery.com/QUnit

     Test methods:
     expect(numAssertions)
     stop(increment)
     start(decrement)
     Test assertions:
     ok(value, [message])
     equal(actual, expected, [message])
     notEqual(actual, expected, [message])
     deepEqual(actual, expected, [message])
     notDeepEqual(actual, expected, [message])
     strictEqual(actual, expected, [message])
     notStrictEqual(actual, expected, [message])
     raises(block, [expected], [message])
     */

    module('names', {
    });

    test('should abbreviate centrum', function () {
        equal(names.abbreviate("Södertälje centrum"), "Södertälje c");
    });

    test('should abbreviate centrum', function () {
        equal(names.abbreviate("Södertälje hamn"), "Södertälje h");
    });

    test('should remove Upplands', function () {
        equal(names.abbreviate("Upplands Väsby"), "Väsby");
    });

    test('should remove Stockholms', function () {
        equal(names.abbreviate("Stockholms södra"), "södra");
    });

    test('should remove T-', function () {
        equal(names.abbreviate("T-Centralen"), "Centralen");
    });

    test('should abbreviate Väster', function () {
        equal(names.abbreviate("Västerhaninge"), "V‧haninge");
    });

    test('should abbreviate Flemings', function () {
        equal(names.abbreviate("Flemingsberg"), "F‧berg");
    });

    test('should perform multiple abbreviations', function () {
        equal(names.abbreviate("Upplands hamn"), "h");
    });

}(jQuery));
