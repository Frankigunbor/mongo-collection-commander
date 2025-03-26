
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Moon,
  User,
  LogOut
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  // Settings state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    activityDigest: true
  });
  
  const [appearance, setAppearance] = useState({
    darkMode: false,
    compactView: false
  });
  
  const [privacy, setPrivacy] = useState({
    twoFactorAuth: false,
    publicProfile: true,
    dataCollection: true
  });
  
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
    
    toast({
      title: "Settings updated",
      description: "Your notification preferences have been saved",
    });
  };
  
  const handleAppearanceChange = (key: keyof typeof appearance) => {
    setAppearance({
      ...appearance,
      [key]: !appearance[key]
    });
    
    toast({
      title: "Appearance updated",
      description: "Your appearance settings have been saved",
    });
  };
  
  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy({
      ...privacy,
      [key]: !privacy[key]
    });
    
    toast({
      title: "Privacy settings updated",
      description: "Your privacy settings have been saved",
    });
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };
  
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <CardTitle>Settings</CardTitle>
          </div>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="notifications" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive email notifications about account activity</p>
                    </div>
                    <Switch 
                      checked={notifications.emailNotifications} 
                      onCheckedChange={() => handleNotificationChange('emailNotifications')} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                    </div>
                    <Switch 
                      checked={notifications.pushNotifications} 
                      onCheckedChange={() => handleNotificationChange('pushNotifications')} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium">Marketing Emails</h4>
                      <p className="text-sm text-muted-foreground">Receive updates about new features and offers</p>
                    </div>
                    <Switch 
                      checked={notifications.marketingEmails} 
                      onCheckedChange={() => handleNotificationChange('marketingEmails')} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium">Activity Digest</h4>
                      <p className="text-sm text-muted-foreground">Receive weekly summary of your account activity</p>
                    </div>
                    <Switch 
                      checked={notifications.activityDigest} 
                      onCheckedChange={() => handleNotificationChange('activityDigest')} 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Appearance Tab */}
            <TabsContent value="appearance">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Appearance Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium">Dark Mode</h4>
                      <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
                    </div>
                    <Switch 
                      checked={appearance.darkMode} 
                      onCheckedChange={() => handleAppearanceChange('darkMode')} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium">Compact View</h4>
                      <p className="text-sm text-muted-foreground">Display more content with less spacing</p>
                    </div>
                    <Switch 
                      checked={appearance.compactView} 
                      onCheckedChange={() => handleAppearanceChange('compactView')} 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Privacy and Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch 
                      checked={privacy.twoFactorAuth} 
                      onCheckedChange={() => handlePrivacyChange('twoFactorAuth')} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium">Public Profile</h4>
                      <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                    </div>
                    <Switch 
                      checked={privacy.publicProfile} 
                      onCheckedChange={() => handlePrivacyChange('publicProfile')} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-medium">Data Collection</h4>
                      <p className="text-sm text-muted-foreground">Allow us to collect usage data to improve our service</p>
                    </div>
                    <Switch 
                      checked={privacy.dataCollection} 
                      onCheckedChange={() => handlePrivacyChange('dataCollection')} 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Account Tab */}
            <TabsContent value="account">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Account Management</h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-base font-medium">User Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="font-medium">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Account Status</p>
                        <p className="font-medium">{user?.status || 'Active'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-col gap-2">
                    <h4 className="text-base font-medium">Account Actions</h4>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <Button variant="outline" onClick={() => window.location.href = '/profile'}>
                        Edit Profile
                      </Button>
                      <Button variant="outline" className="text-amber-600 border-amber-600 hover:bg-amber-50 hover:text-amber-700">
                        Change Password
                      </Button>
                      <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive">
                        Delete Account
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
