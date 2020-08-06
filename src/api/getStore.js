import handler400 from './handler400';

export default async function getStore(uuid) {
  // Get store contents by uuid
  const response = await fetch(`/api/note/list?store_uuid=${encodeURIComponent(uuid)}`);
  if (response.status === 400) {
    return handler400();
  }
  return response.json();
}
