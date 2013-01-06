/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global time:false*/
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

    module('time', {
    });

    test('should calculate difference in seconds', function() {
        equal(time.diff(3333, 1000).toString(), '2.333');
        equal(time.diff(3133, 1000).toString(), '2.133');
    });

    test('should return hour and minute if seconds are zero', function () {
        equal(time.getTime('2013-01-02T13:37:00'), '13:37');
    });

    test('should seconds too if non-zero', function () {
        equal(time.getTime('2013-01-02T13:37:17'), '13:37:17');
    });

}(jQuery));
