"use strict";

$(document).ready(()=>{
    let predjiNaStranicuPodesavanja = () => {
        location.href = "skocko-podesavanja.html"
    };
    $("#modal-settings").on("click", predjiNaStranicuPodesavanja);
    let $endTitle = $("#kraj-igre-naslov");
    let $musicButton = $("#music-button");
    let $musicPlayer = $("#music-player");
    let $dugmad = $("#dugmad");
    let $player1Panel = $("#player-panel-1");
    let $player2Panel = $("#player-panel-2");
    let currentPlayer = 0;
    let name1 = localStorage.getItem("name0");
    let name2 = localStorage.getItem("name1");
    let combination1 = localStorage.getItem("combination0");
    let combination2 = localStorage.getItem("combination1");
    let storageError = false;
    let $predjiNaPodesavanja = $("<button>");

    $predjiNaPodesavanja.html("&#9881;");
    $predjiNaPodesavanja.addClass("settings");
    $predjiNaPodesavanja.on("click", predjiNaStranicuPodesavanja);


    //$musicButton.on("click", ()=> {
    //    if ($musicButton.hasClass("active")) {
    //        $musicPlayer.get(0).pause();
    //    } else {
    //        $musicPlayer.get(0).play();
    //    }
    //    $musicButton.toggleClass("active");
    //});


    //localStorage.clear();
    if (!name1) {
        name1 = "Igrač 1";
        storageError = true;
    }

    if (!name2) {
        name2 = "Igrač 2";
        storageError = true;
    }

    if (!!combination1) {
        combination1 = JSON.parse(combination1);
    } else {
        storageError = true;
    }
    if (!!combination2) {
        combination2 = JSON.parse(combination2);
    } else {
        storageError = true;
    }
    let dataObservers;
    try {
        dataObservers = [
            new DataObserver(new Combination(combination1), name1),
            new DataObserver(new Combination(combination2), name2)
        ];
    } catch (e) {
        storageError = true;
    }
    //localStorage.clear();

    if (storageError) {
        $endTitle.text("Podaci nisu uneti");
        $("#kraj-tekst").text("Morate uneti podatke u podešavanjima da biste igrali.");
        $("#kraj-igre").modal("show");
        $dugmad.append($predjiNaPodesavanja);

        return;
    }
    let playerPanel1 = new PlayerPanel($player1Panel, dataObservers[0]);
    let playerPanel2 = new PlayerPanel($player2Panel, dataObservers[1]);
    let game = new Game(dataObservers, [playerPanel1, playerPanel2]);



    let aktivnaIgraDugmad = [];
    for (let key in symbols) {
        let symbol = symbols[key];
        let $dugme = $("<button>");
        $dugme.addClass(symbol.name);
        $dugme.attr("data-name", symbol.name);
        $dugme.attr("data-value", symbol.value);
        $dugme.attr("disabled", "disabled");
        $dugme.text(symbol.value);

        $dugme.on("click", ()=>{
            let $e = $dugme;
            game.addSymbol({
                name: $e.attr("data-name"),
                value: $e.attr("data-value")
            });

        });
        aktivnaIgraDugmad.push($dugme);
        $dugmad.append($dugme);
    }
    let $obrisiUnos = $("<button>");
    $obrisiUnos.text("←");
    $obrisiUnos.on("click", ()=>{
        game.removeSymbol();
    });
    $obrisiUnos.attr("disabled", "disabled");
    aktivnaIgraDugmad.push($obrisiUnos);
    $dugmad.append($obrisiUnos);

    game.setActiveButtons(aktivnaIgraDugmad);


    let $startujIgru = $("<button>");
    $startujIgru.text("START").addClass("start");
    $startujIgru.on("click", ()=> {
        if (game.startGame()) {
            $startujIgru.attr("disabled", "disabled");
        }
    });
    $dugmad.append($startujIgru);


    $dugmad.append($predjiNaPodesavanja);






});
