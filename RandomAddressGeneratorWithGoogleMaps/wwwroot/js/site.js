var selectedPolygon = null;
let map;
let drawingManager;
let geocoder;
var pointArray = [];
var pointCount = 0;
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

function deletePolygon() {
    if (selectedPolygon != null) {
        selectedPolygon.overlay.setMap(null);
        selectedPolygon = null;
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
    }
}

function createPoint() {
    pointArray = [];
    pointCount = parseInt($("#pointCount").val());
    getRandomPointInRange();
}


function getRandomPointInRange() {
    var point = createRandomPoint(getPolygonRange(),3);
    getPointAddress(point);
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
  
    
    geocoder.geocode({ location: latlng }, function(results, status) {
        if (status === "OK") {
            if (results) {
                for (let result of results) {
                    if (result.address_components.length == 7 && result.geometry.location_type == 'ROOFTOP') {
                        pointArray.push(result);
                        break;
                    }
                }
            } 
        }
        if (pointArray.length < pointCount) {
            getRandomPointInRange();
        }
        else {
            createExcel();
        }
    });
}

function createExcel() {    
    var Results = [];

    pointArray.forEach(function (RowItem, RowIndex) {
        var object = [];
        object.push(RowItem.address_components[2].long_name);
        object.push(RowItem.address_components[1].long_name);
        object.push(RowItem.address_components[0].long_name);
        object.push(RowItem.address_components[3].long_name);
        object.push(RowItem.address_components[4].long_name);
        object.push(RowItem.address_components[5].long_name);
        object.push(RowItem.address_components[6].long_name);
        Results.push(object);
    });
    var CsvString = "";
    Results.forEach(function (RowItem, RowIndex) {
        RowItem.forEach(function (ColItem, ColIndex) {
            CsvString += ColItem + ',';
        });
        CsvString += "\r\n";
    });
    CsvString = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(CsvString);
    var x = document.createElement("a");
    x.setAttribute("href", CsvString);
    x.setAttribute("download", "somedata.csv");
    document.body.appendChild(x);
    x.click();
}