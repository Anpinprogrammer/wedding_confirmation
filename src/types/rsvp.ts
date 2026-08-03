export const MEAL_OPTIONS = [
  { value: "tamal", label: "🫔 Tamal valluno" },
  { value: "sancocho", label: "🍲 Sancocho de pollo" },
  { value: "kids", label: "🍟 Menú infantil" },
] as const;

export type MealValue = (typeof MEAL_OPTIONS)[number]["value"];

export interface GuestEntry {
  name: string;
  meal: MealValue | "";
}

export interface RsvpFormValues {
  guestCount: number | "";
  guests: GuestEntry[];
  message: string;
}

/** Flat shape sent to the Google Sheet — one row per submission. */
export interface RsvpSheetPayload {
  submittedAt: string;
  guestCount: number;
  guestNames: string;
  guestMeals: string;
  message: string;
}
