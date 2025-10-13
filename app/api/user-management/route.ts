import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import UserManagement from '@/lib/models/Users'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''
    
    const skip = (page - 1) * limit
    
    // Build search query
    let query: any = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactNo: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
        { village: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (status) {
      query.status = status
    }
    
    if (category) {
      query.category = category
    }
    
    const users = await UserManagement.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await UserManagement.countDocuments(query)
    
    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    
    // Check if contact number already exists
    const existingUser = await UserManagement.findOne({ 
      contactNo: body.contactNo 
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this contact number already exists' },
        { status: 400 }
      )
    }
    
    const user = new UserManagement(body)
    await user.save()
    
    return NextResponse.json({ 
      message: 'User created successfully', 
      user 
    })
    
  } catch (error: any) {
    console.error('Error creating user:', error)
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}