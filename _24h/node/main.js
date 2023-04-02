let mytab = [
    ["nom", "ip", "port"],
    ["nom1", "ip1", "port1"]
];

let selecteur = document.getElementById("selecteur");
let affichage = document.getElementById("affichage");
console.log("CouCou");
for (let i = 0; i < mytab.length; i++) {
    let nom = mytab[i][0];
    let ip = mytab[i][1];
    let port = mytab[i][2];

    let option = document.createElement("option");
    option.text = nom;
    selecteur.add(option);

    option.addEventListener("click", function() {
        affichage.innerHTML = "IP : " + ip + ", port : " + port;
    });
}
