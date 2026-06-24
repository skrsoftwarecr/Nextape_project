/**
 * Represents the CORE identity data stored in the "core" Firestore collection.
 * This is the developer's public digital identity profile.
 */
export interface CoreIdentity {
  uid: string;
  visibility: "public" | "private";
  views: number;
  tags: string[];
  telemetry: Record<string, unknown>;
}
