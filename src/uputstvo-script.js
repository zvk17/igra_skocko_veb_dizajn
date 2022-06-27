"use strict";
$(document).ready(()=>{
    let $potvrda1 = $("#potvrda-1");
    let $potvrda2 = $("#potvrda-2");
    let $potvrdaDugme = $("#potvrda-dugme");
    let $greska = $("#greska");

    $potvrdaDugme.on("click", ()=>{
        let p1 = $potvrda1.get(0).checked;
        let p2 = $potvrda2.get(0).checked;
        if (!p1 || !p2) {
            $greska.removeClass("d-none");
            return;
        }
        location.href = "./skocko-podesavanja.html";
    });

});
