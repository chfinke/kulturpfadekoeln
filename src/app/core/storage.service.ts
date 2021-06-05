import * as localForage from 'localforage';

export const setStringItem = async (
  key: string,
  item: string
): Promise<string> => {
  return await localForage.setItem(key, item);
};

export const setObjectItem = async (key: string, item: any): Promise<any> => {
  return await setStringItem(key, JSON.stringify(item)).then((itemReturned) =>
    JSON.parse(itemReturned)
  );
};

export const getStringItem = async (key: string): Promise<string> => {
  return await localForage.getItem(key);
};

export const getObjectItem = async (key: string): Promise<any> => {
  return await localForage.getItem(key);
  // return await getStringItem(key).then((itemReturned) =>
  //   JSON.parse(itemReturned)
  // );
};

export const removeItem = async (key: string): Promise<void> => {
  return await localForage.removeItem(key);
};

export const clear = async (): Promise<void> => {
  return await localForage.clear();
};
