import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const riderIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/709/709790.png', // Modern Scooter/Delivery Bike icon
    iconSize: [45, 45],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
});

const storeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3014/3014795.png', // Modern Store icon
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const homeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1946/1946436.png', // Modern Home icon
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

// Component to fit bounds
function ChangeView({ bounds }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [bounds, map]);
    return null;
}

export default function LiveMap({ order, onClose }) {
    const [riderPos, setRiderPos] = useState(null);
    const [progress, setProgress] = useState(0);
    const [eta, setEta] = useState(15);
    const [routeCoords, setRouteCoords] = useState([]);

    // Mock coordinates for Tlapa (center)
    const center = [17.545, -98.575];
    // Mock random locations around Tlapa for Store and Customer
    const [storePos] = useState([17.545 + (Math.random() * 0.005 - 0.0025), -98.575 + (Math.random() * 0.005 - 0.0025)]);
    const [customerPos] = useState([17.545 + (Math.random() * 0.008 - 0.004), -98.575 + (Math.random() * 0.008 - 0.004)]);

    // Fetch Route from OSRM
    useEffect(() => {
        const fetchRoute = async () => {
            try {
                // Formatting: longitude,latitude;longitude,latitude
                const url = `https://router.project-osrm.org/route/v1/driving/${storePos[1]},${storePos[0]};${customerPos[1]},${customerPos[0]}?overview=full&geometries=geojson`;
                const response = await fetch(url);
                const data = await response.json();

                if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                    const geoCoordinates = data.routes[0].geometry.coordinates;
                    // OSRM returns [lon, lat], Leaflet needs [lat, lon]
                    const latLngs = geoCoordinates.map(coord => [coord[1], coord[0]]);
                    setRouteCoords(latLngs);
                    setEta(Math.ceil(data.routes[0].duration / 60)); // Duration is in seconds
                } else {
                    // Fallback to straight line
                    setRouteCoords([storePos, customerPos]);
                }
            } catch (error) {
                console.error("Error fetching route:", error);
                setRouteCoords([storePos, customerPos]);
            }
        };

        fetchRoute();
    }, [storePos, customerPos]);

    // Simulation Loop along the route
    useEffect(() => {
        if (routeCoords.length === 0) return;

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 1) return 1;
                return prev + 0.005; // Speed of simulation
            });
        }, 100);

        return () => clearInterval(interval);
    }, [routeCoords]);

    // Calculate Rider Position based on Progress along the Route
    useEffect(() => {
        if (routeCoords.length === 0) return;

        const totalPoints = routeCoords.length;
        const currentPointIndex = Math.floor(progress * (totalPoints - 1));
        const nextPointIndex = Math.min(currentPointIndex + 1, totalPoints - 1);

        const currentPoint = routeCoords[currentPointIndex];
        const nextPoint = routeCoords[nextPointIndex];

        // Segment progress (interpolation between two specific path points)
        const segmentLength = 1 / (totalPoints - 1);
        const segmentProgress = (progress - (currentPointIndex * segmentLength)) / segmentLength;

        if (currentPoint && nextPoint) {
            const lat = currentPoint[0] + (nextPoint[0] - currentPoint[0]) * segmentProgress;
            const lng = currentPoint[1] + (nextPoint[1] - currentPoint[1]) * segmentProgress;
            setRiderPos([lat, lng]);
        } else if (currentPoint) {
            setRiderPos(currentPoint);
        }

    }, [progress, routeCoords]);


    return (
        <div className="fade-in" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'white', zIndex: 1000, display: 'flex', flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{ padding: '1rem', background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 1001, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Seguimiento en Vivo</h2>
                    <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>
                        Llega en aproximadamente <strong>{Math.max(1, eta)} min</strong>
                    </p>
                </div>
            </div>

            {/* Map */}
            <div style={{ flex: 1, position: 'relative' }}>
                <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <ChangeView bounds={routeCoords.length > 0 ? [storePos, customerPos] : null} />

                    <Marker position={storePos} icon={storeIcon}>
                        <Popup>Restaurante: {order.restaurant}</Popup>
                    </Marker>

                    <Marker position={customerPos} icon={homeIcon}>
                        <Popup>Tu Ubicación</Popup>
                    </Marker>

                    {riderPos && (
                        <Marker position={riderPos} icon={riderIcon}>
                            <Popup>Repartidor</Popup>
                        </Marker>
                    )}

                    {routeCoords.length > 0 && (
                        <Polyline positions={routeCoords} color="var(--primary)" weight={5} opacity={0.7} />
                    )}
                </MapContainer>

                {/* Rider info overlay */}
                <div style={{
                    position: 'absolute', bottom: '20px', left: '20px', right: '20px',
                    background: 'white', padding: '1rem', borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 1002,
                    display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                    <div style={{ width: '50px', height: '50px', background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="https://cdn-icons-png.flaticon.com/512/709/709790.png" width="30" />
                    </div>
                    <div>
                        <h4 style={{ margin: 0 }}>Repartidor en camino</h4>
                        <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.9rem' }}>Tu pedido está cerca</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
