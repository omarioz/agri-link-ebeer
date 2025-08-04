import React, { useState } from 'react';
import { Header } from '@/components/common/Header';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { StatusChip } from '@/components/common/StatusChip';
import { useTranslation } from 'react-i18next';
import { Filter, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import somalilandMap from '@/assets/maps/somaliland-map.png';

const CITIES = [
  { name: 'Borama', top: '35%', left: '15%' },
  { name: 'Hargeisa', top: '50%', left: '40%' },
  { name: 'Burao', top: '45%', left: '65%' },
];

interface Route {
  id: string;
  driverName: string;
  driverPhone: string;
  status: 'in-transit' | 'delivered' | 'delayed';
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
      <div className="relative flex-1 overflow-hidden bg-muted">
        <img
          src={somalilandMap}
          alt="Somaliland map"
          className="w-full h-full object-cover select-none pointer-events-none"
        />

        {/* City pins */}
        {CITIES.map(city => (
          <button
            key={city.name}
            style={{ top: city.top, left: city.left }}
            className="absolute -translate-x-1/2 -translate-y-full group hover:scale-110 focus:scale-110 transition-transform"
            aria-label={city.name}
          >
            <div className="relative">
              <span className="block h-4 w-4 bg-primary rounded-full border-2 border-white shadow-lg" />
              <span className="absolute top-5 left-1/2 -translate-x-1/2 text-xs bg-white/90 px-2 py-1 rounded shadow-md font-medium whitespace-nowrap">
                {city.name}
              </span>
            </div>
          </button>
        ))}

        {/* Route indicators */}
        {filteredRoutes.map((route, index) => (
          <button
            key={route.id}
            onClick={() => setSelectedRoute(route)}
            style={{ 
              top: `${30 + index * 15}%`, 
              left: `${20 + index * 20}%` 
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group hover:scale-110 focus:scale-110 transition-transform"
            aria-label={`Route ${route.id}`}
          >
            <div className="relative">
              <div className={`h-6 w-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white ${
                route.status === 'in-transit' ? 'bg-blue-500' :
                route.status === 'delayed' ? 'bg-red-500' : 'bg-green-500'
              }`}>
                🚛
              </div>
              <div className="absolute top-7 left-1/2 -translate-x-1/2 text-xs bg-white/90 px-2 py-1 rounded shadow-md font-medium whitespace-nowrap">
                {route.id}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Filter Panel */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-20 left-4 z-[1000] bg-background shadow-lg"
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