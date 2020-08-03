const dummyData = {
  '1e749a09-2dc1-4826-8281-d386a506d70a': {
    view: 'Calendar',
    items: [],
    members: { test: { permissions: 'owner' } },
  },
  '530254aa-536b-4d07-bf72-7987ecf319f6': {
    view: 'Calendar',
    items: [],
    members: { test: { permissions: 'owner' } },
  },
  '8900ad1a-5a23-4c08-99bc-1aa2f3c220b0': {
    view: 'Todo',
    items: [],
    members: { test: { permissions: 'owner' } },
  },
  '46caecbc-3bab-45b9-8ade-856c84b0526a': {
    view: 'Todo',
    items: [],
    members: { test: { permissions: 'owner' } },
  },
};

export default function getStore(uuid) {
  // Get store contents by uuid
  return new Promise((resolve) => {
    // return dummy data in 0.5 - 1.5 seconds.
    setTimeout(() => {
      resolve(dummyData[uuid]);
    }, 500 + Math.random() * 1000);
  });
}
