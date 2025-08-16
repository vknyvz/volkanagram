import {Document} from "mongoose";

export type LeanDocument<T> = Omit<T, keyof Document> & {
  _id: string;
};