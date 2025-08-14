import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

//funcion para abrir/actualizar el modal con los detalles del producto
//productoId: ID del doc en FS
async function abrirModal(productoId) {

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


//funcion que busca productos de firestore segun texto y categoria
async function buscarFS(textoBusqueda, categoria) {

    //limpia el texto, lo convierte a minusculas y lo separa por espacios
    const palabrasClave = textoBusqueda.trim().toLowerCase().split(/\s+/);
    //trim(). quita espacios al inicio y al final
    //toLowerCase(). convierte a minusculas
    //split(/\s+/). divide por espacios (una o mas)

    const snapShot = await getDocs(collection(db, "productos"));
    //await. espera a que se obtengan los datos
    //getDocs(). obtiene todos los docs
    //collection(). accede a la coleccion "productos"

    const productos = []; //array vacio para guardar los que coincidan

    //recorre cada documenti de la coleccion
    snapShot.forEach(doc => {

        const data = doc.data(); //obtiene loa datos del documento

        //verifica si la categoria coincide (ignorando mayusculas)
        if(!Array.isArray(data.categoria) || !data.categoria.some(cat => cat.toLowerCase() === categoria.toLowerCase())) return;
        //array.isarray(). verifica s es un array
        //.some(). busca si alguna categoria coincide

        //convierte nombre, desc y marca a minusculas (si existen)
        const nombre = data.nombre?.toLowerCase() || ""; //operador ?. evita errores si no existe
        const descripcion = data.descripcion?.toLowerCase() || "";
        const marca = data.marca?.toLowerCase() || "";

        //verifica si alguna palabra clave esta en nombre, desc y marca
        const coincide = palabrasClave.some(palabra =>
            nombre.includes(palabra) ||
            descripcion.includes(palabra) ||
            marca.includes(palabra)
        );
        //.includes(): busca si contiene la palabra
        // .some(): devuelve true su alguna palabra coincide

        //si coincide, agrega el producto al array
        if (coincide){
            productos.push({id: doc.id, ...data});
            //...data: copua todos los campos del producto
            //id: se agrega el ID del doc
        }
        
    });
    
    return productos; //devuelve los productos encontrados

}

//funcion que conecta el input con la busqueda y el boton
function iniciarBuscador(idInput, idBoton, categoria, idContenedor){

    //obtiene el input y el boton por su ID
    const input = document.getElementById(idInput);
    const boton = document.getElementById(idBoton);
    if (!input || !boton) return; //si no existen no hace nd

    //agrega evento al boton para hacer la busqueda al hacer click
    boton.addEventListener("click", async () =>{
        const texto = input.value; //obtiene el texto del input
        const resultados = await buscarFS(texto, categoria); //busca productos
        mostrarProductos(resultados, idContenedor); //muestra los productos
    });

}

//funcion para mostrar en html
function mostrarProductos(productos, idContenedor){

    //busca el contenedor por si ID
    const contenedor = document.querySelector(idContenedor);

    //si no existe, no hace nd
    if(!contenedor) return;

    contenedor.innerHTML = ""; //limpia el contendio anterior

    //si no hay productos, muestra un mensaje
    if(productos.length === 0){

        contenedor.innerHTML = "<p>No se encontraron resultados</p>";
        return;

    }

    //recorre los productos y crea una tarjeta para cada uno
    productos.forEach(producto => {

        const div = document.createElement("div"); //crea un div
        div.classList.add("producto"); //clase para estilos

        //extrae el nombre del producto o usa "producto si no esta definido"
    const nombre = producto.nombre || "producto";

    //convierte el array de categorias separado por comillas
    const categoria = producto.categoria?.join(", ") || "sin categoria";

    //genera el texto alternativo
    const altTexto = `imagen de ${nombre} de la o las categorias ${categoria}`;

        div.innerHTML = `
            <div class="cont" data-id="${producto.id}">
            <div class="img-wrapper">
                <img src="${producto.imagen}" class="pluc" alt="${altTexto}" loading="lazy">
            </div>
            <p class="potaxie">${producto.nombre}</p>
            <p class="fife">$${producto.precio}</p>
            </div>
        `;

        contenedor.appendChild(div); //agrega el div al contenedor

        //conecta con clic del modal
        const tarjeta = div.querySelector(".cont");
        tarjeta.addEventListener("click", () => {
            abrirModal(producto.id);
        });

    });

}

iniciarBuscador("busca", "srch", "Lo más vendido", "#LoMasVendido");
iniciarBuscador("busca", "srch", "Lo más nuevo", "#LoMasNuevo");
iniciarBuscador("busca", "srch", "Ofertas del día", "#OfertasDelDia");