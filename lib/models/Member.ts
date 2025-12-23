// models/Member.ts
import mongoose, { type Document, Schema } from "mongoose"

export interface IMember extends Document {
  name: string
  email: string
  phone: string
  mobileNumber: string
  isWhatsAppSame: boolean
  whatsappNumber: string
  address: string
  state: string
  district: string
  lokSabha: string
  vidhanSabha: string
  ward: string
  tehsil: string
  pincode: string
  dateOfBirth: Date
  age: number
  gender: "male" | "female" | "other" | "prefer_not_to_say"
  memberType: string
  occupation?: string
  membershipId: string
  referredBy?: string
  referralCode: string
  joinedDate: Date
  status: "active" | "pending" | "inactive"
  isVolunteer: boolean
  volunteerSkills: string[]
  additionalInfo: string
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
  }
  createdAt: Date
  updatedAt: Date
}

const MemberSchema = new Schema<IMember>(
  {
    name: {
      type: String,
      required: [false, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"], // Changed to required
      unique: true, // Ensure uniqueness
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    isWhatsAppSame: {
      type: Boolean,
      default: false,
    },
    whatsappNumber: {
      type: String,
      validate: {
        validator: function(this: IMember, v: string) {
          return this.isWhatsAppSame || v?.length > 0
        },
        message: "WhatsApp number is required when not same as mobile number"
      },
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit WhatsApp number"],
    },
    address: {
      type: String,
      required: [false, "Address is required"],
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
    state: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      required: [false, "District is required"],
      trim: true,
    },
    lokSabha: {
      type: String,
      required: [false, "Lok Sabha constituency is required"],
      trim: true,
    },
    vidhanSabha: {
      type: String,
      required: [false, "Vidhan Sabha constituency is required"],
      trim: true,
    },
    ward: {
      type: String,
      trim: true,
    },
    tehsil: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    memberType: {
      type: String,
    },
    occupation: {
      type: String,
      trim: true,
    },
    membershipId: {
      type: String,
      required: false,
      unique: false,
    },
    referredBy: {
      type: String,
      ref: "Leader",
    },
    referralCode: {
      type: String,
      required: false,
      unique: true,
      uppercase: true,
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "pending", "inactive"],
      default: "pending",
    },
    isVolunteer: {
      type: Boolean,
      default: false,
    },
    volunteerSkills: [
      {
        type: String,
        enum: [
          "social_media",
          "event_management",
          "public_speaking",
          "data_entry",
          "graphic_design",
          "content_writing",
          "fundraising",
          "community_outreach",
        ],
      },
    ],
    additionalInfo: {
      type: String,
      maxlength: [500, "Additional info cannot exceed 500 characters"],
    },
    socialMedia: {
      facebook: {
        type: String,
        match: [/^[a-zA-Z0-9._-]+$/, "Please enter a valid Facebook username"],
      },
      twitter: {
        type: String,
        match: [/^[A-Za-z0-9_]{1,15}$/, "Please enter a valid Twitter handle"],
      },
      instagram: {
        type: String,
        match: [/^[a-zA-Z0-9._-]+$/, "Please enter a valid Instagram username"],
      },
    },
  },
  {
    timestamps: true,
  },
)

// Update the pre-save hook to handle new fields
MemberSchema.pre("save", function(next) {
  const member = this as IMember;
  
  // Only run for new documents
  if (!member.isNew) {
    // For updates, just check mobile uniqueness if modified
    if (member.isModified('mobileNumber')) {
      mongoose.models.Member.findOne({
        mobileNumber: member.mobileNumber,
        _id: { $ne: member._id }
      }).lean().then((existingMember: any) => {
        if (existingMember) {
          const error = new mongoose.Error.ValidationError();
          error.errors.mobileNumber = new mongoose.Error.ValidatorError({
            message: 'Mobile number already exists',
            path: 'mobileNumber',
            value: member.mobileNumber
          });
          return next(error);
        }
        next();
      }).catch(next);
    } else {
      next();
    }
    return;
  }

  // Calculate age from dateOfBirth if not provided
  if (member.dateOfBirth && !member.age) {
    const diff = Date.now() - member.dateOfBirth.getTime();
    const ageDate = new Date(diff);
    member.age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  // Generate membership ID if not provided
  if (!member.membershipId) {
    const year = new Date().getFullYear();
    
    mongoose.models.Member.findOne(
      { membershipId: { $regex: `^CGNP${year}` } },
      { membershipId: 1 }
    ).sort({ createdAt: -1 }).lean().then((lastMember: any) => {
      let nextNumber = 200;

      if (lastMember?.membershipId) {
        const match = lastMember.membershipId.match(/\d{6}$/);
        if (match) {
          const lastDigits = parseInt(match[0]);
          if (!isNaN(lastDigits)) {
            nextNumber = lastDigits + 1;
          }
        }
      }

      member.membershipId = `CGNP${year}${String(nextNumber).padStart(6, "0")}`;

      // Generate referral code if not provided
      if (!member.referralCode) {
        const generateCode = () => {
          const initials = member.name
            ? member.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 3)
            : "MEM";
          const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0");
          return `${initials}${random}`;
        };

        let code = generateCode();
        let attempts = 0;
        const maxAttempts = 10;

        const checkCode = () => {
          mongoose.models.Member.findOne({ referralCode: code }).lean().then((existing: any) => {
            if (!existing) {
              member.referralCode = code.toUpperCase();
              
              // Set WhatsApp number if same as mobile
              if (member.isWhatsAppSame && !member.whatsappNumber) {
                member.whatsappNumber = member.mobileNumber;
              }

              // Check mobile uniqueness
              mongoose.models.Member.findOne({
                mobileNumber: member.mobileNumber,
                _id: { $ne: member._id }
              }).lean().then((existingMember: any) => {
                if (existingMember) {
                  const error = new mongoose.Error.ValidationError();
                  error.errors.mobileNumber = new mongoose.Error.ValidatorError({
                    message: 'Mobile number already exists',
                    path: 'mobileNumber',
                    value: member.mobileNumber
                  });
                  return next(error);
                }
                next();
              }).catch(next);
            } else {
              attempts++;
              if (attempts < maxAttempts) {
                code = generateCode();
                checkCode();
              } else {
                const timestamp = Date.now().toString().slice(-4);
                code = `${code.slice(0, 6)}${timestamp}`;
                member.referralCode = code.toUpperCase();
                
                if (member.isWhatsAppSame && !member.whatsappNumber) {
                  member.whatsappNumber = member.mobileNumber;
                }

                mongoose.models.Member.findOne({
                  mobileNumber: member.mobileNumber,
                  _id: { $ne: member._id }
                }).lean().then((existingMember: any) => {
                  if (existingMember) {
                    const error = new mongoose.Error.ValidationError();
                    error.errors.mobileNumber = new mongoose.Error.ValidatorError({
                      message: 'Mobile number already exists',
                      path: 'mobileNumber',
                      value: member.mobileNumber
                    });
                    return next(error);
                  }
                  next();
                }).catch(next);
              }
            }
          }).catch(next);
        };
        checkCode();
      } else {
        if (member.isWhatsAppSame && !member.whatsappNumber) {
          member.whatsappNumber = member.mobileNumber;
        }

        mongoose.models.Member.findOne({
          mobileNumber: member.mobileNumber,
          _id: { $ne: member._id }
        }).lean().then((existingMember: any) => {
          if (existingMember) {
            const error = new mongoose.Error.ValidationError();
            error.errors.mobileNumber = new mongoose.Error.ValidatorError({
              message: 'Mobile number already exists',
              path: 'mobileNumber',
              value: member.mobileNumber
            });
            return next(error);
          }
          next();
        }).catch(next);
      }
    }).catch(next);
  } else {
    if (!member.referralCode) {
      // Same as above for referral code generation
      const generateCode = () => {
        const initials = member.name
          ? member.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 3)
          : "MEM";
        const random = Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0");
        return `${initials}${random}`;
      };

      let code = generateCode();
      let attempts = 0;
      const maxAttempts = 10;

      const checkCode = () => {
        mongoose.models.Member.findOne({ referralCode: code }).lean().then((existing: any) => {
          if (!existing) {
            member.referralCode = code.toUpperCase();
            
            if (member.isWhatsAppSame && !member.whatsappNumber) {
              member.whatsappNumber = member.mobileNumber;
            }

            mongoose.models.Member.findOne({
              mobileNumber: member.mobileNumber,
              _id: { $ne: member._id }
            }).lean().then((existingMember: any) => {
              if (existingMember) {
                const error = new mongoose.Error.ValidationError();
                error.errors.mobileNumber = new mongoose.Error.ValidatorError({
                  message: 'Mobile number already exists',
                  path: 'mobileNumber',
                  value: member.mobileNumber
                });
                return next(error);
              }
              next();
            }).catch(next);
          } else {
            attempts++;
            if (attempts < maxAttempts) {
              code = generateCode();
              checkCode();
            } else {
              const timestamp = Date.now().toString().slice(-4);
              code = `${code.slice(0, 6)}${timestamp}`;
              member.referralCode = code.toUpperCase();
              
              if (member.isWhatsAppSame && !member.whatsappNumber) {
                member.whatsappNumber = member.mobileNumber;
              }

              mongoose.models.Member.findOne({
                mobileNumber: member.mobileNumber,
                _id: { $ne: member._id }
              }).lean().then((existingMember: any) => {
                if (existingMember) {
                  const error = new mongoose.Error.ValidationError();
                  error.errors.mobileNumber = new mongoose.Error.ValidatorError({
                    message: 'Mobile number already exists',
                    path: 'mobileNumber',
                    value: member.mobileNumber
                  });
                  return next(error);
                }
                next();
              }).catch(next);
            }
          }
        }).catch(next);
      };
      checkCode();
    } else {
      if (member.isWhatsAppSame && !member.whatsappNumber) {
        member.whatsappNumber = member.mobileNumber;
      }

      mongoose.models.Member.findOne({
        mobileNumber: member.mobileNumber,
        _id: { $ne: member._id }
      }).lean().then((existingMember: any) => {
        if (existingMember) {
          const error = new mongoose.Error.ValidationError();
          error.errors.mobileNumber = new mongoose.Error.ValidatorError({
            message: 'Mobile number already exists',
            path: 'mobileNumber',
            value: member.mobileNumber
          });
          return next(error);
        }
        next();
      }).catch(next);
    }
  }
});

export default mongoose.models.Member || mongoose.model<IMember>("Member", MemberSchema)