const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.argv[2] });

var cartas;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

wss.on('connection', function connection(ws) {
    console.log("Conexión establecida.");

    ws.on('message', function incoming(m) {
        let data = JSON.parse(m);
        switch (data.mensaje) {
            case "iniciarMano":
                iniciarMano(data);
                break;
            case "pedirJugada":
                jugar(data, ws);
                break;
            case "resultadoMano":
                resultadoMano(data);
                break;
            case "resultadoPartida":
                resultadoPartida(data);
                break;
            case "resultadoEnvido":
                resultadoEnvido(data);
                break;
            default:
                break;
        }
    });

});

function iniciarMano(data) {
    cartas = data.cartas;
    console.log("Cartas repartidas: [", cartas[0].palo, " ", cartas[0].numero, ", ", cartas[1].palo, " ", cartas[1].numero, ", ", cartas[2].palo, " ", cartas[2].numero, "]");
}

function jugar(data, ws) {
    let j;
    let c;
    if (data.jugadasDisponibles && data.jugadasDisponibles.length > 0) {

        j = getRandomInt(0, data.jugadasDisponibles.length - 1);

        if (data.jugadasDisponibles[j].mensaje === "carta") {

            c = getRandomInt(0, cartas.length - 1);
            data.jugadasDisponibles[j].carta = cartas[c];
            console.log(">>>>>>>> Juego Carta: ",  cartas[c].numero, " de ", cartas[c].palo);

        } else {

            console.log(">>>>>>>> ¡", data.jugadasDisponibles[j].mensaje, "!");
        }

        ws.send(JSON.stringify(data.jugadasDisponibles[j]));

        if (data.jugadasDisponibles[j].mensaje === "carta") {
            cartas = cartas.filter((e, i) => i !== c);
        }

    } else {
        console.log("### No hay jugadas disponibles ###");
    }
}

function resultadoMano(data) {
    console.log("### Resultado de la mano -> Puntos: ", data.puntos, " Puntos Oponente: ", data.puntosOponente)
}

function resultadoPartida(data) {
    console.log("### Resultado de la Partida -> ",  (data.ganada) ? "Ganada" : "Perdida");
}

function resultadoEnvido(data) {
    console.log("### Resultado del Envido -> ", (data.ganado) ? "Ganado" : "Perdido", " Tantos oponente: ", data.tantosOponente);
}