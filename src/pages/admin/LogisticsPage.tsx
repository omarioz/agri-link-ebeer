import React, { useState, Suspense } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Header } from '@/components/common/Header';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { Filter, Phone, Clock, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { StatusChip } from '@/components/common/StatusChip';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Route {
  id: string;
  driverName: string;
  driverPhone: string;
  status: 'in-transit' | 'delivered' | 'delayed';
  coordinates: [number, number][];
  eta: string;
  produce: Array<{
    name: string;
    qty: string;
    farmer: string;
  }>;
}

// Fix leaflet default icons
const pin = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Somaliland cities
const cities = [
  { name: 'Hargeisa', coords: [9.5632, 44.0670] as [number, number] },
  { name: 'Borama', coords: [9.9432, 43.1809] as [number, number] },
  { name: 'Burao', coords: [9.5189, 45.5336] as [number, number] },
];

const mockRoutes: Route[] = [
  {
    id: 'R001',
    driverName: 'Ahmed Hassan',
    driverPhone: '+252 61 234 5678',
    status: 'in-transit',
    coordinates: [cities[1].coords, cities[0].coords, cities[2].coords], // Borama → Hargeisa → Burao
    eta: '2h 30m',
    produce: [
      { name: 'Tomatoes', qty: '50kg', farmer: 'Fatima Ali' },
      { name: 'Onions', qty: '30kg', farmer: 'Mohamed Omar' }
    ]
  },
  {
    id: 'R002',
    driverName: 'Omar Jama',
    driverPhone: '+252 61 345 6789',
    status: 'delivered',
    coordinates: [cities[0].coords, cities[2].coords], // Hargeisa → Burao
    eta: 'Completed',
    produce: [
      { name: 'Bananas', qty: '40kg', farmer: 'Sahra Yusuf' }
    ]
  }
];

export const LogisticsPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [statusFilters, setStatusFilters] = useState({
    'in-transit': true,
    'delivered': true,
    'delayed': true
  });

  const filteredRoutes = mockRoutes.filter(route => statusFilters[route.status]);

  return (
    <div className="h-screen flex flex-col">
      <OfflineBanner />
      <Header title={t('admin.logistics')} showLogo={false} />

      {/* Map Container */}
      <div className="flex-1 relative">
        {typeof navigator !== 'undefined' && navigator.onLine === false ? (
          <EmptyState
            illustration={<WifiOff className="w-16 h-16" />}
            title="Offline – Map requires internet"
            description="Connect to the internet to view the logistics map"
          />
        ) : (
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <MapContainer
              center={[9.6, 44.3] as [number, number]}
              zoom={7}
              className="h-full w-full z-0"
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='© OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* City markers */}
              {cities.map((city) => (
                <Marker key={city.name} position={city.coords} icon={pin}>
                  <Popup>
                    <strong>{city.name}</strong>
                  </Popup>
                </Marker>
              ))}

              {/* Route polylines */}
              {filteredRoutes.map((route) => (
                <Polyline
                  key={route.id}
                  positions={route.coordinates}
                  pathOptions={{
                    color: route.status === 'in-transit' ? '#00562C' : 
                           route.status === 'delayed' ? '#dc2626' : '#16a34a',
                    weight: 4,
                    opacity: 0.7
                  }}
                  eventHandlers={{
                    click: () => setSelectedRoute(route)
                  }}
                />
              ))}
            </MapContainer>
          </Suspense>
        )}
      </div>

        {/* Filter Panel */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 left-4 z-[1000] bg-background shadow-lg"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>{t('common.filter')}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="font-medium mb-3">Status</h4>
                <div className="space-y-3">
                  {Object.entries(statusFilters).map(([status, checked]) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={status}
                        checked={checked}
                        onCheckedChange={(checked) =>
                          setStatusFilters(prev => ({ ...prev, [status]: checked as boolean }))
                        }
                      />
                      <label htmlFor={status} className="text-sm capitalize">
                        {status.replace('-', ' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Route Detail Drawer */}
        {selectedRoute && (
          <Drawer open={!!selectedRoute} onOpenChange={() => setSelectedRoute(null)}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Route {selectedRoute.id}</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedRoute.driverName}</h3>
                    <StatusChip status={selectedRoute.status} />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedRoute.eta}
                    </div>
                    <a
                      href={`tel:${selectedRoute.driverPhone}`}
                      className="flex items-center text-primary hover:underline mt-1"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      {selectedRoute.driverPhone}
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Produce</h4>
                  <div className="space-y-2">
                    {selectedRoute.produce.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                        <span className="font-medium">{item.name}</span>
                        <div className="text-right text-sm">
                          <div>{item.qty}</div>
                          <div className="text-muted-foreground">{item.farmer}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        )}
    </div>
  );
};