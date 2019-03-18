const { pager, getItems, getNext } = require("./pager");

test("getItems(array)", () => {
  expect(getItems(["a"])).toEqual(["a"]);
});

test("getItems(object)", () => {
  expect(getItems({ a: false, b: ["a"] })).toEqual(["a"]);
});

test("getNext", () => {
  expect(getNext({ next_cursor_str: "test" })).toEqual({
    type: "cursor",
    value: "test"
  });
  expect(getNext({ next_cursor: 0, next_cursor_str: "test" })).toEqual(false);
  expect(getNext([{ id_str: "2" }])).toEqual({
    type: "max_id",
    value: "1"
  });
});
