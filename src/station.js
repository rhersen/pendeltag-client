/*global expiry: false, names: false, countdown: false, alert: false */

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

        function updateHtml() {
            lib('#title').html(names.abbreviate(result.station));
            lib('#predecessor').html(result.predecessor);
            lib('#successor').html(result.successor);
            lib('#updated').html(result.updated);
        }

        function updateTable() {
            lib('span.time').remove();
            lib('span.destination').remove();
            lib('span.countdown').remove();
            result.northbound.forEach(createDivRow('northbound'));
            result.southbound.forEach(createDivRow('southbound'));
        }

        function createDivRow(trClass) {
            return function (departure) {
                lib('div#' + trClass).append('<span></span>');
                lib('div#' + trClass + ' :last-child').html(departure.time);
                lib('div#' + trClass + ' :last-child').addClass('time');
                lib('div#' + trClass).append('<span></span>');
                lib('div#' + trClass + ' :last-child').html(names.abbreviate(departure.destination));
                lib('div#' + trClass + ' :last-child').addClass('destination');
                lib('div#' + trClass).append('<span></span>');
                lib('div#' + trClass + ' :last-child').addClass('countdown');
                lib('div#' + trClass + ' :last-child').data('time', departure.time);
            };
        }

        function bindEvent(isTouch) {
            function getRequestSender(id) {
                return function () {
                    sendRequest(lib, id);
                };
            }

            var ev = isTouch ? 'touchend' : 'mouseup';
            lib('#predecessor').bind(ev, getRequestSender(result.predecessor));
            lib('#successor').bind(ev, getRequestSender(result.successor));
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
            lib('#northbound').addClass('touch');
            lib('#southbound').addClass('touch');
        }

        lib('button.clear').click(function () {
            alert('pixel ratio is ' + window.devicePixelRatio);
        });

        if (interval) {
            setInterval(tick, interval);
        }
    }

    function sendRequest(lib, id) {
        timer.setRequest(new Date().getTime());
        updatePending(lib);
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

    return {
        setResult: setResult,
        init: init
    };
}
