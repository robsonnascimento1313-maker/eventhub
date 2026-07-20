import { useRouter } from 'next/router';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Provider, coordsFor, formatBRL, isTopResponder } from '../services/catalog';

function priceIcon(p: Provider, active: boolean): L.DivIcon {
  const top = isTopResponder(p);
  const bg = active ? '#7c5cfa' : top ? '#1b1e2b' : '#14161f';
  const border = active ? '#a78bfa' : top ? 'rgba(251,191,36,.5)' : '#2a2e3e';
  const color = active ? '#fff' : top ? '#fcd34d' : '#e8eaf2';
  return L.divIcon({
    className: '',
    html: `<div style="
      font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:12px;
      color:${color};background:${bg};border:1.5px solid ${border};
      padding:4px 9px;border-radius:999px;white-space:nowrap;
      box-shadow:0 4px 14px rgba(0,0,0,.5);transform:translateZ(0);">
      ${formatBRL(p.priceFrom)}</div>`,
    iconSize: [76, 26],
    iconAnchor: [38, 13],
  });
}

interface Props {
  providers: Provider[];
  activeId?: string | null;
}

export default function ProviderMap({ providers, activeId }: Props) {
  const router = useRouter();

  return (
    <MapContainer
      center={[-23.56, -46.64]}
      zoom={11}
      zoomControl={false}
      scrollWheelZoom
      style={{ height: '100%', width: '100%', background: '#0a0b10' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />
      {providers.map((p) => (
        <Marker
          key={p.id}
          position={coordsFor(p)}
          icon={priceIcon(p, p.id === activeId)}
          eventHandlers={{ click: () => router.push(`/fornecedor/${p.id}`) }}
        >
          <Popup>
            <strong>{p.name}</strong>
            <br />
            {formatBRL(p.priceFrom)} · ⭐ {p.rating.toFixed(1)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
