import React, { useRef, useEffect } from "react";
import { Map, LayersControl, TileLayer } from "react-leaflet";
import L from "leaflet";
import CoordFile from "../data/Nurnberg.json";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapComponent = () => {
  const { BaseLayer } = LayersControl;
  const mapRef = useRef();
  useEffect(() => {
    markerInit();
  }, []);

  const markerInit = () => {
    const { current = {} } = mapRef;
    const { leafletElement: map } = current;
    if (!map) return;

    var featureGroup = L.featureGroup();
    CoordFile.map((o, i) => {
      var icon = L.divIcon({
        iconSize: null,

        html:
          '<div class="circle"> <div class="content-circle">' +
          (i + 1) +
          "</div></div>",
      });
      var marker = new L.Marker([o.lat, o.lng], { icon: icon }).bindPopup(
        `
        <div>

        <text class="title-name-popupMap">
        ${o.name}
        </text>
        <br/>

        <img src='${o.img}'/>
        </div>`
      ).bindTooltip(`<text class="title-name-popupMap">
        ${o.name}
        </text>`);
      marker.addTo(featureGroup);
    });
    featureGroup.addTo(map);
    map.fitBounds(featureGroup.getBounds());
  };

  return (
    <>
      <Map
        ref={mapRef}
        style={{ borderRadius: "15px" }}
        center={[0, 0]}
        zoom={2}
        minZoom={1}
        maxZoom={20}
      >
        <LayersControl position="topleft">
          <BaseLayer checked name="Base">
            <TileLayer
              noWrap={true}
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="Calle">
            <TileLayer
              noWrap={true}
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"
            />
          </BaseLayer>
          <BaseLayer name="Dark">
            <TileLayer
              noWrap={true}
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </BaseLayer>
        </LayersControl>
      </Map>
    </>
  );
};

export default MapComponent;
