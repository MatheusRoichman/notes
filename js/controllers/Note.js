class Note {
    constructor() { }

    loadNotes() {
        const notes_JSON = localStorage.getItem('notes');

        const notes_ul = document.querySelector('#notes-list');

        notes_ul.innerHTML = '';

        if (!notes_JSON) {
            const no_notes_title = document.createElement('h3');
            no_notes_title.innerText = 'Não há notas';
            notes_ul.appendChild(no_notes_title);
            return;
        }

        const notes_array = JSON.parse(notes_JSON).notes_array;

        if (notes_array.length === 0) {
            const no_notes_title = document.createElement('h3');
            no_notes_title.innerText = 'Não há notas';
            notes_ul.appendChild(no_notes_title);
            return;
        }

        for (let i in notes_array) {
            notes_ul.appendChild(createNoteLi(notes_array[i].title, notes_array[i].content, notes_array[i].id));
        }
    }

    AddNote() {
        const note_form = document.createElement('form');

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
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Adicionar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const now = new Date();
                if (!localStorage.getItem('notes')) localStorage.setItem('notes', JSON.stringify({
                    notes_array: []
                }))
                const notes_array = JSON.parse(localStorage.getItem('notes')).notes_array;

                const new_note = {
                    title: note_title_input.value || 'Nova nota',
                    content: note_content_input.value || 'Nota vazia',
                    datetime: {
                        date: `${formatDateTime(now.getDate())}/${formatDateTime(now.getMonth()) + 1}/${now.getFullYear()}`,
                        time: `${formatDateTime(now.getHours())}:${formatDateTime(now.getMinutes())}:${formatDateTime(now.getSeconds())}`
                    },
                    id: `note-${now.getTime()}`
                }

                if (!localStorage.getItem('notes')) {
                    localStorage.setItem('notes', JSON.stringify({
                        notes_array: [
                            new_note
                        ]
                    }));

                    loadNotes();

                    return;
                }

                notes_array.push(new_note);

                localStorage.setItem('notes', JSON.stringify({
                    notes_array: notes_array
                }));
            }
        }).then(result => {
            if (result.isConfirmed) Swal.fire({
                title: 'Nota criada!',
                icon: 'success'
            })

            loadNotes();
        });
    }

    editNote() {
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
                        date: `${formatDateTime(now.getDate())}/${formatDateTime(now.getMonth()) + 1}/${now.getFullYear()}`,
                        time: `${formatDateTime(now.getHours())}:${formatDateTime(now.getMinutes())}:${formatDateTime(now.getSeconds())}`
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

    deleteNote(note_title, note_id) {
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
        });
    }
}