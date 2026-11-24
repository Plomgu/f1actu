import { NextResponse } from "next/server";

import { getNews } from "../../lib/news";

export const revalidate = 300; // refresh every 5 minutes

export async function GET() {
  try {
    return NextResponse.json(await getNews());
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}
