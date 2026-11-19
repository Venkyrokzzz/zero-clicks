export async function submitContact(data: Record<string, string>) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15_000)
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    })
    const body = await response.json().catch(() => null)
    if (!response.ok || body?.success !== true) {
      throw new Error(typeof body?.error === 'string' ? body.error
        : 'We could not confirm delivery. Please email zeroclicks.hq@gmail.com directly.')
    }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('Delivery could not be confirmed in time. Please email zeroclicks.hq@gmail.com directly.')
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}
