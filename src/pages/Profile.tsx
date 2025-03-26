
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Edit, Image } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  phoneNumber: z.string().optional(),
});

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.userPhoneNumber || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // In a real app, you would update the user information in the backend
    console.log('Updated profile data:', values);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    
    setIsEditing(false);
  };

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-40">
              <p>Loading profile information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <User className="h-8 w-8 text-primary" />
              <CardTitle>Profile</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            View and manage your profile information
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <Button variant="outline" size="sm" className="flex gap-2">
                  <Image className="h-4 w-4" />
                  <span>Change Photo</span>
                </Button>
              )}
            </div>
            
            <div className="flex-1">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={!isEditing} 
                              className={!isEditing ? "bg-muted" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              disabled={!isEditing} 
                              className={!isEditing ? "bg-muted" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email" 
                            disabled={!isEditing} 
                            className={!isEditing ? "bg-muted" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!isEditing} 
                            className={!isEditing ? "bg-muted" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {isEditing && (
                    <div className="flex justify-end gap-2 pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="font-medium">{user.status || 'Active'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
