class PlayerPanel {
    constructor($playerPanel, dataObserver) {
        this.dataObserver = dataObserver;
        this.dataObserver.registerTimerChange(this);
        this.dataObserver.registerDataChange(this);
        this.$playerPanel = $playerPanel;

        this.$playerPanel.find(".player-name").text(this.dataObserver.name);

        this.$playerTime = this.$playerPanel.find(".player-time");

        this.$playerSymbols = this.$playerPanel.find(".pogadjanje-simboli");
        this.$playerResults = this.$playerPanel.find(".pogadjanje-pogodci");

        this.symbolRows = this.getRows(this.$playerSymbols);
        this.resultRows = this.getRows(this.$playerResults);

        this.updateTime();

    }
    activatePanel() {
        //console.log("activate");
        this.$playerPanel.addClass("active");
    }
    deactivatePanel() {
        //console.log("deactivate");
        this.$playerPanel.removeClass("active");
    }
    getRows($jqueryArray) {
        let rows = [];
        for (let row of $jqueryArray) {
            let $row = $(row);
            rows.push($row.find(".polje"));
        }
        return rows;
    }
    updateTime() {
        this.setTime(this.dataObserver.getTime());
    }
    updateData() {
        this.data = this.dataObserver.getData();
        this.updateCombination();
        this.updateResults();
    }
    setTime(time) {
        this.$playerTime.text(time);
    }
    addSymbol(symbol) {
        if (this.numberOfGuesses >= 7)
            return;
        this.currentCombination.push(symbol);
        this.updateCombination();
        if (this.currentCombination.length == Combination.COMBINATION_SIZE) {
            this.updateResults();
            this.numberOfGuesses++;
            this.currentCombination = [];
        }

    }
    updateCombination() {
        for (let i = 0; i < this.data.attempts.length; i++) {
            let attempt = this.data.attempts[i];
            let $row = this.symbolRows[i];
            for (let j = 0; j < Combination.COMBINATION_SIZE; j++) {
                let $tile = $($row.get(j));
                if (j >= attempt.length) {
                    $tile.attr("class", "polje");
                    $tile.text("");
                } else {
                    $tile.attr("class", "polje");
                    $tile.addClass(attempt[j].name);
                    $tile.text(attempt[j].value);
                }


            }
        }
    }
    updateResults() {
        for (let i = 0; i < this.data.results.length; i++) {
            let result = this.data.results[i];

            let $row = this.resultRows[i];
            for (let j = 0; j < result.length; j++) {
                $($row.get(j)).addClass(result[j]);
            }
        }
    }

}
