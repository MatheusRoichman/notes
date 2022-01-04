const notes = new Note();

if (!localStorage.getItem('notes_array')) {
    notes.setNotesInStorage([]);
}

window.onload = notes.sortNotes();