const {
  stopAt,
  filterByTime,
  filterTimeline,
  unique,
  compile
} = require("./correspondents");

const testDate = new Date("Thu Apr 06 15:24:15 +0000 2017");
const before = { created_at: "Thu Apr 06 15:24:14 +0000 2017" };
const same = { created_at: "Thu Apr 06 15:24:15 +0000 2017" };
const after = { created_at: "Thu Apr 06 15:24:16 +0000 2017" };

test("stopAt", () => {
  const stopFn = stopAt(testDate);

  expect(stopFn([after])).toBe(false);
  expect(stopFn([same])).toBe(false);
  expect(stopFn([before])).toBe(true);
});

test("filterByTime", () => {
  const filterFn = filterByTime(testDate);
  const filtered = filterFn([before, after, same]);
  expect(filtered).toEqual(expect.arrayContaining([after, same]));
  expect(filtered).not.toEqual(expect.arrayContaining([before]));
});

test("filterTimeline", () => {
  const rt = { retweeted_status: {} };
  const qt = { quoted_status: {} };
  const r = { in_reply_to_screen_name: "name" };
  const o = {};

  expect(filterTimeline([rt, qt, r, o])).toEqual([rt, qt, r]);
  expect(filterTimeline([rt, qt, r, o])).not.toBe(expect.arrayContaining([o]));
});

test("unique", () => {
  expect(unique(["a", "b", "c", "c"])).toEqual(["a", "b", "c"]);
  expect(unique(["a", "b", "c", "d"])).toEqual(["a", "b", "c", "d"]);
});

test("compile", () => {
  const tweets = [
    {
      user: { screen_name: "a" },
      retweeted_status: { user: { screen_name: "b" } },
      quoted_status: { user: { screen_name: "c" } },
      in_reply_to_screen_name: "d",
      entities: { user_mentions: [{ screen_name: "e" }, { screen_name: "f" }] }
    }
  ];

  expect(compile(tweets)).toEqual(["a", "b", "c", "d", "e", "f"]);
});
