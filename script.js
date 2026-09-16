// 1. Tablas de conversión (mismo orden para hacer coincidir los índices)
const vogais  = ["e", "i", "a", "o", "u"];
const codigos = ["enter", "imes", "ai", "ober", "ufat"];

// 2. Selección de elementos del DOM
const entrada       = document.getElementById("entrada");
const saida         = document.getElementById("saida");
const aviso         = document.getElementById("aviso");
const botaoInverter = document.getElementById("botaoInverter");
const botaoCopiar   = document.getElementById("botaoCopiar");
const botaoLimpar   = document.getElementById("botaoLimpar");
const labelEsquerda = document.getElementById("labelEsquerda");
const labelDireita  = document.getElementById("labelDireita");
const tituloEntrada = document.getElementById("tituloEntrada");

// 3. Variables de estado
let modoCodificar = true; // true = Codificar | false = Decodificar
let textoResultado = "";

function entradaValida(frase) {
  for (let i = 0; i < frase.length; i++) {
    const letra = frase[i];
    const ehMinuscula = letra >= "a" && letra <= "z";
    const ehEspaco = letra === " ";

    // Si encuentra cualquier otro carácter (mayúsculas, tildes, números, etc.), rechaza la entrada
    if (!ehMinuscula && !ehEspaco) {
      return false;
    }
  }
  return true;
}

//Codificar

function codificar(frase) {
  const pedacos = [];
  const letras = frase.split("");

  for (let i = 0; i < letras.length; i++) {
    const posicao = vogais.indexOf(letras[i]);

    if (posicao !== -1) {
      // Es una vocal: guardamos el código equivalente
      pedacos.push({ texto: codigos[posicao], ehCodigo: true });
    } else {
      // Es una consonante o espacio: lo dejamos igual
      pedacos.push({ texto: letras[i], ehCodigo: false });
    }
  }
  return pedacos;
}

//Decodificar

function decodificar(frase) {
  const pedacos = [];
  let i = 0;

  while (i < frase.length) {
    let achouCodigo = false;

    // Probamos con cada código si coincide con el texto recortado en la posición actual
    for (let j = 0; j < codigos.length; j++) {
      const codigo = codigos[j];

      if (frase.slice(i, i + codigo.length) === codigo) {
        pedacos.push({ texto: vogais[j], ehCodigo: true });
        i += codigo.length; // Avanzamos el cursor el tamaño completo del código
        achouCodigo = true;
        break;
      }
    }

    if (!achouCodigo) {
      pedacos.push({ texto: frase[i], ehCodigo: false });
      i += 1; // Avanzamos 1 carácter normal
    }
  }
  return pedacos;
}

//Traduzir
function traduzir() {
  const frase = entrada.value;

  // Si el campo está vacío, reseteamos la caja de salida
  if (frase === "") {
    saida.innerHTML = '<span class="vazio">El resultado aparecerá aquí…</span>';
    aviso.textContent = "";
    textoResultado = "";
    return;
  }

  // Validamos las reglas del ejercicio
  if (!entradaValida(frase)) {
    saida.innerHTML = '<span class="vazio">Corrige la entrada para traducir</span>';
    aviso.classList.remove("ok");
    aviso.textContent = "✗ Usa solo letras minúsculas, sin acentos ni símbolos.";
    textoResultado = "";
    return;
  }

  // Seleccionamos la lógica según el modo activo
  const pedacos = modoCodificar ? codificar(frase) : decodificar(frase);

  // Renderizamos el resultado en el DOM
  saida.innerHTML = "";
  textoResultado = "";

  for (const p of pedacos) {
    const span = document.createElement("span");
    span.textContent = p.texto;
    if (p.ehCodigo) span.className = "cod";
    saida.appendChild(span);
    textoResultado += p.texto;
  }

  aviso.classList.add("ok");
  aviso.textContent = "✓ Entrada válida";
}

//Eventos de interacción

// Traducir dinámicamente al escribir
entrada.addEventListener("input", traduzir);

// Alternar entre Codificar y Decodificar
botaoInverter.addEventListener("click", () => {
  modoCodificar = !modoCodificar;

  labelEsquerda.classList.toggle("ativo", modoCodificar);
  labelDireita.classList.toggle("ativo", !modoCodificar);
  tituloEntrada.textContent = modoCodificar ? "Tú escribes" : "Tú escribes (en código)";
  entrada.placeholder = modoCodificar ? "Ejemplo: hola mundo" : "Ejemplo: hoberlai mufandober";

  // Reutilizamos el resultado actual como nueva entrada
  entrada.value = textoResultado;
  traduzir();
  entrada.focus();
});

// Copiar al portapapeles
botaoCopiar.addEventListener("click", async () => {
  if (textoResultado === "") return;

  try {
    await navigator.clipboard.writeText(textoResultado);
    botaoCopiar.textContent = "¡Copiado!";
    setTimeout(() => (botaoCopiar.textContent = "Copiar"), 1500);
  } catch (error) {
    botaoCopiar.textContent = "Error al copiar";
    setTimeout(() => (botaoCopiar.textContent = "Copiar"), 1500);
  }
});

// Limpiar campos
botaoLimpar.addEventListener("click", () => {
  entrada.value = "";
  traduzir();
  entrada.focus();
});