import { MapContainer, TileLayer } from 'react-leaflet';
import LocationMarker from './LocationMarker';

const MapView = ({ location, onLocationChange }) => {
  return (
    <div className="h-[400px] w-full rounded-xl shadow-md overflow-hidden">
      <MapContainer
        center={location || [20.5937, 78.9629]} // Default to India center
        zoom={location ? 13 : 4}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <LocationMarker location={location} onLocationChange={onLocationChange} />
      </MapContainer>
    </div>
  );
};

export default MapView;