
const wasaNum = "5218994843635";

function generarWasa() {

  //capturar talla y color seleccionados
  //busca el elemento <select> dentro de una clase llamada .size y obtiene el valor seleccionado
  //lo mismo con .colorr
  const tallaElegida = document.querySelector(".size select")?.value;
  const colorElegido = document.querySelector(".colorr select")?.value;

  const nombre = document.querySelector(".tula")?.textContent;
  const marca = document.querySelector(".marca")?.textContent;
  const precio = document.querySelector(".presio")?.textContent?.replace("$", "").trim();
  const imagen = document.querySelector(".pluc")?.src;


  //mensaje personalizado
  const mensaje = `Hola, me interesan estos tenis: 
  \n *${nombre}* 
  \n Marca: ${marca} 
  \n Precio: $ ${precio} 
  \n Talla: ${tallaElegida}
  \n Color: ${colorElegido}
  \n Imagen: ${imagen}`;

  //codifica el mensaje para que se pueda enviar por URL
  //encodeURIComponent convierte caracteres especiales en formato seguro para URLs
  const urlWasa = `https://wa.me/${wasaNum}?text=${encodeURIComponent(mensaje)}`;

  //inserta el href del boton
  window.open(urlWasa, "_blank");
  
}

document.querySelector("#wasaa").addEventListener("click", (e) =>{
  e.preventDefault;
  generarWasa();
});