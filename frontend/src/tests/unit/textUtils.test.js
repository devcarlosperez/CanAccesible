import { describe, it, expect } from "vitest";
import { truncateText, isValidMessage } from "../../utils/textUtils";

describe("Unit Test: textUtils", () => {
    describe("truncateText", () => {
        it.each([
            ["Hello World", 5, "Hello..."],
            [null, 5, ""]
        ])("truncateText('%s', %i) should return '%s'", (text, maxLength, expected) => {
            expect(truncateText(text, maxLength)).toBe(expected);
        });
    });

    describe("isValidMessage", () => {
        it("should return false for empty or invalid messages", () => {
            expect(isValidMessage("")).toBe(false);
        });
    });
});
