import React, { useState } from 'react';
import { Header } from '@/components/common/Header';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { EmptyState } from '@/components/common/EmptyState';
import { StatusChip } from '@/components/common/StatusChip';
import { useTranslation } from 'react-i18next';
import { Plus, MoreVertical, ShoppingBasket, Edit, Pause, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface Listing {
  id: string;
  name: string;
  image: string;
  quantity: string;
  price: string;
  status: 'active' | 'paused' | 'sold';
  harvestDate: string;
  organic: boolean;
}

const mockListings: Listing[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    image: '/api/placeholder/100/100',
    quantity: '50kg',
    price: '$2.50/kg',
    status: 'active',
    harvestDate: '2024-08-03',
    organic: true
  },
  {
    id: '2',
    name: 'Red Onions',
    image: '/api/placeholder/100/100',
    quantity: '30kg',
    price: '$1.80/kg',
    status: 'paused',
    harvestDate: '2024-08-02',
    organic: false
  },
  {
    id: '3',
    name: 'Sweet Bananas',
    image: '/api/placeholder/100/100',
    quantity: '40kg',
    price: '$3.00/kg',
    status: 'sold',
    harvestDate: '2024-08-01',
    organic: true
  }
];

export const ListingsPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [showNewListingDialog, setShowNewListingDialog] = useState(false);
  const [newListing, setNewListing] = useState({
    name: '',
    quantity: '',
    price: '',
    harvestDate: '',
    organic: false,
    description: ''
  });

  const filteredListings = mockListings.filter(listing => {
    if (activeTab === 'all') return true;
    return listing.status === activeTab;
  });

  const handleSelectListing = (id: string, checked: boolean) => {
    setSelectedListings(prev =>
      checked ? [...prev, id] : prev.filter(listingId => listingId !== id)
    );
  };

  const handleBulkAction = (action: 'pause' | 'activate' | 'sold') => {
    console.log(`Bulk ${action} for listings:`, selectedListings);
    setSelectedListings([]);
  };

  const handleListingAction = (id: string, action: 'edit' | 'pause' | 'sold') => {
    console.log(`${action} listing ${id}`);
  };

  const handleCreateListing = () => {
    console.log('Creating listing:', newListing);
    setShowNewListingDialog(false);
    setNewListing({
      name: '',
      quantity: '',
      price: '',
      harvestDate: '',
      organic: false,
      description: ''
    });
  };

  const renderListingCard = (listing: Listing) => (
    <div key={listing.id} className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={selectedListings.includes(listing.id)}
          onCheckedChange={(checked) => handleSelectListing(listing.id, checked as boolean)}
        />
        
        <img
          src={listing.image}
          alt={listing.name}
          className="w-16 h-16 rounded-lg object-cover bg-muted"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{listing.name}</h3>
              <p className="text-sm text-muted-foreground">
                {listing.quantity} • {listing.price}
              </p>
              {listing.organic && (
                <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Organic
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <StatusChip status={listing.status} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleListingAction(listing.id, 'edit')}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleListingAction(listing.id, 'pause')}>
                    <Pause className="w-4 h-4 mr-2" />
                    {listing.status === 'active' ? 'Pause' : 'Activate'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleListingAction(listing.id, 'sold')}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Sold
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <OfflineBanner />
      <Header title={t('farmer.listings')} showLogo={false} />

      <div className="p-4">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
          </TabsList>

          {/* Bulk Actions */}
          {selectedListings.length > 0 && (
            <div className="mb-4 p-3 bg-muted rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedListings.length} selected
              </span>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('pause')}
                >
                  Pause
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('sold')}
                >
                  Mark Sold
                </Button>
              </div>
            </div>
          )}

          {/* Listings */}
          <TabsContent value={activeTab} className="space-y-3">
            {filteredListings.length > 0 ? (
              filteredListings.map(renderListingCard)
            ) : (
              <EmptyState
                illustration={<ShoppingBasket className="w-12 h-12" />}
                title="No listings found"
                description={
                  activeTab === 'all'
                    ? "Add your first listing to start selling"
                    : `No ${activeTab} listings`
                }
                cta={activeTab === 'all' ? "Add Listing" : undefined}
                onAction={() => setShowNewListingDialog(true)}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Floating Action Button */}
        <Dialog open={showNewListingDialog} onOpenChange={setShowNewListingDialog}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('farmer.newListing')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="listing-name">Produce Name</Label>
                <Input
                  id="listing-name"
                  value={newListing.name}
                  onChange={(e) => setNewListing(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Fresh Tomatoes"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    value={newListing.quantity}
                    onChange={(e) => setNewListing(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price per kg</Label>
                  <Input
                    id="price"
                    value={newListing.price}
                    onChange={(e) => setNewListing(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="2.50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="harvest-date">Harvest Date</Label>
                <Input
                  id="harvest-date"
                  type="date"
                  value={newListing.harvestDate}
                  onChange={(e) => setNewListing(prev => ({ ...prev, harvestDate: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newListing.description}
                  onChange={(e) => setNewListing(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your produce..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="organic"
                  checked={newListing.organic}
                  onCheckedChange={(checked) => setNewListing(prev => ({ ...prev, organic: checked }))}
                />
                <Label htmlFor="organic">Organic Certification</Label>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowNewListingDialog(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCreateListing}>
                  Create Listing
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};