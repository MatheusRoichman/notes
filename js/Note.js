class Note {
    constructor() { }
    
    // Utilities
    getNotesFromStorage() {
        if (!localStorage.getItem('notes')) {
          localStorage.setItem('notes', JSON.stringify({
            notes_array: []
          }))
        }
      
        return JSON.parse(localStorage.getItem('notes')).notes_array;
    }
    
    setNotesInStorage(notes_array) {
      localStorage.setItem('notes', JSON.stringify({
        notes_array
      }));
      
      this.loadNotes();
    }
    
    createNoteLi(note_title, note_content, note_id, note_datetime) {
        const list_element = document.createElement('li');
        list_element.id = note_id;
        list_element.classList.add('bg-gray', 'container-fluid', 'rounded', 'p-4', 'my-4');
      
        const note_title_element = document.createElement('h2');
        note_title_element.innerText = note_title;
        
        const note_last_mod = document.createElement('p');
        note_last_mod.classList.add('text-muted');
        note_last_mod.innerText = `Modificado em ${note_datetime.date} ${note_datetime.time}`;
      
        const note_content_element = document.createElement('p');
        note_content_element.classList.add('text-small');
        note_content_element.innerText = note_content;
      
        const edit_note_button = document.createElement('button');
        edit_note_button.classList.add('btn', 'rounded', 'btn-warning', 'm-2', 'text-light', 'text-start');
        edit_note_button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 0 24 24" width="2rem" fill="#fff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/></svg> Editar';
        edit_note_button.onclick = () => notes.editNote(note_title, note_content, note_id, note_datetime);
      
        const delete_note_button = document.createElement('button');
        delete_note_button.classList.add('btn', 'rounded', 'btn-danger', 'm-2', 'text-light', 'text-start');
        delete_note_button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 0 24 24" width="2rem" fill="#fff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg> Deletar';
        delete_note_button.onclick = () => notes.deleteNote(note_title, note_id);
      
        const note_controllers_div = document.createElement('div');
        note_controllers_div.classList.add('d-flex', 'justify-content-end', 'mt-2');
        note_controllers_div.append(edit_note_button, delete_note_button);
      
        list_element.append(note_title_element, note_last_mod, note_content_element, note_controllers_div);
      
        return list_element;
    }
    
    createNoteForm(note_title_value, note_content_value) {
        const note_form = document.createElement('form');

        const note_title_input = document.createElement('input');
        note_title_input.id = 'note_title_input'
        note_title_input.className = 'swal2-input'
        note_title_input.placeholder = 'Título da nota';
        note_title_input.value = note_title_value || '';

        const note_content_input = document.createElement('textarea');
        note_content_input.id = 'note_content_input'
        note_content_input.className = 'swal2-textarea'
        note_content_input.placeholder = 'Conteúdo da nota';
        note_content_input.value = note_content_value || '';

        note_form.append(note_title_input, note_content_input)
        
        return note_form;
    }
    
    // Controllers
    loadNotes() {
        const notes_ul = document.querySelector('#notes-list');

        notes_ul.innerHTML = '';
        const notes_array = this.getNotesFromStorage();

        if (!notes_array.length) {
            document.querySelector('#note-count').innerText = 'Não há notas';
            return;
        }
        
        document.querySelector('#note-count').innerText = notes_array.length == 1 ? '1 nota' : `${notes_array.length} notas`;

        for (let note of notes_array) {
            notes_ul.appendChild(this.createNoteLi(note.title, note.content, note.id, note.datetime));
        }
    }

    addNote() {
        Swal.fire({
            title: 'Adicionar nota',
            html: this.createNoteForm(),
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Adicionar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const now = new Date();
                const notes_array = this.getNotesFromStorage();

                const new_note = {
                    title: note_title_input.value || 'Nova nota',
                    content: note_content_input.value || 'Nota vazia',
                    datetime: {
                        date: formatDate(now),
                        time: formatTime(now)
                    },
                    id: `note-${now.getTime()}`
                }

                notes_array.push(new_note);

                this.setNotesInStorage(notes_array);
            }
        }).then(result => {
            if (result.isConfirmed) Swal.fire({
                title: 'Nota criada!',
                icon: 'success'
            })
        });
    }

    editNote(old_title, old_content, note_id, old_datetime) {
        Swal.fire({
            title: `Editando nota: "${old_title}"`,
            html: this.createNoteForm(old_title, old_content),
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Salvar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                let notes_array = this.getNotesFromStorage();
                const now = new Date();

                const edited_note = {
                    title: note_title_input.value || old_title,
                    content: note_content_input.value || old_content,
                    datetime: {
                        date: formatDate(now),
                        time: formatTime(now)
                    },
                    id: note_id
                }
                
                if (edited_note.title === old_title && edited_note.content === old_content) {
                  edited_note.datetime = old_datetime;
                }
                
                const old_note_index = notes_array.findIndex(note => note.id === note_id);

                notes_array[old_note_index] = edited_note;
                
                this.setNotesInStorage(notes_array)
            }
        }).then(result => {
            if (result.isConfirmed) Swal.fire({
                title: 'Nota editada!',
                icon: 'success'
            })
        });
    }

    deleteNote(note_title, note_id) {
        let notes_array = this.getNotesFromStorage();

        Swal.fire({
            title: `Tem certeza de que deseja apagar a nota "${note_title}"?`,
            text: 'Você não poderá recuperá-la depois.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Deletar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
              const deleted_note_index = notes_array.findIndex(note => note.id === note_id);
              
              notes_array.splice(deleted_note_index, 1);
              
              this.setNotesInStorage(notes_array);
            }
        }).then(result => {
          if (result.isConfirmed) Swal.fire({
            title: 'Nota deletada!',
            icon: 'success'
          })
        });
    }

    deleteAllNotes() {
        Swal.fire({
            title: 'Tem certeza de que quer deletar TODAS as notas?',
            text: "Essa ação é irreversível!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Deletar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
              localStorage.removeItem('notes');
              this.loadNotes()
            }
        }).then((result) => {
            if (result.isConfirmed) Swal.fire(
                'Notas deletadas!',
                'Seu bloco de notas está vazio.',
                    'success'
            );
        });
    }
}