import FormSubmission from '../models/FormSubmission.js'
import ExcelJS from 'exceljs'

export async function submitForm(req, res) {
  try {
    const { name, email, message } = req.body
    if (!name || !email) return res.status(400).json({ message: 'name and email are required' })
    const doc = await FormSubmission.create({ name, email, message })
    res.status(201).json(doc)
  } catch {
    res.status(500).json({ message: 'Failed to save form' })
  }
}

export async function listForms(req, res) {
  try {
    const items = await FormSubmission.find().sort({ createdAt: -1 })
    res.json(items)
  } catch {
    res.status(500).json({ message: 'Failed to list forms' })
  }
}

export async function exportFormsExcel(req, res) {
  try {
    const items = await FormSubmission.find().sort({ createdAt: -1 })
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Form Submissions')
    sheet.columns = [
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Message', key: 'message', width: 50 },
      { header: 'Created At', key: 'createdAt', width: 24 },
    ]
    items.forEach((x) => {
      sheet.addRow({
        name: x.name,
        email: x.email,
        message: x.message || '',
        createdAt: x.createdAt?.toISOString() || '',
      })
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename="form_submissions.xlsx"')
    await workbook.xlsx.write(res)
    res.end()
  } catch (err) {
    res.status(500).json({ message: 'Export failed' })
  }
}


