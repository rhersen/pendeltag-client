/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global createStation:false, TouchEvent:true*/
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

    function createJqueryMock() {
        var called = {};
        var mock = function (selector) {
            return {
                html:function (text) {
                    called[selector] = text;
                },
                text:function (text) {
                    if (text) {
                        called[selector] = text;
                    }
                },
                append:function () {
                },
                data:function () {
                },
                addClass:function () {
                },
                bind:function (e) {
                    called[selector] = e;
                },
            show:function () {
                    called['show'] = selector;
                },
                hide:function () {
                    called['hide'] = selector;
                },
                remove:function () {
                    called['remove'] = selector;
                }
            };
        };
        mock.ajax = function (params) {
            called[params.dataType] = true;
            called['cache'] = params.cache;
        };
        mock.getCalled = function (x) {
            return called[x];
        };

        return mock;
    }

    test('should remove all table rows', function () {
        var lib = createJqueryMock();
        station.setResult(lib, fixture);
        equal(lib.getCalled('remove'), 'span.countdown');
    });

    test('should set station name', function () {
        var lib = createJqueryMock();
        station.setResult(lib, fixture);
        equal(lib.getCalled('#title'), 'Femlingsberg');
    });

    test('should set update time', function () {
        var lib = createJqueryMock();
        station.setResult(lib, fixture);
        equal(lib.getCalled('#updated'), '21:32');
    });

    test('should set southbound station name', function () {
        var lib = createJqueryMock();
        station.setResult(lib, fixture);
        equal(lib.getCalled('div#southbound :last-child'), 'Östertälje');
    });

    test('should set northbound station name', function () {
        var lib = createJqueryMock();
        station.setResult(lib, { "station":"Flemingsberg", "updated":"21:32",
            "northbound":[ {"time":"22:29","destination":"Märsta"} ],
            "southbound":[]
        });
        equal(lib.getCalled('div#northbound :last-child'), 'Märsta');
    });

    test('should bind mouseup', function () {
        TouchEvent = undefined;
        var lib = createJqueryMock();
        station.setResult(lib, fixture);
        equal(lib.getCalled('#successor'), 'mouseup');
        equal(lib.getCalled('#predecessor'), 'mouseup');
    });

    test('should bind touchend', function () {
        TouchEvent = 'defined';
        var lib = createJqueryMock();
        station.setResult(lib, fixture);
        equal(lib.getCalled('#successor'), 'touchend');
        equal(lib.getCalled('#predecessor'), 'touchend');
    });

}(jQuery));
