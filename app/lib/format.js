const currency = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' })

export const formatPrice = value => {
  const amount = Number(String(value ?? '').replaceAll(',', ''))
  return value != null && value !== '' && Number.isFinite(amount) ? currency.format(amount) : null
}
