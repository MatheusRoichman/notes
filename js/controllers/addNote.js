const addNote = () => {
  const note_form = document.createElement('form');
  note_form.id = 'note_form';

  const note_title_input = document.createElement('input');
  note_title_input.id = 'note_title_input'
  note_title_input.className = 'swal2-input'
  note_title_input.placeholder = 'Título da nota';

  const note_content_input = document.createElement('textarea');
  note_content_input.id = 'note_content_input'
  note_content_input.className = 'swal2-textarea'
  note_content_input.placeholder = 'Conteúdo da nota';

  note_form.append(note_title_input, note_content_input)

  Swal.fire({
    title: 'Adicionar nota',
    html: note_form,
    confirmButtonText: 'Adicionar',
    preConfirm: () => {
      const now = new Date();
      const all_notes_object = JSON.parse(localStorage.getItem('notes'));
      
      const new_note = {
        title: note_title_input.value || 'Nova nota',
        content: note_content_input.value || 'Nota vazia',
        datetime: {
          date: `${ formatDateTime(now.getDate()) }/${ formatDateTime(now.getMonth()) + 1 }/${ now.getFullYear() }`,
          time: `${ formatDateTime(now.getHours()) }:${ formatDateTime(now.getMinutes()) }:${ formatDateTime(now.getSeconds()) }`
        },
        id: `note-${now.getTime()}`
      }
      
      if (!localStorage.getItem('notes'))
      {
        localStorage.setItem('notes', JSON.stringify({
          notes_array: [
            new_note
          ]
        }));
        
        loadNotes();

        return;
      }

      all_notes_object.notes_array.push(new_note);

      localStorage.setItem('notes', JSON.stringify(all_notes_object));
    }
  }).then(result => {
    Swal.fire({
      title: 'Nota criada!',
      icon: 'success'
    })
    
    loadNotes();
  });
}