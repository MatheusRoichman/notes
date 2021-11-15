const getNotesFromStorage = () => {
  if (!localStorage.getItem('notes')) {
    localStorage.setItem('notes', JSON.stringify({
      notes_array: []
    }))
  }
  
  return JSON.parse(localStorage.getItem('notes')).notes_array;
}