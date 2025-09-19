"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import {
  Settings,
  Bell,
  Palette,
  Globe,
  Shield,
  Database,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Wifi,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Save,
  AlertTriangle,
} from "lucide-react"

interface AppSettings {
  theme: "light" | "dark" | "system"
  language: string
  timezone: string
  dateFormat: string
  notifications: boolean
  sounds: boolean
  autoSync: boolean
  offlineMode: boolean
  dataUsage: "low" | "medium" | "high"
  cacheSize: number
  fontSize: number
  animationsEnabled: boolean
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState<AppSettings>({
    theme: "light",
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    notifications: true,
    sounds: true,
    autoSync: true,
    offlineMode: false,
    dataUsage: "medium",
    cacheSize: 512,
    fontSize: 16,
    animationsEnabled: true
  })

  const handleSave = () => {
    toast.success("Settings saved successfully!")
  }

  const handleReset = () => {
    toast.success("Settings reset to default!")
  }

  const handleClearCache = () => {
    toast.success("Cache cleared successfully!")
  }

  const handleExportData = () => {
    toast.success("Data export started!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">App Settings</h1>
          <p className="text-gray-600">Customize your StudyAI experience</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleReset} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSave} className="bg-sky hover:bg-sky/90 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data & Storage</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-sky" />
                  <span>Language & Region</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                      <SelectItem value="Asia/Dubai">Gulf Standard Time (GST)</SelectItem>
                      <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={settings.dateFormat}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, dateFormat: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-sage" />
                  <span>App Behavior</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoSync">Auto Sync</Label>
                    <p className="text-sm text-gray-600">Automatically sync data across devices</p>
                  </div>
                  <Switch
                    id="autoSync"
                    checked={settings.autoSync}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, autoSync: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="offlineMode">Offline Mode</Label>
                    <p className="text-sm text-gray-600">Enable offline functionality</p>
                  </div>
                  <Switch
                    id="offlineMode"
                    checked={settings.offlineMode}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, offlineMode: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sounds">Sound Effects</Label>
                    <p className="text-sm text-gray-600">Play sounds for interactions</p>
                  </div>
                  <Switch
                    id="sounds"
                    checked={settings.sounds}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, sounds: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="animations">Animations</Label>
                    <p className="text-sm text-gray-600">Enable smooth animations</p>
                  </div>
                  <Switch
                    id="animations"
                    checked={settings.animationsEnabled}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, animationsEnabled: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-yellow" />
                  <span>Theme & Display</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <Button
                      variant={settings.theme === "light" ? "default" : "outline"}
                      onClick={() => setSettings(prev => ({ ...prev, theme: "light" }))}
                      className="flex flex-col items-center p-4 h-auto"
                    >
                      <Sun className="h-6 w-6 mb-2" />
                      <span>Light</span>
                    </Button>
                    <Button
                      variant={settings.theme === "dark" ? "default" : "outline"}
                      onClick={() => setSettings(prev => ({ ...prev, theme: "dark" }))}
                      className="flex flex-col items-center p-4 h-auto"
                    >
                      <Moon className="h-6 w-6 mb-2" />
                      <span>Dark</span>
                    </Button>
                    <Button
                      variant={settings.theme === "system" ? "default" : "outline"}
                      onClick={() => setSettings(prev => ({ ...prev, theme: "system" }))}
                      className="flex flex-col items-center p-4 h-auto"
                    >
                      <Monitor className="h-6 w-6 mb-2" />
                      <span>System</span>
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Font Size</Label>
                  <div className="mt-2">
                    <Slider
                      value={[settings.fontSize]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, fontSize: value[0] }))}
                      max={24}
                      min={12}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>Small (12px)</span>
                      <span>Current: {settings.fontSize}px</span>
                      <span>Large (24px)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>See how your settings look</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className={`p-4 rounded-lg border ${
                    settings.theme === "dark" ? "bg-gray-900 text-white border-gray-700" : 
                    "bg-white text-gray-900 border-gray-200"
                  }`}
                  style={{ fontSize: `${settings.fontSize}px` }}
                >
                  <h3 className="font-semibold mb-2">Sample Content</h3>
                  <p className="text-sm opacity-80">
                    This is how your content will appear with the current settings. 
                    The theme and font size will be applied throughout the app.
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <Badge className="bg-sky text-white">Mathematics</Badge>
                    <Badge className="bg-sage text-white">Physics</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-yellow" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-gray-600">Turn all notifications on or off</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, notifications: checked }))
                  }
                />
              </div>

              {settings.notifications && (
                <div className="space-y-4 pl-4 border-l-2 border-sky/20">
                  <h4 className="font-semibold text-navy">Notification Types</h4>
                  
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-sky/20 rounded-full">
                          <Bell className="h-4 w-4 text-sky" />
                        </div>
                        <div>
                          <Label>Study Reminders</Label>
                          <p className="text-sm text-gray-600">Scheduled study session alerts</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 rounded-full">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <Label>Exam Alerts</Label>
                          <p className="text-sm text-gray-600">Important exam reminders</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-sage/20 rounded-full">
                          <Badge className="h-4 w-4 text-sage" />
                        </div>
                        <div>
                          <Label>Achievement Notifications</Label>
                          <p className="text-sm text-gray-600">Celebrate your milestones</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-teal" />
                  <span>Data Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Data Usage Mode</Label>
                  <Select
                    value={settings.dataUsage}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setSettings(prev => ({ ...prev, dataUsage: value }))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Save Data)</SelectItem>
                      <SelectItem value="medium">Medium (Balanced)</SelectItem>
                      <SelectItem value="high">High (Best Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Cache Size</Label>
                  <div className="mt-2">
                    <Slider
                      value={[settings.cacheSize]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, cacheSize: value[0] }))}
                      max={2048}
                      min={128}
                      step={128}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>128 MB</span>
                      <span>Current: {settings.cacheSize} MB</span>
                      <span>2 GB</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleClearCache} variant="outline" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <span>Data Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button onClick={handleExportData} variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All Data
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-navy mb-2">Storage Usage</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Academic Records</span>
                      <span>2.3 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Study Plans</span>
                      <span>1.8 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cache</span>
                      <span>{settings.cacheSize} MB</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total</span>
                      <span>{(4.1 + settings.cacheSize).toFixed(1)} MB</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-gray-600" />
                <span>Advanced Settings</span>
              </CardTitle>
              <CardDescription>
                Advanced configuration options for power users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Caution</h4>
                    <p className="text-sm text-yellow-700">
                      These settings are for advanced users. Changing them may affect app performance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Developer Mode</Label>
                    <p className="text-sm text-gray-600">Enable debugging features</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Beta Features</Label>
                    <p className="text-sm text-gray-600">Access experimental features</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics</Label>
                    <p className="text-sm text-gray-600">Help improve StudyAI with usage data</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Crash Reports</Label>
                    <p className="text-sm text-gray-600">Automatically send crash reports</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-navy mb-4">App Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Version:</span>
                    <span className="ml-2 font-medium">1.0.0</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Build:</span>
                    <span className="ml-2 font-medium">2025.01.19</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Platform:</span>
                    <span className="ml-2 font-medium">Web</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="ml-2 font-medium">Today</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}