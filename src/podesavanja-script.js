"use strict";
class ListObserver {
    constructor($unosDom) {
        this.polja = [];
        let $polja = $unosDom.find(".polje");
        for (let i = 0; i < $polja.length; i++) {
            let $polje = $polja[i];
            this.polja.push($($polje));
        }
    }
    update(combination) {
        for (let i = 0; i < Combination.COMBINATION_SIZE; i++) {
            let $polje = this.polja[i];
            if (i < combination.length) {
                let symbol = symbols[combination[i]];
                $polje.text(symbol.value);
                $polje.addClass(symbol.name);
            } else {
                $polje.text("");
                $polje.attr("class", "polje");
            }
        }
    }
}
$(document).ready(()=> {
    let $greska = $("#greska");
    let $naslov = $("#naslov");
    let $potvrda = $("#potvrda");
    let $ime = $("#ime-igraca");
    let list1 = [];
    let listObserver = new ListObserver($(".unos"));
    let brojIgraca = 0;
    let $dugmad = $("#dugmad");
    for (let s in symbols) {
        let symbol = symbols[s];
        let $dugme = $("<button>");
        $dugme.text(symbol.value);
        $dugme.addClass("polje").addClass(symbol.name);
        $dugme.attr("data-name", symbol.name);
        $dugme.attr("data-value", symbol.value);
        $dugme.on("click", ()=>{
            let $e = $dugme;
            let name = $e.attr("data-name");
            if (list1.length < Combination.COMBINATION_SIZE) {
                list1.push(name);
                listObserver.update(list1);
            }
        });
        $dugmad.append($dugme);
    }
    let $obrisiUnos = $("<button>");
    $obrisiUnos.text("←");
    $obrisiUnos.on("click", ()=>{
        if (list1.length > 0) {
            list1.pop();
            listObserver.update(list1);
        }

    });
    $dugmad.append($obrisiUnos);
    $potvrda.on("click", ()=>{
        let ime = $ime.val();
        let lista = list1;
        let greska = "";
        if (ime.length <= 2) {
            greska += "Ime mora sadržati više od 2 znaka<br />";
        }
        if (lista.length != Combination.COMBINATION_SIZE) {
            greska += "Kombinacija mora sadržati 4 simbola";
        }
        if (greska.length > 0) {
            $greska.html(greska);
            $greska.removeClass("d-none");
        } else {
            $greska.addClass("d-none");
            $ime.val("");
            if (brojIgraca == 0) {
                $naslov.text("Igrač 2");
                localStorage.setItem("name0", ime);
                console.log(lista);
                localStorage.setItem("combination1", JSON.stringify(lista));
                list1 = [];
                $ime.val("");
                listObserver.update(list1);
                brojIgraca++;
                $potvrda.text("Potvrdi i pređi na igru");
            } else {
                localStorage.setItem("name1", ime);
                localStorage.setItem("combination0", JSON.stringify(lista));
                location.href = "./skocko-igra.html";
            }
        }

    });
});
