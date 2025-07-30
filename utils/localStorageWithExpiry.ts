export function setWithExpiry(key: string, value: any, ttlMinutes: number) {
  const now = new Date();

  const item = {
    value: value,
    expiry: now.getTime() + ttlMinutes * 60 * 1000, //? Convert to ms
  };

  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key: string) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);

    if (new Date().getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}
