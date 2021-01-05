// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.376116, lng: 34.729803 },
        zoom: 6,
    });
    const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.MARKER,
                google.maps.drawing.OverlayType.CIRCLE,
                google.maps.drawing.OverlayType.POLYGON,
                google.maps.drawing.OverlayType.POLYLINE,
                google.maps.drawing.OverlayType.RECTANGLE,
            ],
        },
        markerOptions: {
            icon:
                "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
        },
        circleOptions: {
            fillColor: "#ffff00",
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1,
        },

    });
    drawingManager.setMap(map);
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (polygon) {
        var coordinatesArray = polygon.overlay.getPath().getArray();
    });
}

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}