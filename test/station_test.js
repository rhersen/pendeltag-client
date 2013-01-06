/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global createStation:false, TouchEvent:true*/

var TouchEvent;

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

    var station = createStation();

    module('station', {
    });

    var fixture = [
        {"ExpectedDateTime":"2013-01-02T13:37:00","SiteId": 9526,"StopAreaName":"Femlingsberg","Destination":"Märsta"},
        {"ExpectedDateTime":"2013-01-02T13:47:00","SiteId": 9526,"StopAreaName":"Femlingsberg","Destination":"Östertälje"}
    ];

    test('should remove all table rows', function () {
        station.setResult($, [{"ExpectedDateTime":"2013-01-02T13:37:00","StopAreaName":"Femlingsberg","Destination":"Märsta"}]);
        equal($('span.countdown').length, 1);
    });

    test('should set station name', function () {
        station.setResult($, fixture);
        equal($('#title').html(), 'Femlingsberg');
    });

    test('should set previous station', function () {
        station.setResult($, fixture);
        equal($('#predecessor').html(), '9525');
    });

    test('should set next station', function () {
        station.setResult($, fixture);
        equal($('#successor').html(), '9527');
    });

    test('should set departure time', function () {
        station.setResult($, fixture);
        equal($('.table').find('time').html(), '13:37');
    });

    test('should set northbound station name', function () {
        station.setResult($, [ {"ExpectedDateTime":"22:29","Destination":"Märsta","StopAreaName":"Femlingsberg"} ]);
        equal($('.table').find('.destination').html(), 'Märsta');
    });

    test('should bind mouseup', function () {
        TouchEvent = undefined;
        station.setResult($, fixture);
        ok($('#successor').data('events').mouseup, 'mouseup should be bound');
        ok($('#predecessor').data('events').mouseup, 'mouseup should be bound');
    });

    test('should bind touchend', function () {
        TouchEvent = function () {};
        station.setResult($, fixture);
        ok($('#successor').data('events').touchend, 'touchend should be bound');
        ok($('#predecessor').data('events').touchend, 'touchend should be bound');
    });

    test('should set id', function () {
        station.init($, '9526');
        equal($('#id').html(), '9526', 'should set id');
    });

    test('should add class mouse if device is not touch', function () {
        TouchEvent = undefined;
        station.init($, '9526');
        equal($('.mouse').length, 1);
    });

    test('should add class touch if device is touch', function () {
        TouchEvent = function () {};
        station.init($, '9526');
        equal($('.touch').length, 1);
    });

}(jQuery));
