document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("agregar-gasto");
  const inputNombre = document.getElementById("gasto");   // ahora texto
  const inputPotencia = document.getElementById("potencia"); // nuevo input number
  const inputCantidad = document.getElementById("cantidad"); // horas por día
  const lista = document.querySelector("#gastos ul");
  const totalPre = document.getElementById("totalpre");
  const precioTotal = document.getElementById("preciototal");
  const tarifaSpan = document.getElementById("Tarifa");

  let totalKWh = 0; // acumulador de kWh mensual

  // Función para calcular el precio total según kWh mensual
  function calcularPrecio(kWh) {
    let precio = 0;

    if (kWh < 16) {
      precio = 13.726; // mínimo
    } else if (kWh < 121) {
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
    if (kWh < 16) {
      return "El mínimo cobro a realizar es Bs. 13.726";
    } else if (kWh < 121) {
      return "Tarifa aplicada: Bs. 0.758 por kWh";
    } else if (kWh < 301) {
      return "Tarifa aplicada: Bs. 0.969 por kWh";
    } else if (kWh < 501) {
      return "Tarifa aplicada: Bs. 1.020 por kWh";
    } else if (kWh < 1001) {
      return "Tarifa aplicada: Bs. 1.068 por kWh";
    } else {
      return "Tarifa aplicada: Bs. 1.479 por kWh";
    }
  }

  // Función para actualizar los totales en pantalla
  function actualizarTotales() {
    totalPre.textContent = totalKWh.toFixed(2) + " kWh/mes";
    precioTotal.textContent = " — Bs " + calcularPrecio(totalKWh).toFixed(2);
    tarifaSpan.textContent = " — " + calcularTarifa(totalKWh);
  }

  formulario.addEventListener("submit", (e) => {
    e.preventDefault(); // evitar recarga

    const nombre = inputNombre.value.trim();
    const potencia = parseFloat(inputPotencia.value.trim());
    const horas = parseFloat(inputCantidad.value.trim());

    if (!nombre || isNaN(potencia) || potencia <= 0 || isNaN(horas) || horas <= 0) {
      alert("Por favor, escribe un nombre, una potencia válida y la cantidad de horas");
      return;
    }

    // Calcular kWh diario y luego multiplicar por 30 (mensual)
    let kWh = ((potencia * horas) / 1000) * 30;

    // Calcular precio para este aparato
    let precioItem = calcularPrecio(kWh);

    // Sumar al total mensual
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
    inputNombre.value = "";
    inputPotencia.value = "";
    inputCantidad.value = "";
  });
});
