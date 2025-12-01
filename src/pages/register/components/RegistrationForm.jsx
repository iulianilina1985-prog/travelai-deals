import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
import authService from '../../../services/authService';

const RegistrationForm = ({ onSubmit, loading }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToMarketing: false,
    selectedTier: 'free'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    const minLength = password?.length >= 8;
    const hasUpper = /[A-Z]/?.test(password);
    const hasLower = /[a-z]/?.test(password);
    const hasNumber = /\d/?.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/?.test(password);
    
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      score: [minLength, hasUpper, hasLower, hasNumber, hasSpecial]?.filter(Boolean)?.length
    };
  };

  const passwordStrength = validatePassword(formData?.password);

  const getStrengthColor = (score) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score) => {
    if (score <= 2) return 'Slabă';
    if (score <= 3) return 'Mediocră';
    if (score <= 4) return 'Bună';
    return 'Puternică';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Curăță eroarea când utilizatorul tastează
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.firstName?.trim()) {
      newErrors.firstName = 'Prenumele este obligatoriu.';
    }

    if (!formData?.lastName?.trim()) {
      newErrors.lastName = 'Numele de familie este obligatoriu.';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Adresa de email este obligatorie.';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Te rugăm să introduci o adresă de email validă.';
    }

    if (!formData?.password) {
      newErrors.password = 'Parola este obligatorie.';
    } else if (passwordStrength?.score < 3) {
      newErrors.password = 'Parola trebuie să fie mai puternică.';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Te rugăm să confirmi parola.';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Parolele nu coincid.';
    }

    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'Trebuie să accepți termenii și condițiile.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await authService?.signUp(
  formData?.email,
  formData?.password,
  {
    firstName: formData?.firstName,
    lastName: formData?.lastName,
    role: formData?.selectedTier || 'free',

    // AICI SALVĂM ACCEPTĂRILE
    accepted_terms: true,
    accepted_terms_at: new Date().toISOString(),
    accepted_privacy: true,
    accepted_privacy_at: new Date().toISOString(),
    terms_version: "1.0",
    privacy_version: "1.0",

    marketing_emails: formData?.agreeToMarketing,
  }
);


      if (error) {
        setErrors({
          general: error?.message || 'Înregistrarea a eșuat. Te rugăm să încerci din nou.'
        });
      } else {
        // Înregistrare reușită
        navigate('/ai-chat-interface');
      }
    } catch (error) {
      setErrors({
        general: 'Înregistrarea a eșuat. Te rugăm să încerci din nou.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Eroare generală */}
      {errors?.general && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={20} className="text-destructive" />
            <p className="text-sm text-destructive">{errors?.general}</p>
          </div>
        </div>
      )}

      {/* Nume și prenume */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Prenume"
          type="text"
          name="firstName"
          value={formData?.firstName}
          onChange={handleInputChange}
          placeholder="Introdu prenumele"
          error={errors?.firstName}
          required
          disabled={isLoading}
        />
        <Input
          label="Nume de familie"
          type="text"
          name="lastName"
          value={formData?.lastName}
          onChange={handleInputChange}
          placeholder="Introdu numele de familie"
          error={errors?.lastName}
          required
          disabled={isLoading}
        />
      </div>
      
      {/* Email */}
      <Input
        label="Adresa de email"
        type="email"
        name="email"
        value={formData?.email}
        onChange={handleInputChange}
        placeholder="Introdu adresa de email"
        error={errors?.email}
        required
        disabled={isLoading}
      />
      
      {/* Parola */}
      <div className="space-y-2">
        <div className="relative">
          <Input
            label="Parolă"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData?.password}
            onChange={handleInputChange}
            placeholder="Creează o parolă puternică"
            error={errors?.password}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>

        {/* Indicator putere parolă */}
        {formData?.password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Puterea parolei:</span>
              <span
                className={`font-medium ${
                  passwordStrength?.score <= 2
                    ? 'text-red-600'
                    : passwordStrength?.score <= 3
                    ? 'text-yellow-600'
                    : passwordStrength?.score <= 4
                    ? 'text-blue-600'
                    : 'text-green-600'
                }`}
              >
                {getStrengthText(passwordStrength?.score)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength?.score)}`}
                style={{ width: `${(passwordStrength?.score / 5) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className={`flex items-center space-x-1 ${passwordStrength?.minLength ? 'text-green-600' : ''}`}>
                <Icon name={passwordStrength?.minLength ? 'Check' : 'X'} size={12} />
                <span>Minim 8 caractere</span>
              </div>
              <div className={`flex items-center space-x-1 ${passwordStrength?.hasUpper ? 'text-green-600' : ''}`}>
                <Icon name={passwordStrength?.hasUpper ? 'Check' : 'X'} size={12} />
                <span>Majusculă</span>
              </div>
              <div className={`flex items-center space-x-1 ${passwordStrength?.hasLower ? 'text-green-600' : ''}`}>
                <Icon name={passwordStrength?.hasLower ? 'Check' : 'X'} size={12} />
                <span>Literă mică</span>
              </div>
              <div className={`flex items-center space-x-1 ${passwordStrength?.hasNumber ? 'text-green-600' : ''}`}>
                <Icon name={passwordStrength?.hasNumber ? 'Check' : 'X'} size={12} />
                <span>Cifră</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Confirmare parolă */}
      <div className="relative">
        <Input
          label="Confirmă parola"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData?.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirmă parola introdusă"
          error={errors?.confirmPassword}
          required
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
          disabled={isLoading}
        >
          <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
      </div>
      
      {/* Acceptări */}
      <div className="space-y-4">
  <Checkbox
    label={
      <span className="text-sm">
        Sunt de acord cu{" "}
        <Link to="/termeni-si-conditii" className="text-primary hover:underline">
          Termenii și condițiile
        </Link>{" "}
        și{" "}
        <Link
          to="/politica-confidentialitate"
          className="text-primary hover:underline"
        >
          Politica de confidențialitate
        </Link>.
      </span>
    }
    name="agreeToTerms"
    checked={formData?.agreeToTerms}
    onChange={handleInputChange}
    error={errors?.agreeToTerms}
    required
    disabled={isLoading}
  />

  <Checkbox
    label="Sunt de acord să primesc emailuri cu oferte și notificări despre călătorii"
    name="agreeToMarketing"
    checked={formData?.agreeToMarketing}
    onChange={handleInputChange}
    disabled={isLoading}
  />
</div>

      
      {/* Buton Submit */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        iconName="UserPlus"
        iconPosition="left"
      >
        Creează contul
      </Button>
      {/* LOGIN CU GOOGLE CU LOGO OFICIAL */}
      <button
        type="button"
        onClick={() => authService.signInWithGoogle()}
        className="w-full flex items-center justify-center gap-3 border border-border bg-white hover:bg-gray-50 py-2.5 rounded-lg shadow-sm transition mt-2"
      >
        {/* SVG LOGO GOOGLE */}
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11.3 0 20-8.7 20-20 0-1.3-.1-2.7-.4-3.5z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.3 16.2 18.8 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 16.1 4 9.2 8.5 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.2 0 10.2-2 13.9-5.7l-6.4-5.9C29.3 36 26.8 37 24 37c-5.3 0-9.7-3.6-11.3-8.5l-6.5 5C9.3 39.4 16.1 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.8-4.6 6.6-8.6 7.3v7.1c7.6-.6 13.9-6.5 15-14.4.3-1.4.3-2.8.3-3.5z"/>
        </svg>

        <span className="text-sm font-medium">Continuă cu Google</span>
      </button>
      {/* Link Login */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Ai deja un cont?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Autentifică-te aici
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;
