import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { createAuthActions } from '@insforge/sdk/ssr'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('insforge_code')
  const oauthError = request.nextUrl.searchParams.get('error')
  const failureUrl = new URL('/login?error=oauth', request.url)

  if (oauthError || !code) {
    return NextResponse.redirect(failureUrl)
  }

  const cookieStore = await cookies()
  const verifier = cookieStore.get('insforge_code_verifier')?.value
  if (!verifier) {
    return NextResponse.redirect(failureUrl)
  }

  const response = NextResponse.redirect(new URL('/', request.url))
  const auth = createAuthActions({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  })
  const { data, error } = await auth.exchangeOAuthCode(code, verifier)

  if (error || !data?.user) {
    return NextResponse.redirect(failureUrl)
  }

  response.cookies.delete('insforge_code_verifier')
  return response
}
