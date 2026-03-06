import { Client } from "@notionhq/client";
import { NextRequest, NextResponse } from "next/server";

const NOTION_API_KEY = process.env.YOUR_NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.YOUR_NOTION_EMAIL_DATABASE_ID;

const notion = new Client({
  auth: NOTION_API_KEY,
});

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();

    await notion.pages.create({
      parent: {
        database_id: NOTION_DATABASE_ID,
      },
      properties: {
        Email: {
          email: body.email || "example@example.com",
        },
      },
    });

    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (error) {
    console.error(error); // Log the error for debugging

    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
