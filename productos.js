//para agregar los productos

/*import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, query, where} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

//config firebase
const firebaseConfig = {
  apiKey: "AIzaSyAJUghAaCOkVq8OFFG6hmV-PAhZGKEoPLQ",
  authDomain: "nice-sneakers-productos.firebaseapp.com",
  projectId: "nice-sneakers-productos",
  storageBucket: "nice-sneakers-productos.firebasestorage.app",
  messagingSenderId: "935438759754",
  appId: "1:935438759754:web:4c7f0fa36d02b7ed29f3b3",
  measurementId: "G-RZZGKR3J3L"
};

//inicializar firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore (app);

//traer los productos desde la coleccion de firebase
async function cargarProductosCategoria(categoria, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  //filtrado por categoria
  const q = query (collection(db, "productos"), where ("categoria", "==", categoria));
  const querySnapshot = await getDocs(q);

  //esto es para q se borre todo en la categoria y evitar q los productos se dupliquen
  contenedor.innerHTML = '';

  querySnapshot.forEach((doc) => {
    const producto = doc.data();

    //se hace la tarjeta del producto
    contenedor.innerHTML += `
    
    <div class="cont" data-name="${doc.id}">
      <img src="${producto.imagen}" class="pluc">
      <p class="potaxie">${producto.nombre}</p>
      <p class="fife">$${producto.precio}</p>
    </div>

    `;

      

  });

  
  //los nuevos productos a los modales
  document.querySelectorAll(`#${contenedorId} .cont`).forEach(item =>{
    item.addEventListener('click', () => abrirModal(item.getAttribute('data-name')));
  });
}

//funcion para abrir el modal
async function abrirModal(productoId) {
  const docSnap = await getDoc(doc(db, "productos", productoId));
  const producto = docSnap.data();

  const modal = document.querySelector(`.comtenido[data-target="${productoId}"]`);
  if (!modal) return;

  //actualizar el modal con los datos del producto
  modal.querySelector('.pluc').src = producto.imagen;
  modal.querySelector('.tula').textContent = producto.nombre;
  modal.querySelector('.presio').textContent = `$${producto.precio}`;

  //actualizar tallas
  if(producto.tallas && modal.querySelector('select')){
    const select = modal.querySelector('select');
    select.innerHTML = producto.tallas.map(t => `<option value="${t}">${t}</option>`).join('');
  }

  modal.style.display = 'block';
}

//cargar las categorias al iniciar la pagina
document.addEventListener('DOMContentLoaded', () => {
  cargarProductosCategoria("Lo más vendido", "LoMasVendido");
  cargarProductosCategoria("Lo más nuevo", "LoMasNuevo");
  cargarProductosCategoria("Ofertas del día", "OfertasDelDia");  
});

*/