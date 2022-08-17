import { useLocalStorage } from "@shared/hooks/useLocalStorage";
import { useEffect, useMemo } from "react";

const SERVERLESS_URL =
  process.env.SERVERLESS_URL || "http://localhost:7071/api";

const PERMISSIONS = "racw"; // read, add, create, write, list --> delete omitted

export const useSasToken = (): string | undefined => {
  const { value: sasToken, setVal } = useLocalStorage<string>("sasToken");

  const expiryDate = useMemo(() => {
    if (sasToken) {
      const xpDate = new URLSearchParams(sasToken).get("se");
      if (xpDate) return new Date(xpDate);
    }
    return null;
  }, [sasToken]);

  const hasExpired = expiryDate ? expiryDate < new Date() : false;

  useEffect(() => {
    const createToken = async () => {
      const response = await fetch(`${SERVERLESS_URL}/generateSasToken`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          container: process.env.CONTAINER_NAME || "gifcollage",
          permissions: PERMISSIONS,
        }),
      });
      const { token } = await response.json();
      setVal(token);
    };

    if (!sasToken || hasExpired) createToken();
  }, [sasToken, hasExpired, setVal]);

  return sasToken;
};
