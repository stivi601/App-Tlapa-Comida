import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from 'use-places-autocomplete';

// Configuración de Librerías
const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '12px',
};
const defaultCenter = {
    lat: 17.542289, // Tlapa de Comonfort, Gro.
    lng: -98.577265
};
const options = {
    disableDefaultUI: true,
    zoomControl: true,
};

export default function LocationPicker({ onLocationSelect, initialLocation }) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    // Memoize libraries array to prevent unnecessary re-renders/initializations
    const libs = useMemo(() => libraries, []);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey || "",
        libraries: libs,
    });

    const [center, setCenter] = useState(initialLocation || defaultCenter);
    const [markerPos, setMarkerPos] = useState(initialLocation || defaultCenter);
    const mapRef = useRef();

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    // Actualizar marker cuando se mueve el mapa (opcional: o solo al soltar)
    // Para UX tipo Uber: El marker está fijo al centro, y el mapa se mueve.
    // O Marker arrastrable.
    // Vamos a hacer Marker fijo al centro para mayor precisión móvil.

    const handleCenterChanged = () => {
        if (!mapRef.current) return;
        const newCenter = mapRef.current.getCenter();
        const lat = newCenter.lat();
        const lng = newCenter.lng();
        setMarkerPos({ lat, lng });
        // No llamamos onLocationSelect en cada frame, solo al confirmar o parar.
    };

    const handleDragEnd = () => {
        if (!mapRef.current) return;
        const newCenter = mapRef.current.getCenter();
        const lat = newCenter.lat();
        const lng = newCenter.lng();
        // Reverse Geocoding podría ir aquí para obtener "Calle 5..."
        onLocationSelect({ lat, lng });
    };

    if (!apiKey) {
        return <div style={{ color: 'red', padding: '10px' }}>Error: Falta VITE_GOOGLE_MAPS_API_KEY</div>;
    }
    if (loadError) return <div>Error cargando mapas: {loadError.message}</div>;
    if (!isLoaded) return <div>Cargando Mapa...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <SearchBox panTo={(props) => {
                setCenter(props);
                setMarkerPos(props);
                onLocationSelect(props);
            }} />

            <div style={{ position: 'relative' }}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={15}
                    center={center}
                    options={options}
                    onLoad={onMapLoad}
                    onDragEnd={handleDragEnd}
                    onCenterChanged={handleCenterChanged} // Mantiene track del centro
                    onClick={(e) => {
                        const lat = e.latLng.lat();
                        const lng = e.latLng.lng();
                        setCenter({ lat, lng });
                        setMarkerPos({ lat, lng });
                        onLocationSelect({ lat, lng });
                    }}
                >
                    {/* Marker fijo al centro visualmente o lógico */}
                    <Marker position={markerPos} />
                </GoogleMap>

                {/* Overlay de instrucción */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255,255,255,0.9)',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                    Mueve el mapa para ajustar
                </div>
            </div>
        </div>
    );
}

function SearchBox({ panTo }) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 17.542289, lng: () => -98.577265 },
            radius: 5000, // 5km alrededor de Tlapa
        },
    });

    const handleInput = (e) => {
        setValue(e.target.value);
    };

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng });
            // Pasamos también la dirección formateada si se desea
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <input
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Buscar calle o colonia..."
                style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                }}
            />
            {status === "OK" && <ul style={{
                position: 'absolute',
                zIndex: 10,
                background: 'white',
                width: '100%',
                listStyle: 'none',
                padding: 0,
                margin: 0,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: '0 0 8px 8px'
            }}>
                {data.map(({ place_id, description }) => (
                    <li
                        key={place_id}
                        onClick={() => handleSelect(description)}
                        style={{
                            padding: '10px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee'
                        }}
                    >
                        {description}
                    </li>
                ))}
            </ul>}
        </div>
    );
}
