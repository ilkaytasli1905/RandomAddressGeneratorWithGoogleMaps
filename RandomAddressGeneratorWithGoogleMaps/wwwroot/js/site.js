// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.
var firstPolygon = null;

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.376116, lng: 34.729803 },
        zoom: 6,
    });
    const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYLINE,
        drawingControl: false
    });
    drawingManager.setMap(map);
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (polygon) {
        if (firstPolygon == null) {
            firstPolygon = polygon;
            var coordinatesArray = polygon.overlay.getPath().getArray();
            drawingManager.setDrawingMode(null);
        }
    });
}

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}
