'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  MapPin,
  Navigation,
  RefreshCw,
  Activity,
  User,
  Route,
  Loader2,
  Circle,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface OperatorLocation {
  operatorId: string;
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  timestamp: string;
  activeJourneyId?: string;
}

export default function LiveMapPage() {
  const [operators, setOperators] = useState<OperatorLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedOperator, setSelectedOperator] = useState<OperatorLocation | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchActiveOperators = useCallback(async () => {
    try {
      const response = await api.getActiveOperatorLocations();
      setOperators(response.data || []);
      setLastUpdate(new Date());
    } catch (err: any) {
      console.error('Failed to fetch operators:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveOperators();
  }, [fetchActiveOperators]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchActiveOperators, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, fetchActiveOperators]);

  const activeCount = operators.filter((o) => o.activeJourneyId).length;
  const idleCount = operators.length - activeCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Map Tracker</h1>
          <p className="text-muted-foreground">
            Real-time view of all active operators and their journeys
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className="mr-2 h-4 w-4" />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchActiveOperators}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Online</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operators.length}</div>
            <p className="text-xs text-muted-foreground">operators broadcasting location</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Journey</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            <p className="text-xs text-muted-foreground">currently on active journeys</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Idle</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{idleCount}</div>
            <p className="text-xs text-muted-foreground">online but no active journey</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Update</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--:--'}
            </div>
            <p className="text-xs text-muted-foreground">refreshes every 5s</p>
          </CardContent>
        </Card>
      </div>

      {/* Map + Operator List */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Map Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Live Map</CardTitle>
            <CardDescription>
              Operator positions update in real-time. Green = on journey, Orange = idle.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[500px] bg-muted rounded-lg overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : operators.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <MapPin className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium">No active operators</p>
                  <p className="text-sm">Operators will appear here when they go online</p>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  {/* 
                    Map visualization placeholder.
                    In production, integrate with Google Maps / Mapbox:
                    
                    import { GoogleMap, Marker } from '@react-google-maps/api';
                    
                    Each operator gets a marker at their lat/lng position.
                    Green markers for operators on journey, orange for idle.
                  */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
                    {/* Grid-based mini visualization */}
                    <svg className="w-full h-full" viewBox="0 0 1000 500">
                      {/* Grid lines */}
                      {Array.from({ length: 20 }).map((_, i) => (
                        <line
                          key={`h${i}`}
                          x1="0"
                          y1={i * 25}
                          x2="1000"
                          y2={i * 25}
                          stroke="currentColor"
                          strokeOpacity="0.05"
                        />
                      ))}
                      {Array.from({ length: 40 }).map((_, i) => (
                        <line
                          key={`v${i}`}
                          x1={i * 25}
                          y1="0"
                          x2={i * 25}
                          y2="500"
                          stroke="currentColor"
                          strokeOpacity="0.05"
                        />
                      ))}

                      {/* Operator dots */}
                      {operators.map((op, idx) => {
                        // Normalize lat/lng to SVG coords
                        const x = ((op.lng + 180) / 360) * 1000;
                        const y = ((90 - op.lat) / 180) * 500;
                        const isActive = !!op.activeJourneyId;
                        const isSelected = selectedOperator?.operatorId === op.operatorId;

                        return (
                          <g
                            key={op.operatorId}
                            onClick={() => setSelectedOperator(op)}
                            style={{ cursor: 'pointer' }}
                          >
                            {/* Pulse effect for active */}
                            {isActive && (
                              <circle
                                cx={x}
                                cy={y}
                                r="12"
                                fill={isActive ? '#22c55e' : '#f97316'}
                                fillOpacity="0.2"
                              >
                                <animate
                                  attributeName="r"
                                  values="8;16;8"
                                  dur="2s"
                                  repeatCount="indefinite"
                                />
                                <animate
                                  attributeName="fill-opacity"
                                  values="0.3;0.1;0.3"
                                  dur="2s"
                                  repeatCount="indefinite"
                                />
                              </circle>
                            )}
                            {/* Selection ring */}
                            {isSelected && (
                              <circle
                                cx={x}
                                cy={y}
                                r="14"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2"
                              />
                            )}
                            {/* Operator dot */}
                            <circle
                              cx={x}
                              cy={y}
                              r="6"
                              fill={isActive ? '#22c55e' : '#f97316'}
                              stroke="white"
                              strokeWidth="2"
                            />
                            {/* Speed indicator */}
                            {op.speed && op.speed > 5 && (
                              <text
                                x={x + 10}
                                y={y - 5}
                                fill="currentColor"
                                fillOpacity="0.6"
                                fontSize="10"
                              >
                                {Math.round(op.speed)} km/h
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm rounded-md px-3 py-2 text-xs flex gap-4">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-green-500" /> On Journey
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-orange-500" /> Idle
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Operator List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Active Operators ({operators.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {operators.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  No operators online
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {operators.map((op) => (
                    <button
                      key={op.operatorId}
                      onClick={() => setSelectedOperator(op)}
                      className={`w-full text-left px-3 py-3 rounded-md transition-colors ${
                        selectedOperator?.operatorId === op.operatorId
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              op.activeJourneyId ? 'bg-green-500' : 'bg-orange-500'
                            }`}
                          />
                          <span className="text-sm font-medium truncate max-w-[140px]">
                            {op.operatorId.slice(-8).toUpperCase()}
                          </span>
                        </div>
                        <Badge variant={op.activeJourneyId ? 'default' : 'secondary'} className="text-[10px]">
                          {op.activeJourneyId ? 'On Journey' : 'Idle'}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground flex items-center gap-3">
                        <span>{op.lat.toFixed(4)}, {op.lng.toFixed(4)}</span>
                        {op.speed !== undefined && <span>{Math.round(op.speed)} km/h</span>}
                      </div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground">
                        {new Date(op.timestamp).toLocaleTimeString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Selected Operator Detail */}
      {selectedOperator && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Operator Detail — {selectedOperator.operatorId.slice(-8).toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <div>
                <p className="text-sm text-muted-foreground">Latitude</p>
                <p className="text-lg font-medium">{selectedOperator.lat.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Longitude</p>
                <p className="text-lg font-medium">{selectedOperator.lng.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Speed</p>
                <p className="text-lg font-medium">{selectedOperator.speed ? `${Math.round(selectedOperator.speed)} km/h` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Heading</p>
                <p className="text-lg font-medium">{selectedOperator.heading ? `${Math.round(selectedOperator.heading)}°` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={selectedOperator.activeJourneyId ? 'default' : 'secondary'}>
                  {selectedOperator.activeJourneyId ? `Journey: ${selectedOperator.activeJourneyId.slice(-6)}` : 'Idle'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
