"use strict";
class Game {
    static PLAYER_NUMBER = 2;
    constructor(dataObservers, playerPanels, activeButtons = []) {
        this.activeButtons = activeButtons;
        this.playerPanels = playerPanels;
        this.dataObservers = dataObservers;
        dataObservers.forEach(observer => observer.registerRowChange(this));
        dataObservers.forEach(observer => observer.registerEndChange(this));
        this.attemptsByPlayer = [0, 0];
        this.currentPlayer = -1;
        this.idWon = -1;
        this.gameFinished = false;
        this.gameStarted = false;
        let game = this;
        this.timer = new Timer(()=> {
            if (game.currentPlayer >= 0) {
                game.dataObservers[game.currentPlayer].tick();
                let time = game.dataObservers[game.currentPlayer].getTime();
                if (time == 0) {
                    this.idWon = game.getNextPlayer();
                    this.updateEnd();

                }
            }
        });
    }
    setActiveButtons(activeButtons) {
        this.activeButtons = activeButtons;
    }
    addSymbol(symbol) {
        if (this.gameFinished || !this.gameStarted)
            return;
        this.dataObservers[this.currentPlayer].addSymbol(symbol);
    }
    removeSymbol() {

        if (this.gameFinished || !this.gameStarted)
            return;
        this.dataObservers[this.currentPlayer].removeSymbol();
    }
    startGame() {
        if (!this.gameStarted) {
            this.currentPlayer = 0;
            this.playerPanels[this.currentPlayer].activatePanel();
            this.playerPanels[this.getNextPlayer()].deactivatePanel();

            this.gameStarted = true;
            this.timer.start();
            this.activeButtons.forEach(($dugme) => {
                $dugme.removeAttr("disabled");
            });

            return true;
        }
        return false;
    }
    getNextPlayer() {
        if (this.currentPlayer == -1)
            return -1;
        return (this.currentPlayer + 1) % Game.PLAYER_NUMBER;
    }
    updateRows() {

        this.attemptsByPlayer[this.currentPlayer]++;
        let nextPlayer = this.getNextPlayer();
        if (this.attemptsByPlayer[nextPlayer] < DataObserver.MAX_ATTEMPTS) {
            this.currentPlayer = nextPlayer;

            this.playerPanels[this.getNextPlayer()].deactivatePanel();
            this.playerPanels[this.currentPlayer].activatePanel();
        }
        let gameEnded = true;
        for (let numberOfAttempts of this.attemptsByPlayer) {
            if (numberOfAttempts < DataObserver.MAX_ATTEMPTS)
                gameEnded = false;
        }
        if (gameEnded) {
            this.updateEnd();
        }
    }

    updateEnd() {
        if (this.gameStarted) {
            this.gameFinished = true;
            this.timer.stop();
            for (let i = 0; i < this.dataObservers.length; i++) {
                if (this.dataObservers[i].won) {
                    this.idWon = i;
                    break;
                }
            }
        }
        this.dataObservers.forEach(observer => observer.showSolution());
        this.activeButtons.forEach(button => button.attr("disabled", "disabled"));
        this.playerPanels.forEach(panel => panel.deactivatePanel());

        $("#kraj-igre").modal("show");
        let $kt = $("#kraj-tekst");
        if (this.idWon == -1) {
            $kt.text("Nerešeno je.");
        } else {
            $kt.text("Pobednik je: " + this.dataObservers[this.idWon].name);
        }

    }
}
