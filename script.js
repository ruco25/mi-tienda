
// --- AUTENTICACIÓN ---

function showRegister() {
  document.getElementById('login-box').style.display = 'none';
  document.getElementById('register-box').style.display = 'block';
  document.getElementById('auth-message').innerText = "";
}

function showLogin() {
  document.getElementById('register-box').style.display = 'none';
  document.getElementById('login-box').style.display = 'block';
  document.getElementById('auth-message').innerText = "";
}

function register() {
  const email = document.getElementById('register-email').value;
  const pass = document.getElementById('register-pass').value;
  if (!email || !pass) {
    document.getElementById('auth-message').innerText = "Completa todos los campos.";
    return;
  }
  let users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[email]) {
    document.getElementById('auth-message').innerText = "Ya existe ese usuario";
    return;
  }
  users[email] = {email, pass, pedidos: []};
  localStorage.setItem('users', JSON.stringify(users));
  document.getElementById('auth-message').innerText = "¡Registrado! Ahora inicia sesión.";
  showLogin();
}

function login() {
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-pass').value;
  let users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[email] && users[email].pass === pass) {
    localStorage.setItem('logged', email);
    document.getElementById('auth-message').innerText = "¡Sesión iniciada!";
    setTimeout(() => {
      document.getElementById('auth').style.display = 'none';
      mostrarSeccion('novedades');
      showProfileMenu(email);
    }, 500);
  } else {
    document.getElementById('auth-message').innerText = "Usuario o contraseña incorrectos";
  }
}

function showProfileMenu(email) {
  if (!document.getElementById('profile-btn')) {
    const btn = document.createElement('button');
    btn.id = 'profile-btn';
    btn.innerText = '👤 Perfil';
    btn.style.position = 'fixed';
    btn.style.top = '20px';
    btn.style.right = '20px';
    btn.onclick = mostrarPerfil;
    document.body.appendChild(btn);

    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logout-btn';
    logoutBtn.innerText = 'Salir';
    logoutBtn.style.position = 'fixed';
    logoutBtn.style.top = '20px';
    logoutBtn.style.right = '100px';
    logoutBtn.onclick = logout;
    document.body.appendChild(logoutBtn);
  }
}
function logout() {
  localStorage.removeItem('logged');
  location.reload();
}

function checkAuth() {
  const email = localStorage.getItem('logged');
  if (email) {
    document.getElementById('auth').style.display = 'none';
    document.querySelector('.cart-btn').style.display = 'block';
    document.querySelector('.menu').style.display = 'flex';
    showProfileMenu(email);
  } else {
    document.getElementById('auth').style.display = 'block';
    document.querySelector('.cart-btn').style.display = 'none';
    document.querySelector('.menu').style.display = 'none';
    document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
  }
}
window.onload = checkAuth;

// ----------------------
// Lógica de productos/tienda

const productos = {
  novedades: [
    { nombre: "Remera Fresh", precio: 1000, img: "https://via.placeholder.com/250", color: ["Negro","Blanco","Azul"], talle: ["S","M","L","XL"] },
    { nombre: "Short Pro", precio: 850, img: "https://via.placeholder.com/250", color: ["Rojo","Negro","Gris"], talle: ["S","M","L","XL"] },
    { nombre: "Musculosa Drop", precio: 900, img: "https://via.placeholder.com/250", color: ["Verde","Negro","Blanco"], talle: ["S","M","L"] },
    { nombre: "Medias RAN", precio: 400, img: "https://via.placeholder.com/250", color: ["Blanco","Negro"], talle: ["Único"] }
  ],
  exclusive: [
    { nombre: "Campera Elite", precio: 2500, img: "https://via.placeholder.com/250", color: ["Negro","Gris","Rojo"], talle: ["S","M","L","XL"] },
    { nombre: "Pantalón Lux", precio: 2300, img: "https://via.placeholder.com/250", color: ["Gris","Negro"], talle: ["S","M","L"] },
    { nombre: "Hoodie Neon", precio: 2000, img: "https://via.placeholder.com/250", color: ["Negro","Verde"], talle: ["S","M","L","XL"] },
    { nombre: "Chaleco Wind", precio: 1800, img: "https://via.placeholder.com/250", color: ["Negro","Blanco"], talle: ["S","M","L"] }
  ],
  drop: [
    { nombre: "Remera Limitada", precio: 1500, img: "https://via.placeholder.com/250", color: ["Negro","Blanco"], talle: ["S","M","L","XL"] },
    { nombre: "Short edición Drop", precio: 1200, img: "https://via.placeholder.com/250", color: ["Negro","Rojo"], talle: ["S","M","L"] },
    { nombre: "Campera Glow", precio: 2700, img: "https://via.placeholder.com/250", color: ["Negro","Lila"], talle: ["M","L","XL"] },
    { nombre: "Musculosa Sport", precio: 1000, img: "https://via.placeholder.com/250", color: ["Azul","Negro"], talle: ["S","M","L"] }
  ]
};

function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(s => s.style.display = "none");
  const seccion = document.getElementById(id);
  seccion.style.display = "block";
  if (!seccion.innerHTML.trim()) {
    let html = '<div class="productos">';
    productos[id].forEach((p, i) => {
      html += `
      <div class="producto">
        <img src="${p.img}" alt="${p.nombre}" />
        <h3>${p.nombre}</h3>
        <p>$${p.precio}</p>
        <select id="${id}_color_${i}">${p.color.map(c => `<option>${c}</option>`).join("")}</select>
        <select id="${id}_talle_${i}">${p.talle.map(t => `<option>${t}</option>`).join("")}</select>
        <input type="number" id="${id}_cant_${i}" value="1" min="1" />
        <select id="${id}_pago_${i}"><option>Efectivo</option><option>Transferencia</option><option>MercadoPago</option></select>
        <button class="add-btn" onclick="agregarAlCarrito('${id}', ${i})">Agregar</button>
      </div>`;
    });
    html += '</div>';
    seccion.innerHTML = html;
    window.scrollTo({ top: seccion.offsetTop, behavior: 'smooth' });
  }
}

let carrito = [];
function agregarAlCarrito(tipo, index) {
  const prod = productos[tipo][index];
  const color = document.getElementById(`${tipo}_color_${index}`).value;
  const talle = document.getElementById(`${tipo}_talle_${index}`).value;
  const cant = document.getElementById(`${tipo}_cant_${index}`).value;
  const pago = document.getElementById(`${tipo}_pago_${index}`).value;
  carrito.push({ nombre: prod.nombre, color, talle, cant, pago });
  alert("Producto agregado al carrito.");
}

function mostrarCarrito() {
  const cart = document.getElementById("cart");
  cart.style.display = cart.style.display === "block" ? "none" : "block";
  const cont = document.getElementById("cartItems");
  cont.innerHTML = carrito.map(c => `<p>${c.cant}x ${c.nombre} - ${c.color} - ${c.talle} - ${c.pago}</p>`).join('');
}

function finalizarCompra() {
  if (carrito.length === 0) return alert("Tu carrito está vacío.");
  const email = localStorage.getItem('logged');
  if (!email) return alert("Debes iniciar sesión para comprar.");
  const msg = carrito.map(c =>
    `${c.cant}x ${c.nombre} - ${c.color} - ${c.talle} - ${c.pago}`).join('\n');
  // Guarda el pedido en el perfil del usuario
  let users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[email]) {
    users[email].pedidos.push({fecha: new Date().toLocaleString(), items: msg});
    localStorage.setItem('users', JSON.stringify(users));
  }
  // WhatsApp
  window.open("https://wa.me/598091290479?text=" + encodeURIComponent("Hola, quiero comprar:\n" + msg), "_blank");
  carrito = [];
  mostrarCarrito();
  alert("¡Pedido enviado y guardado en tu perfil!");
}

function mostrarPerfil() {
  document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
  let perfil = document.getElementById('perfil');
  if (!perfil) {
    perfil = document.createElement('section');
    perfil.id = 'perfil';
    perfil.className = 'seccion';
    document.body.insertBefore(perfil, document.querySelector('footer'));
  }
  const email = localStorage.getItem('logged');
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const user = users[email];
  perfil.innerHTML = `<h2>Perfil de ${email}</h2>
    <h3>Mis pedidos</h3>
    <div>${user.pedidos.length === 0 ? 'No tienes pedidos aún.' : user.pedidos.map(p =>
      `<p>${p.fecha}:<br>${p.items.replace(/\n/g,"<br>")}</p>`).join('')}</div>
    <button onclick="logout()">Cerrar sesión</button>`;
  perfil.style.display = 'block';
}