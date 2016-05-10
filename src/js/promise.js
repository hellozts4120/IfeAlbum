var Promise = function (executor) {
    executor(this.resolve.bind(this), this.reject.bind(this));
};

Promise.prototype.then = function (onResolved, onRejected) {
    this.onResolved = onResolved;
    if (onRejected) {
        this.onRejected = onRejected;
    }
};

Promise.prototype.resolve = function (value) {
    setTimeout((function() {
        if (this.onResolved) {
            this.onResolved(value);
        }
    }).bind(this), 0);
};

Promise.prototype.reject = function (error) {
    setTimeout((function() {
        if (this.onRejected) {
            this.onRejected(value);
        }
    }).bind(this), 0);
};

Promise.prototype.catch = function (onRejected) {
  this.onRejected = onRejected;
}