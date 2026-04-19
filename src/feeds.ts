import { XMLParser } from "fast-xml-parser";
import { Feed } from "./schema";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "gator",
  };

  const res = await fetch(feedURL, {
    method: "GET",
    headers,
  });
  const data = await res.text();

  const parser = new XMLParser({ processEntities: false });
  const xml = parser.parse(data);

  const channel = xml.rss?.channel;
  if (!channel) {
    console.log(xml);
    throw new Error("Failed to parse channel");
  }

  if (
    !channel.title ||
    !channel.link ||
    !channel.description ||
    !channel.item
  ) {
    throw new Error("failed to parse channel");
  }

  const items: any[] = Array.isArray(channel.item)
    ? channel.item
    : [channel.item];

  const rssItems: RSSItem[] = [];

  for (const item of items) {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      continue;
    }

    rssItems.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }

  const rss: RSSFeed = {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: rssItems,
    },
  };

  return rss;
}

export function printFeed(feed: {
  userName: string | null;
  url: string;
  name: string;
}) {
  console.log(
    `Feed: ${feed.name}\n\tURL: ${feed.url}\n\tMade by: ${feed.userName}`,
  );
}
