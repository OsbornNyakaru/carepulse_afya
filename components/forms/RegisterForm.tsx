"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Form, FormControl } from "../ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes } from "@/constants"
import { Label } from "../ui/label"
import { Select, SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"

const RegisterForm = ({ user }: { user: User } ) => {
  
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });
  
  // 2. Define a submit handler.
  const onSubmit = async ({ name, email, phone }: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);
    
    try {
      const userData = { 
        name,
        email,
        phone, 
      }

      const newUser = await createUser(userData);

      if(newUser) { 
        router.push(`/patients/${newUser.$id}/register`);
      }

    } catch (error) {
      console.error('Error creating new user:', error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Karibu! 👋</h1>
          <p className="text-dark-700">
            Let Us Know More about Yourself.
          </p>
        </section>
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">
                Personal Information
                </h2>
            </div>
        </section>

        <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email "
                placeholder="johndoe@ku.ac.ke"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
            />

            <CustomFormField 
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Phone Number"
                placeholder="(+254) 7 123 - 456"
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthDate"
                label="Date of Birth"
                placeholder="johndoe@ku.ac.ke"
            />

            <CustomFormField 
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                label="Gender"
                renderSkeleton={(field) => (
                    <FormControl>
                        <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value}>
                            {GenderOptions.map((option) => (
                                <div key={option} className="radio-group">
                                    <RadioGroupItem 
                                        value={option}
                                        id={option}
                                    />
                                    <Label htmlFor={option} className="cursor-pointer">
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </FormControl>
                )}
            />
        </div>


        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Address"
                placeholder="Kimathi Street, Nairobi Kenya"
                />
            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="occupation"
                label="Occupation"
                placeholder="Software Engineer"
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="emergencyContactName"
                label="Emergency Contact Name"
                placeholder="Parent/ Guardian's Name"
            />

            <CustomFormField 
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="emergencyContactNumber"
                label="Emergency Contact Number"
                placeholder="(+254) 7 123 - 456"
            />
        </div>

        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">
                Medical Information
                </h2>
            </div>
        </section>

        <CustomFormField 
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary Physician"
            placeholder="Select a physician"
        >
            {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                    <div className="flex cursor-pointer items-center gap-2 ">
                        <Image
                            src={doctor.image}
                            height={32}
                            width={32}
                            alt={doctor.name}
                            className="rounded-full border border-dark-500"
                        />
                        <p>{doctor.name}</p>
                        {/* <span>{doctor.name}</span> */}
                    </div>
                </SelectItem>
            ))}
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insuranceProvider"
                label="Insurance Provider"
                placeholder="Jubilee, MEDICROSS, NHIF"
            />
            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insurancePolicyNumber"
                label="Insurance Policy Number"
                placeholder="ex: 8978123BBUX"
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="allergies"
                label="Allergies (If any)"
                placeholder="Cold Allergies, Pollen, etc.,"
            />
            <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="currentMedication"
                label="Current Medication (If any)"
                placeholder="Ibuprofen (200mg, 1*2 days), Loratadine, etc.,"
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="familyMedicalHistory"
                label="Family Medical History (If any)"
                placeholder="Mother had high blood pressure, father had Diabetes, etc.,"
            />
            <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="pastMedicalHistory"
                label="Past Medical History (If any)"
                placeholder="Appendectectomy, Tonsilitis, etc.,"
            />
        </div>

        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">
                Identification and Verification
                </h2>
            </div>
        </section>

        <CustomFormField 
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select an identification type"
        >
            {IdentificationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                    {type}
                </SelectItem>
            ))}
        </CustomFormField>

        <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="ex: 8978123BBUX..."
        />

        <CustomFormField 
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned copy of Identification Document"
            renderSkeleton={(field) => (
                <FormControl>
                    <FileUploader 
                        files={field.value}
                        onChange={field.onChange}
                    />
                </FormControl>
            )}
        />

        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">
                Consent and Privacy
                </h2>
            </div>
        </section>

        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to treatment being provided to me"
        />

        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health information for treatment purposes"
        />

        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I consent to privacy policy"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm