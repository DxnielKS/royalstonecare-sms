import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Modal } from "./ui/modal"
import { Plus } from "lucide-react"
import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"
import { Button } from "./ui/button"

interface AddCustomerModalProps {
    onClose: (closed: boolean) => void
    onSubmit: (data: { name: string; email: string; phone: string, phone_extension: string }) => void
}

export function AddCustomerModal({ onClose, onSubmit }: AddCustomerModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        countryCode: "+44" // Default to UK
    })

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: ""
    })

    const countryCodes = [
        { value: "+1", label: "🇺🇸 +1 (US/Canada)" },
        { value: "+44", label: "🇬🇧 +44 (UK)" },
        { value: "+61", label: "🇦🇺 +61 (Australia)" },
        // Add more as needed
    ]

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const formatPhoneNumber = (phone: string) => {
        // Remove all non-numeric characters
        const cleaned = phone.replace(/\D/g, "")

        // Format as (XXX) XXX-XXXX for US/Canada
        if (formData.countryCode === "+1" && cleaned.length >= 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
        }
        return cleaned
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        let formattedValue = value

        if (name === "phone") {
            formattedValue = formatPhoneNumber(value)
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }))

        // Clear error when user types
        setErrors(prev => ({
            ...prev,
            [name]: ""
        }))
    }

    const handleCountryCodeChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            countryCode: value,
            phone: "" // Reset phone when country changes
        }))
    }

    const validateForm = () => {
        const newErrors = {
            name: !formData.name ? "Name is required" : "",
            email: !validateEmail(formData.email) ? "Invalid email format" : "",
            phone: !formData.phone ? "Phone number is required" : ""
        }

        setErrors(newErrors)
        return !Object.values(newErrors).some(error => error !== "")
    }

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit({
                name: formData.name,
                email: formData.email,
                phone: formData.phone.replace(/\D/g, ""), // Clean format and add country code
                phone_extension: formData.countryCode
            })
            onClose(true)
        }
    }

    return (
        <Modal onClose={onClose} button={<Button onClick={handleSubmit}><Plus className="mr-2" size={20}/>Add <kbd className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
            ↵
        </kbd></Button>}>
            <div className="space-y-4">
                <div>
                    <Label>Customer Name</Label>
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter customer name"
                        className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                </div>

                <div>
                    <Label>Email</Label>
                    <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                        className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
                </div>

                <div>
                    <Label>Phone Number</Label>
                    <div className="flex gap-2">
                        <Select value={formData.countryCode} onValueChange={handleCountryCodeChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                                {countryCodes.map((code) => (
                                    <SelectItem key={code.value} value={code.value}>
                                        {code.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder={formData.countryCode === "+1" ? "(555) 555-5555" : "Enter phone number"}
                            className={`flex-1 ${errors.phone ? "border-red-500" : ""}`}
                        />
                    </div>
                    {errors.phone && <span className="text-sm text-red-500">{errors.phone}</span>}
                </div>
            </div>
        </Modal>
    )
}