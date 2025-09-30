import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Leader from "@/lib/models/Leader"

export async function POST(request: NextRequest) {
  console.log("post register");
  
  try {
    await dbConnect()

    const leaderData = await request.json()

    // Generate referral code
    const generateReferralCode = (name: string) => {
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
      const year = new Date().getFullYear()
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")
      return `${initials}${year}${random}`
    }

    let referralCode = generateReferralCode(leaderData.name)

    // Ensure referral code is unique
    while (await Leader.findOne({ referralCode })) {
      referralCode = generateReferralCode(leaderData.name)
    }
    console.log("referralCode",referralCode);
    
    const leader = new Leader({
      referralCode,
      ...leaderData,
      isActive: true, // Require admin approval
    })

    await leader.save()

    // Remove password from response
    const responseData = leader.toObject()
    delete responseData.password

    return NextResponse.json(
      {
        message: "Registration successful! Your account is pending approval.",
        leader: responseData,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error.code === 11000) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Validation error", details: errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
