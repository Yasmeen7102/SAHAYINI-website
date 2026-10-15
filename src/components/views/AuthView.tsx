import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { UserProfile, LanguageCode } from '../../types';
import {
  Lock,
  Mail,
  User,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Phone,
  Eye,
  EyeOff,
} from 'lucide-react';
import { LANGUAGES } from '../../i18n/translations';

interface AuthViewProps {
  initialMode?: 'login' | 'signup';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login' }) => {
  const { loginUser, setActiveTab, language, setLanguage, t } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up form state
  const [name, setName] = useState('');
  const [signupIdentifier, setSignupIdentifier] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [role, setRole] = useState<'student' | 'public' | 'senior' | 'woman'>('student');
  const [stateName, setStateName] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('Chennai');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Quick Demo Logins
  const handleDemoLogin = (userRole: 'student' | 'public') => {
    const demoProfile: UserProfile = {
      id: userRole === 'student' ? 'demo_student_01' : 'demo_citizen_02',
      name: userRole === 'student' ? 'Priya Raman' : 'Ananya Sharma',
      emailOrPhone: userRole === 'student' ? 'priya.student@sahayini.org' : '+91 9876543210',
      role: userRole,
      state: 'Tamil Nadu',
      district: 'Coimbatore',
      preferredLanguage: language,
      joinedAt: new Date().toISOString(),
    };
    loginUser(demoProfile);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!loginIdentifier.trim()) {
      newErrors.loginIdentifier = 'Please enter your email or mobile number.';
    }
    if (!loginPassword || loginPassword.length < 6) {
      newErrors.loginPassword = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const profile: UserProfile = {
      id: 'user_' + Date.now(),
      name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : 'Citizen User',
      emailOrPhone: loginIdentifier,
      role: 'student',
      state: stateName,
      district,
      preferredLanguage: language,
      joinedAt: new Date().toISOString(),
    };
    loginUser(profile);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }
    if (!signupIdentifier.trim()) {
      newErrors.signupIdentifier = 'Mobile number or email is required.';
    }
    if (!signupPassword || signupPassword.length < 6) {
      newErrors.signupPassword = 'Password must be at least 6 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const profile: UserProfile = {
      id: 'user_' + Date.now(),
      name: name.trim(),
      emailOrPhone: signupIdentifier.trim(),
      role,
      state: stateName,
      district,
      preferredLanguage: language,
      joinedAt: new Date().toISOString(),
    };
    loginUser(profile);
  };

  const indianStates = [
    'Tamil Nadu',
    'Maharashtra',
    'Karnataka',
    'Andhra Pradesh',
    'Telangana',
    'Kerala',
    'Gujarat',
    'Uttar Pradesh',
    'Delhi',
    'West Bengal',
    'Rajasthan',
    'Madhya Pradesh',
    'Punjab',
    'Other State / UT',
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50/70">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-md border border-slate-200/90 overflow-hidden">
        {/* Card Header */}
        <div className="p-6 text-center bg-gradient-to-b from-blue-50/60 to-white border-b border-slate-100">
          <Logo size="md" showText={true} showTagline={true} />
          <p className="mt-3 text-xs text-slate-500 font-medium">
            {t.welcomeSubtitle}
          </p>

          {/* Toggle between Login and Sign Up */}
          <div className="flex bg-slate-100 p-1 rounded-xl mt-5">
            <button
              onClick={() => {
                setMode('login');
                setErrors({});
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-[#0A2E65] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.nav.login}
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrors({});
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-[#0A2E65] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.nav.signup}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. 9876543210 or name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0A2E65] focus:border-transparent"
                  />
                </div>
                {errors.loginIdentifier && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.loginIdentifier}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0A2E65] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.loginPassword && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.loginPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0A2E65] hover:bg-[#072344] text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Sign In to SAHAYINI
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Raman"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0A2E65]"
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={signupIdentifier}
                    onChange={(e) => setSignupIdentifier(e.target.value)}
                    placeholder="e.g. 9876543210 or priya@email.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0A2E65]"
                  />
                </div>
                {errors.signupIdentifier && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.signupIdentifier}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    I am a...
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0A2E65]"
                  >
                    <option value="student">Student</option>
                    <option value="woman">Woman / Girl</option>
                    <option value="public">General Public</option>
                    <option value="senior">Senior Citizen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    State
                  </label>
                  <select
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0A2E65]"
                  >
                    {indianStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Create Password (min. 6 characters)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0A2E65]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.signupPassword && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.signupPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0A2E65] hover:bg-[#072344] text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer mt-2"
              >
                Create Account & Join
              </button>
            </form>
          )}

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2.5">
              ⚡ Fast Demo Access (No Password Needed)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemoLogin('student')}
                className="p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0A2E65] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Demo Student</span>
              </button>
              <button
                onClick={() => handleDemoLogin('public')}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Demo Citizen</span>
              </button>
            </div>
          </div>

          {/* Local Security & Privacy Disclosure */}
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Private & Local:</strong> SAHAYINI protects your privacy. All contacts and credentials remain safely encrypted on your device.
            </span>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-xs text-slate-500 hover:text-[#0A2E65] underline"
            >
              Skip and continue as guest →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
