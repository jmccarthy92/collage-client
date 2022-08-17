import { useState } from "react";

interface LocalStorageApi<T> {
  value: T | undefined;
  setVal: (value: T) => void;
  removeVal: () => void;
}

export function useLocalStorage<T>(
  key: string,
  initialValue?: T
): LocalStorageApi<T> {
  const [value, setValue] = useState((): T | undefined => {
    const item = window.localStorage.getItem(key);
    if (item) return JSON.parse(item);
    return initialValue;
  });

  const setVal = (fieldValue: T): void => {
    setValue(fieldValue);
    window.localStorage.setItem(key, JSON.stringify(fieldValue));
  };

  const removeVal = (): void => {
    setValue(undefined);
    window.localStorage.removeItem(key);
  };

  return { value, setVal, removeVal };
}
