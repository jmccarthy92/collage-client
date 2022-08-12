import { tldExists } from "tldjs";

const DOMAIN_CONSTRAINT =
  /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;

export const isValidDomain = (domain: string) =>
  DOMAIN_CONSTRAINT.test(domain) && tldExists(domain);
