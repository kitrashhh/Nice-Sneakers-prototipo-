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

//definir el numero de wasa al que se le enviaran los mensajes
//formato de "521" de mexico sin espacios ni caracteres especiales
const wasaNum = "5218994843635"

//crear el mensaje que se enviara por wasa
//el *texto* es para negritas
const mensaje = `Hola, me interesan estos tenis: \n`+ //saludo inicial
    `*${producto.nombre}*\n`+
    `*${producto.modelo}*\n`+
    `*${producto.precio}*\n`+
    `*${producto.imagen}*\n`;

//codifica el mensaje para que se pueda enviar por URL
//encodeURIComponent convierte caracteres especiales en formato seguro para URLs
const urlWasa = `https://wa.me/${wasaNum}?text=${encodeURIComponent(mensaje)}`;

document.querySelector(".was").setAttribute("href", urlWasa);