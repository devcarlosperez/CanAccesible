// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { 
    validateIncidentData, 
    getIncidentStatusLabel, 
    startCoordinatesValidation
} from "../../utils/incidentHelpers";

describe("Unit Test: Incident Helpers", () => {
    
    // Requirement: 100% Coverage (Function 1)
    describe("validateIncidentData", () => {
        it("should return false for null or undefined input", () => {
            expect(validateIncidentData(null)).toBe(false);
            expect(validateIncidentData(undefined)).toBe(false);
            expect(validateIncidentData("string")).toBe(false);
        });

        it("should return false if name is missing or too short", () => {
            expect(validateIncidentData({ description: "desc", island: "Tenerife" })).toBe(false); // missing
            expect(validateIncidentData({ name: "ab", description: "desc", island: "Tenerife" })).toBe(false); // too short
        });

        it("should return false if description is missing or non-string", () => {
            expect(validateIncidentData({ name: "Valid Name", island: "Tenerife" })).toBe(false);
            expect(validateIncidentData({ name: "Valid Name", description: "", island: "Tenerife" })).toBe(false);
            expect(validateIncidentData({ name: "Valid Name", description: 123, island: "Tenerife" })).toBe(false);
        });

        it("should return false if island is missing or empty", () => {
            expect(validateIncidentData({ name: "Valid Name", description: "desc" })).toBe(false);
            expect(validateIncidentData({ name: "Valid Name", description: "desc", island: "" })).toBe(false);
            expect(validateIncidentData({ name: "Valid Name", description: "desc", island: "   " })).toBe(false);
        });

        it("should return true for valid object", () => {
            const valid = {
                name: "Broken Streetlight",
                description: "Located at main st",
                island: "Gran Canaria"
            };
            expect(validateIncidentData(valid)).toBe(true);
        });
    });

    // Requirement: Parametrized Test (Function 2)
    describe("getIncidentStatusLabel", () => {
        it.each([
            [1, "incident_status_pending"],
            [2, "incident_status_progress"],
            [3, "incident_status_resolved"],
            [4, "incident_status_rejected"],
            [99, "incident_status_unknown"],
            [0, "incident_status_unknown"],
            [-1, "incident_status_unknown"],
            [null, "incident_status_unknown"],
            ["1", "incident_status_unknown"] // switch strict equality check usually
        ])("should return %s for status ID %s", (statusId, expectedLabel) => {
            expect(getIncidentStatusLabel(statusId)).toBe(expectedLabel);
        });
    });

    // Requirement: 100% Coverage (Function 3 - Extra)
    describe("startCoordinatesValidation", () => {
        it.each([
            [28.0, -16.0, true],    // Valid Tenerife
            [91, 0, false],         // Invalid Lat > 90
            [-91, 0, false],        // Invalid Lat < -90
            [0, 181, false],        // Invalid Lng > 180
            [0, -181, false],       // Invalid Lng < -180
            ["28.5", "-16.5", true],// String valid parsing
            ["abc", 0, false],      // NaN Lat
            [0, "xyz", false],      // NaN Lng
        ])("should validate lat: %s, lng: %s as %s", (lat, lng, expected) => {
            expect(startCoordinatesValidation(lat, lng)).toBe(expected);
        });
    });

});
