import { getWithExpiry, setWithExpiry } from "@/utils/localStorageWithExpiry";
import { useCallback } from "react";

export const useExpiryStorage = () => {
  const setItem = useCallback(setWithExpiry, []);
  const getItem = useCallback(getWithExpiry, []);

  return { setItem, getItem };
};
