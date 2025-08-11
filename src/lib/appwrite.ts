import { Client, Account } from "appwrite";

const { VITE_APPWRITE_PROJECT_ID, VITE_APPWRITE_PUBLIC_ENDPOINT } = import.meta
  .env;

const client = new Client();

client
  .setEndpoint(VITE_APPWRITE_PUBLIC_ENDPOINT)
  .setProject(VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
export { client, account };
