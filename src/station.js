/*global time: false, expiry: false, names: false, countdown: false, $: false */

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
            timer.setUpdated(result.updated);
        }

        function getPredecessor() {
            return result[0].Stops[0].SiteId - 1;
        }

        function getCurrent() {
            return result[0].Stops[0].SiteId + 0;
        }

        function getSuccessor() {
            return result[0].Stops[0].SiteId + 1;
        }

        function updateHtml() {
            $('#title').html(names.abbreviate(result[0].Stops[0].StopAreaName));
            $('#predecessor').html(getPredecessor());
            $('#successor').html(getSuccessor());
            $('#updated').html(result.updated);
        }

        function updateTable() {
            $('section.table time').remove();
            $('span.destination').remove();
            $('span.countdown').remove();
            result.forEach(createDivRow());
        }

        function createDivRow() {
            return function (departure) {
                var dir = 'direction' + departure.JourneyDirection;
                var dateTime = departure.Stops[0].ExpectedDateTime;
                var table = $('.table');
                $('<time></time>')
                    .appendTo(table)
                    .html(time.getTime(dateTime))
                    .addClass(dir);
                $('<span></span>').appendTo(table)
                    .html(names.abbreviate(departure.Destination))
                    .addClass('destination')
                    .addClass(dir);
                $('<span></span>').appendTo(table)
                    .addClass('countdown')
                    .addClass(dir)
                    .data('time', departure.Stops[0].ExpectedDateTime);
            };
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
