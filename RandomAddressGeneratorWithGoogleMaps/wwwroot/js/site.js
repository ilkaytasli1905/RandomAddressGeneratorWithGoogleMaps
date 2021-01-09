// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.
var selectedPolygon = null;
let map;
let drawingManager;
let geocoder;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        //Lat Lng of Turkey center point
        center: { lat: 39.376116, lng: 34.729803 },
        zoom: 6,
    });

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYLINE,
        drawingControl: false
    });

    geocoder = new google.maps.Geocoder();

    drawingManager.setMap(map);
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (polygon) {
        if (selectedPolygon == null) {
            selectedPolygon = polygon;
            drawingManager.setDrawingMode(null);
        }
    });
}

function getRandomPointInRange() {
    var point = createRandomPoint(getPolygonRange(),3);
    return getPointAddress(point);
}

function createRandomPoint(range, fixed) {
    var point = {};
    point.latTemp = (Math.random() * (range.MaxLat - range.MinLat) + range.MinLat).toFixed(fixed) * 1;
    point.lngTemp = (Math.random() * (range.MaxLng - range.MinLng) + range.MinLng).toFixed(fixed) * 1;
    Object.defineProperty(point, "lat", {
        value: function () { return point.latTemp; }
    });
    Object.defineProperty(point, "lng", {
        value: function () { return point.lngTemp; }
    });
    return isPolygonContainsPoint(createPolygonForContainsMethod(), point) ? point : createRandomPoint(range, fixed);
}

function deletePolygon() {
    if (selectedPolygon != null) {
        selectedPolygon.overlay.setMap(null);
        selectedPolygon = null;
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
    }
}

function isPolygonContainsPoint(polygon, point) {
    return google.maps.geometry.poly.containsLocation(
        point,
        polygon
    );
}

function getPointAddress(point) {
    const latlng = {
        lat: parseFloat(point.lat()),
        lng: parseFloat(point.lng()),
    };
  
    
    //geocoder.geocode({ location: latlng }, function(results, status) {
    //    if (status === "OK") {
    //        if (results[0]) {
    //        } else {
    //        }
    //    } else {
    //    }
    //});
}

function createPoint() {
    var point = getRandomPointInRange();
    //new google.maps.Marker({
    //    position: point,
    //    map,
    //    icon: {
    //        path: resultPath,
    //        fillColor: resultColor,
    //        fillOpacity: 0.2,
    //        strokeColor: "white",
    //        strokeWeight: 0.5,
    //        scale: 10,
    //    },
    //});
}

function getPolygonRange() {
    var range = {};

    range.MinLat = selectedPolygon.overlay.getPath().getArray().reduce(function (prev, curr) {
        return prev.lat() < curr.lat() ? prev : curr;
    }).lat();
    range.MaxLat = selectedPolygon.overlay.getPath().getArray().reduce(function (prev, curr) {
        return prev.lat() > curr.lat() ? prev : curr;
    }).lat();
    range.MinLng = selectedPolygon.overlay.getPath().getArray().reduce(function (prev, curr) {
        return prev.lng() < curr.lng() ? prev : curr;
    }).lng();
    range.MaxLng = selectedPolygon.overlay.getPath().getArray().reduce(function (prev, curr) {
        return prev.lng() > curr.lng() ? prev : curr;
    }).lng();

    return range;
}

function createPolygonForContainsMethod() {
    var array = [];
    selectedPolygon.overlay.getPath().getArray().forEach(x => array.push({ "lat": x.lat(), "lng": x.lng() }));
    return new google.maps.Polygon({ paths: array });
}

