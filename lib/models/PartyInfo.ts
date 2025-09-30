import mongoose, { type Document, Schema } from "mongoose"

export interface IPartyInfo extends Document {
  name: string
  description: string
  mission: string
  vision: string
  values: string[]
  goals: string[]
  foundedDate: Date
  headquarters: string
  website: string
  socialMedia: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
  }
  contactInfo: {
    email: string
    phone: string
    address: string
  }
  statistics: {
    totalMembers: number
    totalLeaders: number
    totalVolunteers: number
    statesPresent: number
  }
  createdAt: Date
  updatedAt: Date
}

const PartyInfoSchema = new Schema<IPartyInfo>(
  {
    name: {
      type: String,
      required: [true, "Party name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    mission: {
      type: String,
      required: [true, "Mission is required"],
      maxlength: [500, "Mission cannot exceed 500 characters"],
    },
    vision: {
      type: String,
      required: [true, "Vision is required"],
      maxlength: [500, "Vision cannot exceed 500 characters"],
    },
    values: [
      {
        type: String,
        required: true,
      },
    ],
    goals: [
      {
        type: String,
        required: true,
      },
    ],
    foundedDate: {
      type: Date,
      required: [true, "Founded date is required"],
    },
    headquarters: {
      type: String,
      required: [true, "Headquarters is required"],
    },
    website: {
      type: String,
      required: [true, "Website is required"],
    },
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      youtube: String,
    },
    contactInfo: {
      email: {
        type: String,
        required: [true, "Contact email is required"],
      },
      phone: {
        type: String,
        required: [true, "Contact phone is required"],
      },
      address: {
        type: String,
        required: [true, "Contact address is required"],
      },
    },
    statistics: {
      totalMembers: {
        type: Number,
        default: 0,
      },
      totalLeaders: {
        type: Number,
        default: 0,
      },
      totalVolunteers: {
        type: Number,
        default: 0,
      },
      statesPresent: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.PartyInfo || mongoose.model<IPartyInfo>("PartyInfo", PartyInfoSchema)
