import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import path from 'path'

const root = path.resolve(__dirname, '../../')

function readSrc(relPath: string) {
  return readFileSync(path.join(root, relPath), 'utf-8')
}

describe('Sim C-01: Cancel button only shown to active Pro subscribers', () => {
  const src = readSrc('app/profile/ProfileContent.tsx')

  it('Cancel button is inside the user.isPro conditional block', () => {
    // The button must appear after the isPro check
    const proBlock = src.indexOf('user.isPro ?')
    const cancelButton = src.indexOf("t('profile.cancelSub')")
    expect(proBlock).toBeGreaterThan(-1)
    expect(cancelButton).toBeGreaterThan(proBlock)
  })

  it("Cancel button only renders when subscriptionStatus === 'active'", () => {
    expect(src).toContain("user.subscriptionStatus === 'active'")
    // Ensure the cancel button is inside that active check
    const activeCheck = src.indexOf("user.subscriptionStatus === 'active'")
    const cancelSub = src.indexOf("t('profile.cancelSub')")
    expect(activeCheck).toBeGreaterThan(-1)
    expect(cancelSub).toBeGreaterThan(activeCheck)
  })

  it('Cancel button is disabled while canceling is in progress', () => {
    expect(src).toContain('disabled={canceling}')
  })

  it('Shows cancelling label while request is in flight', () => {
    expect(src).toContain("t('profile.cancelling')")
  })
})

describe('Sim C-02: Confirmation dialog before cancellation', () => {
  const src = readSrc('app/profile/ProfileContent.tsx')

  it('calls window.confirm before making the fetch call', () => {
    expect(src).toContain('window.confirm')
    expect(src).toContain("t('profile.cancelSubConfirm')")
    // confirm should appear before the fetch call in the handler
    const confirm = src.indexOf('window.confirm')
    const fetchCall = src.indexOf("fetch('/api/subscription/cancel'")
    expect(confirm).toBeLessThan(fetchCall)
  })

  it('aborts if user does not confirm (returns false)', () => {
    // If confirm returns falsy, function returns early
    expect(src).toContain("if (!window.confirm")
  })
})

describe('Sim C-03: Cancellation API call', () => {
  const src = readSrc('app/profile/ProfileContent.tsx')

  it("POSTs to /api/subscription/cancel", () => {
    expect(src).toContain("fetch('/api/subscription/cancel'")
    expect(src).toContain("method: 'POST'")
  })

  it('calls router.refresh() on successful cancellation', () => {
    expect(src).toContain('router.refresh()')
  })

  it('uses useRouter from next/navigation', () => {
    expect(src).toContain("from 'next/navigation'")
    expect(src).toContain('useRouter')
    expect(src).toContain('const router = useRouter()')
  })
})

describe('Sim C-04: Error state display', () => {
  const src = readSrc('app/profile/ProfileContent.tsx')

  it('initialises cancelError state as null', () => {
    expect(src).toContain('useState<string | null>(null)')
  })

  it('renders error message when cancelError is set', () => {
    expect(src).toContain('{cancelError && (')
    expect(src).toContain('{cancelError}')
  })

  it('uses the cancelSubError translation key on failure', () => {
    expect(src).toContain("t('profile.cancelSubError')")
  })

  it('resets error state before each new attempt', () => {
    expect(src).toContain('setCancelError(null)')
  })
})

describe('Sim C-05: Translation keys are complete', () => {
  const src = readSrc('lib/translations.ts')

  it('has profile.cancelSub in EN', () => {
    expect(src).toContain("'profile.cancelSub': 'Cancel Subscription'")
  })

  it('has profile.cancelSubConfirm in EN', () => {
    expect(src).toContain("'profile.cancelSubConfirm':")
    expect(src).toContain('immediately lose access to all Pro features')
  })

  it('has profile.cancelSubError in EN', () => {
    expect(src).toContain("'profile.cancelSubError': 'Failed to cancel subscription")
  })

  it('has profile.cancelling in EN', () => {
    expect(src).toContain("'profile.cancelling': 'Cancelling...'")
  })

  it('has profile.cancelSub in AR', () => {
    expect(src).toContain("'profile.cancelSub': '\u0625\u0644\u063a\u0627\u0621 \u0627\u0644\u0627\u0634\u062a\u0631\u0627\u0643'")
  })

  it('has profile.cancelSubConfirm in AR', () => {
    expect(src).toContain("'profile.cancelSubConfirm': '\u0647\u0644 \u0623\u0646\u062a \u0645\u062a\u0623\u0643\u062f")
  })

  it('has profile.cancelSubError in AR', () => {
    expect(src).toContain("'profile.cancelSubError': '\u0641\u0634\u0644 \u0625\u0644\u063a\u0627\u0621 \u0627\u0644\u0627\u0634\u062a\u0631\u0627\u0643")
  })

  it('has profile.cancelling in AR', () => {
    expect(src).toContain("'profile.cancelling': '\u062c\u0627\u0631\u064d \u0627\u0644\u0625\u0644\u063a\u0627\u0621...")
  })
})

describe('Sim C-06: Cancel endpoint structure', () => {
  const src = readSrc('app/api/subscription/cancel/route.ts')

  it('exports a POST handler', () => {
    expect(src).toContain('export async function POST')
  })

  it('reads the subscription ID from the user record (not from request body)', () => {
    // ID comes from DB, not from client input — prevents IDOR
    expect(src).toContain('user.polarSubscriptionId')
    // No req.json() call — client sends no body
    expect(src).not.toContain('req.json()')
  })

  it('calls revoke on subscriptions resource', () => {
    expect(src).toContain('polar.subscriptions.revoke')
  })
})
