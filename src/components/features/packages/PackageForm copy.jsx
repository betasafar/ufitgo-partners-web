import { useEffect, useMemo, useState } from "react"
import { Input } from "../../common/Input"
import { Button } from "../../common/Button"
import { packagesService } from "../../../api/services/packages.service.js"

/* ---------- CONSTANTS ---------- */

const INCLUSIONS_LIST = [
  { key: "visa", label: "Visa Processing" },
  { key: "flight", label: "Return Flight Ticket" },
  { key: "meals", label: "Full Board Meals" },
  { key: "ziyarah", label: "Ziyarah Tours" },
  { key: "hotel", label: "Hotel Accommodation" },
  { key: "transfers", label: "Airport Transfers" },
]

/* ---------- HELPERS ---------- */

const humanize = (value = "") =>
  value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())

const daysBetween = (start, end) => {
  const s = new Date(start)
  const e = new Date(end)
  s.setHours(0, 0, 0, 0)
  e.setHours(0, 0, 0, 0)
  return Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1
}

/* ---------- COMPONENT ---------- */

export const PackageForm = ({ initialData, onSubmit, onCancel }) => {
  /* ---------- STATE ---------- */

  const [packageTypes, setPackageTypes] = useState([])
  const [serviceLevels, setServiceLevels] = useState([])
  const [loadingEnums, setLoadingEnums] = useState(true)

  const [dateError, setDateError] = useState("")

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    itinerary: initialData?.itinerary || "",

    packageType: initialData?.packageType || "",
    serviceLevel: initialData?.serviceLevel || "",

    isGroupPackage: initialData?.isGroupPackage ?? true,

    prices: {
      adult: initialData?.prices?.adult || "",
      child: initialData?.prices?.child || "",
      individual: initialData?.prices?.individual || "",
    },

    departureDate: initialData?.departureDate || "",
    returnDate: initialData?.returnDate || "",
    duration: initialData?.duration || "",

    maxPilgrims: initialData?.maxPilgrims || "",

    installmentsEnabled: initialData?.installmentsEnabled || false,
    installments: {
      registrationFee: initialData?.installments?.registrationFee || "",
      firstDeposit: initialData?.installments?.firstDeposit || "",
      balance: initialData?.installments?.balance || "",
    },

    inclusions: {
      visa: initialData?.inclusions?.visa ?? true,
      flight: initialData?.inclusions?.flight ?? true,
      meals: initialData?.inclusions?.meals ?? true,
      ziyarah: initialData?.inclusions?.ziyarah ?? false,
      hotel: initialData?.inclusions?.hotel ?? true,
      transfers: initialData?.inclusions?.transfers ?? false,
    },
  })

  /* ---------- LOAD ENUMS ---------- */

  useEffect(() => {
    const loadEnums = async () => {
      try {
        const [types, levels] = await Promise.all([
          packagesService.getPackageTypes(),
          packagesService.getServiceLevels(),
        ])

        setPackageTypes(types.map((t) => ({ value: t, label: humanize(t) })))
        setServiceLevels(levels.map((l) => ({ value: l, label: humanize(l) })))

        setFormData((p) => ({
          ...p,
          packageType: p.packageType || types[0],
          serviceLevel: p.serviceLevel || levels[0],
        }))
      } catch (err) {
        console.error("Failed to load enums", err)
      } finally {
        setLoadingEnums(false)
      }
    }

    loadEnums()
  }, [])

  /* ---------- AUTO CALCULATE DURATION ---------- */

  useEffect(() => {
    const { departureDate, returnDate } = formData

    if (!departureDate || !returnDate) {
      setDateError("")
      setFormData((p) => ({ ...p, duration: "" }))
      return
    }

    if (new Date(returnDate) < new Date(departureDate)) {
      setDateError("Return date cannot be earlier than departure date")
      setFormData((p) => ({ ...p, duration: "" }))
      return
    }

    setDateError("")
    setFormData((p) => ({
      ...p,
      duration: daysBetween(departureDate, returnDate),
    }))
  }, [formData.departureDate, formData.returnDate])

  /* ---------- PRICING ---------- */

  const totalPrice = useMemo(() => {
    return formData.isGroupPackage
      ? Number(formData.prices.adult || 0)
      : Number(formData.prices.individual || 0)
  }, [formData.isGroupPackage, formData.prices])

  const installmentTotal =
    Number(formData.installments.registrationFee || 0) +
    Number(formData.installments.firstDeposit || 0) +
    Number(formData.installments.balance || 0)

  const installmentValid =
    !formData.installmentsEnabled || installmentTotal === totalPrice

  /* ---------- HANDLERS ---------- */

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const handlePriceChange = (field, value) => {
    setFormData((p) => ({
      ...p,
      prices: { ...p.prices, [field]: value },
    }))
  }

  const handleInstallmentChange = (e) => {
    const { name, value } = e.target
    setFormData((p) => ({
      ...p,
      installments: { ...p.installments, [name]: value },
    }))
  }

  const toggleInclusion = (key) => {
    setFormData((p) => ({
      ...p,
      inclusions: { ...p.inclusions, [key]: !p.inclusions[key] },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!installmentValid || !totalPrice) return

    await onSubmit({
      ...formData,
      price: totalPrice,
      duration: Number(formData.duration),
      maxPilgrims: Number(formData.maxPilgrims),
      installments: formData.installmentsEnabled
        ? {
          registrationFee: Number(formData.installments.registrationFee),
          firstDeposit: Number(formData.installments.firstDeposit),
          balance: Number(formData.installments.balance),
        }
        : null,
    })
  }

  if (loadingEnums) {
    return <div className="p-8 text-fg">Loading package setup…</div>
  }

  /* ---------- RENDER ---------- */
  return (
    <>
      {/* FORM CONTENT (unchanged layout) */}
      {/* ... exactly as you already had ... */}

      {/* FIXED FOOTER */}
      <div
        className="
          fixed bottom-0 right-0
          w-full md:w-[calc(100%-16rem)] md:ml-64
          bg-card border-t border-border
          px-6 py-4 flex justify-between items-center z-20
        "
      >
        <span className="font-semibold text-lg">
          Total: ₦{totalPrice.toLocaleString()}
        </span>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-border text-fg hover:bg-border/50"
          >
            Cancel
          </button>
          <Button disabled={!installmentValid || !totalPrice} onClick={handleSubmit}>
            {initialData ? "Update Package" : "Create Package"}
          </Button>
        </div>
      </div>
    </>
  )
}
