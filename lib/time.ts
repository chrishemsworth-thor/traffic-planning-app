export const KUALA_LUMPUR_TIMEZONE = "Asia/Kuala_Lumpur";

export function addMinutes(iso: string, offsetMin: number): string {
  const date = new Date(iso);
  date.setMinutes(date.getMinutes() + offsetMin);
  return date.toISOString();
}
