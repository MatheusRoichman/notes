const deleteNote = note_id => {
  
}

const deleteAllNotes = () => {
  Swal.fire({
    title: 'Tem certeza de que quer deletar TODAS as notas?',
    text: "Essa ação é irreversível!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Deletar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('notes');
    
      Swal.fire(
        'Notas deletadas!',
        'Seu bloco de notas está vazio.',
        'success'
      );
      
      loadNotes();
    }
  })
}