import { describe, it, expect } from "vitest";
import {
  validateIncidentData,
  getIncidentStatusLabel,
  startCoordinatesValidation,
} from "../utils/incidentHelpers";
import { truncateText } from "../utils/textUtils";

// FUNCTION 1: validateIncidentData (100% Coverage)
describe("Unit Test: validateIncidentData", () => {

  // Edge case: null/undefined/wrong type inputs
  it("should return false for null, undefined or non-object input", () => {
    const nullInput = null;
    const undefinedInput = undefined;
    const stringInput = "not an object";

    expect(validateIncidentData(nullInput)).toBe(false);
    expect(validateIncidentData(undefinedInput)).toBe(false);
    expect(validateIncidentData(stringInput)).toBe(false);
  });

  // Normal case: valid complete object
  it("should return true for a valid incident object", () => {
    const validIncident = {
      name: "Broken Streetlight",
      description: "Located at main street corner",
      island: "Gran Canaria",
    };

    const result = validateIncidentData(validIncident);

    expect(result).toBe(true);
  });
});

// FUNCTION 2: getIncidentStatusLabel (Parameterized Tests)
describe("Unit Test: getIncidentStatusLabel (Parameterized)", () => {
  it.each([
    // [input, expected output]
    [1, "incident_status_pending"],
    [99, "incident_status_unknown"], // Edge case: non-existent ID
  ])(
    "getIncidentStatusLabel(%s) should return '%s'",
    (statusId, expectedLabel) => {
      // Act
      const result = getIncidentStatusLabel(statusId);

      // Assert
      expect(result).toBe(expectedLabel);
    }
  );
});

// =============================================================================
// FUNCTION 3: startCoordinatesValidation (Parameterized Tests)
// =============================================================================
describe("Unit Test: startCoordinatesValidation (Parameterized)", () => {
  it.each([
    // [latitude, longitude, expected]
    [90, 180, true], // Valid: maximum limits
    [999, 0, false], // Invalid: latitude > 90
    ["28.5", "-16.5", true], // Valid: parseable strings
    ["abc", 0, false], // Invalid: NaN latitude
  ])(
    "coordinates (lat: %s, lng: %s) should validate as %s",
    (lat, lng, expected) => {
      const result = startCoordinatesValidation(lat, lng);

      expect(result).toBe(expected);
    }
  );
});

// =============================================================================
// FUNCTION 4: truncateText (100% Coverage)
// =============================================================================
describe("Unit Test: truncateText", () => {
  // Normal case: text longer than maxLength
  it("should truncate text and add ellipsis when exceeding maxLength", () => {
    const text = "Hello World";
    const maxLength = 5;

    const result = truncateText(text, maxLength);

    expect(result).toBe("Hello...");
  });

  // Normal case: text shorter than maxLength
  it("should return original text when shorter than maxLength", () => {
    const text = "Hi";
    const maxLength = 10;

    const result = truncateText(text, maxLength);

    expect(result).toBe("Hi");
  });

  // Edge case: text exactly equal to maxLength
  it("should return original text when exactly equal to maxLength", () => {
    const text = "Hello";
    const maxLength = 5;

    const result = truncateText(text, maxLength);

    expect(result).toBe("Hello");
  });

  // Edge case: null/undefined input
  it("should return empty string for null or undefined input", () => {
    expect(truncateText(null, 5)).toBe("");
    expect(truncateText(undefined, 5)).toBe("");
  });

  // Edge case: empty string
  it("should return empty string for empty input", () => {
    const text = "";

    const result = truncateText(text, 5);

    expect(result).toBe("");
  });
});
