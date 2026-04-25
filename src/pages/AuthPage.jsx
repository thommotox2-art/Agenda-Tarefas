import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export default function AuthPage() {
  const { user, signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  // Se já estiver logado, redireciona para a home
  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else {
        const { error, data } = await signUp(email, password)
        if (error) throw error
        
        if (data?.user?.identities?.length === 0) {
          setError('Este email já está cadastrado.')
        } else {
          setMessage('Cadastro realizado com sucesso! Você já pode entrar se a confirmação estiver desativada.')
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-bg-main py-4 px-2 sm:py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-2 sm:mb-4">
          <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 sm:h-8 sm:w-8 text-accent" />
          </div>
        </div>
        <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-text-primary">
          {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
        </h2>
        <p className="mt-1 sm:mt-2 text-[11px] sm:text-sm text-text-secondary">
          E organize sua vida com o TaskFlow.
        </p>
      </div>

      <div className="mt-4 sm:mt-8 w-full max-w-sm sm:max-w-md animate-fade-in">
        <div className="bg-bg-surface py-5 px-3 shadow rounded-2xl sm:rounded-xl sm:py-8 sm:px-10 border border-border">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-danger/10 border border-danger/20 rounded-md p-2 sm:p-3 flex items-start gap-2 sm:gap-3">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-danger shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-danger">{error}</p>
              </div>
            )}
            
            {message && (
              <div className="bg-success/10 border border-success/20 rounded-md p-2 sm:p-3">
                <p className="text-xs sm:text-sm text-success">{message}</p>
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium text-text-primary">E-mail</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-border bg-bg-main px-2 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-text-primary">Senha</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-border bg-bg-main px-2 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md border border-transparent bg-accent py-1.5 sm:py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-surface disabled:opacity-50 transition-colors"
            >
              {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
                setMessage(null)
              }}
              className="text-sm font-medium text-text-secondary hover:text-accent transition-colors"
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
