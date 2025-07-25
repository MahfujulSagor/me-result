import { Account, Client, Databases } from "node-appwrite";

export const appwrite = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const db = new Databases(appwrite);
export const account = new Account(appwrite);
