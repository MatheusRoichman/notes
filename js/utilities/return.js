const returnToNotes = () => {
    const return_button = document.querySelector('#return-btn');
    
    notes.loadNotes();
    
    document.querySelector('#note-search').value = '';
    
    return_button.classList.remove('d-flex');
    return_button.classList.add('d-none');
}