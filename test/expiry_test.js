/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global expiry:false*/
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

    module('expiry', {
    });

    test('should not be expired before setResponse', function () {
        var target = expiry.create();
        target.setRequest(1321900001);
        ok(!target.isExpired(new Date(1321995701)));
    });

    test('should be expired before setRequest', function () {
        var target = expiry.create();
        ok(target.isExpired(new Date(1321995701)));
    });

    test('should be expired a minute after setResponse', function () {
        var target = expiry.create();
        target.setRequest(1320000000);
        target.setResponse(1320005000);
        target.setUpdated("2013-01-02T07:40:00");
        ok(target.isExpired(new Date(1320065000)));
    });

    test('should not be expired five seconds after setResponse', function () {
        var target = expiry.create();
        target.setRequest(1320000000);
        target.setResponse(1320040000);
        target.setUpdated("2013-01-02T07:39:00");
        ok(!target.isExpired(new Date(1320045000)));
    });

    test('should be expired fifteen seconds after setResponse', function () {
        var target = expiry.create();
        target.setRequest(1320000000);
        target.setResponse(1320040000);
        target.setUpdated("2013-01-02T07:39:00");
        ok(target.isExpired(new Date(1320055000)));
    });

    test('should not be expired fifteen seconds after request', function () {
        var target = expiry.create();
        target.setRequest(1320000000);
        target.setResponse(1320001900);
        target.setUpdated("2013-01-02T07:39:00");
        target.setRequest(1320002000);
        ok(!target.isExpired(new Date(1320017000)));
    });

    test('should be expired twenty-five seconds after request', function () {
        var target = expiry.create();
        target.setRequest(1320000000);
        target.setResponse(1320001900);
        target.setRequest(1320002000);
        target.setUpdated("2013-01-02T07:39:00");
        ok(target.isExpired(new Date(1320027000)));
    });

    test('should not be expired twenty-five seconds after update', function () {
        var target = expiry.create();
        target.setRequest(1320000000);
        target.setResponse(1320001900);
        target.setRequest(1320002000);
        target.setUpdated("2013-01-02T07:40:00");
        ok(!target.isExpired(new Date(1320027000)));
    });

    test('should be pending before setRequest', function () {
        var target = expiry.create();
        ok(target.isPending());
    });

    test('should be pending before setResponse', function () {
        var target = expiry.create();
        target.setRequest(1320000000);
        ok(target.isPending());
    });

    test('should not be pending after setResponse', function () {
        var target = expiry.create();
        target.setRequest(1320000000);
        target.setResponse(1320001900);
        ok(!target.isPending());
    });

}(jQuery));
