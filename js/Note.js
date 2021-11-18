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
    
    createNoteLi(note_title, note_content, note_id) {
        const list_element = document.createElement('li');
        list_element.id = note_id;
      
        const note_title_element = document.createElement('h3');
        note_title_element.innerText = note_title;
      
        const note_content_element = document.createElement('p');
        note_content_element.innerText = note_content;
      
        const note_data_div = document.createElement('div');
        note_data_div.className = 'note_data';
        note_data_div.append(note_title_element, note_content_element);
      
        const edit_note_button = document.createElement('button');
        edit_note_button.classList.add('btn', 'edit');
        edit_note_button.innerText = 'Editar';
        edit_note_button.onclick = () => notes.editNote(note_title, note_content, note_id);
      
        const delete_note_button = document.createElement('button');
        delete_note_button.classList.add('btn', 'remove');
        delete_note_button.innerText = 'Deletar';
        delete_note_button.onclick = () => notes.deleteNote(note_title, note_id);
      
        const note_controllers_div = document.createElement('div');
        note_controllers_div.className = 'note_controllers'
        note_controllers_div.append(edit_note_button, delete_note_button)
      
        list_element.append(note_data_div, note_controllers_div)
      
        return list_element;
    }
    
    createNoteForm(note_title_value, note_content_value) {
        const note_form = document.createElement('form');

        const note_title_input = document.createElement('input');
        note_title_input.id = 'note_title_input'
        note_title_input.className = 'swal2-input'
        note_title_input.placeholder = 'Título da nota';
        if (note_title_value) note_title_input.value = note_title_value;

        const note_content_input = document.createElement('textarea');
        note_content_input.id = 'note_content_input'
        note_content_input.className = 'swal2-textarea'
        note_content_input.placeholder = 'Conteúdo da nota';
        if (note_content_value) note_content_input.value = note_content_value;

        note_form.append(note_title_input, note_content_input)
        
        return note_form;
    }
    
    // Controllers
    loadNotes() {
        const notes_ul = document.querySelector('#notes-list');

        notes_ul.innerHTML = '';
        const notes_array = this.getNotesFromStorage();

        if (!notes_array.length) {
            const no_notes_title = document.createElement('h3');
            no_notes_title.innerText = 'Não há notas';
            notes_ul.appendChild(no_notes_title);
            return;
        }

        for (let note of notes_array) {
            notes_ul.appendChild(this.createNoteLi(note.title, note.content, note.id));
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
                        date: `${formatDateTime(now.getDate())}/${formatDateTime(now.getMonth()) + 1}/${now.getFullYear()}`,
                        time: `${formatDateTime(now.getHours())}:${formatDateTime(now.getMinutes())}:${formatDateTime(now.getSeconds())}`
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

    editNote(old_title, old_content, note_id) {
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
                        date: `${formatDateTime(now.getDate())}/${formatDateTime(now.getMonth()) + 1}/${now.getFullYear()}`,
                        time: `${formatDateTime(now.getHours())}:${formatDateTime(now.getMinutes())}:${formatDateTime(now.getSeconds())}`
                    },
                    id: note_id
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