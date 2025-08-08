/*para agregar los productos, importa las funciones necesarias de Firebase
  para inicializar la app y trabajar con Firectore
*/
//initializeApp: funcion para inicializarla conexion con FB
//getFirestore: obtiene la instancia de FS q es la base de datos
//collection: referencia a una coleccion en FS
//getDocs: obtiene los docs de una coleccion
//doc: referencia a un doc en especifico
//getDoc: obtiene datos de un doc en especifico
//query: crea una consulta para filtrar datos
//where: filtra documentos segun la condicion (ej: categoria = "Lo mas vendido")

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, query, where} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

//config firebase con las credenciales del proyecto
const firebaseConfig = {
  apiKey: "AIzaSyAJUghAaCOkVq8OFFG6hmV-PAhZGKEoPLQ",
  authDomain: "nice-sneakers-productos.firebaseapp.com",
  projectId: "nice-sneakers-productos",
  storageBucket: "nice-sneakers-productos.firebasestorage.app",
  messagingSenderId: "935438759754",
  appId: "1:935438759754:web:4c7f0fa36d02b7ed29f3b3",
  measurementId: "G-RZZGKR3J3L"
};

//inicializar firebase con la confuguración
//app: instancia de la app FB
const app = initializeApp(firebaseConfig);
//db: instancia de FS para interactuar con la base de datos
const db = getFirestore (app);


// VARIABLES DEL FOM (ELEMENTOS HTML)
//previewContainer: Contenedor del modal
const previewContainer = document.querySelector(".preview");

//modal: el modal en si
const modal = document.querySelector(".comtenido");

//fondoborroso: fondo sdetras del modal
const fondoBorroso = document.querySelector(".fondo-borroso");

//funcion asincronica para traer los productos desde la coleccion de firebase
//categoria: nombre de la categoria
//contenedorId: ID del contenedor HTML donde se insertaran los productos
//limite: cuantos productos mostrar como maximo
async function cargarProductosCategoria(categoria, contenedorId, limite = 5) {
  
  //obtiene el contenedor HTML donde se mostraran los productos
  const contenedor = document.getElementById(contenedorId);
  
  //si no existe el contenedor, termina la ejecución
  if (!contenedor) return; 

  //filtrado por categoria
  //crea una consulta para obtener solo los productos de la categoria especificada
  //q: consulta a firestore para filtrar productos por categoria
  const q = query (collection(db, "productos"), where ("categoria", "array-contains", categoria));
  
  //ejecuta la consulta y obtiene los resultados 
  //query snapshot: resultado de la consulta (lista de docs)
  const querySnapshot = await getDocs(q);

  //esto es para q se borre todo en la categoria y evitar q los productos se dupliquen
  contenedor.innerHTML = '';

  //variable contador para saber cuantos productos hemos añadido
  let contador = 0;

  //para cada doc (producto) en los resultados y crea su tarjeta HTML
  querySnapshot.forEach((doc) => {
    if (contador >= limite) return //solo muestra hasta el limite
    contador++; //aumenta el contador

    //obtiene los datos del producto
    //producto: datos del doc (nombre, precio, img, etc.)
    const producto = doc.data();

    //se hace la tarjeta del producto y la añade al contenedor
    contenedor.innerHTML += `
    
    <div class="cont" data-id="${doc.id}">
      <img src="${producto.imagen}" class="pluc">
      <p class="potaxie">${producto.nombre}</p>
      <p class="fife">$${producto.precio}</p>
    </div>
    `;

  });

  //los nuevos productos a los modales
  //añade event listeners a cada producto para abrir su modal al hacer click
  document.querySelectorAll(`#${contenedorId} .cont`).forEach(item =>{
    item.addEventListener('click', async () => {
      const productoId = item.getAttribute("data-id"); //obtiene el ID del producto
      abrirModal(productoId); //llama a la funcion abrirModal
    });
  });
}

//funcion para abrir/actualizar el modal con los detalles del producto
//productoId: ID del doc en FS
async function abrirModal(productoId) {

  if(!productoId){
    console.error("Error> ID del producto no valido", productoId);
    return;
  }

  //obtiene el doc del producto especifico desde FS
  //docSnap: referencia al documento del producto en FS
  const docSnap = await getDoc(doc(db, "productos", productoId));
  if (!docSnap.exists()) return; //si no existe, termina

  //producto: datos del producto
  const producto = docSnap.data();

  const imgModal = modal.querySelector(".pluc");
  imgModal.src = producto.imagen || "fallback.jpg"; //blindaje si no hay imagen

  const nombre = producto.nombre || "Producto";
  const categoria = producto.categoria || "sin categoria";
  imgModal.alt = `Imagen de ${nombre} de la o las categorias ${categoria}`;
  imgModal.loading = "lazy"; //el Lazy mejroa el rendimiento


  //actualiza el modal con los datos del producto
  modal.querySelector(".tula").textContent = producto.nombre;
  modal.querySelector(".marca").textContent = producto.marca;
  modal.querySelector(".descripcion").textContent = producto.descripcion;
  modal.querySelector(".presio").textContent = `$${producto.precio}`;

  //actualiza las tallas si existen
  if (producto.tallas) {
    const selectTallas = modal.querySelector(".size select"); //el querySelector busca el primer elemento que coincida con el selector
    selectTallas.innerHTML = producto.tallas.map(t => `<option value="${t}">${t} </option>`).join('');
    //el map() transforma un array, como convertir tallas en opciones HTML

  }

  //actualizar colores si existen
  //si el producto tiene tallas, actualiza el <select> en el modal 
  if(producto.colores){ // asegurarse que el texto despues del . como "colores" sea el mismo que en firebase 
    const selectColores = modal.querySelector(".colorr select");
    selectColores.innerHTML = producto.colores.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  //muestra el modal y el fondo borroso
  previewContainer.classList.add("activo"); //el classList manipula clases CSS de un elemento, como add("activo")
  fondoBorroso.classList.remove("oculto");

  modal.classList.add("activo");
  
}

//evento para cerrar el modal al hacer click en X o fondo borroso
modal.querySelector(".cerrar").addEventListener("click", cerrarModal);
fondoBorroso.addEventListener("click", cerrarModal);

function cerrarModal() {
  previewContainer.classList.remove("activo");
  fondoBorroso.classList.add("oculto")

    modal.classList.remove("activo");

}

//cargar las categorias al iniciar la pagina
document.addEventListener('DOMContentLoaded', () => {

  //carga las 3 categorias principales en sus contenedores
  cargarProductosCategoria("Lo más vendido", "LoMasVendido", 5);
  cargarProductosCategoria("Lo más nuevo", "LoMasNuevo", 5);
  cargarProductosCategoria("Ofertas del día", "OfertasDelDia", 5);  
});

