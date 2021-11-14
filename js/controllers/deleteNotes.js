const deleteNote = (note_title, note_id) => {
  let notes_array = JSON.parse(localStorage.getItem('notes')).notes_array;
  
  Swal.fire({
    title: `Tem certeza de que deseja apagar a nota "${note_title}"?`,
    text: 'Você não poderá recuperá-la depois.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Deletar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      for (let i in notes_array) {
        if (notes_array[i].id === note_id) {
          notes_array.splice(i, 1);
      
          localStorage.setItem('notes', JSON.stringify({
          notes_array: notes_array
          }))
      
          loadNotes();
          return;
        }
      }
    }
  })
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