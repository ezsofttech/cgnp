import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import UserManagement from '@/lib/models/Users'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Get all users without pagination for export
    const users = await UserManagement.find({})
      .sort({ createdAt: -1 })
      .lean()

    // Transform data for export
    const exportData = users.map(user => ({
      Name: user.name,
      'Contact No': user.contactNo,
      'Mobile Number': user.mobileNumber || '',
      Gender: user.gender || '',
      Address: user.address,
      Village: user.village,
      City: user.city,
      District: user.district,
      'Lok Sabha': user.loksabha,
      'Vidhan Sabha': user.vidhansabha,
      'Booth No': user.boothNo,
      State: user.state,
      Pincode: user.pincode || '',
      Category: user.category,
      'Political Party': user.politicalParty,
      'Membership ID': user.membershipId || '',
      'Joined Date': new Date(user.joinedDate).toLocaleDateString(),
      Remarks: user.remarks || ''
    }))

    return NextResponse.json({ 
      success: true,
      data: exportData,
      total: users.length
    })
    
  } catch (error) {
    console.error('Error exporting users:', error)
    return NextResponse.json(
      { error: 'Failed to export users' },
      { status: 500 }
    )
  }
}