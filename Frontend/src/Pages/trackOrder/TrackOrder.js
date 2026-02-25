import { useContext, useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./trackorder.css";
import { Storecontext } from "../../context/Storecontext";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const TrackOrder = () => {
  const location = useLocation();
  const order = location.state || {};
  const { geoapikey, latitude, longitude } = useContext(Storecontext);

  const [lat, setLat] = useState(latitude);
  const [lng, setLng] = useState(longitude);

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Socket setup
  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_URL);

    socket.emit("joinRoom", { roomId: "order123" });
    socket.on("locationUpdate", (data) => {
      console.log("Delivery Boy location: ", data);
      setLat(data.latitude);
      setLng(data.longitude);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Initialize map once
  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${geoapikey}`,
      center: [longitude, latitude],
      zoom: 12,
    });

    // Delivery boy marker (orange)
    const marker = new maplibregl.Marker({ color: "orange" })
      .setLngLat([lng, lat])
      .addTo(map);

    // Customer marker (red)
    new maplibregl.Marker({ color: "red" })
      .setLngLat([longitude, latitude])
      .addTo(map);

    mapRef.current = map;
    markerRef.current = marker;
  }, []);

  // Update marker + route when delivery boy moves
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    if (lat == null || lng == null) return;

    // Move marker
    markerRef.current.setLngLat([lng, lat]);

    // Smoothly pan camera to follow delivery boy
    mapRef.current.easeTo({
      center: [lng, lat],
      duration: 1000,
    });

    // Fetch new route
    const fromWaypoint = [lat, lng];
    const toWaypoint = [latitude, longitude];
    const url = `https://api.geoapify.com/v1/routing?waypoints=${fromWaypoint.join(",")}|${toWaypoint.join(",")}&mode=drive&details=instruction_details&apiKey=${geoapikey}`;

    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        if (result?.features?.length > 0) {
          if (mapRef.current.getSource("route")) {
            mapRef.current.getSource("route").setData(result);
          } else {
            mapRef.current.addSource("route", { type: "geojson", data: result });
            mapRef.current.addLayer({
              id: "route-line",
              type: "line",
              source: "route",
              layout: { "line-cap": "round", "line-join": "round" },
              paint: { "line-color": "#0074D9", "line-width": 4 },
            });
          }
        }
      })
      .catch((error) => console.log(error));
  }, [lat, lng]);

  return (
    <div className="map-container">
      <div id="map" className="map-box"></div>
      <div className="delivery-info">
        <div className="orders">
          <h4 className="color">Your Orders</h4>
          <p>
            <span className="bold">Items: </span>
            {order.items.map((item, index) =>
              index === order.items.length - 1
                ? `${item.name} x ${item.quantity}`
                : `${item.name} x ${item.quantity}, `
            )}
          </p>
          <p>
            <span className="bold">Subtotal: </span>₹{order.amount}
          </p>
          <p>
            <span className="bold">Customer Address: </span>
            {`${order.address.street} ${order.address.city} ${order.address.state} ${order.address.zipcode} ${order.address.country}`}
          </p>
        </div>
        <div className="deliverboy-info">
          <h4 className="color">Delivery Boy</h4>
          <p>
            <span className="bold">Name: {order.assignboy.name}</span>
          </p>
          <p>
            <span className="bold">Phone number: {order.assignboy.phone}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
