const API_URL = "http://localhost:3000";

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
    li.innerHTML = `<strong>${t.titulo}</strong><br>${t.descripcion}`;
    lista.appendChild(li);
  });
}

cargarTickets();
