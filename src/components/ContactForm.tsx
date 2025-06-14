"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatPhoneNumber } from "@/lib/utils";
import { Calendar28 } from "@/components/ui/dateinputpicker";

type PhoneForm = {
  phoneNumber: string;
  label: string;
  ordinal: string;
};

type EmailForm = {
  email: string;
  label: string;
  ordinal: string;
};

type AddressForm = {
  address: string;
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
  birthMonthDate: string;
  birthYear: string;
  phones: PhoneForm[];
  emails: EmailForm[];
  addresses: AddressForm[];
};

type ContactFormProps = {
  initialData?: Partial<ContactFormData>;
  onSubmit: (data: ContactFormData) => Promise<void>;
  submitLabel?: string;
};

const months = [
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"
];
const daysInMonth = (month: string) => {
  if (["01", "03", "05", "07", "08", "10", "12"].includes(month)) return 31;
  if (["04", "06", "09", "11"].includes(month)) return 30;
  return 29; // allow up to 29 for February (leap years)
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
    birthMonthDate: initialData.birthMonthDate || "",
    birthYear: initialData.birthYear || "",
    phones: initialData.phones || [{ phoneNumber: "", label: "", ordinal: "1" }],
    emails: initialData.emails || [{ email: "", label: "", ordinal: "1" }],
    addresses: initialData.addresses || [{ address: "", label: "", ordinal: "1" }],
  });

  // Birth date split state
  const [birthPickerDate, setBirthPickerDate] = useState<Date | null>(null);
  const [birthYear, setBirthYear] = useState<string>("");

  // Parse initialData.birthMonthDate and birthYear
  useEffect(() => {
    let m = "", d = "", y = "";
    if (initialData.birthMonthDate) {
      const match = initialData.birthMonthDate.match(/^--(\d{2})-(\d{2})$/);
      if (match) {
        m = match[1];
        d = match[2];
      }
    }
    if (initialData.birthYear) {
      y = initialData.birthYear;
    }
    setBirthYear(y);
    if (m && d) {
      setBirthPickerDate(new Date(`${m}/${d}/2000`));
    }
  }, [initialData.birthMonthDate, initialData.birthYear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Combine month and day
    let birthMonthDate = "";
    if (birthPickerDate) {
      const mm = String(birthPickerDate.getMonth() + 1).padStart(2, '0');
      const dd = String(birthPickerDate.getDate()).padStart(2, '0');
      birthMonthDate = `--${mm}-${dd}`;
    }
    try {
      await onSubmit({ ...formData, birthMonthDate, birthYear });
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
    if (field === "phoneNumber") {
      newPhones[idx][field] = e.target.value.replace(/\D/g, "");
    } else {
      newPhones[idx][field] = e.target.value;
    }
    setFormData(prev => ({ ...prev, phones: newPhones }));
  };

  const movePhoneNumber = (idx: number, direction: 'up' | 'down') => {
    const newPhones = [...formData.phones];
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;

    // Swap the phone numbers
    [newPhones[idx], newPhones[newIdx]] = [newPhones[newIdx], newPhones[idx]];

    // Update ordinals
    newPhones.forEach((phone, index) => {
      phone.ordinal = String(index + 1);
    });

    setFormData(prev => ({ ...prev, phones: newPhones }));
  };

  const addPhone = () => {
    const newPhones = [...formData.phones, { phoneNumber: "", label: "", ordinal: String(formData.phones.length + 1) }];
    setFormData(prev => ({ ...prev, phones: newPhones }));
  };

  const removePhone = (idx: number) => {
    const newPhones = formData.phones.filter((_, i) => i !== idx);
    // Update ordinals after removal
    newPhones.forEach((phone, index) => {
      phone.ordinal = String(index + 1);
    });
    setFormData(prev => ({ ...prev, phones: newPhones }));
  };

  const handleEmailFieldChange = (idx: number, field: keyof EmailForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newEmails = [...formData.emails];
    newEmails[idx][field] = e.target.value;
    setFormData(prev => ({ ...prev, emails: newEmails }));
  };

  const handleAddressFieldChange = (idx: number, field: keyof AddressForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAddresses = [...formData.addresses];
    newAddresses[idx][field] = e.target.value;
    setFormData(prev => ({ ...prev, addresses: newAddresses }));
  };

  const moveEmail = (idx: number, direction: 'up' | 'down') => {
    const newEmails = [...formData.emails];
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newEmails[idx], newEmails[newIdx]] = [newEmails[newIdx], newEmails[idx]];
    newEmails.forEach((email, index) => {
      email.ordinal = String(index + 1);
    });
    setFormData(prev => ({ ...prev, emails: newEmails }));
  };

  const moveAddress = (idx: number, direction: 'up' | 'down') => {
    const newAddresses = [...formData.addresses];
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newAddresses[idx], newAddresses[newIdx]] = [newAddresses[newIdx], newAddresses[idx]];
    newAddresses.forEach((address, index) => {
      address.ordinal = String(index + 1);
    });
    setFormData(prev => ({ ...prev, addresses: newAddresses }));
  };

  const addEmail = () => {
    const newEmails = [...formData.emails, { email: "", label: "", ordinal: String(formData.emails.length + 1) }];
    setFormData(prev => ({ ...prev, emails: newEmails }));
  };

  const addAddress = () => {
    const newAddresses = [...formData.addresses, { address: "", label: "", ordinal: String(formData.addresses.length + 1) }];
    setFormData(prev => ({ ...prev, addresses: newAddresses }));
  };

  const removeEmail = (idx: number) => {
    const newEmails = formData.emails.filter((_, i) => i !== idx);
    newEmails.forEach((email, index) => {
      email.ordinal = String(index + 1);
    });
    setFormData(prev => ({ ...prev, emails: newEmails }));
  };

  const removeAddress = (idx: number) => {
    const newAddresses = formData.addresses.filter((_, i) => i !== idx);
    newAddresses.forEach((address, index) => {
      address.ordinal = String(index + 1);
    });
    setFormData(prev => ({ ...prev, addresses: newAddresses }));
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
          <div key={idx} className="flex flex-row gap-2 mb-2 items-end">
            <div className="flex-col my-4 grid w-full max-w-sm items-center gap-3">
              <Label htmlFor={`phoneNumber-${idx}`}>Phone Number</Label>
              <Input
                id={`phoneNumber-${idx}`}
                type="text"
                value={formatPhoneNumber(phone.phoneNumber)}
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
            {formData.phones.length > 1 && (
              <div className="flex-col my-4 grid max-w-sm items-center gap-3">

                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    onClick={() => movePhoneNumber(idx, 'up')}
                    disabled={idx === 0}
                    className="h-8 w-8 p-0"
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    onClick={() => movePhoneNumber(idx, 'down')}
                    disabled={idx === formData.phones.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    ↓
                  </Button>
                </div>
              </div>
            )}
            <div className="flex-col my-4 grid max-w-sm items-center gap-3">
              {formData.phones.length > 1 && (
                <Button type="button" onClick={() => removePhone(idx)}>-</Button>
              )}
            </div>
          </div>
        ))}

        <h3 className="text-1xl font-bold mb-4 mt-6">Email Addresses</h3>
        <Button type="button" onClick={addEmail}>+</Button>
        {formData.emails.map((email, idx) => (
          <div key={idx} className="flex flex-row gap-2 mb-2 items-end">
            <div className="flex-col my-4 grid w-full max-w-sm items-center gap-3">
              <Label htmlFor={`email-${idx}`}>Email Address</Label>
              <Input
                id={`email-${idx}`}
                type="email"
                value={email.email}
                onChange={handleEmailFieldChange(idx, "email")}
                placeholder={`Email #${idx + 1}`}
              />
            </div>
            <div className="flex-col my-4 grid w-full max-w-sm items-center gap-3">
              <Label htmlFor={`email-label-${idx}`}>Label</Label>
              <Input
                id={`email-label-${idx}`}
                type="text"
                value={email.label}
                onChange={handleEmailFieldChange(idx, "label")}
                placeholder="Label (e.g. Work, Personal)"
              />
            </div>
            {formData.emails.length > 1 && (
              <div className="flex-col my-4 grid max-w-sm items-center gap-3">
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    onClick={() => moveEmail(idx, 'up')}
                    disabled={idx === 0}
                    className="h-8 w-8 p-0"
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    onClick={() => moveEmail(idx, 'down')}
                    disabled={idx === formData.emails.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    ↓
                  </Button>
                </div>
              </div>
            )}
            <div className="flex-col my-4 grid max-w-sm items-center gap-3">
              {formData.emails.length > 1 && (
                <Button type="button" onClick={() => removeEmail(idx)}>-</Button>
              )}
            </div>
          </div>
        ))}

        <h3 className="text-1xl font-bold mb-4 mt-6">Addresses</h3>
        <Button type="button" onClick={addAddress}>+</Button>
        {formData.addresses.map((address, idx) => (
          <div key={idx} className="flex flex-row gap-2 mb-2 items-end">
            <div className="flex-col my-4 grid w-full max-w-sm items-center gap-3">
              <Label htmlFor={`address-${idx}`}>Address</Label>
              <Input
                id={`address-${idx}`}
                type="text"
                value={address.address}
                onChange={handleAddressFieldChange(idx, "address")}
                placeholder={`Address #${idx + 1}`}
              />
            </div>
            <div className="flex-col my-4 grid w-full max-w-sm items-center gap-3">
              <Label htmlFor={`address-label-${idx}`}>Label</Label>
              <Input
                id={`address-label-${idx}`}
                type="text"
                value={address.label}
                onChange={handleAddressFieldChange(idx, "label")}
                placeholder="Label (e.g. Home, Office)"
              />
            </div>
            {formData.addresses.length > 1 && (
              <div className="flex-col my-4 grid max-w-sm items-center gap-3">
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    onClick={() => moveAddress(idx, 'up')}
                    disabled={idx === 0}
                    className="h-8 w-8 p-0"
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    onClick={() => moveAddress(idx, 'down')}
                    disabled={idx === formData.addresses.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    ↓
                  </Button>
                </div>
              </div>
            )}
            <div className="flex-col my-4 grid max-w-sm items-center gap-3">
              {formData.addresses.length > 1 && (
                <Button type="button" onClick={() => removeAddress(idx)}>-</Button>
              )}
            </div>
          </div>
        ))}
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
          <Label htmlFor="birthMonthDate">Birth Date</Label>
          <div className="flex gap-2 items-center">
            <div className="w-48">
              <Calendar28
                value={birthPickerDate}
                onChange={setBirthPickerDate}
                showYear={false}
              />
            </div>
            <Input
              type="text"
              id="birthYear"
              value={birthYear}
              onChange={e => setBirthYear(e.target.value.replace(/\D/g, ""))}
              placeholder="Year (optional)"
              className="w-24"
              maxLength={4}
            />
          </div>
          <div className="text-xs text-gray-500">Year is optional. If left blank, only month and day will be saved.</div>
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