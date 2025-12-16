const API_URL = "https://help-desk-backend-uf12.onrender.com";

const form = document.getElementById("ticketForm");
const lista = document.getElementById("listaTickets");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;

  await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descripcion })
  });

  form.reset();
  cargarTickets();
});

async function cargarTickets() {
  const res = await fetch(`${API_URL}/tickets`);
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
`;
  });
}

cargarTickets();

lista.querySelectorAll("select").forEach(select => {
  select.addEventListener("change", async (e) => {
    const id = e.target.dataset.id;
    const estado = e.target.value;

    await fetch(`${API_URL}/tickets/${id}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado })
    });

    cargarTickets(); // refresca la lista
  });
});
