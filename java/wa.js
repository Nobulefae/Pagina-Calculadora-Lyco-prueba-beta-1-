document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("agregar-gasto");
  const selectGasto = document.getElementById("gasto");
  const inputCantidad = document.getElementById("cantidad");
  const lista = document.querySelector("#gastos ul");
  const totalPre = document.getElementById("totalpre");
  const precioTotal = document.getElementById("preciototal");
  const tarifaSpan = document.getElementById("Tarifa");

  let totalKWh = 0; // acumulador de kWh

  // Valores de potencia en watts
  const potencias = {
  tv_led: 40,
  tv_plasma: 90,
  tv_lcd: 180,
  ventilador_pequeño: 80,
  ventilador_grande: 120,
  pc_escritorio: 550,
  pc_portatil: 100,
  foco_led: 10,
  foco_incandescente: 60,
  refrigerador: 300,
  microondas: 800,
  batidora: 200,
  aspiradora: 800,
  secadoradepelo: 1600,
  cafetara: 750,
  congelador: 400,
  plancha: 1000,
  calentadordeaire: 1500,
  radiograbadora: 40,
  tostadora: 1000,

  // nuevos
  lavadora: 500,
  aire_acondicionado: 2000,
  horno_electrico: 1200,
  consola: 150,
  router: 15,
};

  // Función para calcular el precio total según kWh
  function calcularPrecio(kWh) {
    let precio = 0;

    if (kWh < 121) {
      precio = kWh * 0.758;
    } else if (kWh < 301) {
      precio = kWh * 0.969;
    } else if (kWh < 501) {
      precio = kWh * 1.020;
    } else if (kWh < 1001) {
      precio = kWh * 1.068;
    } else {
      precio = kWh * 1.479;
    }

    return precio;
  }

  // Función para calcular la tarifa aplicada
  function calcularTarifa(kWh) {
    let tarifa = 0;

    if (kWh < 16) {
      return "El mínimo cobro a realizar es Bs. 13.726";
    } else if (kWh < 121) {
      tarifa = 0.758;
    } else if (kWh < 301) {
      tarifa = 0.969;
    } else if (kWh < 501) {
      tarifa = 1.020;
    } else if (kWh < 1001) {
      tarifa = 1.068;
    } else {
      tarifa = 1.479;
    }

    return "Tarifa aplicada: Bs. " + tarifa + " por kWh";
  }

  // Función para actualizar los totales en pantalla
  function actualizarTotales() {
    totalPre.textContent = totalKWh.toFixed(2) + " kWh";
    precioTotal.textContent = " — Bs " + calcularPrecio(totalKWh).toFixed(2);
    tarifaSpan.textContent = " — " + calcularTarifa(totalKWh);
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault(); // evitar recarga

    const seleccionado = selectGasto.value;
    const nombre = selectGasto.options[selectGasto.selectedIndex].text;
    const horas = parseFloat(inputCantidad.value.trim());

    if (!nombre || isNaN(horas) || horas <= 0) {
      alert("Por favor, selecciona un aparato y escribe la cantidad de horas");
      return;
    }

    // Obtener la potencia en W
    let potencia = potencias[seleccionado] || 0;

    // Calcular kWh
    let kWh = (potencia * horas) / 1000;

    // Calcular precio para este aparato
    let precioItem = calcularPrecio(kWh);

    // Sumar al total
    totalKWh += kWh;

    // Actualizar en pantalla
    actualizarTotales();

    // Crear el elemento de lista
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    // Texto del aparato, horas, potencia, kWh y precio
    li.textContent = `${nombre} — ${horas} horas — ${potencia} W — ${kWh.toFixed(2)} kWh — Bs ${precioItem.toFixed(2)}`;

    // --- Colores según el kWh del aparato ---
    if (kWh < 1) {
      li.style.backgroundColor = "#d4edda"; // verde claro
      li.style.color = "#155724"; // verde oscuro
    } else if (kWh < 5) {
      li.style.backgroundColor = "#fff3cd"; // amarillo claro
      li.style.color = "#856404"; // marrón
    } else {
      li.style.backgroundColor = "#f8d7da"; // rojo claro
      li.style.color = "#721c24"; // rojo oscuro
    }

    // Botón eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "✖";
    btnEliminar.className = "btn btn-sm btn-danger ms-2";

    // Evento para eliminar (resta el valor del total)
    btnEliminar.addEventListener("click", () => {
      totalKWh -= kWh;
      actualizarTotales();
      lista.removeChild(li);
    });

    // Agregar botón al <li>
    li.appendChild(btnEliminar);

    // Agregar <li> a la lista
    lista.appendChild(li);

    // Resetear formulario
    selectGasto.selectedIndex = 0;
    inputCantidad.value = "";
  });
});
