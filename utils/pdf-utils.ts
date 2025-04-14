import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { format } from "date-fns"

// Add type declaration for jsPDF with autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export const generateSalesOfferPDF = (property: any, paymentPlan: any) => {
  const doc = new jsPDF()
  const currentDate = format(new Date(), "yyyy-MM-dd HH:mm:ss")

  // Add header
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("SALES OFFER", 105, 20, { align: "center" })

  doc.setFontSize(16)
  doc.text(`UNIT ${property.unitNumber}`, 105, 30, { align: "center" })

  doc.setFontSize(14)
  doc.text(property.projectName, 105, 40, { align: "center" })

  if (property.buildingName) {
    doc.setFontSize(12)
    doc.text(property.buildingName, 105, 48, { align: "center" })
  }

  // Add unit details table
  doc.autoTable({
    startY: 60,
    head: [["Unit", "Bedroom", "Internal Area", "External Area", "Total Area", "Unit Price"]],
    body: [
      [
        property.unitNumber,
        `${property.bedrooms}BR`,
        `${property.internalArea?.toFixed(2) || "-"} Sq. Ft.`,
        `${property.externalArea?.toFixed(2) || "-"} Sq. Ft.`,
        `${property.totalArea?.toFixed(2) || property.area?.toFixed(2) || "-"} Sq. Ft.`,
        `${property.price?.toLocaleString()} AED`,
      ],
    ],
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { halign: "center" },
    columnStyles: { 5: { fontStyle: "bold" } },
  })

  // Add disclaimer
  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.text(
    "Disclaimer: This offer is subject to availability and/or subject to change without notice.",
    14,
    doc.autoTable.previous.finalY + 10,
  )
  doc.text(`Issued On: ${currentDate}`, 14, doc.autoTable.previous.finalY + 15)

  // Add payment plan title
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("PAYMENT PLAN", 105, doc.autoTable.previous.finalY + 30, { align: "center" })

  // Calculate payment amounts
  const calculatePaymentAmount = (percentage: number) => {
    return Math.round(property.price * (percentage / 100))
  }

  // Create payment plan table data
  const paymentPlanData = paymentPlan.installments.map((installment: any) => {
    const amount = calculatePaymentAmount(installment.percentage)
    return [installment.name, installment.milestone, `${installment.percentage}%`, amount.toLocaleString()]
  })

  // Add total row
  paymentPlanData.push(["", "", "Total", property.price.toLocaleString()])

  // Add payment plan table
  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 35,
    head: [["Installments", "Payment Milestone", "Payment(%)", "Amount"]],
    body: paymentPlanData,
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "right" },
    },
    foot: [["", "", "", ""]],
    footStyles: { fillColor: [255, 255, 255] },
  })

  // Add fees notes
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text("* RAK Municipality / Other Administration Fees - AED 5000.", 14, doc.autoTable.previous.finalY + 10)
  doc.text("* RAK Municipality / RERA Registration Fees - As per authorities", 14, doc.autoTable.previous.finalY + 15)

  // Add final disclaimer
  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.text(
    "Disclaimer: This offer is subject to availability and/or subject to change without notice.",
    14,
    doc.autoTable.previous.finalY + 25,
  )
  doc.text(`Issued On: ${currentDate}`, 14, doc.autoTable.previous.finalY + 30)

  // If there's a floor plan, add it to a new page
  if (property.floorPlan) {
    doc.addPage()
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Floor Plan", 105, 20, { align: "center" })

    // In a real implementation, you would load the image and add it to the PDF
    // This is a placeholder for the concept
    doc.text("Floor plan image would be displayed here", 105, 40, { align: "center" })
  }

  return doc
}

export const downloadSalesOfferPDF = (property: any, paymentPlan: any) => {
  const doc = generateSalesOfferPDF(property, paymentPlan)
  doc.save(`Sales_Offer_Unit_${property.unitNumber}.pdf`)
}
