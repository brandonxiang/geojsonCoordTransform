/**
 * 把wgs84的geojson转换成gcj坐标的geojson
 * @param {} _ 
 * @returns {} 
 */
function wgs2gcj(_) {
    var geojson = clone(_);
    switch (geojson.type) {
    case 'FeatureCollection':
        switch (geojson.features[0].geometry.type) {
        case 'Point':
            geojson.features.map(function(feature) {
                wgs2gcjPoint(feature.geometry);
            });
            return geojson;
        case 'LineString':
        case 'MultiPoint':
            geojson.features.map(function(feature) {
                wgs2gcjLine(feature.geometry);
            });
            return geojson;
        case 'Polygon':
        case 'MultiLineString':
            geojson.features.map(function(feature) {
                wgs2gcjPoly(feature.geometry);
            });
            return geojson;
        case 'MultiPolygon':
            geojson.features.map(function(feature) {
                wgs2gcjMultiPoly(feature.geometry);
            });
            return geojson;
        }
    case 'Point':
        return wgs2gcjPoint(geojson);
    case 'LineString':
    case 'MultiPoint':
        return wgs2gcjLine(geojson);
    case 'Polygon':
    case 'MultiLineString':
        return wgs2gcjPoly(geojson);
    case 'MultiPolygon':
        return wgs2gcjMultiPoly(geojson);
    }
}

function wgs2gcjPoint(point) {
    var coord = point.coordinates;
    var gcj = coordtransform.wgs84togcj02(coord[0], coord[1]);
    coord[0] = gcj[0];
    coord[1] = gcj[1];
}

function wgs2gcjLine(line) {
    line.Coordinates.map(function(coord) {
        var gcj = coordtransform.wgs84togcj02(coord[0], coord[1]);
        coord[0] = gcj[0];
        coord[1] = gcj[1];
    });
}

function wgs2gcjPoly(poly) {
    poly.coordinates.map(function(ring) {
        ring.map(function(coord) {
            var gcj = coordtransform.wgs84togcj02(coord[0], coord[1]);
            coord[0] = gcj[0];
            coord[1] = gcj[1];
        });
    });
}

function wgs2gcjMultiPoly(multiPoly) {
    multiPoly.coordinates.map(function(poly) {
        poly.map(function(ring) {
            ring.map(function(coord) {
                var gcj = coordtransform.wgs84togcj02(coord[0], coord[1]);
                coord[0] = gcj[0];
                coord[1] = gcj[1];
            });
        });
    });
}

function clone(obj) {
    var o;
    if (typeof obj == "object") {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    o.push(clone(obj[i]));
                }
            } else {
                o = {};
                for (var j in obj) {
                    o[j] = clone(obj[j]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
}