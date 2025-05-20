import { useState, useEffect } from "react"
import { Eye, EyeOff, Building, Loader2, Home, Shield, Users } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../store/thunks/auth.thunk"
import Logo from "../../public/assets/images/bms-logo.png"

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const loginHandler = async (e) => {
    e.preventDefault()
    try {
      const data = await dispatch(login(formData))
      if (data.payload.success) {
        switch (data.payload.data.role) {
          case "Admin":
            navigate("/Admin-panel")
            break
          case "Security":
            navigate("/security-panel")
            break
          case "Office Manager":
            navigate("/manager-panel")
            break
          default:
            navigate("/")
        }
      }
      formData.email = ""
      formData.password = ""
    } catch (error) {
      console.log("LoginFailed", error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    if (token && user === "Admin") {
      navigate("/Admin-panel")
    } else if (token && user === "Security") {
      navigate("/security-panel")
    } else if (token && user === "Office Manager") {
      navigate("/manager-panel")
    } else if (token && user === "Tenant") {
      navigate("/")
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl transition-all duration-300 sm:flex">
        {/* Left side - BMS Theme with 3 Cards */}
        <div className="hidden sm:block sm:w-1/2">
          <div className="flex h-full flex-col bg-gradient-to-b from-slate-800 to-slate-900 p-6 text-white">
            <div className="mb-4 flex items-center">
              <div className="relative bg-slate-300 w-inherit rounded-full mr-2">
              <img src="/assets/images/bms-logo.png" className="h-8 border border-white rounded-full" alt="BMS Logo" />
              </div>
              <h2 className="text-xl font-bold">Building Management</h2>
            </div>

            <p className="mb-6 text-sm text-slate-300">Streamline your building operations</p>

            <div className="mt-auto space-y-3">
              {/* Card 1 */}
              <div className="rounded-lg bg-gradient-to-r from-slate-700 to-slate-800 p-2.5 shadow-md transition-all duration-300 hover:translate-x-1">
                <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-600">
                  <Home className="h-3.5 w-3.5 text-white" />
                </div>
                <h3 className="mb-0.5 text-xs font-semibold">Property Management</h3>
                <p className="text-xs text-slate-300">Manage properties and units efficiently.</p>
              </div>

              {/* Card 2 */}
              <div className="rounded-lg bg-gradient-to-r from-slate-700 to-slate-800 p-2.5 shadow-md transition-all duration-300 hover:translate-x-1">
                <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-600">
                  <Shield className="h-3.5 w-3.5 text-white" />
                </div>
                <h3 className="mb-0.5 text-xs font-semibold">Security & Access</h3>
                <p className="text-xs text-slate-300">Monitor building access systems.</p>
              </div>

              {/* Card 3 */}
              <div className="rounded-lg bg-gradient-to-r from-slate-700 to-slate-800 p-2.5 shadow-md transition-all duration-300 hover:translate-x-1">
                <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-600">
                  <Users className="h-3.5 w-3.5 text-white" />
                </div>
                <h3 className="mb-0.5 text-xs font-semibold">Tenant Management</h3>
                <p className="text-xs text-slate-300">Manage tenant communications.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full p-6 sm:w-1/2">
          <div className="flex h-full flex-col justify-center">
            <div className="mb-6 flex flex-col items-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <img src="/assets/images/bms-logo.png" alt="BMS Logo" />
              </div>
              <h1 className="mb-1 text-center text-xl font-bold text-slate-800">Welcome to BMS</h1>
              <p className="text-center text-xs text-slate-500">Building Management System</p>

              {/* 🚀 Demo Credentials */}
              <div className="mt-3 w-full rounded-md bg-blue-50 p-3 text-xs text-blue-700 shadow-sm">
                <p className="mb-1 font-semibold">Demo Credentials</p>
                <p>Email: <span className="font-mono">admin@gmail.com</span></p>
                <p>Password: <span className="font-mono">12345678</span></p>
              </div>
            </div>

            <form onSubmit={loginHandler} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-medium text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none ring-slate-300 transition-all focus:border-slate-500 focus:bg-white focus:ring-2"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-medium text-slate-700">
                    Password
                  </label>
                  <Link to="/forget-password" className="text-xs font-medium text-[#2563EB] hover:text-[#1d4ed8]">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none ring-slate-300 transition-all focus:border-slate-500 focus:bg-white focus:ring-2"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative mt-2 w-full rounded-lg bg-[#2563EB] py-2 text-sm font-medium text-white transition-all hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
