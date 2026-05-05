import { useState, useEffect } from 'react'
import { 
  Card, Button, Label, TextInput, Select, 
  ToggleSwitch, Alert, Avatar, Spinner
} from 'flowbite-react'
import { 
  User, Lock, Palette, 
  Shield, Save, Camera, Mail, Building2,
  Trash2, ShieldAlert
} from 'lucide-react'
import Layout from '../components/Layout'
import api from '../services/api'
import { useTranslation } from 'react-i18next'

const SettingsPage = ({ isDark, setIsDark }: any) => {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    branch: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me');
      setProfileData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        email: response.data.email || '',
        branch: response.data.branch || 'Main Office'
      });
    } catch (err) {
      console.error("Failed to load profile");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/me/profile', profileData);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.put('/users/me/password', { newPassword: passwordData.newPassword });
      setSuccess("Password updated successfully!");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      alert("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout isDark={isDark} setIsDark={setIsDark} title="Settings">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        
        {success && (
          <Alert color="success" icon={Shield} className="rounded-lg border-none shadow-lg shadow-green-500/10">
            {success}
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-6">
           {/* Sidebar Navigation (Tabs) */}
           <div className="w-full md:w-64 space-y-2">
              <Card className="border-none shadow-sm dark:bg-gray-800 p-2">
                 <div className="p-4 flex flex-col items-center text-center gap-3">
                    <div className="relative group cursor-pointer">
                       <Avatar 
                          size="xl" 
                          rounded 
                          className="ring-4 ring-blue-50 dark:ring-blue-900/20" 
                          placeholderInitials={(profileData.firstName?.[0] || 'U') + (profileData.lastName?.[0] || 'A')}
                       />
                       <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="text-white" size={20}/>
                       </div>
                    </div>
                    <div>
                       <h3 className="font-bold dark:text-white">{profileData.firstName} {profileData.lastName}</h3>
                       <p className="text-xs text-gray-400">{profileData.email}</p>
                    </div>
                 </div>
                 <hr className="my-2 dark:border-gray-700"/>
                 <div className="space-y-1">
                    {[
                      { id: 'profile', icon: <User size={18}/>, label: 'Profile Info' },
                      { id: 'security', icon: <Lock size={18}/>, label: 'Security' },
                      { id: 'appearance', icon: <Palette size={18}/>, label: 'Interface' }
                    ].map((item) => (
                      <button 
                        key={item.id} 
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activeTab === item.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                         {item.icon} {item.label}
                      </button>
                    ))}
                 </div>
              </Card>
           </div>

           {/* Main Content Area */}
           <div className="flex-1 space-y-6">
              
              {activeTab === 'profile' && (
                <Card className="border-none shadow-sm dark:bg-gray-800 animate-fade-in">
                   <h2 className="text-lg font-bold dark:text-white mb-4">Personal Information</h2>
                   <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <TextInput 
                               id="firstName"
                               className="mt-1" 
                               value={profileData.firstName} 
                               onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} 
                            />
                         </div>
                         <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <TextInput 
                               id="lastName"
                               className="mt-1" 
                               value={profileData.lastName} 
                               onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} 
                            />
                         </div>
                      </div>
                      <div>
                         <Label htmlFor="email">Email Address</Label>
                         <TextInput 
                            id="email"
                            icon={Mail} 
                            className="mt-1" 
                            value={profileData.email} 
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
                         />
                      </div>
                      <div>
                         <Label>Assigned Branch</Label>
                         <Select 
                            className="mt-1" 
                            icon={Building2} 
                            value={profileData.branch} 
                            onChange={(e) => setProfileData({...profileData, branch: e.target.value})}
                         >
                            <option>Main Office</option>
                            <option>West Branch</option>
                            <option>South Center</option>
                         </Select>
                      </div>
                      <div className="pt-4">
                         <Button type="submit" color="blue" disabled={loading} className="rounded-lg px-6">
                            {loading ? <Spinner size="sm" className="mr-2"/> : <Save size={18} className="mr-2"/>}
                            Save Changes
                         </Button>
                      </div>
                   </form>
                </Card>
              )}

              {activeTab === 'security' && (
                <Card className="border-none shadow-sm dark:bg-gray-800 bg-red-50/50 dark:bg-red-900/10 animate-fade-in">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                         <ShieldAlert size={20}/>
                      </div>
                      <h2 className="text-lg font-bold dark:text-white">Security & Password</h2>
                   </div>
                   <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div>
                         <Label>New Password</Label>
                         <TextInput 
                            type="password" 
                            className="mt-1" 
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                         />
                      </div>
                      <div>
                         <Label>Confirm New Password</Label>
                         <TextInput 
                            type="password" 
                            className="mt-1" 
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                         />
                      </div>
                      <div className="pt-2">
                         <Button type="submit" color="failure" disabled={loading} className="rounded-lg shadow-lg shadow-red-500/20">
                            Change Password
                         </Button>
                      </div>
                   </form>
                </Card>
              )}

              {activeTab === 'appearance' && (
                <Card className="border-none shadow-sm dark:bg-gray-800 animate-fade-in">
                   <h2 className="text-lg font-bold dark:text-white mb-4">Application Preferences</h2>
                   <div className="space-y-6">
                      <div className="flex justify-between items-center">
                         <div>
                            <p className="font-bold dark:text-gray-200">Dark Mode</p>
                            <p className="text-xs text-gray-500">Switch between light and dark themes</p>
                         </div>
                         <ToggleSwitch checked={isDark} onChange={setIsDark} />
                      </div>
                      <div className="flex justify-between items-center">
                         <div>
                            <p className="font-bold dark:text-gray-200">System Notifications</p>
                            <p className="text-xs text-gray-500">Receive alerts for urgent client cases</p>
                         </div>
                         <ToggleSwitch checked={true} onChange={() => {}} />
                      </div>
                      <div className="flex justify-between items-center">
                         <div>
                            <p className="font-bold dark:text-gray-200">Language</p>
                            <p className="text-xs text-gray-500">Choose your preferred interface language</p>
                         </div>
                         <div className="flex gap-2">
                            <Button size="xs" color={i18n.language === 'en' ? 'blue' : 'gray'} onClick={() => i18n.changeLanguage('en')}>EN</Button>
                            <Button size="xs" color={i18n.language === 'fr' ? 'blue' : 'gray'} onClick={() => i18n.changeLanguage('fr')}>FR</Button>
                         </div>
                      </div>
                   </div>
                </Card>
              )}

              {activeTab === 'profile' && (
                <div className="flex justify-center p-8">
                   <Button color="light" className="text-red-600 border-none hover:bg-red-50 font-bold">
                      <Trash2 size={18} className="mr-2"/> Deactivate Account
                   </Button>
                </div>
              )}

           </div>
        </div>
      </div>
    </Layout>
  )
}

export default SettingsPage;
