const API_URL = "https://help-desk-backend-uf12.onrender.com";

const form = document.getElementById("ticketForm");
const lista = document.getElementById("listaTickets");

// Crear ticket
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;

  try {
    await fetch(`${API_URL}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descripcion })
    });

    form.reset();
    cargarTickets();
  } catch (error) {
    console.error("Error creando ticket:", error);
  }
});

// Cargar tickets
async function cargarTickets() {
  try {
    const res = await fetch(`${API_URL}/tickets`);
    if (!res.ok) throw new Error(`Error en la petición: ${res.status}`);
    const tickets = await res.json();

    lista.innerHTML = "";
    tickets.forEach(t => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${t.titulo}</strong><br>
        ${t.descripcion}<br>
        <em>Estado:</em>
        <select data-id="${t.id}">
          <option value="abierto" ${t.estado === "abierto" ? "selected" : ""}>Abierto</option>
          <option value="en_proceso" ${t.estado === "en_proceso" ? "selected" : ""}>En Proceso</option>
          <option value="resuelto" ${t.estado === "resuelto" ? "selected" : ""}>Resuelto</option>
          <option value="cerrado" ${t.estado === "cerrado" ? "selected" : ""}>Cerrado</option>
        </select>
         <button class="btn-eliminar" data-id="${t.id}">Eliminar</button>
      `;
      lista.appendChild(li);
    });

    // Agregar listener a los selects **después** de generar los tickets
    lista.querySelectorAll("select").forEach(select => {
      select.addEventListener("change", async (e) => {
        const id = e.target.dataset.id;
        const estado = e.target.value;

        try {
          await fetch(`${API_URL}/tickets/${id}/estado`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado })
          });
          cargarTickets(); // refresca la lista
        } catch (error) {
          console.error("Error actualizando estado:", error);
        }
      });
    });

  } catch (error) {
    console.error("Error cargando tickets:", error);
    lista.innerHTML = "<li>No se pudieron cargar los tickets</li>";
  }
}

// Inicializa
cargarTickets();
