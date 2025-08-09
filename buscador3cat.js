import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

//funcion que busca productos de firestore segun texto y categoria
async function buscarFS(textoBusqueda, categoria) {

    const palabrasClave = textoBusqueda.trim().toLowerCase().split(/\s+/);
    const snapShot = await getDocs(collection(db, "productos"));
    const productos = [];

    snapShot.forEach(doc => {

        const data = doc.data();
        if(!Array.isArray(data.categoria) || !data.categoria.some(cat => cat.toLowerCase() === categoria.toLowerCase())) return;

        const nombre = data.nombre?.toLowerCase() || "";
        const descripcion = data.descripcion?.toLowerCase() || "";
        const marca = data.marca?.toLowerCase() || "";

        const coincide = palabrasClave.some(palabra =>
            nombre.includes(palabra) ||
            descripcion.includes(palabra) ||
            marca.includes(palabra)
        );

        if (coincide){
            productos.push({id: doc.id, ...data});
        }
        
    });
    
    return productos;

}

//funcion que conecta el input con la busqueda y el renderizado
function iniciarBuscador(idInput, idBoton, categoria, idContenedor){

    const input = document.getElementById(idInput);
    const boton = document.getElementById(idBoton);
    if (!input || !boton) return;

    boton.addEventListener("click", async () =>{
        const texto = input.value;
        const resultados = await buscarFS(texto, categoria);
        mostrarProductos(resultados, idContenedor);
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

        const div = document.createElement("div");
        div.classList.add("producto"); //clase para estilos

        div.innerHTML = `
            <div class="cont" data-id="${producto.id}">
            <img src="${producto.imagen}" class="pluc">
            <p class="potaxie">${producto.nombre}</p>
            <p class="fife">$${producto.precio}</p>
            </div>
        `;

        contenedor.appendChild(div);

    });

}

iniciarBuscador("busca", "srch", "Hombres", "#Hombress");
iniciarBuscador("busca", "srch", "Mujeres", "#Mujeress");
iniciarBuscador("busca", "srch", "Ninos", "#Ninoss");