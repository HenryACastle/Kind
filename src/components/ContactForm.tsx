"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type PhoneForm = {
  phoneNumber: string;
  label: string;
  ordinal: string;
};

type ContactFormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  nickname: string;
  phone: string;
  email: string;
  address: string;
  mnemonic: string;
  summary: string;
  introducedBy: string;
  website: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  jobTitle: string;
  company: string;
  mainNationality: string;
  secondaryNationality: string;
  birthDate: string;
  phones: PhoneForm[];
};

type ContactFormProps = {
  initialData?: Partial<ContactFormData>;
  onSubmit: (data: ContactFormData) => Promise<void>;
  submitLabel?: string;
};

export default function ContactForm({ initialData = {}, onSubmit, submitLabel = "Create" }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form state with initialData or empty strings
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: initialData.firstName || "",
    middleName: initialData.middleName || "",
    lastName: initialData.lastName || "",
    suffix: initialData.suffix || "",
    nickname: initialData.nickname || "",
    phone: initialData.phone || "",
    email: initialData.email || "",
    address: initialData.address || "",
    mnemonic: initialData.mnemonic || "",
    summary: initialData.summary || "",
    introducedBy: initialData.introducedBy || "",
    website: initialData.website || "",
    linkedin: initialData.linkedin || "",
    instagram: initialData.instagram || "",
    twitter: initialData.twitter || "",
    jobTitle: initialData.jobTitle || "",
    company: initialData.company || "",
    mainNationality: initialData.mainNationality || "",
    secondaryNationality: initialData.secondaryNationality || "",
    birthDate: initialData.birthDate || "",
    phones: initialData.phones || [{ phoneNumber: "", label: "", ordinal: "" }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleTextareaChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handlePhoneFieldChange = (idx: number, field: keyof PhoneForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPhones = [...formData.phones];
    newPhones[idx][field] = e.target.value;
    setFormData(prev => ({ ...prev, phones: newPhones }));
  };

  const addPhone = () => setFormData(prev => ({ ...prev, phones: [...prev.phones, { phoneNumber: "", label: "", ordinal: "" }] }));

  const removePhone = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== idx),
    }));
  };

  return (
    <form className="max-w-lg mx-auto" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-8">Contact Information</h1>

      <div>
        <h2 className="text-1xl font-bold mb-4 mt-6">Name Information</h2>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange("firstName")}
            required
          />
        </div>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            type="text"
            id="middleName"
            value={formData.middleName}
            onChange={handleChange("middleName")}
          />
        </div>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange("lastName")}

          />
        </div>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="suffix">Suffix</Label>
          <Input
            type="text"
            id="suffix"
            value={formData.suffix}
            onChange={handleChange("suffix")}
          />
        </div>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="nickname">Nickname</Label>
          <Input
            type="text"
            id="nickname"
            value={formData.nickname}
            onChange={handleChange("nickname")}
          />
        </div>

      </div>

      <div>
        <h2 className="text-1xl font-bold mb-4 mt-6">Contact Details</h2>
        <h3 className="text-1xl font-bold mb-4 mt-6">Phone Numbers</h3>
        <Button type="button" onClick={addPhone}>+</Button>
        {formData.phones.map((phone, idx) => (
          <div key={idx} className="flex flex-row gap-2 mb-2  items-end">
            <div className="flex-col my-4 grid w-full max-w-sm items-center gap-3">
              <Label htmlFor={`phoneNumber-${idx}`}>Phone Number</Label>
              <Input
                id={`phoneNumber-${idx}`}
                type="text"
                value={phone.phoneNumber}
                onChange={handlePhoneFieldChange(idx, "phoneNumber")}
                placeholder={`Phone #${idx + 1}`}
              />
            </div>
            <div className="flex-col my-4 grid w-full max-w-sm items-center gap-3">
              <Label htmlFor={`label-${idx}`}>Label</Label>
              <Input
                id={`label-${idx}`}
                type="text"
                value={phone.label}
                onChange={handlePhoneFieldChange(idx, "label")}
                placeholder="Label (e.g. Mobile, Home)"
              />
            </div>
            <div className="flex-col my-4 grid  max-w-sm items-center gap-3">
              <Label htmlFor={`ordinal-${idx}`}>Ordinal</Label>
              <Input
                id={`ordinal-${idx}`}
                type="text"
                value={phone.ordinal}
                onChange={handlePhoneFieldChange(idx, "ordinal")}
                placeholder="Ordinal"
              />
            </div>
            <div className="flex-col my-4 grid  max-w-sm items-center gap-3">
              {formData.phones.length > 1 && (
                <Button type="button" onClick={() => removePhone(idx)}>-</Button>
              )}

            </div>
          </div>
        ))}
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="phone">Phone</Label>
          <Input
            type="text"
            id="phone"
            value={formData.phone}
            onChange={handleChange("phone")}
          />
        </div>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            type="text"
            id="email"
            value={formData.email}
            onChange={handleChange("email")}
          />
        </div>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            id="address"
            value={formData.address}
            onChange={handleChange("address")}
          />
        </div>

      </div>

      <div>
        <h2 className="text-1xl font-bold mb-4 mt-6">Additional Information</h2>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="mnemonic">Mnemonic</Label>
          <Input
            type="text"
            id="mnemonic"
            value={formData.mnemonic}
            onChange={handleChange("mnemonic")}
          />
        </div>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            value={formData.summary}
            onChange={handleTextareaChange("summary")}
          />
        </div>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="introducedBy">Introduced By</Label>
          <Input
            type="text"
            id="introducedBy"
            value={formData.introducedBy}
            onChange={handleChange("introducedBy")}
          />
        </div>
      </div>

      <div>
        <h2 className="text-1xl font-bold mb-4 mt-6">Socials</h2>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="website">Website</Label>
          <Input
            type="text"
            id="website"
            value={formData.website}
            onChange={handleChange("website")}
          />
        </div>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            type="text"
            id="linkedin"
            value={formData.linkedin}
            onChange={handleChange("linkedin")}
          />
        </div>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            type="text"
            id="instagram"
            value={formData.instagram}
            onChange={handleChange("instagram")}
          />
        </div>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="twitter">X (formally Twitter)</Label>
          <Input
            type="text"
            id="twitter"
            value={formData.twitter}
            onChange={handleChange("twitter")}
          />
        </div>
      </div>


      <h2 className="text-1xl font-bold mb-4 mt-6">Work Information</h2>
      <div className="my-4 grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input
          type="text"
          id="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange("jobTitle")}
        />
      </div>
      <div className="my-4 grid w-full max-w-sm items-center gap-3">
        <Label htmlFor="company">Company</Label>
        <Input
          type="text"
          id="company"
          value={formData.company}
          onChange={handleChange("company")}
        />
      </div>

      <div>
        <h2 className="text-1xl font-bold mb-4 mt-6">Other Information</h2>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="birthDate">Birth Date</Label>
          <Input
            type="text"
            id="birthDate"
            value={formData.birthDate}
            onChange={handleChange("birthDate")}
          />
        </div>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="mainNationality">Main Nationality</Label>
          <Input
            type="text"
            id="mainNationality"
            value={formData.mainNationality}
            onChange={handleChange("mainNationality")}
          />
        </div>
        <div className="my-4 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="secondaryNationality">Secondary Nationality</Label>
          <Input
            type="text"
            id="secondaryNationality"
            value={formData.secondaryNationality}
            onChange={handleChange("secondaryNationality")}
          />
        </div>
      </div>



      <div className="flex w-full gap-2">

        <Button disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
} 