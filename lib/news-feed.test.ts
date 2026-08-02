// Integration-style tests for the live news aggregator (lib/news-feed.ts).
//
// This module is the only place in the app that parses untrusted third-party
// XML (WHO, CNA, Google News). It runs on every dashboard render, so it must
// never throw and never let one broken upstream take the feed down. The tests
// drive the real `fetchLiveNews()` with a stubbed `fetch`, covering:
//
//   • RSS + CDATA + HTML-entity decoding
//   • the Google News "Headline - Publisher" / per-item <source> convention
//   • the health-relevance filter on broad publisher feeds
//   • de-duplication across sources, and strict newest-first ordering
//   • og:image cover resolution (and skipping it for Google redirect links)
//   • graceful degradation when a source 500s or the network is down
//
// No network is touched: every fetch is served from the fixtures below.

import { test, describe, afterEach } from "node:test";
import assert from "node:assert/strict";

import { fetchLiveNews } from "./news-feed.ts";

// ── Feed fixtures ───────────────────────────────────────────────────────────

const LONG_SUMMARY = "Measles outbreaks are expanding. ".repeat(12);

const WHO_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>WHO news</title>
    <item>
      <title><![CDATA[WHO warns of dengue &amp; chikungunya surge]]></title>
      <link>https://www.who.int/news/item/dengue-surge</link>
      <description>&lt;p&gt;Cases are rising across South-East Asia.&lt;/p&gt;</description>
      <pubDate>Wed, 02 Jul 2025 08:00:00 GMT</pubDate>
      <category>Outbreak</category>
      <media:content url="https://cdn.who.int/dengue.jpg" />
    </item>
    <item>
      <title>Global measles alert</title>
      <link>https://www.who.int/news/item/measles</link>
      <description>${LONG_SUMMARY}</description>
      <pubDate>Mon, 30 Jun 2025 08:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

const CNA_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <item>
      <title>MOH reports 3,000 dengue cases in June</title>
      <link>https://www.channelnewsasia.com/singapore/dengue-june</link>
      <description>The Ministry of Health urged residents to check for stagnant water.</description>
      <pubDate>Thu, 03 Jul 2025 09:00:00 GMT</pubDate>
      <media:thumbnail url="https://cna.sg/dengue.jpg" />
    </item>
    <item>
      <title>Singapore wins the regional football final</title>
      <link>https://www.channelnewsasia.com/sport/final</link>
      <description>A late goal sealed the trophy in front of a packed stadium.</description>
      <pubDate>Thu, 03 Jul 2025 12:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

const GOOGLE_NEWS_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Dengue cases climb in the east - The Straits Times</title>
      <link>https://news.google.com/rss/articles/CBMiEXN0cmFpdHM</link>
      <description>Dengue cases climb in the east - The Straits Times</description>
      <pubDate>Fri, 04 Jul 2025 10:00:00 GMT</pubDate>
      <source url="https://www.straitstimes.com">The Straits Times</source>
    </item>
    <item>
      <title>WHO warns of dengue &amp; chikungunya surge - WHO</title>
      <link>https://news.google.com/rss/articles/CBMiEXdobw</link>
      <description>WHO warns of dengue surge - WHO</description>
      <pubDate>Wed, 02 Jul 2025 08:00:00 GMT</pubDate>
      <source url="https://www.who.int">WHO</source>
    </item>
  </channel>
</rss>`;

const ARTICLE_HTML = `<!doctype html><html><head>
  <meta property="og:title" content="Global measles alert" />
  <meta property="og:image" content="https://cdn.who.int/measles-cover.jpg" />
</head><body>…</body></html>`;

// ── fetch stub ──────────────────────────────────────────────────────────────

const realFetch = globalThis.fetch;

interface StubOptions {
  /** Status per source; anything other than 200 makes that source contribute nothing. */
  whoStatus?: number;
  cnaStatus?: number;
  googleStatus?: number;
  /** Throw on every call, simulating a total network outage. */
  offline?: boolean;
}

/** Serves the fixtures above; records every URL requested. */
function stubFetch(opts: StubOptions = {}): string[] {
  const requested: string[] = [];

  globalThis.fetch = (async (input: string) => {
    const url = String(input);
    requested.push(url);
    if (opts.offline) throw new Error("network unreachable");

    const reply = (status: number, body: string) =>
      ({
        ok: status >= 200 && status < 300,
        status,
        text: async () => body,
      }) as unknown as Response;

    if (url.includes("who.int/rss-feeds")) return reply(opts.whoStatus ?? 200, WHO_RSS);
    if (url.includes("channelnewsasia.com")) return reply(opts.cnaStatus ?? 200, CNA_RSS);
    if (url.includes("news.google.com/rss/search"))
      return reply(opts.googleStatus ?? 200, GOOGLE_NEWS_RSS);

    // Anything else is an article page fetched for its og:image cover.
    return reply(200, ARTICLE_HTML);
  }) as unknown as typeof fetch;

  return requested;
}

afterEach(() => {
  globalThis.fetch = realFetch;
});

// ── Tests ───────────────────────────────────────────────────────────────────

/** Fails the test with a readable message instead of a TypeError on undefined. */
function must<T>(value: T | null | undefined, what: string): T {
  if (value === undefined || value === null) assert.fail(`expected to find ${what}`);
  return value;
}

describe("fetchLiveNews — parsing", () => {
  test("decodes CDATA, HTML entities and stripped-tag summaries", async () => {
    stubFetch();
    const items = await fetchLiveNews();

    const dengue = must(
      items.find((u) => u.sourceUrl === "https://www.who.int/news/item/dengue-surge"),
      "the WHO dengue item",
    );
    assert.equal(dengue.title, "WHO warns of dengue & chikungunya surge");
    assert.equal(dengue.summary, "Cases are rising across South-East Asia.");
    assert.equal(dengue.sourceName, "World Health Organization");
    assert.equal(dengue.location, "Global");
    assert.equal(dengue.category, "Outbreak");
    assert.equal(dengue.imageUrl, "https://cdn.who.int/dengue.jpg");
    assert.equal(dengue.publishedAt, new Date("Wed, 02 Jul 2025 08:00:00 GMT").toISOString());
    assert.equal(dengue.severity, null, "aggregated news never carries a LIVE badge");
    assert.ok(dengue.id.startsWith("n_"), "each item gets a stable short id");
  });

  test("long summaries are truncated to 240 characters with an ellipsis", async () => {
    stubFetch();
    const items = await fetchLiveNews();

    const measles = must(
      items.find((u) => u.title === "Global measles alert"),
      "the WHO measles item",
    );
    const summary = must(measles.summary, "a summary on the measles item");
    assert.equal(summary.length, 238);
    assert.ok(summary.endsWith("…"));
  });

  test("Google News items are attributed to the real publisher", async () => {
    stubFetch();
    const items = await fetchLiveNews();

    const st = must(
      items.find((u) => u.sourceName === "The Straits Times"),
      "an item attributed to The Straits Times",
    );
    assert.equal(st.title, "Dengue cases climb in the east", "the ' - Publisher' suffix is stripped");
    assert.equal(st.summary, null, "the aggregator's echoed headline is not a real summary");
    assert.equal(st.location, "Singapore");
  });
});

describe("fetchLiveNews — filtering, de-duplication and ordering", () => {
  test("non-health items from broad publisher feeds are dropped", async () => {
    stubFetch();
    const items = await fetchLiveNews();

    assert.ok(
      items.some((u) => u.title.includes("MOH reports 3,000 dengue cases")),
      "health items from CNA are kept",
    );
    assert.ok(
      !items.some((u) => u.title.includes("football")),
      "the sports item must not reach the health feed",
    );
  });

  test("the same story from two sources appears once, first source wins", async () => {
    stubFetch();
    const items = await fetchLiveNews();

    const dupes = items.filter((u) => u.title.startsWith("WHO warns of dengue"));
    assert.equal(dupes.length, 1, "the Google News echo of the WHO story is de-duplicated");
    assert.equal(dupes[0].sourceName, "World Health Organization");
  });

  test("items are strictly newest first across every source", async () => {
    stubFetch();
    const items = await fetchLiveNews();

    assert.deepEqual(
      items.map((u) => u.title),
      [
        "Dengue cases climb in the east", // Fri 04 Jul
        "MOH reports 3,000 dengue cases in June", // Thu 03 Jul
        "WHO warns of dengue & chikungunya surge", // Wed 02 Jul
        "Global measles alert", // Mon 30 Jun
      ],
    );
  });

  test("the limit argument caps the feed", async () => {
    stubFetch();
    const items = await fetchLiveNews(2);

    assert.equal(items.length, 2);
    assert.equal(items[0].title, "Dengue cases climb in the east");
  });
});

describe("fetchLiveNews — cover images", () => {
  test("an item with no feed image gets its article's og:image", async () => {
    stubFetch();
    const items = await fetchLiveNews();

    const measles = items.find((u) => u.title === "Global measles alert");
    assert.equal(measles?.imageUrl, "https://cdn.who.int/measles-cover.jpg");
  });

  test("Google redirect links are never fetched for a cover image", async () => {
    const requested = stubFetch();
    const items = await fetchLiveNews();

    const st = items.find((u) => u.sourceName === "The Straits Times");
    assert.equal(st?.imageUrl, null, "the redirect hides the publisher's cover");
    assert.ok(
      !requested.some((u) => u.startsWith("https://news.google.com/rss/articles")),
      "no pointless request to a Google redirect URL",
    );
  });
});

describe("fetchLiveNews — resilience", () => {
  test("one failing source does not take the feed down", async () => {
    stubFetch({ whoStatus: 500 });
    const items = await fetchLiveNews();

    assert.ok(items.length > 0, "the other sources still deliver");
    assert.ok(
      !items.some((u) => u.sourceName === "World Health Organization"),
      "the failed source contributes nothing",
    );
  });

  test("a total network outage yields an empty feed, not an exception", async () => {
    stubFetch({ offline: true });
    assert.deepEqual(await fetchLiveNews(), []);
  });
});
