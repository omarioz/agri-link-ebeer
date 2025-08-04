import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Header } from '@/components/common/Header';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { useTranslation } from 'react-i18next';
import { Filter, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { StatusChip } from '@/components/common/StatusChip';
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

const mockRoutes: Route[] = [
  {
    id: 'R001',
    driverName: 'Ahmed Hassan',
    driverPhone: '+252 61 234 5678',
    status: 'in-transit',
    coordinates: [[2.0469, 45.3182], [2.0569, 45.3282], [2.0669, 45.3382]],
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
    coordinates: [[2.0369, 45.3082], [2.0469, 45.3182]],
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
        <MapContainer
          center={[2.0469, 45.3182] as [number, number]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Route Markers */}
          {filteredRoutes.map((route) => (
            <React.Fragment key={route.id}>
              <Polyline
                positions={route.coordinates}
                pathOptions={{
                  color: route.status === 'in-transit' ? '#00562C' : route.status === 'delayed' ? '#dc2626' : '#16a34a',
                  weight: 4,
                  opacity: 0.7
                }}
              />
              <Marker
                position={route.coordinates[route.coordinates.length - 1]}
                eventHandlers={{
                  click: () => setSelectedRoute(route)
                }}
              >
                <Popup>
                  <div>
                    <strong>{route.driverName}</strong><br />
                    <StatusChip status={route.status} />
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>

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
    </div>
  );
};