import addNum from "./calculator.js";

describe("Jasmine [Addition]: ", () => {
   it("1 add 2 should equal 3", () => {
      const value = addNum(1, 2);
      expect(value).toBe(4);
   });

   it("3 add 4 should equal 7", () => {
      const value = addNum(3, 4);
      expect(value).toBe(7);
   });
});
