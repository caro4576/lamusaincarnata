// ==============================
// INICIALIZACIÓN Y VARIABLES
// ==============================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ==============================
// CARGAR PRODUCTOS DESDE JSON
// ==============================

function cargarProductos() {
  fetch("productos.json")
    .then((res) => {
      if (!res.ok) throw new Error("Error al cargar los productos");
      return res.json();
    })
    .then((productos) => mostrarProductos(productos))
    .catch((error) => console.error(error));
}

// ==============================
// AGREGAR AL CARRITO
// ==============================

function agregarAlCarrito(id, nombre, precio, imagen) {
  let producto = carrito.find((item) => item.id === id);

  if (producto) {
    producto.cantidad++;
  } else {
    carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

// ==============================
// ELIMINAR PRODUCTOS DEL CARRITO
// ==============================

function eliminar(idProducto) {
  const index = carrito.findIndex((item) => item.id === idProducto);

  if (index !== -1) {
    if (carrito[index].cantidad > 1) {
      carrito[index].cantidad--;
    } else {
      carrito.splice(index, 1);
    }
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarContador();
}

// ==============================
// PROCESAR COMPRA
// ==============================

async function comprar() {
  try {
    if (carrito.length === 0) {
      alert("❌ Tu carrito está vacío");
      return;
    }

    alert(
      "✅ Compra realizada con éxito. ¡Gracias por elegir La Musa Incarnata!",
    );

    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContador();

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error(err);
  }
}

// ==============================
// MOSTRAR PRODUCTOS EN EL INDEX
// ==============================

function mostrarProductos(productos) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  productos.forEach((prod) => {
    const div = document.createElement("div");
    div.classList.add("producto");

    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>${prod.descripcionCorta}</p>
      <p><strong>$${prod.precio}</strong></p>
      <button onclick="verDetalle(${prod.id})">Ver Detalle</button>
      <button onclick="agregarAlCarrito(${prod.id}, '${prod.nombre}', ${prod.precio}, '${prod.imagen}')">Agregar al Carrito</button>
    `;
    contenedor.appendChild(div);
  });
}

// ==============================
// MOSTRAR CARRITO
// ==============================

function mostrarCarrito() {
  const contenedor = document.getElementById("lista-carrito");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  let total = 0;

  carrito.forEach((item) => {
    total += item.precio * item.cantidad;

    contenedor.innerHTML += `
      <div class="item-carrito">
        <img src="${item.imagen}" alt="${item.nombre}" class="carrito-img">
        <p>${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}</p>
        <button onclick="eliminar(${item.id})">❌</button>
      </div>
    `;
  });

  const totalElemento = document.createElement("p");
  totalElemento.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
  contenedor.appendChild(totalElemento);
}
// ==============================
// ENVIAR PEDIDO POR WHATSAPP
// ==============================

function enviarPedidoWhatsApp() {
  if (carrito.length === 0) {
    alert("❌ Tu carrito está vacío");
    return;
  }

  let mensaje = "🖤 *Nuevo pedido desde La Musa Incarnata*%0A%0A";
  let total = 0;

  carrito.forEach(item => {
    total += item.precio * item.cantidad;
    mensaje += `• ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}%0A`;
  });

  mensaje += `%0A🧾 *Total:* $${total.toFixed(2)}%0A%0A📍 _Por favor, indicanos tu nombre y dirección de envío._`;

  const telefono = "5492266471054"; // 🔹 tu número de WhatsApp (ya lo tenés)
  const url = `https://wa.me/${telefono}?text=${mensaje}`;

  window.open(url, "_blank");
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContador();

}


// ==============================
// ACTUALIZAR CONTADOR DEL HEADER
// ==============================

function actualizarContador() {
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    contador.textContent = carrito.reduce(
      (acc, item) => acc + item.cantidad,
      0,
    );
    contador.classList.add("agregado");
    setTimeout(() => contador.classList.remove("agregado"), 300);
  }
}

// ==============================
// VER DETALLE DE PRODUCTO
// ==============================

function verDetalle(id) {
  localStorage.setItem("productoSeleccionado", id);
  window.location.href = "producto.html";
}

// ==============================
// CARGAR DETALLE DE PRODUCTO
// ==============================

function cargarDetalleProducto() {
  fetch("productos.json")
    .then((res) => res.json())
    .then((productos) => {
      const id = localStorage.getItem("productoSeleccionado");
      const producto = productos.find((p) => p.id == id);
      if (!producto) return;

      document.getElementById("detalle").innerHTML = `
        <h2>${producto.nombre}</h2>
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <p>${producto.descripcionLarga}</p>
        <p><strong>Precio: $${producto.precio}</strong></p>
        <button onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio}, '${producto.imagen}')">Agregar al Carrito</button>
      `;
    });
}

// ==============================
// EVENTOS Y LISTENERS
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.contains(document.getElementById("productos"))) {
    cargarProductos();
    actualizarContador();
  }

  if (document.body.contains(document.getElementById("detalle"))) {
    cargarDetalleProducto();
  }

  if (document.body.contains(document.getElementById("lista-carrito"))) {
    window.scrollTo(0, 0);
    mostrarCarrito();

    document.getElementById("comprar").addEventListener("click", comprar);
    document
      .getElementById("volver-tienda")
      .addEventListener("click", () => (window.location.href = "index.html"));
  }

  if (document.getElementById("volver")) {
    document
      .getElementById("volver")
      .addEventListener("click", () => (window.location.href = "index.html"));
  }
});
