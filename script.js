const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const notesList = document.getElementById("notesList");
const notesCount = document.getElementById("notesCount");
const noteStatus = document.getElementById("noteStatus");

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

const STORAGE_KEY = "helixnotes-notes";

/* ================================
   NOTAS
================================ */

function getNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    console.error("Erro ao carregar notas:", error);
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function updateNotesCount(notes) {
  const total = notes.length;

  notesCount.textContent =
    total === 1 ? "1 nota" : `${total} notas`;
}

function showNoteStatus(message) {
  noteStatus.textContent = message;

  setTimeout(() => {
    noteStatus.textContent = "";
  }, 2500);
}

function renderNotes() {
  const notes = getNotes();

  notesList.innerHTML = "";

  updateNotesCount(notes);

  if (notes.length === 0) {
    const emptyMessage = document.createElement("div");

    emptyMessage.className = "empty-state";
    emptyMessage.textContent =
      "Nenhuma nota criada ainda. Crie sua primeira anotação!";

    notesList.appendChild(emptyMessage);

    return;
  }

  notes.forEach((note) => {
    const noteCard = document.createElement("article");
    noteCard.className = "note-card";

    const header = document.createElement("div");
    header.className = "note-card-header";

    const title = document.createElement("h4");
    title.textContent = note.title;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-note";
    deleteButton.dataset.id = note.id;
    deleteButton.textContent = "Excluir";
    deleteButton.setAttribute("aria-label", `Excluir nota ${note.title}`);

    const content = document.createElement("p");
    content.textContent = note.content;

    header.appendChild(title);
    header.appendChild(deleteButton);

    noteCard.appendChild(header);
    noteCard.appendChild(content);

    notesList.appendChild(noteCard);
  });
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();

  if (!title || !content) {
    showNoteStatus("Preencha o título e a anotação.");
    return;
  }

  const notes = getNotes();

  const newNote = {
    id: Date.now().toString(),
    title,
    content
  };

  notes.unshift(newNote);

  saveNotes(notes);
  renderNotes();

  noteForm.reset();

  showNoteStatus("Nota salva com sucesso!");
});

notesList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-note");

  if (!deleteButton) {
    return;
  }

  const noteId = deleteButton.dataset.id;

  const updatedNotes = getNotes().filter(
    (note) => note.id !== noteId
  );

  saveNotes(updatedNotes);
  renderNotes();

  showNoteStatus("Nota excluída.");
});

/* ================================
   CONTATO
================================ */

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  contactStatus.textContent =
    "Mensagem preparada com sucesso! Este formulário é uma demonstração do projeto.";

  contactForm.reset();

  setTimeout(() => {
    contactStatus.textContent = "";
  }, 4000);
});

/* ================================
   INICIALIZAÇÃO
================================ */

renderNotes();
