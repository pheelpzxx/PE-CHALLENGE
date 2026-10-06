// ================================================
// HELIXNOTES — SISTEMA DE NOTAS
// ================================================


// ================================================
// ELEMENTOS DA PÁGINA
// ================================================

const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const notesList = document.getElementById("notesList");
const notesCount = document.getElementById("notesCount");
const noteStatus = document.getElementById("noteStatus");


// ================================================
// CHAVE DO LOCALSTORAGE
// ================================================

const STORAGE_KEY = "helixnotes-notes";


// ================================================
// CARREGAR NOTAS
// ================================================

function getNotes() {
    const savedNotes = localStorage.getItem(STORAGE_KEY);

    if (!savedNotes) {
        return [];
    }

    try {
        return JSON.parse(savedNotes);
    } catch (error) {
        console.error("Erro ao carregar as notas:", error);
        return [];
    }
}


// ================================================
// SALVAR NOTAS
// ================================================

function saveNotes(notes) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notes)
    );
}


// ================================================
// ATUALIZAR CONTADOR
// ================================================

function updateNotesCount(notes) {

    const total = notes.length;

    if (total === 1) {
        notesCount.textContent = "1 nota";
    } else {
        notesCount.textContent = `${total} notas`;
    }
}


// ================================================
// MOSTRAR MENSAGEM
// ================================================

function showStatus(message) {

    noteStatus.textContent = message;

    setTimeout(() => {
        noteStatus.textContent = "";
    }, 2500);
}


// ================================================
// EXIBIR NOTAS
// ================================================

function renderNotes() {

    const notes = getNotes();

    notesList.innerHTML = "";

    updateNotesCount(notes);


    // Nenhuma nota cadastrada

    if (notes.length === 0) {

        const emptyMessage = document.createElement("div");

        emptyMessage.className = "empty-notes";

        emptyMessage.textContent =
            "Você ainda não criou nenhuma nota.";

        notesList.appendChild(emptyMessage);

        return;
    }


    // Criar os cards

    notes.forEach((note) => {

        const noteCard = document.createElement("article");

        noteCard.className = "note-card";


        // Cabeçalho

        const header = document.createElement("div");

        header.className = "note-card-header";


        // Título

        const title = document.createElement("h4");

        title.textContent = note.title;


        // Botão excluir

        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-note";

        deleteButton.type = "button";

        deleteButton.textContent = "Excluir";

        deleteButton.dataset.id = note.id;


        // Conteúdo

        const content = document.createElement("p");

        content.textContent = note.content;


        // Montagem

        header.appendChild(title);

        header.appendChild(deleteButton);

        noteCard.appendChild(header);

        noteCard.appendChild(content);

        notesList.appendChild(noteCard);

    });
}


// ================================================
// ADICIONAR NOTA
// ================================================

noteForm.addEventListener("submit", (event) => {

    event.preventDefault();


    const title = noteTitle.value.trim();

    const content = noteContent.value.trim();


    // Validação

    if (!title || !content) {

        showStatus(
            "Preencha o título e o conteúdo da nota."
        );

        return;
    }


    // Recuperar notas existentes

    const notes = getNotes();


    // Criar nova nota

    const newNote = {

        id: Date.now().toString(),

        title: title,

        content: content

    };


    // Adicionar ao início da lista

    notes.unshift(newNote);


    // Salvar no navegador

    saveNotes(notes);


    // Atualizar interface

    renderNotes();


    // Limpar formulário

    noteForm.reset();


    // Mensagem

    showStatus("Nota salva com sucesso!");
});


// ================================================
// EXCLUIR NOTA
// ================================================

notesList.addEventListener("click", (event) => {

    const deleteButton =
        event.target.closest(".delete-note");


    if (!deleteButton) {
        return;
    }


    const noteId = deleteButton.dataset.id;


    const notes = getNotes();


    const updatedNotes = notes.filter(
        (note) => note.id !== noteId
    );


    saveNotes(updatedNotes);


    renderNotes();


    showStatus("Nota excluída.");
});


// ================================================
// INICIALIZAÇÃO
// ================================================

renderNotes();
