import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/common/Header';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { EmptyState } from '@/components/common/EmptyState';
import { useTranslation } from 'react-i18next';
import { Filter, Phone, Clock, WifiOff, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { StatusChip } from '@/components/common/StatusChip';
import { toast } from 'sonner';

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

// Somaliland cities
const cities = [
  { name: 'Hargeisa', coords: [44.0670, 9.5632] as [number, number] },
  { name: 'Borama', coords: [43.1809, 9.9432] as [number, number] },
  { name: 'Burao', coords: [45.5336, 9.5189] as [number, number] },
];

const mockRoutes: Route[] = [
  {
    id: 'R001',
    driverName: 'Ahmed Hassan',
    driverPhone: '+252 61 234 5678',
    status: 'in-transit',
    coordinates: [[43.1809, 9.9432], [44.0670, 9.5632], [45.5336, 9.5189]], // Borama → Hargeisa → Burao
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
    coordinates: [[44.0670, 9.5632], [45.5336, 9.5189]], // Hargeisa → Burao
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
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  const filteredRoutes = mockRoutes.filter(route => statusFilters[route.status]);

  const initializeMap = async () => {
    if (!mapboxToken || !mapContainer.current) return;

    try {
      // Dynamically import mapbox-gl
      const mapboxgl = await import('mapbox-gl');
      await import('mapbox-gl/dist/mapbox-gl.css');
      
      mapboxgl.default.accessToken = mapboxToken;
      
      map.current = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [44.3, 9.6], // Center between Somaliland cities
        zoom: 7
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        // Add city markers
        cities.forEach((city) => {
          new mapboxgl.default.Marker()
            .setLngLat(city.coords)
            .setPopup(new mapboxgl.default.Popup().setHTML(`<strong>${city.name}</strong>`))
            .addTo(map.current);
        });

        // Add route lines
        filteredRoutes.forEach((route, index) => {
          const routeColor = route.status === 'in-transit' ? '#00562C' : 
                           route.status === 'delayed' ? '#dc2626' : '#16a34a';
          
          map.current.addSource(`route-${route.id}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route.coordinates
              }
            }
          });

          map.current.addLayer({
            id: `route-${route.id}`,
            type: 'line',
            source: `route-${route.id}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': routeColor,
              'line-width': 4,
              'line-opacity': 0.7
            }
          });

          // Add click handler for route
          map.current.on('click', `route-${route.id}`, () => {
            setSelectedRoute(route);
          });
        });
      });

      setShowTokenInput(false);
      toast.success('Map loaded successfully!');
    } catch (error) {
      console.error('Error loading map:', error);
      toast.error('Failed to load map. Please check your Mapbox token.');
    }
  };

  const handleTokenSubmit = () => {
    if (!mapboxToken.trim()) {
      toast.error('Please enter a valid Mapbox token');
      return;
    }
    initializeMap();
  };

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

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
        ) : showTokenInput ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="max-w-md w-full space-y-4 bg-background p-6 rounded-lg border">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold">Mapbox Setup Required</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your Mapbox public token to display the logistics map.
                  Get your token from{' '}
                  <a 
                    href="https://mapbox.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    mapbox.com
                  </a>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
                <Input
                  id="mapbox-token"
                  type="password"
                  placeholder="pk.eyJ1..."
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
                />
              </div>
              <Button onClick={handleTokenSubmit} className="w-full">
                Load Map
              </Button>
            </div>
          </div>
        ) : (
          <div ref={mapContainer} className="h-full w-full" />
        )}
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
            {!showTokenInput && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowTokenInput(true)}
                  className="w-full"
                >
                  Change Mapbox Token
                </Button>
              </div>
            )}
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