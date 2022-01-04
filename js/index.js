const notes = new Note();

if (!notes.getNotesFromStorage()) {
    notes.setNotesInStorage([]);
}

window.onload = notes.sortNotes();