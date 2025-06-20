import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// FIX for missing default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const LocationMarker = ({ location, onLocationChange }) => {
  const [position, setPosition] = useState(location);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationChange && onLocationChange(e.latlng);
    },
  });

  useEffect(() => {
    setPosition(location);
  }, [location]);

  if (!position) return null;

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const newPos = e.target.getLatLng();
          setPosition(newPos);
          onLocationChange && onLocationChange(newPos);
        },
      }}
    >
      <Popup>
        You are here: <br /> {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
      </Popup>
    </Marker>
  );
};

export default LocationMarker;