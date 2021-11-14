const editNote = (old_title, old_content, note_id) => {
   const note_form = document.createElement('form');

  const note_title_input = document.createElement('input');
  note_title_input.id = 'note_title_input'
  note_title_input.className = 'swal2-input'
  note_title_input.placeholder = 'Título da nota';
  note_title_input.value = old_title;

  const note_content_input = document.createElement('textarea');
  note_content_input.id = 'note_content_input'
  note_content_input.className = 'swal2-textarea'
  note_content_input.placeholder = 'Conteúdo da nota';
  note_content_input.value = old_content

  note_form.append(note_title_input, note_content_input)

  Swal.fire({
    title: `Editando nota: "${old_title}"`,
    html: note_form,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      let notes_array = JSON.parse(localStorage.getItem('notes')).notes_array;
      const now = new Date()
      
      const edited_note = {
        title: note_title_input.value || old_title,
        content: note_content_input.value || old_content,
        datetime: {
          date: `${ formatDateTime(now.getDate()) }/${ formatDateTime(now.getMonth()) + 1 }/${ now.getFullYear() }`,
          time: `${ formatDateTime(now.getHours()) }:${ formatDateTime(now.getMinutes()) }:${ formatDateTime(now.getSeconds()) }`
        },
        id: note_id
      }

      for (let i in notes_array) {
        if (notes_array[i].id === note_id) {
          notes_array[i] = edited_note;
        }
      }

      localStorage.setItem('notes', JSON.stringify({
        notes_array: notes_array
      }));
    }
  }).then(result => {
    if (result.isConfirmed) Swal.fire({
      title: 'Nota editada!',
      icon: 'success'
    })
    
    loadNotes();
  });
}
