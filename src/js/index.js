import $ from 'jquery';
import '../css/styles.css';

const arrayTablero = new Array(9);
let arrayLocalStorage;
if (localStorage.partidas) {
    arrayLocalStorage = JSON.parse(localStorage.getItem('partidas'));
} else {
    arrayLocalStorage = new Array();
}
const $divTablero = $('#divTablero');
let numeroTotalBombas = 0;
let contadorMostradas = 0;
let numeroRandomX = 0;
let numeroRandomY = 0;
let inicioPartida;
let finPartida;
const regex = /\b([1-9]|[1-7][0-9]|80)\b/;
class Minas {
    constructor(valor, mostrada) {
        this.valor = valor;
        this.mostrada = mostrada;
    }
}
function newLocalStorage() {
    if (typeof (Storage) !== 'undefined') {
        finPartida = new Date();
        const obj = {
            duracion: inicioPartida,
            finalizacion: finPartida,
        };
        arrayLocalStorage.push(obj);
        localStorage.setItem('partidas', JSON.stringify(arrayLocalStorage));
    } else {
        document.getElementById('result').innerHTML = 'Sorry, your browser does not support Web Storage...';
    }
}
function initArray() {
    for (let i = 0; i < 9; i += 1) {
        arrayTablero[i] = new Array(9);
        for (let j = 0; j < 9; j += 1) {
            arrayTablero[i][j] = new Minas(0, false);
        }
    }
}
function addToDiv() {
    $divTablero.empty();
    for (let i = 0; i < 9; i += 1) {
        const $row = $('<div>').addClass('row');
        for (let j = 0; j < 9; j += 1) {
            const $col = $('<div>', { id: i + ', ' + j }).addClass('col hidden').attr('row', i).attr('col', j);
            if (arrayTablero[i][j].valor === 'M') {
                $col.addClass('mina');
            }
            for (let q = 0; q < 9; q += 1) {
                if (arrayTablero[i][j].valor === q) {
                    $col.text(q).addClass('numero');
                }
            }
            $row.append($col);
        }
        $divTablero.append($row);
    }
}
function limpiarDiv() {
    for (let i = 0; i < 9; i += 1) {
        for (let j = 0; j < 9; j += 1) {
            $('#' + i + ', ' + j).addClass('hidden');
            $('#' + i + ', ' + j).removeClass('mina');
            $('#' + i + ', ' + j).removeClass('numero');
        }
    }
}
function perdedor() {
    for (let i = 0; i < 9; i += 1) {
        for (let j = 0; j < 9; j += 1) {
            arrayTablero[i][j].mostrada = true;
        }
    }
    newLocalStorage();
    $('div').removeClass('hidden').removeClass('mina');
    document.getElementById('result').innerHTML = 'GAME OVER';
}
function ganador(row, col) {
    if (arrayTablero[row][col].valor !== 'M' || arrayTablero[row][col].mostrada === true) {
        contadorMostradas += 1;
        if (contadorMostradas === (81 - $('#numeroMinas').val())) {
            document.getElementById('result').innerHTML = 'Has ganado\nHas mostrado toda la puntuación';
            for (let i = 0; i < 9; i += 1) {
                for (let j = 0; j < 9; j += 1) {
                    arrayTablero[i][j].mostrada = true;
                }
            }
            $('div').removeClass('hidden').removeClass('mina');
            newLocalStorage();
        }
    }
}
function comprobarNumeroInput(numeroMinas) {
    if (regex.exec(numeroMinas)) {
        return true;
    } else {
        document.getElementById('result').innerHTML = 'El numero introducido no cumple con los requisitos!';
        return false;
    }
}
function comprobarNumeroArrayExiste() {
    if (arrayTablero[numeroRandomX][numeroRandomY].valor !== 'M') return true;
}
function añadirNumeroAlrededorTablero(y, z) {
    if (arrayTablero[y - 1] && arrayTablero[y - 1][z - 1] && arrayTablero[y - 1][z - 1].valor !== 'M') arrayTablero[y - 1][z - 1].valor += 1;
    if (arrayTablero[y][z - 1] && arrayTablero[y][z - 1].valor !== 'M') arrayTablero[y][z - 1].valor += 1;
    if (arrayTablero[y + 1] && arrayTablero[y + 1][z - 1] && arrayTablero[y + 1][z - 1].valor !== 'M') arrayTablero[y + 1][z - 1].valor += 1;
    if (arrayTablero[y + 1] && arrayTablero[y + 1][z] && arrayTablero[y + 1][z].valor !== 'M') arrayTablero[y + 1][z].valor += 1;
    if (arrayTablero[y + 1] && arrayTablero[y + 1][z + 1] && arrayTablero[y + 1][z + 1].valor !== 'M') arrayTablero[y + 1][z + 1].valor += 1;
    if (arrayTablero[y][z + 1] && arrayTablero[y][z + 1].valor !== 'M') arrayTablero[y][z + 1].valor += 1;
    if (arrayTablero[y - 1] && arrayTablero[y - 1][z + 1] && arrayTablero[y - 1][z + 1].valor !== 'M') arrayTablero[y - 1][z + 1].valor += 1;
    if (arrayTablero[y - 1] && arrayTablero[y - 1][z] && arrayTablero[y - 1][z].valor !== 'M') arrayTablero[y - 1][z].valor += 1;
}
function generarPosicionMinas(numeroMinas) {
    while (numeroTotalBombas < numeroMinas) {
            numeroRandomX = Math.floor(Math.random() * 9);
            numeroRandomY = Math.floor(Math.random() * 9);
            if (comprobarNumeroArrayExiste()) {
                arrayTablero[numeroRandomX][numeroRandomY].valor = 'M'; // Mina Central
                añadirNumeroAlrededorTablero(numeroRandomX, numeroRandomY);
                numeroTotalBombas += 1;
            }
    }
    numeroTotalBombas = 0;
}
$(document).ready(function () {
    $('#empezar').click(function () {
        limpiarDiv();
        initArray();
        const numeroMinas = $('#numeroMinas').val();
        if (comprobarNumeroInput(numeroMinas)) {
            inicioPartida = new Date();
            generarPosicionMinas(numeroMinas);
            addToDiv();
        }
    });
});
$divTablero.on('click', '.mina', function () {
    const row = $(this).attr('row');
    const col = $(this).attr('col');
    if (arrayTablero[row][col].valor === 'M') {
        perdedor();
    }
});
$divTablero.on('click', '.numero', function () {
    const row = $(this).attr('row');
    const col = $(this).attr('col');
    arrayTablero[row][col].mostrada = true;
    $(this).removeClass('hidden');
    ganador(row, col);
});
