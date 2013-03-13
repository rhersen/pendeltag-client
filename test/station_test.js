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

    var fixture = { trains: [
        { JourneyDirection: 2, "Destination": "Märsta",
            "9526": { "ExpectedDateTime": "2013-01-02T13:37:00" },
            "9525": { "ExpectedDateTime": "2013-01-02T13:40:00" }
        },
        { JourneyDirection: 1, "Destination": "Östertälje",
            "9526": { "ExpectedDateTime": "2013-01-02T13:47:00" },
            "9525": { "ExpectedDateTime": "2013-01-02T13:50:00" }}
    ], stops: [
        { "SiteId": 9526, "StopAreaName": "Flemingsberg", LatestUpdate: "2013-01-02T13:35:23.5506461+01:00" },
        { "SiteId": 9525, "StopAreaName": "Tulunge", LatestUpdate: "2013-01-02T13:34:23.5506461+01:00" }
    ] };

    test('should remove table rows', function () {
        station.setResult(fixture);

        station.setResult({
            trains: [
                { JourneyDirection: 2, "Destination": "Märsta", "9526": { "ExpectedDateTime": "2013-01-02T13:37:00" } }
            ], stops: [
                { "SiteId": 9526, "StopAreaName": "Flemingsberg", LatestUpdate: "2013-01-02T13:33:23.5506461+01:00" }
            ] });
        equal($('tr td:nth(0)').length, 1);
    });

    test('should set station name', function () {
        station.setResult(fixture);
        equal($('#title').html(), 'F‧berg');
    });

    test('should set departure time', function () {
        station.setResult(fixture);
        equal($('.table').find('.time').eq(2).html(), '13:37');
    });

    test('should handle missing stop', function () {
        station.setResult({ trains: [
            { JourneyDirection: 2, "Destination": "Märsta",
                "9526": { "ExpectedDateTime": "2013-01-02T13:37:00" },
                "9525": { "ExpectedDateTime": "2013-01-02T13:40:00" }
            },
            { JourneyDirection: 1, "Destination": "Östertälje",
                "9525": { "ExpectedDateTime": "2013-01-02T13:50:00" }}
        ], stops: [
            { "SiteId": 9526, "StopAreaName": "Flemingsberg", LatestUpdate: "2013-01-02T13:35:23.5506461+01:00" },
            { "SiteId": 9525, "StopAreaName": "Tulunge", LatestUpdate: "2013-01-02T13:34:23.5506461+01:00" }
        ] });
        equal($('tr:nth(3) td:nth(1)').html(), '13:37');
        equal($('tr:nth(3) td:nth(2)').html(), '13:40');
        equal($('tr:nth(4) td:nth(2)').html(), '13:50');
    });

    test('should generate time for every stop', function () {
        station.setResult(fixture);
        equal($('.table').find('td.time').length, 4);
    });

    test('should create rows', function () {
        station.setResult(fixture);
        equal($('tr td:nth(0)').length, 1);
    });

    test('should create header row with SiteId:s', function () {
        station.setResult(fixture);
        equal($('tr:nth(0) th:nth(0)').html(), 'id');
        equal($('tr:nth(0) th:nth(1)').html(), '9526');
    });

    test('should create header with update time', function () {
        station.setResult(fixture);
        equal($('tr:nth(1) th:nth(0)').html(), 'uppdaterad');
        equal($('tr:nth(1) th:nth(1)').html(), '13:35:23');
    });

    test('should create header with abbreviated station names', function () {
        station.setResult(fixture);
        equal($('tr:nth(2) th:nth(0)').html(), 'station');
        equal($('tr:nth(2) th:nth(1)').html(), 'F‧berg');
    });

    test('should set direction class', function () {
        station.setResult(fixture);
        ok($('.table .direction1').length > 1);
        ok($('.table .direction2').length > 1);
    });

    test('should bind mouseup', function () {
        station = createStation(false);
        station.setResult(fixture);
        ok($('#successor').data('events').mouseup, 'mouseup should be bound');
        ok($('#predecessor').data('events').mouseup, 'mouseup should be bound');
        ok($('tr:nth(0) th:nth(1)').data('events').mouseup, 'mouseup should be bound');
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
