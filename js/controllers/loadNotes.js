const loadNotes = () => {
  const notes_JSON = localStorage.getItem('notes');

  const notes_ul = document.querySelector('#notes-list');

  notes_ul.innerHTML = '';

  if (!notes_JSON) 
  { 
    const no_notes_title = document.createElement('h3');
    no_notes_title.innerText = 'Não há notas';
    notes_ul.appendChild(no_notes_title);
    return;
  }

  const notes_array = JSON.parse(notes_JSON).notes_array;

  if (notes_array.length === 0) 
  { 
    const no_notes_title = document.createElement('h3');
    no_notes_title.innerText = 'Não há notas';
    notes_ul.appendChild(no_notes_title);
    return;
  }

  for (let i in notes_array) {
    notes_ul.appendChild(createNoteLi(notes_array[i].title, notes_array[i].content, notes_array[i].id));
  }

}

window.onload = loadNotes;