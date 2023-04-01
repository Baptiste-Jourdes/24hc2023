// Importer le module 'keypress'
const keypress = require('keypress');

// Fonction qui sera appelée lorsque la lettre "z" sera appuyée
function up() {
    console.log('up');
}
function down() {
    console.log('down');
}
function left() {
    console.log('left');
}
function right() {
    console.log('right');
}

// Activer la saisie des touches
keypress(process.stdin);

// Écouter les événements de saisie des touches
process.stdin.on('keypress', function (ch, key) {
    // Vérifier si la touche "z" a été appuyée
    if (key && key.name === 'z') {
        // Appeler la fonction pour afficher "z"
        up();
    }
    if (key && key.name === 's') {
        // Appeler la fonction pour afficher "z"
        down();
    }
    if (key && key.name === 'q') {
        // Appeler la fonction pour afficher "z"
        left();
    }
    if (key && key.name === 'd') {
        // Appeler la fonction pour afficher "z"
        right();
    }
    if (key && key.name === 'p') {
        // Appeler la fonction pour afficher "z"
        process.exit();
    }

});

// Démarrer la saisie des touches
process.stdin.setRawMode(true);
process.stdin.resume();