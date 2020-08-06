import handler400 from './handler400';

export default async function newNote(storeUuid, note) {
  // add note
  const response = await fetch('/api/note/new', {
    method: 'POST',
    body: JSON.stringify({
      store_uuid: storeUuid,
      note,
    }, null, 0),
  });
  if (response.status === 400) {
    return handler400();
  }
  return response.json();
}
