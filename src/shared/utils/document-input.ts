export function isNumericDocumentType(documentType: string | undefined): boolean {
  const normalizedType = documentType?.trim().toLowerCase()
  return normalizedType !== 'pasaporte' && normalizedType !== 'otro'
}

export function resolveDocumentInputMode(
  documentType: string | undefined,
): 'numeric' | 'text' {
  return isNumericDocumentType(documentType) ? 'numeric' : 'text'
}
