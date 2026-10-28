const adivinanzas = [
  { pista: "Tengo agujas pero no coso, y tengo números pero no cuento. ¿Qué soy?", respuesta: "RELOJ", opciones: ["RELOJ", "BRUJULA", "CALENDARIO", "REGLA"] },
  { pista: "Vuelo sin alas y lloro sin ojos. ¿Qué soy?", respuesta: "NUBE", opciones: ["NUBE", "AVION", "RIO", "MAR"] },
  { pista: "Blanca por dentro, verde por fuera. Si quieres que te lo diga, espera.", respuesta: "PERA", opciones: ["PERA", "MANZANA", "LIMON", "UVA"] },
  { pista: "Tengo ciudades pero no casas, ríos pero no agua y montañas pero no árboles. ¿Qué soy?", respuesta: "MAPA", opciones: ["MAPA", "LIBRO", "PAIS", "GLOBO"] },
  { pista: "Soy un conjunto de instrucciones que el computador ejecuta. ¿Qué soy?", respuesta: "PROGRAMA", opciones: ["PROGRAMA", "MONITOR", "CABLE", "TECLADO"] }
];

const valores = {
  A: 1, E: 1, O: 1, I: 1, S: 1, N: 1, R: 1, U: 1, L: 1, T: 1,
  D: 2, G: 2, C: 3, B: 3, M: 3, P: 3, H: 4, F: 4, V: 4, Y: 4,
  Q: 5, J: 8, X: 8, Z: 10
};

const elProgreso = document.getElementById("progreso");
const elPuntaje = document.getElementById("puntaje");
const elPista = document.getElementById("pista");
const elCasillas = document.getElementById("casillas");
const elOpciones = document.getElementById("opciones");
const elMensaje = document.getElementById("mensaje");
const btnSiguiente = document.getElementById("siguiente");
const elFinal = document.getElementById("final");
const btnReiniciar = document.getElementById("reiniciar");

let indice = 0;
let puntaje = 0;
let aciertos = 0;
let respondida = false;

function valorPalabra(palabra) {
  return palabra.split("").reduce(function (suma, letra) {
    return suma + (valores[letra] || 0);
  }, 0);
}

const puntajeMaximo = adivinanzas.reduce(function (suma, a) {
  return suma + valorPalabra(a.respuesta);
}, 0);

function mezclar(lista) {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copia[i];
    copia[i] = copia[j];
    copia[j] = temp;
  }
  return copia;
}

function dibujarFichasVacias(cantidad) {
  elCasillas.innerHTML = "";
  for (let i = 0; i < cantidad; i++) {
    const ficha = document.createElement("div");
    ficha.className = "ficha vacia";
    elCasillas.appendChild(ficha);
  }
}

function dibujarFichas(palabra, estado) {
  elCasillas.innerHTML = "";
  palabra.split("").forEach(function (letra) {
    const ficha = document.createElement("div");
    ficha.className = "ficha " + estado;
    ficha.textContent = letra;
    const valor = document.createElement("small");
    valor.textContent = valores[letra] || 0;
    ficha.appendChild(valor);
    elCasillas.appendChild(ficha);
  });
}

function mostrarAdivinanza() {
  const actual = adivinanzas[indice];
  respondida = false;
  elProgreso.textContent = "Adivinanza " + (indice + 1) + " de " + adivinanzas.length;
  elPuntaje.textContent = puntaje;
  elPista.textContent = actual.pista;
  elMensaje.textContent = "";
  btnSiguiente.hidden = true;
  dibujarFichasVacias(actual.respuesta.length);

  elOpciones.innerHTML = "";
  mezclar(actual.opciones).forEach(function (opcion) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "opcion";
    boton.textContent = opcion;
    boton.addEventListener("click", function () { elegir(opcion, boton); });
    elOpciones.appendChild(boton);
  });
}

function elegir(opcion, boton) {
  if (respondida) return;
  respondida = true;

  const actual = adivinanzas[indice];
  const correcto = opcion === actual.respuesta;

  dibujarFichas(opcion, correcto ? "correcta" : "incorrecta");

  elOpciones.querySelectorAll(".opcion").forEach(function (b) {
    b.disabled = true;
    if (b.textContent === actual.respuesta) b.classList.add("correcta");
  });

  if (correcto) {
    const ganado = valorPalabra(actual.respuesta);
    puntaje += ganado;
    aciertos++;
    elMensaje.textContent = "¡Correcto! +" + ganado + " puntos.";
  } else {
    boton.classList.add("incorrecta");
    elMensaje.textContent = "Incorrecto. La respuesta era " + actual.respuesta + ".";
  }

  elPuntaje.textContent = puntaje;
  btnSiguiente.textContent = indice === adivinanzas.length - 1 ? "Ver resultado" : "Siguiente";
  btnSiguiente.hidden = false;
}

function mostrarResultado() {
  elFinal.textContent = "Acertaste " + aciertos + " de " + adivinanzas.length +
    " adivinanzas. Puntaje: " + puntaje + " de " + puntajeMaximo + ".";
  document.getElementById("resultado").scrollIntoView();
}

btnSiguiente.addEventListener("click", function () {
  indice++;
  if (indice >= adivinanzas.length) {
    mostrarResultado();
  } else {
    mostrarAdivinanza();
  }
});

btnReiniciar.addEventListener("click", function () {
  indice = 0;
  puntaje = 0;
  aciertos = 0;
  elFinal.textContent = "Termina las 5 adivinanzas para ver tu puntaje.";
  mostrarAdivinanza();
  document.getElementById("juego").scrollIntoView();
});

mostrarAdivinanza();