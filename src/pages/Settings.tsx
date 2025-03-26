
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { MongoDBStatus } from "@/components/ui-custom/MongoDBStatus";

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSaveSettings = (category: string) => {
    toast({
      title: "Settings Updated",
      description: `Your ${category} settings have been saved successfully.`,
    });
  };

  return (
    <div className="container p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Tabs defaultValue="account">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={user?.firstName || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={user?.lastName || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user?.email || ''} type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue={user?.userPhoneNumber || ''} type="tel" />
                </div>
              </div>
              <Button onClick={() => handleSaveSettings('profile')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive email updates about account activity</p>
                  </div>
                  <Switch id="emailNotifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications" className="font-medium">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive text messages for important alerts</p>
                  </div>
                  <Switch id="smsNotifications" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications" className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications in the app or on your desktop</p>
                  </div>
                  <Switch id="pushNotifications" defaultChecked />
                </div>
              </div>
              <Button onClick={() => handleSaveSettings('notifications')}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode" className="font-medium">Dark Mode</Label>
                    <p className="text-sm text-gray-500">Use dark theme throughout the application</p>
                  </div>
                  <Switch id="darkMode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compactView" className="font-medium">Compact View</Label>
                    <p className="text-sm text-gray-500">Show more content with reduced spacing</p>
                  </div>
                  <Switch id="compactView" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm">Small</Button>
                    <Button variant="outline" size="sm" className="bg-primary/10">Medium</Button>
                    <Button variant="outline" size="sm">Large</Button>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleSaveSettings('appearance')}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>
                Manage your account security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button onClick={() => handleSaveSettings('password')}>Change Password</Button>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 mb-2">Add an extra layer of security to your account</p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Sessions</h3>
                <p className="text-sm text-gray-500 mb-2">Manage your active sessions and sign out from other devices</p>
                <Button variant="outline" className="text-red-500">Sign Out All Devices</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Connection</CardTitle>
              <CardDescription>
                Manage your MongoDB database connection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MongoDBStatus />
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Connection Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Database Name:</span>
                    <span className="text-sm font-medium">broadsend-backend</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Host:</span>
                    <span className="text-sm font-medium">cluster0.ggagjiv.mongodb.net</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Connection Type:</span>
                    <span className="text-sm font-medium">MongoDB Atlas</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Connection Actions</h3>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => window.location.reload()}>Refresh Connection</Button>
                  <Button variant="destructive" onClick={() => {
                    closeDatabaseConnection();
                    toast({
                      title: "Database Disconnected",
                      description: "Your database connection has been closed",
                    });
                  }}>Disconnect</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
