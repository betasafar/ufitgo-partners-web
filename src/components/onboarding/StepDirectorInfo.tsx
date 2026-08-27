// src/components/onboarding/StepDirectorInfo.tsx
import { Input } from "../common/Input"
import { OnboardingFormData } from "../../api/services/auth.service"

interface StepDirectorInfoProps {
  data: OnboardingFormData
  update: (fields: Partial<OnboardingFormData>) => void
}

export function StepDirectorInfo({ data, update }: StepDirectorInfoProps) {
  const isGuide = data.partnerType === "tour-guide"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          {isGuide ? "Contact Details" : "Director & Contact Information"}
        </h2>
        <p className="text-sm opacity-70 mt-1">
          {isGuide ? "How can we reach you?" : "Primary contact and director details"}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {!isGuide && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1.5">Director Title</label>
              <select
                value={data.directorTitle}
                onChange={(e) => update({ directorTitle: e.target.value })}
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-fg focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              >
                <option value="Alhaji">Alhaji</option>
                <option value="Hajia">Hajia</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Dr">Dr</option>
              </select>
            </div>
            <Input
              label="Director Full Name *"
              value={data.directorName}
              onChange={(e) => update({ directorName: e.target.value })}
              placeholder="Full legal name"
            />
          </>
        )}

        <Input
          label={isGuide ? "Phone Number *" : "Director Phone *"}
          value={data.directorPhone}
          onChange={(e) => update({ directorPhone: e.target.value })}
          placeholder="e.g. 08012345678"
        />
        <Input
          label="WhatsApp Number"
          value={data.directorWhatsApp}
          onChange={(e) => update({ directorWhatsApp: e.target.value })}
          placeholder="WhatsApp number"
        />
        <Input
          label={isGuide ? "Email Address *" : "Company Email *"}
          type="email"
          value={data.email}
          onChange={(e) => update({ email: e.target.value })}
          placeholder={isGuide ? "your@email.com" : "info@company.com"}
        />
        <Input
          label="National ID / Iqama Number"
          value={data.directorNin}
          onChange={(e) => update({ directorNin: e.target.value })}
          placeholder="ID Number"
        />

        {!isGuide && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Brief description of your services</label>
            <textarea
              rows={4}
              value={data.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="Describe your company and services..."
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-fg focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
            />
          </div>
        )}
      </div>
    </div>
  )
}
