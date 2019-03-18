const decrement = require("./decrement");

test('subtracts one from "1"', () => {
  expect(decrement("1")).toBe("0");
});

test('subtracts one from "0"', () => {
  expect(decrement("0")).toBe("-1");
});

// TODO: netagive numbers
// test('subtracts one from "-1"', () => {
//   expect(decrement("0")).toBe("-2");
// });

test('subtracts one from "2"', () => {
  expect(decrement("2")).toBe("1");
});

test('subtracts one from "10"', () => {
  expect(decrement("10")).toBe("9");
});

test('subtracts one from "11"', () => {
  expect(decrement("11")).toBe("10");
});

test('subtracts one from "29027834868298356902365129623"', () => {
  expect(decrement("29027834868298356902365129623")).toBe(
    "29027834868298356902365129622"
  );
});

test('subtracts one from "29027834868298356902365129621"', () => {
  expect(decrement("29027834868298356902365129621")).toBe(
    "29027834868298356902365129620"
  );
});
