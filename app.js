
// INICIALIZACIÓN Y VARIABLES GLOBALES

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];



// Cargar productos desde JSON
function cargarProductos() {
  fetch("productos.json")
    .then(res => {
      if (!res.ok) throw new Error("Error al cargar los productos");
      return res.json();
    })
    .then(productos => mostrarProductos(productos))
    .catch(error => console.error(error));
}

// Agregar producto al carrito
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


// Eliminar productos del carrito de uno en uno
function eliminar(idProducto) {
  const index = carrito.findIndex(item => item.id === idProducto);

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

// Simular proceso de compra
async function comprar() {
  try {
    const msg = await new Promise((resolve, reject) => {
      if (carrito.length > 0) {
        setTimeout(() => resolve("✅ Compra realizada con éxito"), 1000);
      } else {
        reject("❌ Tu carrito está vacío");
      }
    });

    alert(msg);
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContador();
  } catch (err) {
    alert(err);
  }
}





// Mostrar productos en el index.html
function mostrarProductos(productos) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = ""; // Limpiar el contenedor antes de agregar

  productos.forEach(prod => {
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

// Mostrar los productos en el carrito.html
function mostrarCarrito() {
  const contenedor = document.getElementById("lista-carrito");
  if (!contenedor) return; // Asegurar que el contenedor existe

  contenedor.innerHTML = "";
  let total = 0;

  carrito.forEach(item => {
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

// Actualizar el contador del carrito en el header
function actualizarContador() {
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    contador.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contador.classList.add("agregado");
    setTimeout(() => contador.classList.remove("agregado"), 300);
  }
}
// Guardar el ID del producto seleccionado y redirigir producto.html
function verDetalle(id) {
  localStorage.setItem("productoSeleccionado", id);
  window.location.href = "producto.html";
}

// Cargar el detalle de un producto en producto.html
function cargarDetalleProducto() {
  fetch("productos.json")
    .then(res => res.json())
    .then(productos => {
      const id = localStorage.getItem("productoSeleccionado");
      const producto = productos.find(p => p.id == id);
      if (!producto) return; 

      document.getElementById("detalle").innerHTML = `
        <h2>${producto.nombre}</h2>
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <p>${producto.descripcionLarga}</p>
        <p><strong>Precio: $${producto.precio}</strong></p>
        <button onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio})">Agregar al Carrito</button>
      `;
    });
}

//eventos y listeners

document.addEventListener("DOMContentLoaded", () => {
  // Inicialización de la página de productos
  if (document.body.contains(document.getElementById("productos"))) {
    cargarProductos();
    actualizarContador();
  }
  // Inicialización de la página de detalle de producto
  if (document.body.contains(document.getElementById("detalle"))) {
    cargarDetalleProducto();
  }
  // Inicialización de la página del carrito
  if (document.body.contains(document.getElementById("lista-carrito"))) {
    mostrarCarrito();
    document.getElementById("comprar").addEventListener("click", comprar);
    document
      .getElementById("volver-tienda")
      .addEventListener("click", () => (window.location.href = "index.html"));
  }
  // Botón volver en producto.html
  if (document.getElementById("volver")) {
    document
      .getElementById("volver")
      .addEventListener("click", () => (window.location.href = "index.html"));
  }
});