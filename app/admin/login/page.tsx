import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '../../../lib/admin-auth'
import { getAdminPath } from '../../../lib/admin-routes'
import { signInWithGoogle } from '../actions'

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin()

  if (admin) {
    redirect(await getAdminPath('/'))
  }

  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <p className="admin-kicker">Simbionte Joyas</p>
        <h1>Administración</h1>
        <p>Ingresa con la cuenta de Google autorizada para editar el sitio.</p>
        <form action={signInWithGoogle}>
          <button className="admin-google-button" type="submit">Continuar con Google</button>
        </form>
      </div>
    </main>
  )
}
