import { ApifyClient } from "apify-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "Instagram URL is required" },
        { status: 400 }
      );
    }

    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    const run = await client
      .actor("apify/instagram-profile-scraper")
      .call({
        usernames: [url],
      });

    const { items } = await client
      .dataset(run.defaultDatasetId)
      .listItems();

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Apify error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to scrape Instagram profile",
      },
      { status: 500 }
    );
  }
}