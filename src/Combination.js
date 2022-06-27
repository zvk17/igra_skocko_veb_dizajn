"use strict";
class Combination {
    static COMBINATION_SIZE = 4;

    constructor(combination) {
        Combination.checkInput(combination);
        this.combination = combination;
        this.numberOfGuesses = 0;
        this.map = Combination.getMap(combination);

    }
    static checkInput(combination) {
        if (!Array.isArray(combination) || combination.length != Combination.COMBINATION_SIZE) {
            throw new Error("Greska: loš format argumenta");
        }
    }
    static getMap(combination) {
        let map = new Map();
        for (let i = 0; i < Combination.COMBINATION_SIZE; i++) {
            let element = combination[i];
            if (map.has(element)) {
                map.set(element, map.get(element) + 1);
            } else {
                map.set(element, 1);
            }
        }
        return map;
    }
    guess(combination) {
        let {rightPlace, rightSymbol} = this.calcGuess(combination);
        let array = [];
        for (let i = 0; i < rightPlace; i++) {
            array.push("right-place");
        }
        for (let i = 0; i < rightSymbol; i++) {
            array.push("right-symbol");
        }
        while (array.length < Combination.COMBINATION_SIZE)
            array.push("");
        return array;
    }
    calcGuess(combination) {
        Combination.checkInput(combination);
        let rightPlace = 0;
        let rightSymbol = 0;
        let m = Combination.getMap(combination);
        for (let i = 0; i < Combination.COMBINATION_SIZE; i++) {
            if (this.combination[i] == combination[i]) {
                rightPlace++;
            }
        }
        for (let entry of m.entries()) {
            let [element,value] = entry;
            if (this.map.has(element)) {
                let myValue = this.map.get(element);
                rightSymbol += Math.min(value, myValue);
            }
        }
        rightSymbol -= rightPlace;
        return {rightSymbol, rightPlace};
    }
    getCombination() {
        return this.combination;
    }
}
