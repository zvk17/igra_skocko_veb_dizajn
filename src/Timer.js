"use strict"
class Timer {
    constructor(callback) {
        this.callback = callback;
    }
    start() {
        this.idInterval = setInterval(()=>{
            this.callback();
        }, 1000);
    }
    stop() {
        clearInterval(this.idInterval);
    }
}
