"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"
import { useState } from "react"
import { ChevronDown, Loader2 } from "lucide-react"
// import { DatePicker } from "@/components/ui/date-picker"
import { type IPartyInfo } from "@/lib/models/PartyInfo"
import { Popover, PopoverTrigger } from "../ui/popover"
import { PopoverContent } from "@radix-ui/react-popover"
import { Calendar } from "../ui/calendar"

// Define the schema for party information
const partyInfoSchema = z.object({
  name: z.string().min(1, "Party name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  mission: z.string().min(10, "Mission must be at least 10 characters"),
  vision: z.string().min(10, "Vision must be at least 10 characters"),
  values: z.array(z.string().min(1, "Value cannot be empty")).min(1, "At least one value is required"),
  goals: z.array(z.string().min(1, "Goal cannot be empty")).min(1, "At least one goal is required"),
  foundedDate: z.date(),
  headquarters: z.string().min(1, "Headquarters is required"),
  website: z.string().url("Invalid URL format"),
  socialMedia: z.object({
    facebook: z.string().url("Invalid URL format").or(z.literal("")),
    twitter: z.string().url("Invalid URL format").or(z.literal("")),
    instagram: z.string().url("Invalid URL format").or(z.literal("")),
    youtube: z.string().url("Invalid URL format").or(z.literal("")),
  }),
  contactInfo: z.object({
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(1, "Address is required"),
  }),
  statistics: z.object({
    totalMembers: z.number().min(0, "Cannot be negative"),
    totalLeaders: z.number().min(0, "Cannot be negative"),
    totalVolunteers: z.number().min(0, "Cannot be negative"),
    statesPresent: z.number().min(0, "Cannot be negative"),
  }),
})

type PartyInfoFormData = z.infer<typeof partyInfoSchema>

interface PartyInfoFormProps {
  initialData?: IPartyInfo | null
}



export function PartyInfoForm({ initialData }: PartyInfoFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PartyInfoFormData>({
    resolver: zodResolver(partyInfoSchema),
    defaultValues: initialData ? {
      ...initialData,
      foundedDate: new Date(initialData.foundedDate),
    } : {
      name: "",
      description: "",
      mission: "",
      vision: "",
      values: [""],
      goals: [""],
      foundedDate: new Date(),
      headquarters: "",
      website: "",
      socialMedia: {
        facebook: "",
        twitter: "",
        instagram: "",
        youtube: "",
      },
      contactInfo: {
        email: "",
        phone: "",
        address: "",
      },
      statistics: {
        totalMembers: 0,
        totalLeaders: 0,
        totalVolunteers: 0,
        statesPresent: 0,
      },
    },
  })

  const values = watch("values")
  const goals = watch("goals")

  const addValue = () => setValue("values", [...values, ""])
  const removeValue = (index: number) => setValue("values", values.filter((_, i) => i !== index))

  const addGoal = () => setValue("goals", [...goals, ""])
  const removeGoal = (index: number) => setValue("goals", goals.filter((_, i) => i !== index))

  const onSubmit = async (data: PartyInfoFormData) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/party-info', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Party information updated successfully",
          variant: "default",
        })
        reset(data)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update party information",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Update error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const DatePickerField = ({ name }: { name: keyof PartyInfoFormData }) => {
    const date = watch(name) as Date

      const formatDate = (date: Date | undefined) => {
    if (!date) return null
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            {date ? formatDate(date) : <span>Pick a date</span>}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setValue(name, date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Card className="w-full  mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Party Information Management</CardTitle>
        <CardDescription>
          Update all details about your political party
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Party Name*</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter party name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="foundedDate">Founded Date*</Label>
                <DatePickerField name="foundedDate" />
                {errors.foundedDate && (
                  <p className="text-sm text-red-600">{errors.foundedDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="headquarters">Headquarters*</Label>
                <Input
                  id="headquarters"
                  {...register("headquarters")}
                  placeholder="Enter headquarters address"
                />
                {errors.headquarters && (
                  <p className="text-sm text-red-600">{errors.headquarters.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website*</Label>
                <Input
                  id="website"
                  {...register("website")}
                  placeholder="https://example.com"
                />
                {errors.website && (
                  <p className="text-sm text-red-600">{errors.website.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Vision & Mission Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Vision & Mission</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe your party (min 10 characters)"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mission">Mission Statement*</Label>
                <Textarea
                  id="mission"
                  {...register("mission")}
                  placeholder="Enter your party's mission"
                  rows={3}
                />
                {errors.mission && (
                  <p className="text-sm text-red-600">{errors.mission.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vision">Vision Statement*</Label>
                <Textarea
                  id="vision"
                  {...register("vision")}
                  placeholder="Enter your party's vision"
                  rows={3}
                />
                {errors.vision && (
                  <p className="text-sm text-red-600">{errors.vision.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Core Values*</h3>
              <Button type="button" variant="outline" size="sm" onClick={addValue}>
                Add Value
              </Button>
            </div>
            <div className="space-y-4">
              {values.map((value, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    {...register(`values.${index}`)}
                    placeholder="Enter a core value"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeValue(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {errors.values && (
                <p className="text-sm text-red-600">{errors.values.message}</p>
              )}
            </div>
          </div>

          {/* Goals Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Goals*</h3>
              <Button type="button" variant="outline" size="sm" onClick={addGoal}>
                Add Goal
              </Button>
            </div>
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    {...register(`goals.${index}`)}
                    placeholder="Enter a goal"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGoal(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {errors.goals && (
                <p className="text-sm text-red-600">{errors.goals.message}</p>
              )}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  {...register("socialMedia.facebook")}
                  placeholder="https://facebook.com/yourpage"
                />
                {errors.socialMedia?.facebook && (
                  <p className="text-sm text-red-600">{errors.socialMedia.facebook.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  {...register("socialMedia.twitter")}
                  placeholder="https://twitter.com/yourhandle"
                />
                {errors.socialMedia?.twitter && (
                  <p className="text-sm text-red-600">{errors.socialMedia.twitter.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  {...register("socialMedia.instagram")}
                  placeholder="https://instagram.com/yourprofile"
                />
                {errors.socialMedia?.instagram && (
                  <p className="text-sm text-red-600">{errors.socialMedia.instagram.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  {...register("socialMedia.youtube")}
                  placeholder="https://youtube.com/yourchannel"
                />
                {errors.socialMedia?.youtube && (
                  <p className="text-sm text-red-600">{errors.socialMedia.youtube.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("contactInfo.email")}
                  placeholder="contact@example.com"
                />
                {errors.contactInfo?.email && (
                  <p className="text-sm text-red-600">{errors.contactInfo.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone*</Label>
                <Input
                  id="phone"
                  {...register("contactInfo.phone")}
                  placeholder="+91 1234567890"
                />
                {errors.contactInfo?.phone && (
                  <p className="text-sm text-red-600">{errors.contactInfo.phone.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address*</Label>
                <Input
                  id="address"
                  {...register("contactInfo.address")}
                  placeholder="Full postal address"
                />
                {errors.contactInfo?.address && (
                  <p className="text-sm text-red-600">{errors.contactInfo.address.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Party Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="totalMembers">Total Members</Label>
                <Input
                  id="totalMembers"
                  type="number"
                  min="0"
                  {...register("statistics.totalMembers", { valueAsNumber: true })}
                />
                {errors.statistics?.totalMembers && (
                  <p className="text-sm text-red-600">{errors.statistics.totalMembers.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalLeaders">Total Leaders</Label>
                <Input
                  id="totalLeaders"
                  type="number"
                  min="0"
                  {...register("statistics.totalLeaders", { valueAsNumber: true })}
                />
                {errors.statistics?.totalLeaders && (
                  <p className="text-sm text-red-600">{errors.statistics.totalLeaders.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalVolunteers">Total Volunteers</Label>
                <Input
                  id="totalVolunteers"
                  type="number"
                  min="0"
                  {...register("statistics.totalVolunteers", { valueAsNumber: true })}
                />
                {errors.statistics?.totalVolunteers && (
                  <p className="text-sm text-red-600">{errors.statistics.totalVolunteers.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="statesPresent">States Present</Label>
                <Input
                  id="statesPresent"
                  type="number"
                  min="0"
                  {...register("statistics.statesPresent", { valueAsNumber: true })}
                />
                {errors.statistics?.statesPresent && (
                  <p className="text-sm text-red-600">{errors.statistics.statesPresent.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Update Party Information"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}