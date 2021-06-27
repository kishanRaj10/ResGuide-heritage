/** @format */

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: site.geometry.coordinates, //[lng,lat]
  zoom: 8,
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(site.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${site.title}</h5> <p>${site.location}</p>`
    )
  )
  .addTo(map);
