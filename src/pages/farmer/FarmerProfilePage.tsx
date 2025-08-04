import React, { useState } from 'react';
import { Header } from '@/components/common/Header';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { useTranslation } from 'react-i18next';
import { useAuthActions } from '@/hooks/useAuth';
import { Camera, Edit, Globe, RefreshCw, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const FarmerProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { logout, switchRole } = useAuthActions();
  const [profile, setProfile] = useState({
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@example.com',
    phone: '+252 61 234 5678',
    region: 'Bay',
    avatar: '',
    farmName: 'Hassan Organic Farm',
    farmSize: '15 hectares',
    primaryCrops: 'Tomatoes, Onions, Bananas',
    paymentMethod: '+252 61 234 5678'
  });

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="min-h-screen">
      <OfflineBanner />
      <Header title={t('farmer.profile')} showLogo={false} />

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-lg">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute -bottom-1 -right-1 bg-primary rounded-full p-2 cursor-pointer">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-muted-foreground">Farmer</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Select
                    value={profile.region}
                    onValueChange={(value) => setProfile(prev => ({ ...prev, region: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mogadishu">Mogadishu</SelectItem>
                      <SelectItem value="Bay">Bay</SelectItem>
                      <SelectItem value="Hargeisa">Hargeisa</SelectItem>
                      <SelectItem value="Gedo">Gedo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farm Information */}
        <Card>
          <CardHeader>
            <CardTitle>Farm Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="farm-name">Farm Name</Label>
              <Input
                id="farm-name"
                value={profile.farmName}
                onChange={(e) => setProfile(prev => ({ ...prev, farmName: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="farm-size">Farm Size</Label>
                <Input
                  id="farm-size"
                  value={profile.farmSize}
                  onChange={(e) => setProfile(prev => ({ ...prev, farmSize: e.target.value }))}
                  placeholder="e.g., 15 hectares"
                />
              </div>
              <div>
                <Label htmlFor="primary-crops">Primary Crops</Label>
                <Input
                  id="primary-crops"
                  value={profile.primaryCrops}
                  onChange={(e) => setProfile(prev => ({ ...prev, primaryCrops: e.target.value }))}
                  placeholder="e.g., Tomatoes, Onions"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payout Method</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Payout Method</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="payment-method">Mobile Money Number</Label>
                      <Input
                        id="payment-method"
                        value={profile.paymentMethod}
                        onChange={(e) => setProfile(prev => ({ ...prev, paymentMethod: e.target.value }))}
                        placeholder="+252 61 234 5678"
                      />
                    </div>
                    <Button className="w-full">Update</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="font-medium">Mobile Money</p>
                <p className="text-sm text-muted-foreground">{profile.paymentMethod}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <Label>Language</Label>
              </div>
              <Select value={i18n.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="so">Somali</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={switchRole}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Switch Role
            </Button>
            <Button variant="destructive" className="w-full justify-start" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              {t('auth.logout')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};