var time = {
    diff: function diff(toMillis, fromMillis) {
        return (toMillis - fromMillis) / 1000;
    },

    getTime: function (dateTime) {
        var zeroSeconds = /^.*T(.+):00$/.exec(dateTime);
        if (zeroSeconds) {
            return zeroSeconds[1];
        }
        var nonZeroSeconds = /^.*T(.+)$/.exec(dateTime);
        if (nonZeroSeconds) {
            return nonZeroSeconds[1];
        }
        return dateTime;
    }
};
