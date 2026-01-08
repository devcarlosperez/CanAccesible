import { describe, it, expect } from "vitest";
import { truncateText, isValidMessage } from "../../utils/textUtils";

describe("Unit Test: textUtils", () => {
    describe("truncateText", () => {
        it.each([
            ["Hello World", 5, "Hello..."],
            ["Short", 10, "Short"],
            ["Exact Length", 12, "Exact Length"],
            ["", 5, ""],
            [null, 5, ""],
            [undefined, 5, ""]
        ])("truncateText('%s', %i) should return '%s'", (text, maxLength, expected) => {
            expect(truncateText(text, maxLength)).toBe(expected);
        });

        it("should use default maxLength of 100 if not provided", () => {
            const longText = "a".repeat(105);
            expect(truncateText(longText).length).toBe(103);
            expect(truncateText(longText).endsWith("...")).toBe(true);
        });
    });

    describe("isValidMessage", () => {
        it.each([
            ["Hello", true],
            ["  spaces  ", true],
            ["", false], 
            ["   ", false],
            [null, false],
            [123, false]
        ])("isValidMessage('%s') should return %s", (input, expected) => {
            expect(isValidMessage(input)).toBe(expected);
        });
    });
});
