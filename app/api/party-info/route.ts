


import { type NextRequest, NextResponse } from "next/server";

let dbConnect: any;
let PartyInfo: any;
let authenticateRequest: any;

try {
  dbConnect = require("@/lib/mongodb").default;
  PartyInfo = require("@/lib/models/PartyInfo").default;
  authenticateRequest = require("@/lib/auth").authenticateRequest;
} catch (err) {
  console.error("Top-level import error:", err);
}

// GET latest PartyInfo
export async function GET() {
  try {
    console.log("GET /api/party-info called");
    if (!dbConnect || !PartyInfo) throw new Error("Database or model not loaded properly");

    await dbConnect();
    console.log("MongoDB connected");

    const partyInfo = await PartyInfo.findOne().sort({ createdAt: -1 });
    // console.log("Fetched party info:", partyInfo);

    if (!partyInfo) {
      return NextResponse.json({ error: "Party information not found" }, { status: 404 });
    }

    return NextResponse.json({ partyInfo });
  } catch (error: any) {
    console.error("GET /api/party-info error:", error);
    return NextResponse.json({ error: "Internal server error", message: error.message, stack: error.stack }, { status: 500 });
  }
}

// POST to create first PartyInfo
export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/party-info called");
    if (!dbConnect || !PartyInfo) throw new Error("Database or model not loaded properly");

    await dbConnect();
    console.log("MongoDB connected");

    const data = await request.json();
    console.log("POST data received:", data);

    const existing = await PartyInfo.findOne();
    if (existing) {
      return NextResponse.json({ error: "PartyInfo already exists" }, { status: 400 });
    }

    const newPartyInfo = new PartyInfo(data);
    await newPartyInfo.validate();
    await newPartyInfo.save();

    console.log("Created new PartyInfo:", newPartyInfo);
    return NextResponse.json({ message: "PartyInfo created", partyInfo: newPartyInfo });
  } catch (error: any) {
    console.error("POST /api/party-info error:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: "Validation error", details: errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error", message: error.message }, { status: 500 });
  }
}

// PATCH to update existing PartyInfo
export async function PATCH(request: NextRequest) {
  try {
    console.log("PATCH /api/party-info called");
    if (!dbConnect || !PartyInfo || !authenticateRequest) throw new Error("Database, model, or auth not loaded properly");

    await dbConnect();
    console.log("MongoDB connected");

    // Authenticate request
    let auth = false;
    try {
      auth = await authenticateRequest(request);
    } catch (err) {
      console.error("Authentication error:", err);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Parse JSON payload
    let updateData;
    try {
      updateData = await request.json();
      console.log("Update data received:", updateData);
    } catch (err) {
      console.error("Invalid JSON payload:", err);
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    // Find existing PartyInfo
    const existingPartyInfo = await PartyInfo.findOne();
    if (!existingPartyInfo) {
      return NextResponse.json({ error: "No party info exists to update. Please create one first." }, { status: 404 });
    }

    // Update only provided fields safely
    Object.assign(existingPartyInfo, updateData);

    // Validate & save
    await existingPartyInfo.validate();
    await existingPartyInfo.save();

    console.log("Updated party info:", existingPartyInfo);
    return NextResponse.json({ message: "Party information updated successfully", partyInfo: existingPartyInfo });
  } catch (error: any) {
    console.error("PATCH /api/party-info error:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: "Validation error", details: errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error", message: error.message, stack: error.stack }, { status: 500 });
  }
}
