// Adapter between the backend Package entity/DTO shape and the PackageForm's
// internal field names, which differ (e.g. title/type/capacity vs name/packageType/maxPilgrims).

const INCLUSION_KEYS = ["visa", "flight", "meals", "ziyarah", "hotel", "transfers"]

const toDateInputValue = (value) => {
  if (!value) return ""
  const str = typeof value === "string" ? value : new Date(value).toISOString()
  return str.slice(0, 10)
}

export const mapApiPackageToFormInitialData = (pkg) => {
  if (!pkg) return null

  const inclusionsArray = Array.isArray(pkg.inclusions) ? pkg.inclusions : []
  const inclusions = INCLUSION_KEYS.reduce((acc, key) => {
    acc[key] = inclusionsArray.includes(key)
    return acc
  }, {})

  return {
    name: pkg.title || "",
    description: pkg.description || "",
    itinerary: pkg.itinerary || "",

    packageType: pkg.type || "",
    serviceLevel: pkg.serviceLevel || "",

    prices: {
      adult: pkg.price ?? "",
      child: "",
      individual: pkg.price ?? "",
    },

    departureDate: toDateInputValue(pkg.departureDate),
    returnDate: toDateInputValue(pkg.returnDate),
    duration: pkg.duration || "",

    maxPilgrims: pkg.capacity ?? "",

    installmentsEnabled: !!pkg.installmentEligible,
    installments: {
      registrationFee: pkg.registrationFeeAmount ?? "",
      firstDeposit: pkg.initialDeposit ?? "",
      balance: pkg.finalBalance ?? "",
    },

    inclusions,

    groupDiscountEnabled: !!pkg.groupDiscountEnabled,
    groupDiscountThreshold: pkg.groupDiscountThreshold ?? "",
    groupDiscountPercentage: pkg.groupDiscountPercentage ?? "",

    extensionIds: (pkg.extensions || []).map((ext) => ext.id),
  }
}

export const mapFormPayloadToApiPayload = (payload) => {
  const inclusions = Object.entries(payload.inclusions || {})
    .filter(([, enabled]) => enabled)
    .map(([key]) => key)

  const hasRegistrationFee = Number(payload.installments?.registrationFee) > 0

  return {
    title: payload.name,
    description: payload.description,
    type: payload.packageType,
    serviceLevel: payload.serviceLevel,
    price: payload.price,
    duration: payload.duration,
    capacity: payload.maxPilgrims,
    departureDate: payload.departureDate,
    returnDate: payload.returnDate,
    inclusions,

    installmentEligible: payload.installmentsEnabled,
    initialDeposit: payload.installments?.firstDeposit ?? null,
    finalBalance: payload.installments?.balance ?? null,

    registrationFeeEnabled: !!(payload.installmentsEnabled && hasRegistrationFee),
    registrationFeeAmount: hasRegistrationFee ? payload.installments.registrationFee : null,

    groupDiscountEnabled: payload.groupDiscountEnabled,
    groupDiscountThreshold: payload.groupDiscountThreshold,
    groupDiscountPercentage: payload.groupDiscountPercentage,

    extensionIds: payload.extensionIds,
  }
}
