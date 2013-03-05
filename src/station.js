/*global time: false, expiry: false, names: false, countdown: false, $: false, _: false */

function createStation(isTouch) {
    function updatePending() {
        if (timer.isPending()) {
            $('body').addClass('pending');
        } else {
            $('body').removeClass('pending');
        }
    }

    function setResult(result, currentTimeMillis) {
        function updateTimer() {
            timer.setResponse(currentTimeMillis);
            timer.setUpdated(trains.updated);
        }

        function getPredecessor() {
            return _.first(result.stops).SiteId - 1;
        }

        function getCurrent() {
            return _.first(result.stops).SiteId + 0;
        }

        function getSuccessor() {
            return _.first(result.stops).SiteId + 1;
        }

        function updateHtml() {
            $('#title').html(names.abbreviate(_.first(result.stops).StopAreaName));
            $('#predecessor').html(getPredecessor());
            $('#successor').html(getSuccessor());
            $('#updated').html(trains.updated);
        }

        function updateTable() {
            function createHeaderRow(heading, values) {
                function appendTh(html) {
                    $('<th></th>').appendTo(header).html(html);
                }

                var header = $('<tr></tr>').appendTo($('.table'));
                appendTh(heading);
                _.each(_.map(result.stops, values), appendTh);
            }

            function getSiteId(stop) {
                return stop.SiteId;
            }

            function getName(stop) {
                return names.abbreviate(stop.StopAreaName);
            }

            $('tr').remove();

            createHeaderRow('id', getSiteId);
            createHeaderRow('Destination', getName);

            _.each(trains, createDivRow);
        }

        function createDivRow(departure) {
            var dir = 'direction' + departure.JourneyDirection;
            var row = $('<tr></tr>').appendTo($('.table'));
            $('<td></td>').appendTo(row)
                .html(names.abbreviate(departure.Destination))
                .addClass('destination')
                .addClass(dir);
            _.each(result.stops, function (resultStop) {
                var stop = departure[resultStop.SiteId];
                var dateTime = stop.ExpectedDateTime;
                $('<td></td>')
                    .appendTo(row)
                    .html(time.getTime(dateTime))
                    .addClass('time')
                    .addClass(dir);
            });
            $('<td></td>').appendTo(row)
                .addClass('countdown')
                .addClass(dir)
                .data('time', departure[_.first(result.stops).SiteId].ExpectedDateTime);
        }

        function bindEvent() {
            function getRequestSender(id) {
                return function () {
                    sendRequest(id);
                };
            }

            var ev = isTouch ? 'touchend' : 'mouseup';
            $('#predecessor').bind(ev, getRequestSender(getPredecessor()));
            $('#title').bind(ev, getRequestSender(getCurrent()));
            $('#successor').bind(ev, getRequestSender(getSuccessor()));
        }

        var trains = result.trains;

        updateTimer();
        updatePending();
        updateHtml();
        updateTable();
        bindEvent();
    }

    function init(id, interval) {
        function tick() {
            function setCountdowns() {
                var now = new Date();

                $('span.countdown').each(function () {
                    var time = $(this).data('time');
                    $(this).html(countdown.getCountdown(time, now));
                });
            }

            $('#expired').html((timer.getDebugString()));

            setCountdowns();

            if (timer.isExpired(new Date())) {
                sendRequest($('span#id').text());
            }
        }

        $('span#id').text(id);

        if (isTouch) {
            $('.table').addClass('touch');
        } else {
            $('.table').addClass('mouse');
        }

        $('button.clear').click(function () {
            clearInterval(intervalId);
        });

        if (interval) {
            intervalId = setInterval(tick, interval);
        }
    }

    function sendRequest(id) {
        timer.setRequest(new Date().getTime());
        updatePending();
        $('#title').unbind('mouseup touchend').html(id);
        $('#predecessor').unbind('mouseup touchend').html(' ');
        $('#successor').unbind('mouseup touchend').html(' ');

        $.ajax({
            url: '/departures/' + id + '.json',
            dataType: 'json',
            cache: false,
            success: function (result) {
                setResult(result, new Date().getTime());
            }
        });

        $('span#id').text(id);
    }

    var timer = expiry.create();
    var intervalId;

    return {
        setResult: setResult,
        init: init
    };
}
