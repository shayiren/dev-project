"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Trash } from "lucide-react"

export default function PaymentPlansManager() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<string[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("default")
  const [paymentPlans, setPaymentPlans] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  // New installment state
  const [newInstallment, setNewInstallment] = useState({
    name: "",
    milestone: "",
    percentage: 0,
  })

  // Load projects and payment plans on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load projects from localStorage
      const savedProjects = localStorage.getItem("projects")
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects)
        if (Array.isArray(parsedProjects)) {
          const projectNames = parsedProjects.map((p: any) => p.name || p.projectName)
          setProjects(projectNames)
        }
      }

      // Load payment plans from localStorage
      const savedPaymentPlans = localStorage.getItem("paymentPlans")
      if (savedPaymentPlans) {
        setPaymentPlans(JSON.parse(savedPaymentPlans))
      } else {
        // Set default payment plan if none exists
        const defaultPlan = {
          default: {
            installments: [
              { name: "Booking Amount", milestone: "Effective date", percentage: 20 },
              { name: "1st Installment", milestone: "60 days from the booking date", percentage: 5 },
              { name: "2nd Installment", milestone: "120 days from the booking date", percentage: 5 },
              {
                name: "3rd Installment",
                milestone: "180 days from the booking date. *completion of 15% Construction",
                percentage: 5,
              },
              {
                name: "4th Installment",
                milestone: "240 days from the booking date. *completion of 25% Construction",
                percentage: 5,
              },
              {
                name: "5th Installment",
                milestone: "300 days from the booking date. *completion of 40% Construction",
                percentage: 5,
              },
              {
                name: "6th Installment",
                milestone: "360 days from the booking date. * completion of 60% Construction",
                percentage: 5,
              },
              { name: "Final Amount", milestone: "Completion", percentage: 50 },
            ],
          },
        }
        setPaymentPlans(defaultPlan)
        localStorage.setItem("paymentPlans", JSON.stringify(defaultPlan))
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectChange = (value: string) => {
    setSelectedProject(value)

    // If this project doesn't have a payment plan yet, create one based on the default
    if (!paymentPlans[value] && value !== "default") {
      const updatedPlans = {
        ...paymentPlans,
        [value]: JSON.parse(JSON.stringify(paymentPlans.default)), // Deep copy default plan
      }
      setPaymentPlans(updatedPlans)
      localStorage.setItem("paymentPlans", JSON.stringify(updatedPlans))
    }
  }

  const handleInstallmentChange = (index: number, field: string, value: any) => {
    const currentPlan = paymentPlans[selectedProject]
    if (!currentPlan) return

    const updatedInstallments = [...currentPlan.installments]
    updatedInstallments[index] = {
      ...updatedInstallments[index],
      [field]: field === "percentage" ? Number(value) : value,
    }

    const updatedPlans = {
      ...paymentPlans,
      [selectedProject]: {
        ...currentPlan,
        installments: updatedInstallments,
      },
    }

    setPaymentPlans(updatedPlans)
    localStorage.setItem("paymentPlans", JSON.stringify(updatedPlans))
  }

  const handleAddInstallment = () => {
    if (!newInstallment.name || !newInstallment.milestone || newInstallment.percentage <= 0) {
      toast({
        title: "Invalid installment",
        description: "Please fill in all fields with valid values",
        variant: "destructive",
      })
      return
    }

    const currentPlan = paymentPlans[selectedProject]
    if (!currentPlan) return

    const updatedInstallments = [
      ...currentPlan.installments,
      { ...newInstallment, percentage: Number(newInstallment.percentage) },
    ]

    const updatedPlans = {
      ...paymentPlans,
      [selectedProject]: {
        ...currentPlan,
        installments: updatedInstallments,
      },
    }

    setPaymentPlans(updatedPlans)
    localStorage.setItem("paymentPlans", JSON.stringify(updatedPlans))

    // Reset new installment form
    setNewInstallment({
      name: "",
      milestone: "",
      percentage: 0,
    })

    toast({
      title: "Installment added",
      description: "The installment has been added to the payment plan",
    })
  }

  const handleRemoveInstallment = (index: number) => {
    const currentPlan = paymentPlans[selectedProject]
    if (!currentPlan) return

    const updatedInstallments = currentPlan.installments.filter((_: any, i: number) => i !== index)

    const updatedPlans = {
      ...paymentPlans,
      [selectedProject]: {
        ...currentPlan,
        installments: updatedInstallments,
      },
    }

    setPaymentPlans(updatedPlans)
    localStorage.setItem("paymentPlans", JSON.stringify(updatedPlans))

    toast({
      title: "Installment removed",
      description: "The installment has been removed from the payment plan",
    })
  }

  // Calculate total percentage
  const getTotalPercentage = () => {
    const currentPlan = paymentPlans[selectedProject]
    if (!currentPlan) return 0

    return currentPlan.installments.reduce((total: number, installment: any) => {
      return total + Number(installment.percentage)
    }, 0)
  }

  const totalPercentage = getTotalPercentage()

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Plans</h1>
          <p className="text-muted-foreground">Manage payment plans for different projects</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Select value={selectedProject} onValueChange={handleProjectChange}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default Payment Plan</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedProject === "default" ? "Default Payment Plan" : `Payment Plan for ${selectedProject}`}
          </CardTitle>
          <CardDescription>
            {selectedProject === "default"
              ? "This plan will be used for all projects that don't have a specific payment plan"
              : "Customize the payment plan for this specific project"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading payment plans...</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Installment Name</TableHead>
                      <TableHead>Payment Milestone</TableHead>
                      <TableHead>Percentage (%)</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentPlans[selectedProject]?.installments.map((installment: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={installment.name}
                            onChange={(e) => handleInstallmentChange(index, "name", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={installment.milestone}
                            onChange={(e) => handleInstallmentChange(index, "milestone", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={installment.percentage}
                            onChange={(e) => handleInstallmentChange(index, "percentage", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveInstallment(index)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end mt-4">
                <div className={`text-sm font-medium ${totalPercentage === 100 ? "text-green-600" : "text-red-600"}`}>
                  Total: {totalPercentage}% {totalPercentage !== 100 && "(Should be 100%)"}
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Add New Installment</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="installmentName">Installment Name</Label>
                    <Input
                      id="installmentName"
                      placeholder="e.g., 1st Installment"
                      value={newInstallment.name}
                      onChange={(e) => setNewInstallment({ ...newInstallment, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="installmentMilestone">Payment Milestone</Label>
                    <Input
                      id="installmentMilestone"
                      placeholder="e.g., 60 days from booking"
                      value={newInstallment.milestone}
                      onChange={(e) => setNewInstallment({ ...newInstallment, milestone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="installmentPercentage">Percentage (%)</Label>
                    <Input
                      id="installmentPercentage"
                      type="number"
                      placeholder="e.g., 10"
                      value={newInstallment.percentage || ""}
                      onChange={(e) => setNewInstallment({ ...newInstallment, percentage: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <Button className="mt-4" onClick={handleAddInstallment}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Installment
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
