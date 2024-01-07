import addNum from "../Jasmine/spec/calculator.js";
import { describe, expect, test } from "@jest/globals";

describe("calculations", () => {
   test("adding nums", () => {
      expect(addNum(1, 2)).toBe(3);
   });
});
