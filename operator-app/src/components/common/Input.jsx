export const Input = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input className="input-field" {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
