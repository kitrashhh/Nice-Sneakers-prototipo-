     document.addEventListener("DOMContentLoaded", () => {
    const productos = document.querySelectorAll(".cont");
    const previewContainer = document.querySelector(".preview");
    const previewBoxes = document.querySelectorAll(".comtenido");
    const fondoBorroso = document.querySelector(".fondo-borroso");

    productos.forEach(producto => {
        producto.addEventListener("click", () => {
            const name = producto.getAttribute("data-name");
            previewContainer.classList.add("activo");
            fondoBorroso.classList.remove("oculto");

            previewBoxes.forEach(preview => {
                const target = preview.getAttribute("data-target");
                if (name === target) {
                    preview.classList.add("activo");
                } else {
                    preview.classList.remove("activo");
                }
            });
        });
    });

    // Cerrar modal al hacer clic en "X"
    document.querySelectorAll(".cerrar").forEach(btn => {
        btn.addEventListener("click", () => {
            previewContainer.classList.remove("activo");
            fondoBorroso.classList.add("oculto");
            previewBoxes.forEach(box => {
                box.classList.remove("activo");
            });
        });
    });

    // Cerrar modal si se hace clic fuera del contenido
    fondoBorroso.addEventListener("click", () => {
        previewContainer.classList.remove("activo");
        fondoBorroso.classList.add("oculto");
        previewBoxes.forEach(box => {
            box.classList.remove("activo");
        });
    });
});