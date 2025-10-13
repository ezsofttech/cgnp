import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import UserManagement from '@/lib/models/Users'
import * as XLSX from 'xlsx'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ]
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload Excel or CSV file.' },
        { status: 400 }
      )
    }

    // Parse the file
    const fileBuffer = await file.arrayBuffer()
    let parsedData: any[] = []

    if (file.name.endsWith('.csv')) {
      const csvText = new TextDecoder().decode(fileBuffer)
      parsedData = parseCSV(csvText)
    } else {
      const workbook = XLSX.read(fileBuffer, { type: 'array' })
      const worksheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[worksheetName]
      parsedData = XLSX.utils.sheet_to_json(worksheet)
    }

    if (parsedData.length === 0) {
      return NextResponse.json(
        { error: 'No data found in the file' },
        { status: 400 }
      )
    }

    // Process and validate data
    const processedData = parsedData.map((row, index) => {
      return {
        name: row.Name || row.name || '',
        contactNo: row['Contact No'] || row.contactNo || row.contact || '',
        mobileNumber: row['Mobile Number'] || row.mobileNumber || row.mobile || '',
        address: row.Address || row.address || '',
        village: row.Village || row.village || '',
        city: row.City || row.city || '',
        district: row.District || row.district || '',
        loksabha: row['Lok Sabha'] || row.loksabha || '',
        vidhansabha: row['Vidhan Sabha'] || row.vidhansabha || '',
        boothNo: row['Booth No'] || row.boothNo || row.booth || '',
        state: row.State || row.state || 'Chhattisgarh',
        pincode: row.Pincode || row.pincode || '',
        category: row.Category || row.category || 'General',
        politicalParty: row['Political Party'] || row.politicalParty || 'CG NP',
        gender: (row.Gender || row.gender || 'male') as "male" | "female" | "other" | "prefer_not_to_say",
        remarks: row.Remarks || row.remarks || '',
        joinedDate: row['Joined Date'] ? new Date(row['Joined Date']) : new Date()
      }
    })

    // Validate required fields
    const validationErrors: string[] = []
    const validUsers = []
    const duplicateContacts: string[] = []

    for (let i = 0; i < processedData.length; i++) {
      const user = processedData[i]
      const rowNumber = i + 2 // +2 because header is row 1 and data starts from row 2

      // Check required fields
      if (!user.name.trim()) {
        validationErrors.push(`Row ${rowNumber}: Name is required`)
        continue
      }
      if (!user.contactNo.trim()) {
        validationErrors.push(`Row ${rowNumber}: Contact number is required`)
        continue
      }
      if (!/^[0-9]{10}$/.test(user.contactNo)) {
        validationErrors.push(`Row ${rowNumber}: Contact number must be 10 digits`)
        continue
      }
      if (!user.address.trim()) {
        validationErrors.push(`Row ${rowNumber}: Address is required`)
        continue
      }
      if (!user.village.trim()) {
        validationErrors.push(`Row ${rowNumber}: Village is required`)
        continue
      }
      if (!user.city.trim()) {
        validationErrors.push(`Row ${rowNumber}: City is required`)
        continue
      }
      if (!user.district.trim()) {
        validationErrors.push(`Row ${rowNumber}: District is required`)
        continue
      }
      if (!user.loksabha.trim()) {
        validationErrors.push(`Row ${rowNumber}: Lok Sabha is required`)
        continue
      }
      if (!user.vidhansabha.trim()) {
        validationErrors.push(`Row ${rowNumber}: Vidhan Sabha is required`)
        continue
      }
      if (!user.boothNo.trim()) {
        validationErrors.push(`Row ${rowNumber}: Booth number is required`)
        continue
      }
      if (!user.state.trim()) {
        validationErrors.push(`Row ${rowNumber}: State is required`)
        continue
      }
      if (!user.category.trim()) {
        validationErrors.push(`Row ${rowNumber}: Category is required`)
        continue
      }
      if (!user.politicalParty.trim()) {
        validationErrors.push(`Row ${rowNumber}: Political party is required`)
        continue
      }

      // Check for duplicate contact numbers in the import file
      const isDuplicateInFile = processedData
        .slice(0, i)
        .some(u => u.contactNo === user.contactNo)
      
      if (isDuplicateInFile) {
        validationErrors.push(`Row ${rowNumber}: Duplicate contact number in file`)
        continue
      }

      validUsers.push(user)
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationErrors,
          validCount: validUsers.length,
          errorCount: validationErrors.length
        },
        { status: 400 }
      )
    }

    // Check for existing users in database and import
    let importedCount = 0
    let skippedCount = 0
    const importErrors: string[] = []
    const importedUsers = []

    for (const userData of validUsers) {
      try {
        // Check if user already exists
        const existingUser = await UserManagement.findOne({ 
          contactNo: userData.contactNo 
        })

        if (existingUser) {
          skippedCount++
          importErrors.push(`Contact number ${userData.contactNo} already exists`)
          continue
        }

        // Create new user
        const user = new UserManagement(userData)
        await user.save()
        importedCount++
        importedUsers.push(user)
      } catch (error: any) {
        console.error(`Error importing user ${userData.contactNo}:`, error)
        skippedCount++
        
        if (error.code === 11000) {
          importErrors.push(`Contact number ${userData.contactNo} already exists`)
        } else if (error.name === 'ValidationError') {
          const errors = Object.values(error.errors).map((err: any) => err.message)
          importErrors.push(`Contact ${userData.contactNo}: ${errors.join(', ')}`)
        } else {
          importErrors.push(`Contact ${userData.contactNo}: ${error.message}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed successfully`,
      summary: {
        totalInFile: parsedData.length,
        imported: importedCount,
        skipped: skippedCount,
        duplicates: duplicateContacts.length
      },
      importedUsers: importedUsers.map(user => ({
        name: user.name,
        contactNo: user.contactNo,
        membershipId: user.membershipId
      })),
      errors: importErrors.length > 0 ? importErrors : undefined
    })

  } catch (error: any) {
    console.error('Error importing users:', error)
    return NextResponse.json(
      { error: 'Failed to import users: ' + error.message },
      { status: 500 }
    )
  }
}

function parseCSV(csvText: string): any[] {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []

  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''))
  
  const result = []
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',').map(field => field.trim().replace(/"/g, ''))
    
    if (currentLine.length === 0 || currentLine.every(field => !field)) continue
    
    const obj: any = {}
    headers.forEach((header, index) => {
      obj[header] = currentLine[index] || ''
    })
    
    result.push(obj)
  }
  
  return result
}

// Optional: GET endpoint to download template
export async function GET(request: NextRequest) {
  try {
    const templateData = [
      {
        'Name': 'John Doe',
        'Contact No': '1234567890',
        'Mobile Number': '9876543210',
        'Gender': 'male',
        'Address': '123 Main Street',
        'Village': 'Sample Village',
        'City': 'Sample City',
        'District': 'Sample District',
        'Lok Sabha': 'Sample Lok Sabha',
        'Vidhan Sabha': 'Sample Vidhan Sabha',
        'Booth No': 'Booth-001',
        'State': 'Chhattisgarh',
        'Pincode': '492001',
        'Category': 'General',
        'Political Party': 'CG NP',
        'Remarks': 'Sample remarks'
      }
    ]

    const worksheet = XLSX.utils.json_to_sheet(templateData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template')
    
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="user-import-template.xlsx"',
      },
    })
    
  } catch (error) {
    console.error('Error generating template:', error)
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    )
  }
}