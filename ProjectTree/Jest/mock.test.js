import { expect, jest, test } from "@jest/globals";
import axios from "axios";

const iteration = (items, callback) => {
   for (let i = 0; i < items.length; i++) {
      callback(items[i]);
   }
};

test("mock cb", () => {
   const mockCb = jest.fn((x) => x + 42);

   iteration([0, 1], mockCb);

   expect(mockCb.mock.calls.length).toBe(2);

   expect(mockCb.mock.calls[0][0]).toBe(0);

   expect(mockCb.mock.results[0].value).toBe(42);
});

test("mock return", () => {
   const mock = jest.fn();

   mock.mockReturnValueOnce(true).mockReturnValueOnce(1).mockReturnValueOnce("Hi");

   const results1 = mock();
   const results2 = mock();
   const results3 = mock();

   expect(results1).toBeTruthy();
   expect(results2).toBe(1);
   expect(results3).toBe("Hi");
});

const fetchData = async (id) => {
   const result = await axios.get(`https://....`);
   return result["data"];
};

test("mock axios", async () => {
   jest.spyOn(axios, "get").mockReturnValueOnce({
      data: {
         id: 1,
         todo: "Hello",
      },
   });

   const results = await fetchData(1);

   expect(results["todo"]).toBe("Hello");
});
