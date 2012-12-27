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

    var fixture = {
        "station":"Femlingsberg","updated":"21:32","northbound":[
            {"time":"22:29","destination":"Märsta"}
        ], "southbound":[
            {"time":"21:45","destination":"Östertälje"}
        ]};

    test('should remove all table rows', function () {
        station.setResult($, { "station": "Femlingsberg","updated":"21:32","northbound":[ ], "southbound":[ ]});
        equal($('span.countdown').length, 0);
    });

    test('should set station name', function () {
        station.setResult($, fixture);
        equal($('#title').html(), 'Femlingsberg');
    });

    test('should set update time', function () {
        station.setResult($, fixture);
        equal($('#updated').html(), '21:32');
    });

    test('should set southbound station name', function () {
        station.setResult($, fixture);
        equal($('#southbound').find('.destination').html(), 'Östertälje');
    });

    test('should set northbound station name', function () {
        station.setResult($, { "station":"Flemingsberg", "updated":"21:32",
            "northbound":[ {"time":"22:29","destination":"Märsta"} ],
            "southbound":[]
        });
        equal($('#northbound').find('.destination').html(), 'Märsta');
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

    test('should not add class touch', function () {
        TouchEvent = undefined;
        station.init($, '9526');
        equal($('.touch').length, 0);
    });

    test('should add class touch', function () {
        TouchEvent = function () {};
        station.init($, '9526');
        equal($('.touch').length, 2);
    });

}(jQuery));
