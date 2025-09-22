'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Settings, User, Bell, Shield, CreditCard, ExternalLink } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useUser()
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    weeklyReports: true,
    newSaleAlerts: true,
  })

  const handleSave = async () => {
    setIsSaving(true)
    // In a real app, you'd save these settings to your database
    setTimeout(() => {
      setIsSaving(false)
      // Show success message
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={user?.firstName || ''}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={user?.lastName || ''}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.emailAddresses[0]?.emailAddress || ''}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Email managed by Clerk. Update it in your Clerk dashboard.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive important updates via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="newSaleAlerts">New Sale Alerts</Label>
                  <p className="text-sm text-gray-600">Get notified when someone purchases your lists</p>
                </div>
                <Switch
                  id="newSaleAlerts"
                  checked={settings.newSaleAlerts}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, newSaleAlerts: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyReports">Weekly Reports</Label>
                  <p className="text-sm text-gray-600">Receive weekly performance summaries</p>
                </div>
                <Switch
                  id="weeklyReports"
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, weeklyReports: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  <p className="text-sm text-gray-600">Receive tips and updates about the platform</p>
                </div>
                <Switch
                  id="marketingEmails"
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, marketingEmails: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </CardTitle>
              <CardDescription>
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Two-Factor Authentication</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage in Clerk
                </Button>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Password</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Change your password and security settings
                </p>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Login</span>
                <span className="text-sm font-medium">
                  {user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">Stripe Connected</h4>
                <p className="text-green-800 text-sm">Your account is ready to receive payouts</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage Stripe Account
              </Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Card>
            <CardContent className="p-6">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

