import debounce from 'debounce-promise';
import handler400 from './handler400';

const debouncers = {};

export default async function editNote(storeUuid, noteUuid, note) {
  if (debouncers[storeUuid + noteUuid] === undefined) {
    debouncers[storeUuid + noteUuid] = debounce(async (note2) => {
      const response = await fetch('/api/note/edit', {
        method: 'POST',
        body: JSON.stringify({
          store_uuid: storeUuid,
          note_uuid: noteUuid,
          note: note2,
        }, null, 0),
      });
      return [response, await response.json()];
    }, 500);
  }
  // add note
  const [response, json] = await debouncers[storeUuid + noteUuid](note);
  if (response.status === 400) {
    return handler400(response, json);
  }
  return json;
}
