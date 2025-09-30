import mongoose, { type Document, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export interface ILeader extends Document {
  name: string
  email: string
  password: string
  position: string
  bio: string
  image?: string
  phone: string
  address: string
  referralCode: string
  joinedDate: Date
  isActive: boolean
  role:
    | "national_convenor"
    | "deputy_convenor"
    | "policy_head"
    | "organization_secretary"
    | "state_convenor"
    | "district_convenor"
  permissions: string[]
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const LeaderSchema = new Schema<ILeader>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    position: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    image: {
      type: String,
      default: "/placeholder.svg?height=300&width=300",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    address: {
      type: String,
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
    referralCode: {
      type: String,
      uppercase: true,

    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: [
        "national_convenor",
        "deputy_convenor",
        "policy_head",
        "organization_secretary",
        "state_convenor",
        "district_convenor",
      ],
      required: [true, "Role is required"],
    },
    permissions: [
      {
        type: String,
        enum: ["manage_members", "view_analytics", "manage_events", "manage_donations", "admin_access"],
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
LeaderSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
LeaderSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.Leader || mongoose.model<ILeader>("Leader", LeaderSchema)
