"use client";

import * as z from "zod";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { User, Settings, Palette, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const tabs = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "account",
    label: "Account",
    icon: Settings,
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
  }
]

// Zod schema for profile validation
const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s-]+$/, "First name can only contain letters, spaces and hypens")
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters long")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s-]+$/, "Last name can only contain letters, spaces and hypens")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or less")
    .optional()
})

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Setting1sPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [fontSize, setFontSize] = useState([2]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
    },
    mode: "onChange",
  })
  const { formState: { isValid, isDirty}} = form;

  async function onSubmit(data: ProfileFormValues) {
    //TODO: Implement updating logic.
  }

  function renderCurrentTab() {
    switch(activeTab) {
      case "profile":
        return <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update how you would like the models to see you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({field}) => <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder={user?.firstName || "Enter your first name"} {...field} />
                      </FormControl>
                    </FormItem>}
                  />

                  <FormField 
                    control={form.control}
                    name="lastName"
                    render={({field}) => <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder={user?.lastName || "Enter your last name"} {...field} />
                      </FormControl>
                    </FormItem>}
                  />

                  <FormField 
                    control={form.control}
                    name="email"
                    render={({field}) => <FormItem className="md:col-span-2">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={user?.emailAddresses?.[0]?.emailAddress || "Enter your email address"} {...field} />
                      </FormControl>
                    </FormItem>}
                  />

                  <FormField 
                    control={form.control}
                    name="bio"
                    render={({field}) => <FormItem>
                      <FormLabel>
                        Bio
                        <span className="text-sm text-muted-foreground ml-2">
                          ({field.value?.length || 0}/500)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What should the models know about you?"
                          className="min-h-[100px] max-h-[300px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>}
                  />
                </div>

                <Button type="submit" disabled={!isDirty || !isValid}>Save Changes</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      case "account":
        return <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Preferences</CardTitle>
              <CardDescription>Choose what email notifications you'd like to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing emails</Label>
                  <p className="text-sm text-muted-foreground">Receive emails about new products and features.</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Security alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive emails about account security.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Product updates</Label>
                  <p className="text-sm text-muted-foreground">Receive emails about product updates.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="delete">Delete Account</Label>
                  <p className="text-sm text-muted-foreground">Delete your account permanently.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="size-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone. This will <span className="font-bold">permanently</span> delete your account and remove your data from our servers.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>
                        <Trash2 className="size-4" />
                        Delete account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      case "appearance":
        return <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display</CardTitle>
              <CardDescription>Customize the appearance of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="themeSelector">Theme</Label>
                  <Select defaultValue="system">
                    <SelectTrigger id="themeSelector" className="w-full">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">
                    Language
                    <span className="text-xs text-muted-foreground">experimental</span>
                  </Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Use a more compact layout</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show animations</Label>
                  <p className="text-sm text-muted-foreground">Enable interface animations</p>
                </div>
                <Switch defaultChecked/>
              </div>

              <Separator />
              <div className="space-y-4">
                <Label htmlFor="fontSize">Font Size</Label>
                <div className="space-y-3">
                  <Slider 
                    id="fontSize"
                    min={0}
                    max={4}
                    step={1}
                    value={fontSize}
                    onValueChange={setFontSize}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>XS</span>
                    <span>S</span>
                    <span>M</span>
                    <span>L</span>
                    <span>XL</span>
                  </div>
                </div>
                <Label htmlFor="font">Font Type</Label>
                <Select defaultValue="default">
                  <SelectTrigger id="font" className="w-full">
                    <SelectValue placeholder="Select Font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="dyslexic">Dyslexic Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
    }
  }

  return <div className="container mx-auto p-6 pt-16 max-w-6xl">
    <h1 className="text-3xl font-bold mb-8">Settings</h1>

    <div className="flex flex-col lg:flex-row gap-8">
      {/* Mobile Tabs -- Horizontal scroll*/}
      <div className="lg:hidden">
        <div className="flex space-x-1 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return <button
              key={tab.id}  
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200",
                activeTab == tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}>
                <Icon className="size-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
          })}
        </div>
      </div>

      {/* Desktop tabs -- Vertical */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                activeTab == tab.id ? "bg-primary text-primary-foreground" : "bg-background hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="size-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          })}
        </nav>
      </div>

      {/* Content area */}
      <div className="flex-1">{renderCurrentTab()}</div>
    </div>
  </div>
}