import { Timestamp } from "firebase/firestore";

export type FirestoreTimestamp = Timestamp;

export interface BaseEntity {
  id: string;
  createdAt: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
