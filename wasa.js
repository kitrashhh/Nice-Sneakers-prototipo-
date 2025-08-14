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

//definir el numero de wasa al que se le enviaran los mensajes
//formato de "521" de mexico sin espacios ni caracteres especiales
const wasaNum = "5218994843635"



//funcion principal
async function generarWasa(productoId) {

  //capturar talla y color seleccionados
  //busca el elemento <select> dentro de una clase llamada .size y obtiene el valor seleccionado
  //lo mismo con .colorr
  const tallaElegida = document.querySelector(".size").value;
  const colorElegido = document.querySelector(".colorr").value;

  //crea una referencia al documento de firestore usando el ID rcibido
  const docRef = doc(db, "productos", productoId);

  //espera la respuesta del servidor y obtiene el documento completo
  const docSnap = await getDoc(docRef);

  //extrae los datos como un objeto de javascript
  const producto = docSnap.data();

  //mensaje personalizado
  const mensaje = `Hola, me interesan estos tenis: 
  \n *${producto.nombre}* 
  \n Marca: ${producto.marca} 
  \n Precio: $ ${producto.precio} 
  \n Talla: ${tallaElegida}
  \n Color: ${colorElegido}
  \n Imagen: ${producto.imagen}`;

  //codifica el mensaje para que se pueda enviar por URL
  //encodeURIComponent convierte caracteres especiales en formato seguro para URLs
  const urlWasa = `https://wa.me/${wasaNum}?text=${encodeURIComponent(mensaje)}`;

  //inserta el href del boton
  document.querySelector("#wasaa").setAttribute("href", urlWasa);
  
}

//ejecuta la funcion
generarWasa();