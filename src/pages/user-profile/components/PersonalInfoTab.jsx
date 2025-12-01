import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
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

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Când se încarcă componenta, preluăm userul Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (data?.user) {
          const user = data.user;
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
        }
      } catch (err) {
        console.error('Eroare la preluarea utilizatorului:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          phone: personalInfo.phone,
          date_of_birth: personalInfo.dateOfBirth
        }
      });

      if (error) throw error;
      console.log('✅ Date actualizate:', data);
      setIsEditing(false);
      alert('Informațiile personale au fost salvate cu succes!');
    } catch (err) {
      console.error('Eroare la salvare:', err.message);
      alert('Eroare la salvarea informațiilor.');
    }
  };

  const handlePasswordChange = async () => {
    if (personalInfo.newPassword !== personalInfo.confirmPassword) {
      alert('Parolele nu coincid!');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: personalInfo.newPassword
      });

      if (error) throw error;
      setPersonalInfo((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setShowPasswordSection(false);
      alert('Parola a fost actualizată cu succes!');
    } catch (err) {
      console.error('Eroare la schimbarea parolei:', err.message);
      alert('Eroare la schimbarea parolei.');
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Se încarcă informațiile personale...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Informații Personale</h3>
          <Button
            variant={isEditing ? 'outline' : 'default'}
            size="sm"
            iconName={isEditing ? 'X' : 'Edit'}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Renunță' : 'Editează'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Prenume"
            name="firstName"
            value={personalInfo.firstName}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
          />
          <Input
            label="Nume"
            name="lastName"
            value={personalInfo.lastName}
            onChange={handleInputChange}
            disabled={!isEditing}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={personalInfo.email}
            disabled
            description="Adresa de email folosită la autentificare"
          />
          <Input
            label="Telefon"
            type="tel"
            name="phone"
            value={personalInfo.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="+40 XXX XXX XXX"
          />
          <Input
            label="Data nașterii"
            type="date"
            name="dateOfBirth"
            value={personalInfo.dateOfBirth}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        {isEditing && (
          <div className="flex justify-end mt-6 space-x-3">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Anulează
            </Button>
            <Button onClick={handleSaveChanges} iconName="Save">
              Salvează Modificările
            </Button>
          </div>
        )}
      </div>

      {/* Security Settings Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Securitate</h3>

        <div className="space-y-4">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  twoFactorEnabled
                    ? 'bg-success text-success-foreground'
                    : 'bg-warning text-warning-foreground'
                }`}
              >
                <Icon name={twoFactorEnabled ? 'Shield' : 'ShieldAlert'} size={20} />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Autentificare cu doi factori</h4>
                <p className="text-sm text-muted-foreground">
                  {twoFactorEnabled
                    ? 'Activată - Contul tău este protejat'
                    : 'Dezactivată - Activeaz-o pentru mai multă siguranță'}
                </p>
              </div>
            </div>
            <Button
              variant={twoFactorEnabled ? 'outline' : 'default'}
              size="sm"
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            >
              {twoFactorEnabled ? 'Dezactivează' : 'Activează'}
            </Button>
          </div>

          {/* Password Change */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <Icon name="Key" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Parolă</h4>
                  <p className="text-sm text-muted-foreground">Ultima schimbare: n/a</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
              >
                Schimbă Parola
              </Button>
            </div>

            {showPasswordSection && (
              <div className="space-y-4 mt-4 pt-4 border-t border-border">
                <Input
                  label="Parolă Nouă"
                  type="password"
                  name="newPassword"
                  value={personalInfo.newPassword}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Confirmă Parola Nouă"
                  type="password"
                  name="confirmPassword"
                  value={personalInfo.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowPasswordSection(false)}>
                    Anulează
                  </Button>
                  <Button onClick={handlePasswordChange} iconName="Save">
                    Actualizează Parola
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Email Notifications */}
          <div className="p-4 bg-muted rounded-lg">
            <Checkbox
              label="Notificări prin email"
              description="Primește actualizări importante despre contul tău"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
