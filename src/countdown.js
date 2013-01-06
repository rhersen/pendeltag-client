function createCountdown() {
    var MINUTES = 60000;
    var SECONDS = 1000;
    var MINUTES_PER_HOUR = 60;
    var HOURS = MINUTES_PER_HOUR * MINUTES;
    var HOURS_PER_DAY = 24;

    function getNow(nowTime) {
        var offset = nowTime.getTimezoneOffset() * MINUTES;
        return (nowTime.getTime() - offset) % (HOURS_PER_DAY * HOURS);
    }

    function millisSinceMidnight(time) {
        var start = time.indexOf('T');
        var firstColon = time.indexOf(':');
        var secondColon = time.lastIndexOf(':');
        if (start < 1 || firstColon < 1 || secondColon < 1) {
            return undefined;
        } else {
            var hour = time.substring(start + 1, firstColon);
            var minute = time.substring(firstColon + 1, secondColon);
            var second = time.substring(secondColon + 1);
            return hour * HOURS + minute * MINUTES + second * SECONDS;
        }
    }

    return {
        getNow: getNow,
        millisSinceMidnight: millisSinceMidnight,
        getCountdown: function getCountdown(time, nowTime) {
            function format(millis) {
                function div(a, b) {
                    var mod = a % b;
                    return (a - mod) / b;
                }

                function pad(number) {
                    var r = number.toString();

                    if (r.length < 2) {
                        return '0' + r;
                    }

                    return r;
                }

                var minutes = div(millis, MINUTES) % MINUTES_PER_HOUR;
                var seconds = div(millis, 1000) % MINUTES_PER_HOUR;
                var tenths = div(millis, 1000 / 10) % 10;

                return minutes + ':' + pad(seconds) + '.' + tenths;
            }

            var countdown = millisSinceMidnight(time) - getNow(nowTime);

            if (countdown < 0) {
                return '-' + format(-countdown);
            } else {
                return format(countdown);
            }
        }
    };
}

var countdown = createCountdown();
