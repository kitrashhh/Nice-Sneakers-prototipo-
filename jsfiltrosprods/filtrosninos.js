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

//previewContainer: Contenedor del modal
const previewContainer = document.querySelector(".preview");

//modal: el modal en si
const modal = document.querySelector(".comtenido");

//fondoborroso: fondo sdetras del modal
const fondoBorroso = document.querySelector(".fondo-borroso");

//FUNCION PARA OBTENER LOS FILTROS 
//para leer q checkboxes estan marcados
function ObtenerCheks(ids){
  const seleccionados = []; // array donde guardamos los filtros

  ids.forEach((id) =>{
    const checkbox = document.getElementById(id); //encuentra el checkbox por ID, solo es "id" por el hecho de que son muchos
    const label = checkbox?.nextElementSibling; //busca su etiqueta justo al lado

    //si existe, esta marcado y tiene label, se agrega
    if (checkbox && checkbox.checked && label){
      seleccionados.push(label.textContent.trim()); //guarda el texto de la etiqueta
    }
  });
  
  return seleccionados; //devuelve la lista de opciones seleccionadas

}

//evento para cuando clickean en "aplicar filtros"
document.getElementById("aplicarfiltros-ninos").addEventListener("click", async () => {
  
  //leer los filtros desde los checkboxes
  const tallas = ObtenerCheks(["taia1", "taia2", "taia3", "taia4", "taia5", "taia6", "taia7",]).map(t => parseInt(t)); //hace cada string en numero
  const colores = ObtenerCheks(["kolor1", "kolor2", "kolor3", "kolor4", "kolor5", "kolor6", "kolor7", "kolor8", "kolor9", "kolor10", "kolor11", 
    "kolor12", "kolor13", "kolor14", "kolor15", "kolor16", "kolor17", "kolor18", "kolor19", "kolor20", "kolor21", "kolor22", "kolor23", "kolor24", "kolor25", 
    "kolor26", "kolor27", "kolor28", "kolor29", "kolor30", "kolor31", "kolor32",
  ]);
  const marca = ObtenerCheks(["marka1", "marka2", "marka3", "marka4", "marka5", "marka6", "marka7", "marka8", "marka9", "marka10",]);

  //aplicar la funcion principal para filtrar productos
  await filtrarProds(tallas, colores, marca);

});

//funcion principal para filtrar productos desde firestore
async function filtrarProds(tallas, colores, marca) {

  const prodsRef = collection(db, "productos"); //referencia a la coleccion

  //crear consulta
  const consula = query(prodsRef, where("categoria", "array-contains", "Ninos"));

  //obtener los docs que cumplen con la categoria
  const result = await getDocs(consula);

  //filtrar dibnamicamente por talla, color y marca
  const filtradoss = result.docs.filter(doc =>{
    const data = doc.data(); //obtiene los datos del producto

    //verifica si la talla seleccionada coincide 
    const tallaCoincidir = tallas.length === 0 || (
      Array.isArray(data.tallas) && tallas.some(t => data.tallas.includes(Number(t)))
    );

    //verifica si la talla seleccionada coincide 
    const colorCoincidir = colores.length === 0 || colores.some(c => data.colores.includes(c));

    //verifica si la talla seleccionada coincide 
    const marcaCoincidir = marca.length === 0 || marca.includes(data.marca);

    return tallaCoincidir && colorCoincidir && marcaCoincidir;

  });

  //PARTE DEL HTML 
  //se limpia el contenedor antes de mostrar os resultados de los filtros
  document.getElementById("Ninoss").innerHTML = ""; //limpia la seccion

  //recorrer los productos y mostrarlos
  //LO MAS VENDIDO
  filtradoss.forEach((doc) => {

    const producto = doc.data(); //obtener los datos de producto

    //se crea un nuevo bloque para cada producto
    const item = document.createElement("div");
    item.className = "producto"; //

    //se agrega la info al bloque
    item.innerHTML = `
      <div class="cont" data-id="${doc.id}">
      <img src="${producto.imagen}" class="pluc">
      <p class="potaxie">${producto.nombre}</p>
      <p class="fife">$${producto.precio}</p>
    </div>
    `;

    //evento para abrir el modal al hacer click en la tarjeta
    item.addEventListener("click", () => {
      abrirModal(doc.id); //llama a la funcion abrirmodal y le pasa el id del producto del modal
    });

    //se agrega al html para q se muestre
    document.getElementById("Ninoss").appendChild(item);

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

  //actualiza el modal con los datos del producto
  modal.querySelector(".pluc").src = producto.imagen;
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

/*borrar filtros*/

//Se ejecuta cuando el usuario le da click en Limpiar filtros

document.getElementById("limpiarfiltros-ninos").addEventListener("click", async () => { //el async define una funcion para usar await cosas que pueden tardar en cargar como firestore

  //busca todos los checkboxes que estan dentro del contenedor con clase ".filtros"
  //que no estén ocultos (hiden para esconder algunos)
  const checkboxes = document.querySelectorAll('.filtros input[type="checkbox"]:not([hidden])');

  //recorre cada checkbox encontrado
  checkboxes.forEach(checkbox => {

    //desmarca el checkbox (lo deja sin seleccionar)
    checkbox.checked = false;
});

//llama a la funcion principal para mostrar todos los productos sin filtros
//le ponemos tres arrays vacios, q son sin tallas, ni colores ni marcas
await filtrarProds([], [], []);

});