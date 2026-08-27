// src/components/onboarding/StepDocuments.tsx
import { useState, useRef } from "react"
import { Upload, FileText, X, CheckCircle } from "lucide-react"
import { OnboardingFormData, onboardingService } from "../../api/services/auth.service"

interface StepDocumentsProps {
  data: OnboardingFormData
}

interface DocConfig {
  type: string
  label: string
  required: boolean
}

function getDocumentTypes(data: OnboardingFormData): DocConfig[] {
  const isSaudi = data.country === "Saudi Arabia"
  const isGuide = data.partnerType === "tour-guide"

  if (isGuide) {
    return [
      { type: "id_card", label: isSaudi ? "Saudi Iqama / National ID" : "National ID (NIN) / Passport", required: true },
      { type: "other", label: "Professional Profile Photo", required: true },
      { type: "license", label: "Tour Guide License (Optional)", required: false },
    ]
  }

  const docs: DocConfig[] = [
    { type: "cac", label: isSaudi ? "Commercial Registration (CR)" : "CAC Certificate", required: true },
  ]

  if (data.partnerType === "tour-operator" && !isSaudi) {
    docs.push({ type: "license", label: "NAHCON License", required: true })
  }
  if (data.partnerType === "transport") {
    docs.push({ type: "insurance", label: "Vehicle Insurance / Fleet Cert", required: true })
  }
  if (data.partnerType === "sim-seller") {
    docs.push({ type: "license", label: "Telecom Reseller Permit", required: true })
  }

  docs.push({ type: "id_card", label: "Director ID Card", required: true })
  docs.push({ type: "other", label: "Company Logo", required: false })

  return docs
}

interface UploadBoxProps {
  doc: DocConfig
  uploaded: boolean
  uploading: boolean
  onUpload: (file: File) => void
  onRemove: () => void
}

function UploadBox({ doc, uploaded, uploading, onUpload, onRemove }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (uploaded || uploading) return
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">
        {doc.label} {doc.required && <span className="text-red-500">*</span>}
      </label>
      <div
        onClick={handleClick}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          uploaded
            ? "border-green-500 bg-green-500/5"
            : uploading
            ? "border-yellow-400 bg-yellow-500/5"
            : "border-border hover:border-primary/40 hover:bg-bg"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleChange}
        />

        <div className={`mb-3 rounded-full p-3 ${
          uploaded ? "bg-green-500/10 text-green-600" : uploading ? "bg-yellow-500/10 text-yellow-600" : "bg-border text-fg/60"
        }`}>
          {uploaded ? <CheckCircle className="h-6 w-6" /> : uploading ? <Upload className="h-6 w-6 animate-pulse" /> : <FileText className="h-6 w-6" />}
        </div>

        <p className="font-medium text-sm">
          {uploaded ? "Uploaded successfully" : uploading ? "Uploading..." : doc.label}
        </p>
        <p className="mt-1 text-xs opacity-60">
          {uploaded ? "Click to replace" : "PDF or Image, max 5MB"}
        </p>

        {uploaded && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 text-red-500"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

export function StepDocuments({ data }: StepDocumentsProps) {
  const [uploadStates, setUploadStates] = useState<Record<string, { file: File; uploaded: boolean; uploading: boolean }>>({})
  const docs = getDocumentTypes(data)

  const handleUpload = async (docType: string, file: File) => {
    setUploadStates((prev) => ({
      ...prev,
      [docType]: { file, uploaded: false, uploading: true },
    }))

    try {
      await onboardingService.uploadDocument(docType, file)
      setUploadStates((prev) => ({
        ...prev,
        [docType]: { file, uploaded: true, uploading: false },
      }))
    } catch (err) {
      setUploadStates((prev) => ({
        ...prev,
        [docType]: { file, uploaded: false, uploading: false },
      }))
    }
  }

  const handleRemove = (docType: string) => {
    setUploadStates((prev) => {
      const next = { ...prev }
      delete next[docType]
      return next
    })
  }

  const allRequiredUploaded = docs
    .filter((d) => d.required)
    .every((d) => uploadStates[d.type]?.uploaded)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Upload Documents</h2>
        <p className="text-sm opacity-70 mt-1">
          Upload required documents (PDF or image, max 5MB each)
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {docs.map((doc) => (
          <UploadBox
            key={doc.type + doc.label}
            doc={doc}
            uploaded={!!uploadStates[doc.type]?.uploaded}
            uploading={!!uploadStates[doc.type]?.uploading}
            onUpload={(file) => handleUpload(doc.type, file)}
            onRemove={() => handleRemove(doc.type)}
          />
        ))}
      </div>

      {!allRequiredUploaded && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Please upload all required documents. You can also complete this later from your dashboard.
        </p>
      )}
    </div>
  )
}
