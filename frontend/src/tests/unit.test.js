import { describe, it, expect } from "vitest";
import {
  validateIncidentData,
  startCoordinatesValidation,
} from "../utils/incidentHelpers";

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

// FUNCTION 2: startCoordinatesValidation (Parameterized Tests)
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
