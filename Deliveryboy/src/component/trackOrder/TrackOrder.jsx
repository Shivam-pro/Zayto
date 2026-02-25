import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./trackorder.css";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios"

const TrackOrder = ({ url, user, longitude, latitude, setLatitude, setLongitude }) => {
  const nevigate = useNavigate()
  const location = useLocation();
  const geoapikey = import.meta.env.VITE_GEOAPI;
  const order = location.state || {};
  const lat = order.address.location.latitude;
  const lng = order.address.location.longitude;

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const markAsDelivered = async (orderId) => {
    await axios.post(url + "/api/order/status", { orderId: orderId, status: "Delivered" });
    nevigate("/allorders");
  }

  useEffect(() => {
    const socket = io(url);
    socket.emit("joinRoom", { roomId: "order123" });

    navigator.geolocation.watchPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        socket.emit("locationUpdate", {
          roomId: "order123",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error: ", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
      }
    );

    // Initialize map only once
    const map = new maplibregl.Map({
      container: "map",
      style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${geoapikey}`,
      center: [lng, lat],
      zoom: 12,
    });

    // Delivery boy marker (orange)
    const marker = new maplibregl.Marker({ color: "orange" })
      .setLngLat([longitude, latitude])
      .addTo(map);

    // Customer marker (red)
    new maplibregl.Marker({ color: "red" })
      .setLngLat([lng, lat])
      .addTo(map);

    mapRef.current = map;
    markerRef.current = marker;
  }, []);

  // Update marker + route when location changes
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    if (latitude == null || longitude == null) return;

    // Move delivery boy marker
    markerRef.current.setLngLat([longitude, latitude]);

    // Fetch new route
    const fromWaypoint = [latitude, longitude];
    const toWaypoint = [lat, lng];
    const routeUrl = `https://api.geoapify.com/v1/routing?waypoints=${fromWaypoint.join(",")}|${toWaypoint.join(",")}&mode=drive&details=instruction_details&apiKey=${geoapikey}`;

    fetch(routeUrl)
      .then((res) => res.json())
      .then((result) => {
        if (result?.features?.length > 0) {
          if (mapRef.current.getSource("route")) {
            // Update existing route
            mapRef.current.getSource("route").setData(result);
          } else {
            // Add route for the first time
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
  }, [latitude, longitude]);

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
            <span className="bold">Name: {user.name}</span>
          </p>
          <p>
            <span className="bold">Phone number: {user.phone}</span>
          </p>
        </div>
        <div>
          <button className="delivered-btn" onClick={()=>{markAsDelivered(order._id)}}>Mark as Delivered</button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
