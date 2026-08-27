// src/components/onboarding/StepReview.tsx
import { OnboardingFormData } from "../../api/services/auth.service"

interface StepReviewProps {
  data: OnboardingFormData
  agreed: boolean
  onAgreedChange: (agreed: boolean) => void
}

const LABEL_MAP: Record<string, string> = {
  "tour-operator": "Tour Operator",
  transport: "Transport Provider",
  "sim-seller": "SIM Seller",
  "tour-guide": "Tour Guide",
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-sm opacity-70">{label}</span>
      <span className="text-sm font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}

export function StepReview({ data, agreed, onAgreedChange }: StepReviewProps) {
  const isGuide = data.partnerType === "tour-guide"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Review Your Application</h2>
        <p className="text-sm opacity-70 mt-1">
          Please confirm all details are correct before submitting
        </p>
      </div>

      <div className="bg-bg rounded-xl p-4 border border-border">
        <h3 className="text-sm font-semibold mb-3">Partner Type</h3>
        <ReviewRow label="Type" value={LABEL_MAP[data.partnerType || ""] || data.partnerType} />
        <ReviewRow label="Country" value={data.country} />
      </div>

      <div className="bg-bg rounded-xl p-4 border border-border">
        <h3 className="text-sm font-semibold mb-3">{isGuide ? "Guide Information" : "Company Information"}</h3>
        <ReviewRow label={isGuide ? "Full Name" : "Company Name"} value={data.companyName} />
        {!isGuide && <ReviewRow label="Trading Name" value={data.tradingName} />}
        {!isGuide && <ReviewRow label="RC / CAC Number" value={data.rcNumber} />}
        <ReviewRow label="Year Established" value={data.yearEstablished} />
        <ReviewRow label="Office Address" value={data.officeAddress} />
        {data.partnerType === "tour-operator" && <ReviewRow label="NAHCON License" value={data.nahconLicense} />}
        {data.partnerType === "tour-operator" && <ReviewRow label="Capacity" value={data.capacity} />}
        {data.partnerType === "transport" && <ReviewRow label="Transport Reg" value={data.transportReg} />}
        {data.partnerType === "transport" && <ReviewRow label="Fleet Size" value={data.fleetSize} />}
        {data.partnerType === "sim-seller" && <ReviewRow label="Telecom Permit" value={data.telecomPermit} />}
        {data.partnerType === "sim-seller" && <ReviewRow label="Supported Networks" value={data.supportedNetworks} />}
        {isGuide && <ReviewRow label="Languages" value={data.guideLanguages} />}
        {isGuide && <ReviewRow label="Experience" value={data.guideExperience} />}
        {isGuide && data.guideExpertise.length > 0 && (
          <ReviewRow label="Expertise" value={data.guideExpertise.join(", ")} />
        )}
      </div>

      <div className="bg-bg rounded-xl p-4 border border-border">
        <h3 className="text-sm font-semibold mb-3">{isGuide ? "Contact Details" : "Director & Contact"}</h3>
        {!isGuide && <ReviewRow label="Title" value={data.directorTitle} />}
        {!isGuide && <ReviewRow label="Director Name" value={data.directorName} />}
        <ReviewRow label="Phone" value={data.directorPhone} />
        <ReviewRow label="WhatsApp" value={data.directorWhatsApp} />
        <ReviewRow label="Email" value={data.email} />
        <ReviewRow label="National ID / Iqama" value={data.directorNin} />
        {!isGuide && <ReviewRow label="Description" value={data.description} />}
      </div>

      <div className="rounded-lg border bg-bg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
            checked={agreed}
            onChange={(e) => onAgreedChange(e.target.checked)}
          />
          <span className="text-sm leading-relaxed">
            I confirm all information is accurate. I agree to UfitGo's{" "}
            <a href="#" className="font-semibold text-primary hover:underline">Terms of Service</a> and{" "}
            <a href="#" className="font-semibold text-primary hover:underline">Partner Agreement</a>.
            False information may result in rejection or termination.
          </span>
        </label>
      </div>
    </div>
  )
}
