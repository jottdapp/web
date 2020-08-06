import { navigate } from '@reach/router';

export default async function handler400(response, json) {
  let myJson = json;
  if (myJson === undefined) {
    myJson = await response.json();
  }
  if (myJson.detail === 'unauthorized') {
    navigate('/login');
    return undefined;
  }
  throw json.detail;
}
