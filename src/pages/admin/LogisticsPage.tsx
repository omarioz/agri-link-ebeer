import React, { useState } from 'react';
import { Header } from '@/components/common/Header';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { useTranslation } from 'react-i18next';
import { Filter, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { StatusChip } from '@/components/common/StatusChip';

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

      {/* Map Container - Temporarily replaced due to react-leaflet compatibility issues */}
      <div className="flex-1 relative bg-muted rounded-lg m-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold text-muted-foreground mb-2">
              Logistics Map
            </div>
            <div className="text-sm text-muted-foreground">
              Interactive map will be available soon
            </div>
            {/* Display route information as cards instead */}
            <div className="mt-6 space-y-3 max-w-md">
              {filteredRoutes.map((route) => (
                <div
                  key={route.id}
                  className="bg-background p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedRoute(route)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{route.driverName}</div>
                      <div className="text-sm text-muted-foreground">Route {route.id}</div>
                    </div>
                    <div className="text-right">
                      <StatusChip status={route.status} />
                      <div className="text-xs text-muted-foreground mt-1">{route.eta}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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