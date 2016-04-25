function convert2gaode(_) {
    var geojson = clone(_);
    switch (geojson.type) {
    case 'FeatureCollection':
        switch (geojson.features[0].geometry.type) {
        case 'Point':
            geojson.features.map(function(feature) {
                convert2gaodePoint(feature.geometry);
            });
            return geojson;
        case 'LineString':
        case 'MultiPoint':
            geojson.features.map(function(feature) {
                convert2gaodeLine(feature.geometry);
            });
            return geojson;
        case 'Polygon':
        case 'MultiLineString':
            geojson.features.map(function(feature) {
                convert2gaodePoly(feature.geometry);
            });
            return geojson;
        case 'MultiPolygon':
            geojson.features.map(function(feature) {
                convert2gaodeMultiPoly(feature.geometry);
            });
            return geojson;
        }
    case 'Point':
        return convert2gaodePoint(geojson);
    case 'LineString':
    case 'MultiPoint':
        return convert2gaodeLine(geojson);
    case 'Polygon':
    case 'MultiLineString':
        return convert2gaodePoly(geojson);
    case 'MultiPolygon':
        return convert2gaodeMultiPoly(geojson);
    }
}

function convert2gaodePoint(point) {
    var coord = point.coordinates;
    var gcj = coordtransform.wgs84togcj02(coord[0], coord[1]);
    coord[0] = gcj[0];
    coord[1] = gcj[1];
}

function convert2gaodeLine(line) {
    line.Coordinates.map(function(coord) {
        var gcj = coordtransform.wgs84togcj02(coord[0], coord[1]);
        coord[0] = gcj[0];
        coord[1] = gcj[1];
    });
}

function convert2gaodePoly(poly) {
    poly.coordinates.map(function(ring) {
        ring.map(function(coord) {
            var gcj = coordtransform.wgs84togcj02(coord[0], coord[1]);
            coord[0] = gcj[0];
            coord[1] = gcj[1];
        });
    });
}

function convert2gaodeMultiPoly(multiPoly) {
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