// src/components/onboarding/StepCompanyInfo.tsx
import { Input } from "../common/Input"
import { OnboardingFormData } from "../../api/services/auth.service"

interface StepCompanyInfoProps {
  data: OnboardingFormData
  update: (fields: Partial<OnboardingFormData>) => void
}

const EXPERTISE_OPTIONS = [
  "Mutawwif (Religious Guide)",
  "Historical Makkah Ziyarah",
  "Historical Madinah Ziyarah",
  "Tour Leader (Logistics)",
  "Shopping & Markets",
  "Culinary & Food Tours",
  "Museums & Exhibitions",
  "VIP & Executive Services",
]

export function StepCompanyInfo({ data, update }: StepCompanyInfoProps) {
  const isSaudi = data.country === "Saudi Arabia"
  const isGuide = data.partnerType === "tour-guide"

  const toggleExpertise = (option: string) => {
    const current = data.guideExpertise || []
    if (current.includes(option)) {
      update({ guideExpertise: current.filter((item) => item !== option) })
    } else {
      update({ guideExpertise: [...current, option] })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          {isGuide ? "Guide Information" : "Company Information"}
        </h2>
        <p className="text-sm opacity-70 mt-1">
          {isGuide ? "Tell us about yourself and your expertise" : "Tell us about your organization"}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Country */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1.5">
            Country of Operation <span className="text-red-500">*</span>
          </label>
          <select
            value={data.country}
            onChange={(e) => update({ country: e.target.value })}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-fg focus:ring-2 focus:ring-primary focus:outline-none transition-all"
          >
            <option value="Nigeria">Nigeria</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {isGuide ? (
          <>
            <div className="sm:col-span-2">
              <Input
                label="Full Legal Name *"
                value={data.companyName}
                onChange={(e) => update({ companyName: e.target.value })}
                placeholder="First and Last Name"
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Base City / State *"
                value={data.officeAddress}
                onChange={(e) => update({ officeAddress: e.target.value })}
                placeholder="e.g. Makkah, Saudi Arabia or Kano, Nigeria"
              />
            </div>
            <div>
              <Input
                label="Languages Spoken"
                value={data.guideLanguages}
                onChange={(e) => update({ guideLanguages: e.target.value })}
                placeholder="e.g. English, Arabic, Hausa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Years of Experience</label>
              <select
                value={data.guideExperience}
                onChange={(e) => update({ guideExperience: e.target.value })}
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-fg focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              >
                <option value="">Select range</option>
                <option value="0-2">0 - 2 years</option>
                <option value="3-5">3 - 5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Areas of Expertise</label>
              <div className="flex flex-wrap gap-2">
                {EXPERTISE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleExpertise(option)}
                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      data.guideExpertise?.includes(option)
                        ? "border-primary bg-primary text-primary-contrast"
                        : "border-border bg-bg text-fg hover:bg-border/50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <Input
              label={`Company Name *`}
              value={data.companyName}
              onChange={(e) => update({ companyName: e.target.value })}
              placeholder="e.g. UfitGo Travels Ltd"
            />
            <Input
              label="Trading Name"
              value={data.tradingName}
              onChange={(e) => update({ tradingName: e.target.value })}
              placeholder="Public-facing name"
            />
            <Input
              label={isSaudi ? "Commercial Registration (CR) Number *" : "RC Number (CAC) *"}
              value={data.rcNumber}
              onChange={(e) => update({ rcNumber: e.target.value })}
              placeholder={isSaudi ? "e.g. 1010123456" : "e.g. RC123456"}
            />
            <Input
              label="Year Established"
              value={data.yearEstablished}
              onChange={(e) => update({ yearEstablished: e.target.value })}
              placeholder="e.g. 2015"
              type="number"
            />
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5">
                Office Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={data.officeAddress}
                onChange={(e) => update({ officeAddress: e.target.value })}
                placeholder="Full address including city and state"
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-fg focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Tour Operator specific */}
            {data.partnerType === "tour-operator" && (
              <>
                {!isSaudi && (
                  <Input
                    label="NAHCON License Number *"
                    value={data.nahconLicense}
                    onChange={(e) => update({ nahconLicense: e.target.value })}
                    placeholder="e.g. NAHCON/2024/001"
                  />
                )}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Pilgrims Per Year (Capacity)</label>
                  <select
                    value={data.capacity}
                    onChange={(e) => update({ capacity: e.target.value })}
                    className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-fg focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  >
                    <option value="">Select range</option>
                    <option value="1-50">1 - 50</option>
                    <option value="50-200">50 - 200</option>
                    <option value="200+">200+</option>
                  </select>
                </div>
              </>
            )}

            {/* Transport specific */}
            {data.partnerType === "transport" && (
              <>
                <Input
                  label="Transport Union Registration Number"
                  value={data.transportReg}
                  onChange={(e) => update({ transportReg: e.target.value })}
                  placeholder="e.g. NURTW/001"
                />
                <div>
                  <label className="block text-sm font-medium mb-1.5">Fleet Size</label>
                  <select
                    value={data.fleetSize}
                    onChange={(e) => update({ fleetSize: e.target.value })}
                    className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-fg focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  >
                    <option value="">Select size</option>
                    <option value="1-5">1 - 5 Vehicles</option>
                    <option value="6-20">6 - 20 Vehicles</option>
                    <option value="20+">20+ Vehicles</option>
                  </select>
                </div>
              </>
            )}

            {/* SIM Seller specific */}
            {data.partnerType === "sim-seller" && (
              <>
                <Input
                  label="Telecom Agency Permit"
                  value={data.telecomPermit}
                  onChange={(e) => update({ telecomPermit: e.target.value })}
                  placeholder="Permit ID"
                />
                <Input
                  label="Supported Networks"
                  value={data.supportedNetworks}
                  onChange={(e) => update({ supportedNetworks: e.target.value })}
                  placeholder="e.g. STC, Mobily, Zain"
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
