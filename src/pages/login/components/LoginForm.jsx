import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email este obligatoriu';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Formatul email-ului nu este valid';
    }

    if (!formData?.password) {
      newErrors.password = 'Parola este obligatorie';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Parola trebuie să aibă cel puțin 6 caractere';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await signIn(formData?.email, formData?.password);
      
      if (error) {
        setErrors({
          general: error?.message || 'Email sau parolă incorectă.'
        });
      } else {
        // Successful login - navigation handled by AuthContext
        navigate('/ai-chat-interface');
      }
    } catch (error) {
      setErrors({
        general: 'A apărut o eroare. Vă rugăm să încercați din nou.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      // This would integrate with Supabase OAuth
      // For now, we'll use the auth service structure
      const { error } = await signIn(`demo@${provider}.com`, 'demo123');
      if (!error) {
        navigate('/ai-chat-interface');
      }
    } catch (error) {
      setErrors({
        general: `${provider} login failed. Please try again.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-card border border-border p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="Plane" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Bun venit înapoi</h1>
          <p className="text-muted-foreground">Conectează-te la contul tău TravelAI Deals</p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-2">Demo Credentials:</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>Admin: admin@travelai.ro / Travel123!</div>
            <div>User: user@travelai.ro / Travel123!</div>
            <div>Manager: manager@travelai.ro / Travel123!</div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors?.general && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={20} className="text-destructive" />
                <p className="text-sm text-destructive">{errors?.general}</p>
              </div>
            </div>
          )}

          {/* Email Input */}
          <Input
            label="Adresa de email"
            type="email"
            name="email"
            placeholder="exemplu@email.com"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
            disabled={isLoading}
          />

          {/* Password Input */}
          <div className="relative">
            <Input
              label="Parola"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Introdu parola"
              value={formData?.password}
              onChange={handleInputChange}
              error={errors?.password}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
            </button>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <Checkbox
              label="Ține-mă minte"
              name="rememberMe"
              checked={formData?.rememberMe}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Ai uitat parola?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            iconName="LogIn"
            iconPosition="right"
          >
            Conectează-te
          </Button>
        </form>

        {/* BUTON GOOGLE — ca în REGISTER */}
<button
  type="button"
  onClick={() => authService.signInWithProvider("google")}
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


        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Nu ai cont?{' '}
            <Link
              to="/register"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Creează cont nou
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;