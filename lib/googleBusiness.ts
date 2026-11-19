export type GoogleBusinessLocation = {
  accountId: string
  locationId: string
  name: string
  address: string
}

type GoogleAccount = { name?: string }
type GoogleLocation = {
  name?: string
  title?: string
  storefrontAddress?: { addressLines?: string[]; locality?: string; postalCode?: string }
}

function displayAddress(address?: GoogleLocation['storefrontAddress']) {
  return [address?.addressLines?.join(', '), address?.locality, address?.postalCode]
    .filter(Boolean)
    .join(', ')
}

export async function listGoogleBusinessLocations(accessToken: string): Promise<GoogleBusinessLocation[]> {
  const headers = { Authorization: `Bearer ${accessToken}` }
  const accountsResponse = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', { headers })
  if (!accountsResponse.ok) throw new Error(`Google account lookup failed (${accountsResponse.status})`)

  const { accounts = [] } = await accountsResponse.json() as { accounts?: GoogleAccount[] }
  const locations = await Promise.all(accounts.flatMap(async account => {
    if (!account.name || !/^accounts\/[\w-]+$/.test(account.name)) return []
    const response = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?pageSize=100&readMask=name,title,storefrontAddress`, { headers })
    if (!response.ok) throw new Error(`Google location lookup failed (${response.status})`)
    const body = await response.json() as { locations?: GoogleLocation[] }
    return (body.locations ?? []).flatMap(location => {
      const locationId = location.name?.split('/').pop()
      const accountId = account.name?.split('/').pop()
      if (!locationId || !accountId) return []
      return [{
        accountId: `accounts/${accountId}`,
        locationId: `locations/${locationId}`,
        name: location.title || 'Unnamed Google Business Profile',
        address: displayAddress(location.storefrontAddress),
      }]
    })
  }))

  return locations.flat()
}

export function chooseMatchingLocation(locations: GoogleBusinessLocation[], businessName: string) {
  if (locations.length === 1) return locations[0]
  const normalized = businessName.trim().toLowerCase()
  if (!normalized) return null
  const matches = locations.filter(location => {
    const candidate = location.name.toLowerCase()
    return candidate === normalized || candidate.includes(normalized) || normalized.includes(candidate)
  })
  return matches.length === 1 ? matches[0] : null
}
