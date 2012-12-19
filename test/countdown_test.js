/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global countdown:false*/
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

    module('countdown', {
    });

    test('should handle less than one minute', function () {
        equal(countdown.getCountdown("17:41:00", new Date(1322152807741)), "0:52.2");
    });

    test('should handle less than two minutes', function () {
        equal(countdown.getCountdown("17:41:00", new Date(1322152747147)), "1:52.8");
    });

    test('should round tenths to zero', function () {
        equal(countdown.getCountdown("17:41:00", new Date(1322152747000)), "1:53.0");
    });

    test('should handle departures next hour', function () {
        equal(countdown.getCountdown("18:01:00", new Date(1322152747000)), "21:53.0");
    });

    test('should handle departures far into next hour', function () {
        equal(countdown.getCountdown("18:39:00", new Date(1322153707000)), "43:53.0");
    });

    test('should handle train that has just departed', function () {
        var date = new Date(1322152860100);
        date.getTimezoneOffset = function () { return -60; };
        equal(countdown.getCountdown("17:41:00", date), "-0:00.1");
    });

    test('should handle train that departed a minute ago', function () {
        var date = new Date(1322152860100);
        date.getTimezoneOffset = function () { return -60; };
        equal(countdown.getCountdown("17:40:00", date), "-1:00.1");
    });

    test('should handle departures almost an hour from now', function () {
        equal(countdown.getCountdown("18:40:00", new Date(1322152860100)), "58:59.9");
    });

    test('should handle train that departs exactly now', function () {
        equal(countdown.getCountdown("17:41:00", new Date(1322152860000)), "0:00.0");
    });

    test('should handle hour without leading zero', function () {
        equal(countdown.millisSinceMidnight("5:00:00"), 18000000);
    });

}(jQuery));
