/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global createStation:false, TouchEvent:true*/

(function ($) {

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
        {
            JourneyDirection: 2,
            "Destination": "Märsta",
            Stops: [
                {
                    "SiteId": 9526,
                    "StopAreaName": "Femlingsberg",
                    "ExpectedDateTime": "2013-01-02T13:37:00"
                }

            ]
        },
        {
            JourneyDirection: 1,
            "Destination": "Östertälje",
            Stops: [
                {
                    "ExpectedDateTime": "2013-01-02T13:47:00",
                    "SiteId": 9526,
                    "StopAreaName": "Femlingsberg"
                },
                {
                    "SiteId": 9525,
                    "StopAreaName": "Tulunge",
                    "ExpectedDateTime": "2013-01-02T13:50:00"
                }
            ]
        }
    ];

    test('should remove table rows', function () {
        station.setResult([
            {
                JourneyDirection: 2,
                "Destination": "Märsta",
                Stops: [
                    {
                        "SiteId": 9526,
                        "StopAreaName": "Femlingsberg",
                        "ExpectedDateTime": "2013-01-02T13:37:00"
                    }
                ]
            }
        ]);
        equal($('tr').length, 1);
    });

    test('should set station name', function () {
        station.setResult(fixture);
        equal($('#title').html(), 'Femlingsberg');
    });

    test('should set previous station', function () {
        station.setResult(fixture);
        equal($('#predecessor').html(), '9525');
    });

    test('should set next station', function () {
        station.setResult(fixture);
        equal($('#successor').html(), '9527');
    });

    test('should set departure time', function () {
        station.setResult(fixture);
        equal($('.table').find('.time').eq(2).html(), '13:37');
    });

    test('should generate time for every stop', function () {
        station.setResult(fixture);
        equal($('.table').find('td.time').length, 3);
    });

    test('should create rows', function () {
        station.setResult(fixture);
        equal($('tr').length, 2);
    });

    test('should set direction class', function () {
        station.setResult(fixture);
        equal($('.table .direction1').length, 4);
        equal($('.table .direction2').length, 3);
    });

    test('should bind mouseup', function () {
        station = createStation(false);
        station.setResult(fixture);
        ok($('#successor').data('events').mouseup, 'mouseup should be bound');
        ok($('#predecessor').data('events').mouseup, 'mouseup should be bound');
    });

    test('should bind touchend', function () {
        station = createStation(true);
        station.setResult(fixture);
        ok($('#successor').data('events').touchend, 'touchend should be bound');
        ok($('#predecessor').data('events').touchend, 'touchend should be bound');
    });

    test('should set id', function () {
        station.init('9526');
        equal($('#id').html(), '9526', 'should set id');
    });

    test('should add class mouse if device is not touch', function () {
        station = createStation(false);
        station.init('9526');
        equal($('.mouse').length, 1);
    });

    test('should add class touch if device is touch', function () {
        station = createStation(true);
        station.init('9526');
        equal($('.touch').length, 1);
    });

}(jQuery));
