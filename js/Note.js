class Note {
    constructor() { }
    
    // Utilities
    getNotesFromStorage() {
      return JSON.parse(localStorage.getItem('notes')).notes_array;
    }
    
    setNotesInStorage(notes_array) {
      localStorage.setItem('notes', JSON.stringify({
        notes_array
      }));
      
      this.sortNotes();
    }
    
    createNoteLi(note, highlighted = {}) {
        const list_element = document.createElement('li');
        list_element.id = note.id;
        list_element.classList.add('note', 'bg-gray', 'container-fluid', 'rounded', 'p-4', 'my-4', 'pb-3', 'opacity-0');
      
        const note_title_element = document.createElement('h2');
        note_title_element.innerHTML = highlighted.title || note.title;
        
        const note_creation = document.createElement('p');
        note_creation.classList.add('text-muted', 'text-small');
        note_creation.innerHTML = `Criado em ${formatDate(new Date(note.datetime.creation))} ${formatTime(new Date(note.datetime.creation))}`;
       
        const note_last_mod = document.createElement('p');
        note_last_mod.classList.add('text-muted', 'text-small', 'mb-1');
        note_last_mod.innerHTML = `Modificado em ${formatDate(new Date(note.datetime.edition))} ${formatTime(new Date(note.datetime.edition))}`;
      
        const note_content_element = document.createElement('p');
        note_content_element.classList.add('text-small');
        note_content_element.innerHTML = highlighted.content || note.content;
      
        const edit_note_button = document.createElement('button');
        edit_note_button.classList.add('btn', 'rounded', 'btn-warning', 'm-2', 'text-light', 'text-start');
        edit_note_button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 0 24 24" width="2rem" fill="#fff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/></svg> Editar';
        edit_note_button.onclick = () => notes.editNote(note);
      
        const delete_note_button = document.createElement('button');
        delete_note_button.classList.add('btn', 'rounded', 'btn-danger', 'm-2', 'text-light', 'text-start');
        delete_note_button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 0 24 24" width="2rem" fill="#fff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg> Deletar';
        delete_note_button.onclick = () => notes.deleteNote(note.title, note.id);
      
        const note_controllers_div = document.createElement('div');
        note_controllers_div.classList.add('d-flex', 'justify-content-end', 'mt-2');
        note_controllers_div.append(edit_note_button, delete_note_button);
      
        list_element.append(note_creation, note_title_element, note_content_element, note_last_mod, note_controllers_div);
      
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
    loadNotes(notes_array = this.getNotesFromStorage()) {
        const notes_ul = document.querySelector('#notes-list');

        notes_ul.innerHTML = '';
        
        if (!notes_array.length) {
            document.querySelector('#note-count').innerHTML = 'Não há notas';
            return;
        }
        
        document.querySelector('#note-count').innerHTML = notes_array.length === 1 ? '1 nota' : `${notes_array.length} notas`;
    
        for (let note of notes_array) {
            const note_list_element = this.createNoteLi(note, note?.highlighted);

            notes_ul.appendChild(note_list_element);
        }
        return;
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
                        creation: now, 
                        edition: now
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

    editNote(old_note) {
        Swal.fire({
            title: `Editando nota: "${old_note.title}"`,
            html: this.createNoteForm(old_note.title, old_note.content),
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Salvar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const notes_array = this.getNotesFromStorage();
                const now = new Date();

                const edited_note = {
                    title: note_title_input.value || old_note.title,
                    content: note_content_input.value || old_note.content,
                    datetime: {
                        creation: old_note.datetime.creation,
                        edition: now
                    },
                    id: old_note.id
                }
                
                if (edited_note.title === old_note.title && edited_note.content === old_note.content) {
                  edited_note.datetime.edition = old_note.datetime.edition;
                }
                
                const old_note_index = notes_array.findIndex(note => note.id === old_note.id);

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
        const notes_array = this.getNotesFromStorage();

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
              this.setNotesInStorage([]);
            }
        }).then((result) => {
            if (result.isConfirmed) Swal.fire(
                'Notas deletadas!',
                'Seu bloco de notas está vazio.',
                    'success'
            );
        });
    }
    
    searchForNotes(event) {
        event.preventDefault();
      
        if (document.querySelector('#return-btn').classList.contains('d-none')) document.querySelector('#return-btn').classList.replace('d-none', 'd-flex');
        
        const notes_array = this.getNotesFromStorage();
        
        const search = document.querySelector('#note-search').value;
        
        let search_results = fuzzysort.go(
            search,
            notes_array,
            {
                threshold: -999,
                allowTypo: true,
                keys: ['title', 'content']
            }
        );
        
        delete search_results['total'];
        
        const highlighted_search_results = [];

        for (let i in search_results) {
            const result = search_results[i];

            const highlighted = {
                title: fuzzysort.highlight(result[0], '<strong>', '</strong>'),
                content: fuzzysort.highlight(result[1], '<strong>', '</strong>')
            }
           
            highlighted_search_results.push({
                ...result["obj"],
                highlighted
            });
        }
        
        localStorage.setItem('current-search', JSON.stringify({
              search_results: highlighted_search_results
            }));

        this.sortNotes(undefined, highlighted_search_results);
    }
    
    sortNotes(order = localStorage.getItem('current-order') || 'recent-mod', notes_array = JSON.parse(localStorage.getItem('current-search'))?.search_results || this.getNotesFromStorage()) {
        
        localStorage.setItem('current-order', order);
        
        if (localStorage.getItem('current-search')) notes_array = JSON.parse(localStorage.getItem('current-search')).search_results;
        
        const setDropdownHTML = html => {
            document.querySelector('#dropdown-toggle').innerHTML = `Ordem: ${html}`;
        };
        
        this.loadNotes((function() {
            switch (order) {
                case 'recent-mod':
                    setDropdownHTML('Modificação (mais recente)')
                
                    return notes_array;
                
                    break;
            
                case 'old-mod':
                    setDropdownHTML('Modificação (mais antiga)')
                
                    return notes_array;
                
                    break;
            
                case 'recent-creation':
                setDropdownHTML('Criação (mais recente)')
                
                    return notes_array;
                
                    break;
            
                case 'old-creation':
                    setDropdownHTML('Criação (mais antiga)')
                
                    return notes_array;
                
                    break;
                
                case 'title-a-z':
                    setDropdownHTML('Título (A-Z)')
                
                    return notes_array.sort((a, b) => a.title.localeCompare(b.title));
                
                    break;
                
                case 'title-z-a':
                    setDropdownHTML('Título (Z-A)');
                
                    return notes_array.sort((a, b) => b.title.localeCompare(a.title));
                
                    break;
                
                default:
                    return notes_array;
                    break;
            }
        }()))
    }
}