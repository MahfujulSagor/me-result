import { Account, Client, Databases } from "appwrite";

export const appwrite = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const db = new Databases(appwrite);
export const account = new Account(appwrite);

export const validateJwt = async (jwt: string) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setJWT(jwt);

  const account = new Account(client);
  try {
    const user = await account.get();

    return user;
  } catch (error) {
    console.error("Invalid or expired JWT session:", error);
    return null;
  }
};
