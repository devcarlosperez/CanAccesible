import { describe, it, expect } from "vitest";
import { formatDate } from "../../utils/dateUtils";

describe("Unit Test: dateUtils", () => {
  describe("formatDate", () => {
    it("should return empty string for null, undefined, or empty input", () => {
      expect(formatDate(null)).toBe("");
      expect(formatDate(undefined)).toBe("");
      expect(formatDate("")).toBe("");
    });

    it("should return empty string for invalid date string", () => {
      expect(formatDate("invalid-date-string")).toBe("");
    });

    it("should format a valid date string correctly (es-ES)", () => {
      // Note: The output depends on the timezone of the runner if not handled carefully.
      // However, toLocaleDateString with specific options usually gives consistent format structure.
      // We will check if it contains the expected parts.
      const date = "2023-12-25T10:30:00";
      const result = formatDate(date);

      // Expected format roughly: "25 dic 2023, 10:30" (depending on browser/node locale implementation)
      // We check for key components to be safe across environments
      expect(result).toContain("2023");
      expect(result).toMatch(/25/);
      expect(result).toMatch(/10:30/);
    });
  });
});
