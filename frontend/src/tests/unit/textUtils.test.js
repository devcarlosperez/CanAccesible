import { describe, it, expect } from "vitest";
import { truncateText, isValidMessage } from "../../utils/textUtils";

describe("Unit Test: textUtils", () => {
    describe("truncateText", () => {
        // Parameterized test using it.each as per rubric
        it.each([
            ["Hello World", 5, "Hello..."],
            ["Short", 10, "Short"],
            ["Exact Length", 12, "Exact Length"],
            ["", 5, ""],
            [null, 5, ""],
            [undefined, 5, ""]
        ])("should return '%s' when text is '%s' and maxLength is %i", (text, maxLength, expected) => {
            expect(truncateText(text, maxLength)).toBe(expected);
        });

        it("should use default maxLength of 100 if not provided", () => {
            const longText = "a".repeat(105);
            expect(truncateText(longText).length).toBe(103); // 100 chars + "..."
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
        ])("should return %s for input '%s'", (input, expected) => {
            expect(isValidMessage(input)).toBe(expected);
        });
    });
});
