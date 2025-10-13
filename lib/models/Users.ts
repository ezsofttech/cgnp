import mongoose, { Document, Schema } from "mongoose"

export interface IUserManagement extends Document {
  name: string
  contactNo: string
  address: string
  village: string
  city: string
  district: string
  loksabha: string
  vidhansabha: string
  boothNo: string
  state: string
  category: string
  politicalParty: string
  remarks: string
  mobileNumber?: string
  pincode?: string
  gender?: "male" | "female" | "other" | "prefer_not_to_say"
  membershipId?: string
  joinedDate: Date
  createdAt: Date
  updatedAt: Date
}

const UserManagementSchema = new Schema<IUserManagement>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    contactNo: {
      type: String,
      required: [true, "Contact number is required"],
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit contact number"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      maxlength: [500, "Address cannot exceed 500 characters"],
    },
    village: {
      type: String,
      required: [true, "Village is required"],
      trim: true,
      maxlength: [100, "Village name cannot exceed 100 characters"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: [100, "City name cannot exceed 100 characters"],
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
      maxlength: [100, "District name cannot exceed 100 characters"],
    },
    loksabha: {
      type: String,
      required: [true, "Lok Sabha constituency is required"],
      trim: true,
      maxlength: [100, "Lok Sabha constituency cannot exceed 100 characters"],
    },
    vidhansabha: {
      type: String,
      required: [true, "Vidhan Sabha constituency is required"],
      trim: true,
      maxlength: [100, "Vidhan Sabha constituency cannot exceed 100 characters"],
    },
    boothNo: {
      type: String,
      required: [true, "Booth number is required"],
      trim: true,
      maxlength: [50, "Booth number cannot exceed 50 characters"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      maxlength: [50, "State name cannot exceed 50 characters"],
    },
category: {
  type: String,
  required: [true, "Category is required"],
},

    politicalParty: {
      type: String,
      required: [true, "Political party is required"],
      trim: true,
      maxlength: [100, "Political party name cannot exceed 100 characters"],
      default: "CG NP"
    },
    remarks: {
      type: String,
      maxlength: [1000, "Remarks cannot exceed 1000 characters"],
      default: ""
    },
    mobileNumber: {
      type: String,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    pincode: {
      type: String,
      match: [/^[0-9]{6}$/, "Please enter a valid 6-digit pincode"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other", "prefer_not_to_say"],
        message: "Gender must be male, female, other, or prefer_not_to_say"
      },
    },
    membershipId: {
      type: String,
      unique: true,
      sparse: true,
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for performance
UserManagementSchema.index({ contactNo: 1 }, { unique: true })
UserManagementSchema.index({ district: 1, city: 1 })
UserManagementSchema.index({ loksabha: 1, vidhansabha: 1 })
UserManagementSchema.index({ category: 1 })

// Auto-generate membership ID
UserManagementSchema.pre('save', function(next) {
  if (!this.membershipId) {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    this.membershipId = `MEM${timestamp}${random}`
  }
  next()
})

UserManagementSchema.methods.getFullAddress = function() {
  return `${this.address}, ${this.village}, ${this.city}, ${this.district}, ${this.state} - ${this.pincode}`
}

export default mongoose.models.UserManagement ||
  mongoose.model<IUserManagement>("UserManagement", UserManagementSchema)
