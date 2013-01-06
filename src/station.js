/*global time: false, expiry: false, names: false, countdown: false, alert: false */

function createStation() {
    function updatePending(lib) {
        if (timer.isPending()) {
            lib('body').addClass('pending');
        } else {
            lib('body').removeClass('pending');
        }
    }

    function setResult(lib, result, currentTimeMillis) {
        function updateTimer() {
            timer.setResponse(currentTimeMillis);
            timer.setUpdated(result.updated);
        }

        function getPredecessor() {
            return result[0].SiteId - 1;
        }

        function getCurrent() {
            return result[0].SiteId + 0;
        }

        function getSuccessor() {
            return result[0].SiteId + 1;
        }

        function updateHtml() {
            lib('#title').html(names.abbreviate(result[0].StopAreaName));
            lib('#predecessor').html(getPredecessor());
            lib('#successor').html(getSuccessor());
            lib('#updated').html(result.updated);
        }

        function updateTable() {
            lib('section.table time').remove();
            lib('span.destination').remove();
            lib('span.countdown').remove();
            result.forEach(createDivRow());
        }

        function createDivRow() {
            return function (departure) {
                lib('.table').append('<time></time>');
                var dateTime = departure.ExpectedDateTime;
                lib('.table :last-child').html(time.getTime(dateTime));
                lib('.table').append('<span></span>');
                lib('.table :last-child').html(names.abbreviate(departure.Destination));
                lib('.table :last-child').addClass('destination');
                lib('.table').append('<span></span>');
                lib('.table :last-child').addClass('countdown');
                lib('.table :last-child').data('time', departure.ExpectedDateTime);
            };
        }

        function bindEvent(isTouch) {
            function getRequestSender(id) {
                return function () {
                    sendRequest(lib, id);
                };
            }

            var ev = isTouch ? 'touchend' : 'mouseup';
            lib('#predecessor').bind(ev, getRequestSender(getPredecessor()));
            lib('#title').bind(ev, getRequestSender(getCurrent()));
            lib('#successor').bind(ev, getRequestSender(getSuccessor()));
        }

        updateTimer();
        updatePending(lib);
        updateHtml();
        updateTable();
        bindEvent(typeof TouchEvent !== 'undefined');
    }

    function init(lib, id, interval) {
        function tick() {
            function setCountdowns() {
                var now = new Date();

                lib('span.countdown').each(function () {
                    var time = lib(this).data('time');
                    lib(this).html(countdown.getCountdown(time, now));
                });
            }

            lib('#expired').html((timer.getDebugString()));

            setCountdowns();

            if (timer.isExpired(new Date())) {
                sendRequest(lib, lib('span#id').text());
            }
        }

        lib('span#id').text(id);

        if (typeof TouchEvent === 'function') {
            lib('.table').addClass('touch');
        } else {
            lib('.table').addClass('mouse');
        }

        lib('button.clear').click(function () {
            clearInterval(intervalId);
        });

        if (interval) {
            intervalId = setInterval(tick, interval);
        }
    }

    function sendRequest(lib, id) {
        timer.setRequest(new Date().getTime());
        updatePending(lib);
        lib('#title').unbind('mouseup touchend');
        lib('#predecessor').unbind('mouseup touchend');
        lib('#successor').unbind('mouseup touchend');
        lib('#title').html(id);
        lib('#predecessor').html(' ');
        lib('#successor').html(' ');

        lib.ajax({
            url: '/departures/' + id + '.json',
            dataType: 'json',
            cache: false,
            success: function (result) {
                setResult(lib, result, new Date().getTime());
            }
        });

        lib('span#id').text(id);
    }

    var timer = expiry.create();
    var intervalId;

    return {
        setResult: setResult,
        init: init
    };
}
