// src/components/onboarding/StepPartnerType.tsx
import { Building2, Car, Wifi, MapPin } from "lucide-react"

type PartnerType = "tour-operator" | "transport" | "sim-seller" | "tour-guide"

interface StepPartnerTypeProps {
  selected: string
  onSelect: (type: PartnerType) => void
}

const OPTIONS: { id: PartnerType; title: string; subtitle: string; icon: React.ReactNode }[] = [
  {
    id: "tour-operator",
    title: "Tour Operator",
    subtitle: "Hajj & Umrah packages",
    icon: <Building2 className="h-6 w-6 text-primary" />,
  },
  {
    id: "transport",
    title: "Transport Provider",
    subtitle: "Vehicle & Fleet services",
    icon: <Car className="h-6 w-6 text-primary" />,
  },
  {
    id: "sim-seller",
    title: "SIM Seller",
    subtitle: "Connectivity services",
    icon: <Wifi className="h-6 w-6 text-primary" />,
  },
  {
    id: "tour-guide",
    title: "Tour Guide",
    subtitle: "Individual guiding",
    icon: <MapPin className="h-6 w-6 text-primary" />,
  },
]

export function StepPartnerType({ selected, onSelect }: StepPartnerTypeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Select Partner Type</h2>
        <p className="text-sm opacity-70 mt-1">What type of service do you provide?</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`flex flex-col items-center justify-center gap-3 rounded-xl border p-6 text-center transition-all ${
              selected === option.id
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:border-primary/40 hover:bg-bg"
            }`}
          >
            <div className="rounded-full bg-bg p-3 shadow-sm border border-border">
              {option.icon}
            </div>
            <div>
              <p className="font-semibold text-sm">{option.title}</p>
              <p className="text-xs opacity-70 mt-0.5">{option.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
