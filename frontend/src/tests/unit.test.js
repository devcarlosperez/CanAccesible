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
    // Arrange: prepare invalid inputs
    const nullInput = null;
    const undefinedInput = undefined;
    const stringInput = "not an object";

    // Act & Assert: verify all return false
    expect(validateIncidentData(nullInput)).toBe(false);
    expect(validateIncidentData(undefinedInput)).toBe(false);
    expect(validateIncidentData(stringInput)).toBe(false);
  });

  // Edge case: missing or too short name field
  it("should return false if name is missing or too short (< 3 chars)", () => {
    // Arrange
    const missingName = { description: "desc", island: "Tenerife" };
    const shortName = { name: "ab", description: "desc", island: "Tenerife" };

    // Act & Assert
    expect(validateIncidentData(missingName)).toBe(false);
    expect(validateIncidentData(shortName)).toBe(false);
  });

  // Edge case: invalid description field
  it("should return false if description is missing, empty or non-string", () => {
    // Arrange
    const missingDesc = { name: "Valid Name", island: "Tenerife" };
    const emptyDesc = {
      name: "Valid Name",
      description: "",
      island: "Tenerife",
    };
    const numberDesc = {
      name: "Valid Name",
      description: 123,
      island: "Tenerife",
    };

    // Act & Assert
    expect(validateIncidentData(missingDesc)).toBe(false);
    expect(validateIncidentData(emptyDesc)).toBe(false);
    expect(validateIncidentData(numberDesc)).toBe(false);
  });

  // Edge case: missing or empty island field
  it("should return false if island is missing, empty or whitespace-only", () => {
    // Arrange
    const missingIsland = { name: "Valid Name", description: "desc" };
    const emptyIsland = { name: "Valid Name", description: "desc", island: "" };
    const whitespaceIsland = {
      name: "Valid Name",
      description: "desc",
      island: "   ",
    };

    // Act & Assert
    expect(validateIncidentData(missingIsland)).toBe(false);
    expect(validateIncidentData(emptyIsland)).toBe(false);
    expect(validateIncidentData(whitespaceIsland)).toBe(false);
  });

  // Normal case: valid complete object
  it("should return true for a valid incident object", () => {
    // Arrange
    const validIncident = {
      name: "Broken Streetlight",
      description: "Located at main street corner",
      island: "Gran Canaria",
    };

    // Act
    const result = validateIncidentData(validIncident);

    // Assert
    expect(result).toBe(true);
  });
});

// FUNCTION 2: getIncidentStatusLabel (Parameterized Tests)
describe("Unit Test: getIncidentStatusLabel (Parameterized)", () => {
  it.each([
    // [input, expected output]
    [1, "incident_status_pending"],
    [2, "incident_status_progress"],
    [3, "incident_status_resolved"],
    [4, "incident_status_rejected"],
    [99, "incident_status_unknown"], // Edge case: non-existent ID
    [0, "incident_status_unknown"], // Edge case: zero
    [-1, "incident_status_unknown"], // Edge case: negative
    [null, "incident_status_unknown"], // Edge case: null
    ["1", "incident_status_unknown"], // Edge case: string instead of number
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
    [28.0, -16.0, true], // Valid: Tenerife coordinates
    [0, 0, true], // Valid: origin point
    [90, 180, true], // Valid: maximum limits
    [-90, -180, true], // Valid: minimum limits
    [91, 0, false], // Invalid: latitude > 90
    [-91, 0, false], // Invalid: latitude < -90
    [0, 181, false], // Invalid: longitude > 180
    [0, -181, false], // Invalid: longitude < -180
    ["28.5", "-16.5", true], // Valid: parseable strings
    ["abc", 0, false], // Invalid: NaN latitude
    [0, "xyz", false], // Invalid: NaN longitude
  ])(
    "coordinates (lat: %s, lng: %s) should validate as %s",
    (lat, lng, expected) => {
      // Act
      const result = startCoordinatesValidation(lat, lng);

      // Assert
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
    // Arrange
    const text = "Hello World";
    const maxLength = 5;

    // Act
    const result = truncateText(text, maxLength);

    // Assert
    expect(result).toBe("Hello...");
  });

  // Normal case: text shorter than maxLength
  it("should return original text when shorter than maxLength", () => {
    // Arrange
    const text = "Hi";
    const maxLength = 10;

    // Act
    const result = truncateText(text, maxLength);

    // Assert
    expect(result).toBe("Hi");
  });

  // Edge case: text exactly equal to maxLength
  it("should return original text when exactly equal to maxLength", () => {
    // Arrange
    const text = "Hello";
    const maxLength = 5;

    // Act
    const result = truncateText(text, maxLength);

    // Assert
    expect(result).toBe("Hello");
  });

  // Edge case: null/undefined input
  it("should return empty string for null or undefined input", () => {
    // Act & Assert
    expect(truncateText(null, 5)).toBe("");
    expect(truncateText(undefined, 5)).toBe("");
  });

  // Edge case: empty string
  it("should return empty string for empty input", () => {
    // Arrange
    const text = "";

    // Act
    const result = truncateText(text, 5);

    // Assert
    expect(result).toBe("");
  });
});
