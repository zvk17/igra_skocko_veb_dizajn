class DataObserver {
    static MAX_ATTEMPTS = 7;
    static START_TIME = 60;
    constructor(combination, name) {
        this.combination = combination;
        this.name = name;
        this.results = [];
        this.attempts = [];
        for (let i = 0; i < 7; i++) {
            this.results.push(["", "", "", ""]);
        }
        for (let i = 0; i < 8; i++) {
            this.attempts.push([]);
        }
        this.won = false;
        this.time = DataObserver.START_TIME;
        this.dataChangeList = [];
        this.rowChangeList = [];
        this.timerChangeList = [];
        this.endChangeList = [];
        this.numberOfAttempts = 0;
    }
    getTime() {
        return this.time;
    }
    tick() {
        if (this.time > 0) {
            this.time--;
            this.notifyTimer();
        }
    }
    notifyTimer() {
        this.timerChangeList.forEach(object => object.updateTime());
    }
    notifyData() {
        this.dataChangeList.forEach(object => object.updateData());
    }
    notifyRow() {
        this.rowChangeList.forEach(object => object.updateRows());
    }
    notifyEnd() {
        this.endChangeList.forEach(object => object.updateEnd());
    }
    registerDataChange(object) {
        this.dataChangeList.push(object);
    }
    registerTimerChange(object)  {
        this.timerChangeList.push(object);
    }
    registerRowChange(object) {
        this.rowChangeList.push(object);
    }
    registerEndChange(object) {
        this.endChangeList.push(object);
    }
    addSymbol(symbol) {
        if (this.numberOfAttempts >= 7) {
            return;
        }
        let na = this.numberOfAttempts;
        this.attempts[na].push(symbol);
        if (this.attempts[na].length == Combination.COMBINATION_SIZE) {
            let mappedSymbols = this.attempts[na].map(s=>s.name);
            let rightPlace = this.combination.calcGuess(mappedSymbols).rightPlace;
            this.results[na] = this.combination.guess(mappedSymbols);
            this.numberOfAttempts++;
            this.notifyRow();
            if (rightPlace == Combination.COMBINATION_SIZE) {
                this.won = true;
                this.notifyEnd();
            }
        }
        if (this.numberOfAttempts == DataObserver.MAX_ATTEMPTS) {
            let combo = this.combination.getCombination();
            this.attempts[DataObserver.MAX_ATTEMPTS] = combo.map(c => {
                return symbols[c];
            });

        }
        this.notifyData();
    }
    removeSymbol() {
        if (this.numberOfAttempts >= DataObserver.MAX_ATTEMPTS) {
            return;
        }
        let na = this.numberOfAttempts;
        if (this.attempts[na].length > 0) {
            this.attempts[na].pop();
        }
        this.notifyData();
    }
    getData() {
        return {
            attempts: this.attempts,
            results: this.results
        }
    }
    showSolution() {
        //console.log("showSolution");

        let combo = this.combination.getCombination();
        combo.forEach(item => {
            this.attempts[DataObserver.MAX_ATTEMPTS].push(symbols[item]);
        });

        this.notifyData();
    }

}
