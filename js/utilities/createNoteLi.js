const createNoteLi = (note_title, note_content, note_id) => {
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
  edit_note_button.onclick = editNote;
      
  const delete_note_button = document.createElement('button');
  delete_note_button.classList.add('btn', 'remove');
  delete_note_button.innerText = 'Deletar';
  delete_note_button.onclick = deleteNote(note_id);
      
  const note_controllers_div = document.createElement('div');
  note_controllers_div.className = 'note_controllers'
  note_controllers_div.append(edit_note_button, delete_note_button)
  
  list_element.append(note_data_div, note_controllers_div)
  
  return list_element;
}