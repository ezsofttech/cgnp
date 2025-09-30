import dbConnect from "../lib/mongodb"
import Leader from "../lib/models/Leader"
import Member from "../lib/models/Member"
import PartyInfo from "../lib/models/PartyInfo"

async function seedDatabase() {
  try {
    await dbConnect()

    // Clear existing data
    await Leader.deleteMany({})
    await Member.deleteMany({})
    await PartyInfo.deleteMany({})

    // Create sample leaders
    const leaders = await Leader.create([
      {
        name: "Arvind Kejriwal",
        email: "arvind@aamaadmiparty.org",
        password: "password123",
        position: "National Convenor",
        bio: "Founder and National Convenor of Aam Aadmi Party. Former Chief Minister of Delhi.",
        phone: "+919876543210",
        address: "New Delhi, India",
        role: "national_convenor",
        permissions: ["manage_members", "view_analytics", "manage_events", "manage_donations", "admin_access"],
        isActive: true,
      },
      {
        name: "Manish Sisodia",
        email: "manish@aamaadmiparty.org",
        password: "password123",
        position: "Deputy Chief Minister",
        bio: "Deputy Chief Minister of Delhi and Senior AAP Leader.",
        phone: "+919876543211",
        address: "New Delhi, India",
        role: "deputy_convenor",
        permissions: ["manage_members", "view_analytics", "manage_events"],
        isActive: true,
      },
      {
        name: "Atishi Marlena",
        email: "atishi@aamaadmiparty.org",
        password: "password123",
        position: "Education Minister",
        bio: "Education Minister of Delhi, known for education reforms.",
        phone: "+919876543212",
        address: "New Delhi, India",
        role: "policy_head",
        permissions: ["manage_members", "view_analytics"],
        isActive: true,
      },
    ])

    // Create sample members
    const members = await Member.create([
      {
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        phone: "+919876543213",
        address: "Sector 15, Rohini, New Delhi",
        state: "Delhi",
        district: "North West Delhi",
        pincode: "110085",
        dateOfBirth: new Date("1985-05-15"),
        gender: "male",
        occupation: "Software Engineer",
        referredBy: leaders[0]._id,
        status: "active",
        isVolunteer: true,
        volunteerSkills: ["social_media", "data_entry"],
      },
      {
        name: "Priya Sharma",
        email: "priya@example.com",
        phone: "+919876543214",
        address: "Lajpat Nagar, New Delhi",
        state: "Delhi",
        district: "South Delhi",
        pincode: "110024",
        dateOfBirth: new Date("1990-08-22"),
        gender: "female",
        occupation: "Teacher",
        referredBy: leaders[1]._id,
        status: "active",
        isVolunteer: true,
        volunteerSkills: ["event_management", "public_speaking"],
      },
      {
        name: "Amit Singh",
        email: "amit@example.com",
        phone: "+919876543215",
        address: "Karol Bagh, New Delhi",
        state: "Delhi",
        district: "Central Delhi",
        pincode: "110005",
        dateOfBirth: new Date("1988-12-10"),
        gender: "male",
        occupation: "Business Owner",
        referredBy: leaders[2]._id,
        status: "pending",
        isVolunteer: false,
        volunteerSkills: [],
      },
      {
        name: "Sunita Devi",
        email: "sunita@example.com",
        phone: "+919876543216",
        address: "Dwarka, New Delhi",
        state: "Delhi",
        district: "South West Delhi",
        pincode: "110075",
        dateOfBirth: new Date("1982-03-18"),
        gender: "female",
        occupation: "Social Worker",
        referredBy: leaders[0]._id,
        status: "active",
        isVolunteer: true,
        volunteerSkills: ["community_outreach", "fundraising"],
      },
      {
        name: "Vikash Yadav",
        email: "vikash@example.com",
        phone: "+919876543217",
        address: "Janakpuri, New Delhi",
        state: "Delhi",
        district: "West Delhi",
        pincode: "110058",
        dateOfBirth: new Date("1995-07-25"),
        gender: "male",
        occupation: "Student",
        referredBy: leaders[1]._id,
        status: "active",
        isVolunteer: true,
        volunteerSkills: ["graphic_design", "content_writing"],
      },
    ])

    // Create party information
    await PartyInfo.create({
      name: "Aam Aadmi Party",
      description:
        "The Aam Aadmi Party (AAP) is a political party in India, formally launched on 26 November 2012. It came into existence following differences between the activists Arvind Kejriwal and Anna Hazare regarding whether to form a political party to fight corruption.",
      mission: "To provide clean, transparent and accountable governance to the people of India",
      vision: "To build a corruption-free India where every citizen has equal opportunities and rights",
      values: ["Transparency", "Accountability", "Honesty", "Integrity", "Service to People"],
      goals: [
        "Eliminate corruption from governance",
        "Provide quality education and healthcare",
        "Ensure 24x7 electricity and clean water",
        "Create employment opportunities",
        "Empower women and marginalized communities",
      ],
      foundedDate: new Date("2012-11-26"),
      headquarters: "New Delhi, India",
      website: "https://aamaadmiparty.org",
      socialMedia: {
        facebook: "https://facebook.com/AamAadmiParty",
        twitter: "https://twitter.com/AamAadmiParty",
        instagram: "https://instagram.com/aamaadmiparty",
        youtube: "https://youtube.com/AamAadmiParty",
      },
      contactInfo: {
        email: "info@aamaadmiparty.org",
        phone: "+91-11-23379379",
        address: "206, Rouse Avenue, New Delhi - 110002",
      },
      statistics: {
        totalMembers: members.length,
        totalLeaders: leaders.length,
        totalVolunteers: members.filter((m) => m.isVolunteer).length,
        statesPresent: 8,
      },
    })

    console.log("Database seeded successfully!")
    console.log("\nTest Login Credentials:")
    console.log("Email: arvind@aamaadmiparty.org")
    console.log("Password: password123")
    console.log("\nEmail: manish@aamaadmiparty.org")
    console.log("Password: password123")
    console.log("\nEmail: atishi@aamaadmiparty.org")
    console.log("Password: password123")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
