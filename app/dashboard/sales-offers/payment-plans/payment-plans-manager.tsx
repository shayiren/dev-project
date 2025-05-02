"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Edit, Save } from "lucide-react"
import { loadFromStorage, saveToStorage } from "@/utils/storage-utils"

export default function PaymentPlansManager() {
  const [paymentPlans, setPaymentPlans] = useState<any[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<any>(null)
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    installments: [
      { name: "Booking", milestone: "On Booking", percentage: 10 },
      { name: "Final Payment", milestone: "On Handover", percentage: 90 },
    ],
  })

  // Load payment plans on component mount
  useEffect(() => {
    const savedPlans = loadFromStorage<any[]>("paymentPlans", [
      {
        id: "plan1",
        name: "Standard Payment Plan",
        description: "40/60 Payment Plan",
        installments: [
          { name: "Booking", milestone: "On Booking", percentage: 10 },
          { name: "1st Installment", milestone: "Within 30 days", percentage: 10 },
          { name: "2nd Installment", milestone: "Within 60 days", percentage: 10 },
          { name: "3rd Installment", milestone: "Within 90 days", percentage: 10 },
          { name: "Final Payment", milestone: "On Handover", percentage: 60 },
        ],
      },
      {
        id: "plan2",
        name: "Extended Payment Plan",
        description: "30/70 Payment Plan",
        installments: [
          { name: "Booking", milestone: "On Booking", percentage: 10 },
          { name: "1st Installment", milestone: "Within 30 days", percentage: 5 },
          { name: "2nd Installment", milestone: "Within 60 days", percentage: 5 },
          { name: "3rd Installment", milestone: "Within 90 days", percentage: 5 },
          { name: "4th Installment", milestone: "Within 120 days", percentage: 5 },
          { name: "Final Payment", milestone: "On Handover", percentage: 70 },
        ],
      },
    ])
    setPaymentPlans(savedPlans)
  }, [])

  // Save payment plans whenever they change
  useEffect(() => {
    if (paymentPlans.length > 0) {
      saveToStorage("paymentPlans", paymentPlans)
    }
  }, [paymentPlans])

  // Add a new payment plan
  const addPaymentPlan = () => {
    const newPlanWithId = {
      ...newPlan,
      id: `plan${Date.now()}`,
    }
    setPaymentPlans([...paymentPlans, newPlanWithId])
    setNewPlan({
      name: "",
      description: "",
      installments: [
        { name: "Booking", milestone: "On Booking", percentage: 10 },
        { name: "Final Payment", milestone: "On Handover", percentage: 90 },
      ],
    })
    setIsAddDialogOpen(false)
  }

  // Edit an existing payment plan
  const editPaymentPlan = () => {
    if (currentPlan) {
      setPaymentPlans(paymentPlans.map((plan) => (plan.id === currentPlan.id ? currentPlan : plan)))
      setCurrentPlan(null)
      setIsEditDialogOpen(false)
    }
  }

  // Delete a payment plan
  const deletePaymentPlan = (id: string) => {
    if (confirm("Are you sure you want to delete this payment plan?")) {
      setPaymentPlans(paymentPlans.filter((plan) => plan.id !== id))
    }
  }

  // Add a new installment to a plan
  const addInstallment = (plan: any) => {
    const updatedPlan = { ...plan }
    const newInstallment = {
      name: `Installment ${updatedPlan.installments.length}`,
      milestone: "TBD",
      percentage: 0,
    }
    updatedPlan.installments = [...updatedPlan.installments, newInstallment]

    if (plan.id === currentPlan?.id) {
      setCurrentPlan(updatedPlan)
    } else {
      setNewPlan(updatedPlan)
    }
  }

  // Remove an installment from a plan
  const removeInstallment = (plan: any, index: number) => {
    const updatedPlan = { ...plan }
    updatedPlan.installments = updatedPlan.installments.filter((_, i) => i !== index)

    if (plan.id === currentPlan?.id) {
      setCurrentPlan(updatedPlan)
    } else {
      setNewPlan(updatedPlan)
    }
  }

  // Update installment details
  const updateInstallment = (plan: any, index: number, field: string, value: string | number) => {
    const updatedPlan = { ...plan }
    updatedPlan.installments = [...updatedPlan.installments]
    updatedPlan.installments[index] = {
      ...updatedPlan.installments[index],
      [field]: field === "percentage" ? Number(value) : value,
    }

    if (plan.id === currentPlan?.id) {
      setCurrentPlan(updatedPlan)
    } else {
      setNewPlan(updatedPlan)
    }
  }

  // Calculate total percentage
  const calculateTotalPercentage = (installments: any[]) => {
    return installments.reduce((sum, installment) => sum + (installment.percentage || 0), 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Payment Plans</h1>
        <p className="text-muted-foreground">Manage payment plans for sales offers</p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Available Payment Plans</h2>
          <p className="text-sm text-muted-foreground">Create and manage payment plans for your properties</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Payment Plan</DialogTitle>
              <DialogDescription>Create a new payment plan for your properties.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    placeholder="e.g., Standard Payment Plan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    placeholder="e.g., 40/60 Payment Plan"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Installments</Label>
                  <Button variant="outline" size="sm" onClick={() => addInstallment(newPlan)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Installment
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Milestone</TableHead>
                      <TableHead>Percentage (%)</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newPlan.installments.map((installment, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={installment.name}
                            onChange={(e) => updateInstallment(newPlan, index, "name", e.target.value)}
                            placeholder="e.g., Booking"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={installment.milestone}
                            onChange={(e) => updateInstallment(newPlan, index, "milestone", e.target.value)}
                            placeholder="e.g., On Booking"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={installment.percentage}
                            onChange={(e) => updateInstallment(newPlan, index, "percentage", e.target.value)}
                            placeholder="e.g., 10"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeInstallment(newPlan, index)}
                            disabled={newPlan.installments.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} className="text-right font-bold">
                        Total
                      </TableCell>
                      <TableCell
                        className={
                          calculateTotalPercentage(newPlan.installments) === 100 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {calculateTotalPercentage(newPlan.installments)}%
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                {calculateTotalPercentage(newPlan.installments) !== 100 && (
                  <p className="text-sm text-red-600">Total percentage must equal 100%</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={addPaymentPlan}
                disabled={
                  !newPlan.name || !newPlan.description || calculateTotalPercentage(newPlan.installments) !== 100
                }
              >
                <Save className="mr-2 h-4 w-4" />
                Save Payment Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentPlans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Installment</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plan.installments.map((installment: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{installment.name}</TableCell>
                      <TableCell>{installment.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Dialog open={isEditDialogOpen && currentPlan?.id === plan.id} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setCurrentPlan({ ...plan })}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Edit Payment Plan</DialogTitle>
                    <DialogDescription>Modify the payment plan details.</DialogDescription>
                  </DialogHeader>
                  {currentPlan && (
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Plan Name</Label>
                          <Input
                            id="edit-name"
                            value={currentPlan.name}
                            onChange={(e) => setCurrentPlan({ ...currentPlan, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-description">Description</Label>
                          <Input
                            id="edit-description"
                            value={currentPlan.description}
                            onChange={(e) => setCurrentPlan({ ...currentPlan, description: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Installments</Label>
                          <Button variant="outline" size="sm" onClick={() => addInstallment(currentPlan)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Installment
                          </Button>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Milestone</TableHead>
                              <TableHead>Percentage (%)</TableHead>
                              <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentPlan.installments.map((installment: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Input
                                    value={installment.name}
                                    onChange={(e) => updateInstallment(currentPlan, index, "name", e.target.value)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={installment.milestone}
                                    onChange={(e) => updateInstallment(currentPlan, index, "milestone", e.target.value)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    value={installment.percentage}
                                    onChange={(e) =>
                                      updateInstallment(currentPlan, index, "percentage", e.target.value)
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeInstallment(currentPlan, index)}
                                    disabled={currentPlan.installments.length <= 1}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={2} className="text-right font-bold">
                                Total
                              </TableCell>
                              <TableCell
                                className={
                                  calculateTotalPercentage(currentPlan.installments) === 100
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {calculateTotalPercentage(currentPlan.installments)}%
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        {calculateTotalPercentage(currentPlan.installments) !== 100 && (
                          <p className="text-sm text-red-600">Total percentage must equal 100%</p>
                        )}
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={editPaymentPlan}
                      disabled={
                        !currentPlan?.name ||
                        !currentPlan?.description ||
                        calculateTotalPercentage(currentPlan?.installments || []) !== 100
                      }
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" size="sm" onClick={() => deletePaymentPlan(plan.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
