const SESSION_ID_STORAGE_KEY = "sessionId";
const SESSION_USER_DATA = "userData";
const USER_ID = "userId";
const ttl = 6000000;

const saveSession = (value, userData) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(SESSION_ID_STORAGE_KEY, JSON.stringify(item));

  const userItem = {
    value: userData,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(SESSION_USER_DATA, JSON.stringify(userItem));
};

const getSessionId = () => {
  const itemStr = localStorage.getItem(SESSION_ID_STORAGE_KEY);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(SESSION_ID_STORAGE_KEY);
    return null;
  }
  return item.value;
};

const getSessionUser = () => {
  const itemStr = localStorage.getItem(SESSION_USER_DATA);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(SESSION_USER_DATA);
    return null;
  }
  return item.value;
};

const removeSessionId = () => {
  localStorage.removeItem(SESSION_ID_STORAGE_KEY);
  localStorage.removeItem(SESSION_USER_DATA);
};

export { saveSession, getSessionId, removeSessionId, getSessionUser };
