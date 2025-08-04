import React, { useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Header } from '@/components/common/Header';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { Skeleton } from '@/components/common/SkeletonLoader';
import { StatusChip } from '@/components/common/StatusChip';
import { useTranslation } from 'react-i18next';
import { Search, Download, MoreVertical, UserX, RotateCcw, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface User {
  id: string;
  name: string;
  role: 'buyer' | 'farmer' | 'admin';
  region: string;
  phone: string;
  status: 'active' | 'paused' | 'pending';
  joinedDate: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    role: 'buyer',
    region: 'Mogadishu',
    phone: '+252 61 234 5678',
    status: 'active',
    joinedDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Fatima Ali',
    role: 'farmer',
    region: 'Bay',
    phone: '+252 61 345 6789',
    status: 'active',
    joinedDate: '2024-02-20'
  },
  {
    id: '3',
    name: 'Omar Jama',
    role: 'buyer',
    region: 'Hargeisa',
    phone: '+252 61 456 7890',
    status: 'paused',
    joinedDate: '2024-03-10'
  },
  // Add more mock data for scrolling demo
  ...Array.from({ length: 100 }, (_, i) => ({
    id: `${i + 4}`,
    name: `User ${i + 4}`,
    role: (['buyer', 'farmer', 'admin'] as const)[i % 3],
    region: ['Mogadishu', 'Bay', 'Hargeisa', 'Gedo'][i % 4],
    phone: `+252 61 ${String(i + 4).padStart(3, '0')} ${String(i + 4).padStart(4, '0')}`,
    status: (['active', 'paused', 'pending'] as const)[i % 3],
    joinedDate: '2024-01-01'
  }))
];

export const UsersPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredUsers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  const handleUserAction = (userId: string, action: 'suspend' | 'reactivate' | 'reset-password') => {
    console.log(`${action} user ${userId}`);
    // TODO: Implement user actions
  };

  const exportCSV = () => {
    const csvContent = [
      ['Name', 'Role', 'Region', 'Phone', 'Status', 'Joined'],
      ...filteredUsers.map(user => [
        user.name,
        user.role,
        user.region,
        user.phone,
        user.status,
        user.joinedDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <OfflineBanner />
      <Header title={t('admin.users')} showLogo={false} />

      <div className="p-4">
        {/* Toolbar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="farmer">Farmer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
          </Table>

          {/* Virtualized table body */}
          <div
            ref={parentRef}
            className="h-[500px] overflow-auto"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {isLoading ? (
                <div className="space-y-3 p-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex space-x-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const user = filteredUsers[virtualItem.index];
                  return (
                    <div
                      key={virtualItem.key}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                      className="flex items-center px-4 py-3 border-b border-border hover:bg-muted/50"
                    >
                      <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                        <div className="font-medium">{user.name}</div>
                        <div className="capitalize text-sm text-muted-foreground">{user.role}</div>
                        <div className="text-sm text-muted-foreground">{user.region}</div>
                        <div className="text-sm text-muted-foreground">{user.phone}</div>
                        <StatusChip status={user.status} />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.status === 'active' ? (
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, 'suspend')}>
                              <UserX className="w-4 h-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, 'reactivate')}>
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Reactivate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'reset-password')}>
                            <KeyRound className="w-4 h-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {mockUsers.length} users
        </div>
      </div>
    </div>
  );
};