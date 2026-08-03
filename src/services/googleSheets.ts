import type { RsvpFormValues, RsvpSheetPayload } from "@/types/rsvp";

/**
 * URL of the deployed Google Apps Script Web App that receives the POST
 * request and appends a row to the Google Sheet.
 *
 * Set this in a `.env` file at the project root:
 *   VITE_GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/XXXXX/exec"
 *
 * See README.md for the step-by-step Apps Script setup.
 */
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL as
  | string
  | undefined;

function toSheetPayload(values: RsvpFormValues): RsvpSheetPayload {
  return {
    submittedAt: new Date().toISOString(),
    guestCount: Number(values.guestCount),
    guestNames: values.guests.map((g) => g.name).join(" | "),
    guestMeals: values.guests
      .map((g) => {
        const label =
          g.meal === "tamal"
            ? "Tamal valluno"
            : g.meal === "sancocho"
            ? "Sancocho de pollo"
            : g.meal === "kids"
            ? "Menú infantil"
            : "";
        return `${g.name}: ${label}`;
      })
      .join(" | "),
    message: values.message,
  };
}

export class GoogleSheetsNotConfiguredError extends Error {
  constructor() {
    super(
      "VITE_GOOGLE_SCRIPT_URL no está configurada. Revisa el README para conectar Google Sheets."
    );
    this.name = "GoogleSheetsNotConfiguredError";
  }
}

/**
 * Sends the RSVP data to the connected Google Sheet.
 *
 * Apps Script Web Apps don't return CORS headers for simple deployments,
 * so the request is sent with `mode: "no-cors"`. This means the browser
 * cannot read the response body/status — the POST still reaches the
 * script and appends the row. Treat the promise resolving as "sent",
 * and rely on server-side validation/logging in Apps Script if you need
 * delivery confirmation (see README for an optional confirmation pattern).
 */
export async function submitRsvpToGoogleSheets(
  values: RsvpFormValues
): Promise<void> {
  if (!GOOGLE_SCRIPT_URL) {
    throw new GoogleSheetsNotConfiguredError();
  }

  const payload = toSheetPayload(values);

  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    // text/plain avoids a CORS preflight request, which Apps Script
    // web apps do not handle well by default.
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
}
