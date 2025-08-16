import { Client, Account, Functions } from "appwrite";

const {
  VITE_APPWRITE_PROJECT_ID,
  VITE_APPWRITE_PUBLIC_ENDPOINT,
  VITE_APPWRITE_FUNCTION_ID,
} = import.meta.env;

const client = new Client();

client
  .setEndpoint(VITE_APPWRITE_PUBLIC_ENDPOINT)
  .setProject(VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const functions = new Functions(client);

export const APPWRITE_FUNCTION_ID = VITE_APPWRITE_FUNCTION_ID;

export { client, account, functions };
