import { Client } from "@notionhq/client";
import { NextRequest, NextResponse } from "next/server";

const NOTION_API_KEY = process.env.YOUR_NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.YOUR_NOTION_CONTACT_DATABASE_ID;

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
        "Full Name": {
          title: [{ text: { content: body.fullName } }],
        },
        Email: {
          email: body.email || "example@example.com",
        },
        Phone: {
          rich_text: [{ text: { content: body.number } }],
        },
        Governate: {
          rich_text: [{ text: { content: body.text } }],
        }
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
