import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { supabase } from '../../../lib/supabase';

const PersonalInfoTab = () => {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ===================== LOAD USER ===================== */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        const user = data.user;
        if (!user) return;

        setPersonalInfo({
          firstName: user.user_metadata?.first_name || '',
          lastName: user.user_metadata?.last_name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          dateOfBirth: user.user_metadata?.date_of_birth || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (err) {
        console.error('Eroare user:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  /* ===================== HANDLERS ===================== */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          phone: personalInfo.phone,
          date_of_birth: personalInfo.dateOfBirth
        }
      });

      if (error) throw error;

      setIsEditing(false);
      alert('✅ Informațiile personale au fost actualizate.');
    } catch (err) {
      console.error(err.message);
      alert('❌ Eroare la salvarea datelor.');
    }
  };

  /* ===================== PASSWORD CHANGE ===================== */
  const handlePasswordChange = async () => {
    const {
      email,
      currentPassword,
      newPassword,
      confirmPassword
    } = personalInfo;

    if (!currentPassword) {
      alert('Introdu parola actuală.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Parolele noi nu coincid.');
      return;
    }

    try {
      // 🔐 Re-auth (OBLIGATORIU)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword
      });

      if (signInError) {
        alert('Parola actuală este incorectă.');
        return;
      }

      // 🔐 Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setPersonalInfo((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setShowPasswordSection(false);
      alert('🔐 Parola a fost schimbată cu succes.');
    } catch (err) {
      console.error(err.message);
      alert('❌ Eroare la schimbarea parolei.');
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Se încarcă datele contului...</p>;
  }

  return (
    <div className="space-y-6">

      {/* ===================== PERSONAL INFO ===================== */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Informații personale</h3>
          <Button
            size="sm"
            variant={isEditing ? 'outline' : 'default'}
            iconName={isEditing ? 'X' : 'Edit'}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Renunță' : 'Editează'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Prenume" name="firstName" value={personalInfo.firstName} onChange={handleInputChange} disabled={!isEditing} />
          <Input label="Nume" name="lastName" value={personalInfo.lastName} onChange={handleInputChange} disabled={!isEditing} />
          <Input label="Email" value={personalInfo.email} disabled description="Email folosit la autentificare" />
          <Input label="Telefon" name="phone" value={personalInfo.phone} onChange={handleInputChange} disabled={!isEditing} />
          <Input label="Data nașterii" type="date" name="dateOfBirth" value={personalInfo.dateOfBirth} onChange={handleInputChange} disabled={!isEditing} />
        </div>

        {isEditing && (
          <div className="flex justify-end mt-6 gap-3">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Anulează</Button>
            <Button iconName="Save" onClick={handleSaveChanges}>Salvează</Button>
          </div>
        )}
      </div>

      {/* ===================== SECURITY ===================== */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Securitate</h3>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                <Icon name="Key" size={20} />
              </div>
              <div>
                <h4 className="font-medium">Parolă</h4>
                <p className="text-sm text-muted-foreground">
                  Pentru siguranță, confirmă parola actuală
                </p>
              </div>
            </div>

            <Button size="sm" variant="outline" onClick={() => setShowPasswordSection(!showPasswordSection)}>
              Schimbă parola
            </Button>
          </div>

          {showPasswordSection && (
            <div className="space-y-4 pt-4 border-t border-border">
              <Input
                label="Parola actuală"
                type="password"
                name="currentPassword"
                value={personalInfo.currentPassword}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Parola nouă"
                type="password"
                name="newPassword"
                value={personalInfo.newPassword}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Parola trebuie să conțină minimum 8 caractere, o literă mare, o literă mică,
                o cifră și un caracter special.
              </p>
              <Input
                label="Confirmă parola nouă"
                type="password"
                name="confirmPassword"
                value={personalInfo.confirmPassword}
                onChange={handleInputChange}
                required
              />

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowPasswordSection(false)}>Anulează</Button>
                <Button iconName="Save" onClick={handlePasswordChange}>Actualizează</Button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default PersonalInfoTab;
