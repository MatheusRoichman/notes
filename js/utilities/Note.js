class Note {
  constructor(title, content) {
    this.title = title;
    this.content = content;
    this.datetime = {
      date: `${ formatDateTime(now.getDate()) }/${ formatDateTime(now.getMonth()) + 1 }/${ now.getFullYear() }`,
      time: `${ formatDateTime(now.getHours()) }:${ formatDateTime(now.getMinutes()) }:${ formatDateTime(now.getSeconds()) }`
    };
    this.id = `note-${now.getTime()}`;
  }
}