import { describe, it, expect } from "vitest";
import { formatDate } from "./dateUtils";

describe("dateUtils", () => {
  describe("formatDate", () => {
    it.each([
      [null, ""],
      [undefined, ""],
      ["", ""],
      ["invalid-date-string", ""],
    ])(
      "should return empty string for invalid input: %s",
      (input, expected) => {
        expect(formatDate(input)).toBe(expected);
      }
    );

    it("should format a valid date string correctly", () => {
      // Note: The output depends on the locale and timezone.
      // We are mocking the locale in the implementation to 'es-ES'.
      // However, running in different environments might produce different results due to timezone.
      // For this test, we'll check if it contains the expected parts.
      const dateString = "2023-10-26T10:30:00Z";
      const result = formatDate(dateString);

      expect(result).toContain("26");
      expect(result).toContain("oct");
      expect(result).toContain("2023");
    });

    it("should handle different valid date formats", () => {
      const date = new Date(2023, 0, 1, 12, 0); // Jan 1, 2023 12:00
      const result = formatDate(date.toISOString());
      expect(result).toContain("1");
      expect(result).toContain("ene");
      expect(result).toContain("2023");
    });
  });
});
