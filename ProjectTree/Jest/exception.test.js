import { expect, test } from "@jest/globals";

const compileCode = () => {
   throw new Error("Testing");
};

test("compiling error", () => {
   expect(() => compileCode()).toThrow("optional error msg");
});
