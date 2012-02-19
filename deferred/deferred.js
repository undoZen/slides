var whenFirst = function ( promises ) {
    var d = defer(), i, promise, length = promises.length;
    for ( i = 0; i < length; i++ ) {
        promise = promises[i];
        if ( isPromise( promise )) {
            promise.then( function () {
                d.resolve( promise );
            });
        }
    }
}
var whenAll = function ( promises ) {
    var d = defer(), i, promise, length = promises.length, count = 0;
    function check() {
        count++;
        if ( count == length ) {
            d.resolve( promises );
        }
    }
    for ( i = 0; i < length; i++ ) {
        promise = promises[i];
        if ( isPromise( promise )) {
            promise.then( check );
        } else {
            check();
        }
    }
}
var defer = function () {
    var queue = [], value, i, callback;
    return {
        resolve: function ( _value ) {
            value = _value;
            for ( i = -1; callback = queue[++i]; ) {
                callback( value );
            }
            queue = undefined;
        },
        promise: {
            then: function ( callback ) {
                if ( queue ) {
                    queue.push( callback );
                } else {
                    callback( value );
                }
            },
            pipe: function ( _callback ) {
                var d = defer(),
                    callback = function ( _value ) {
                        d.resolve( _callback( _value ));
                    };
                if ( queue ) {
                    queue.push( callback );
                } else {
                    callback( value );
                }
                return d.promise;
            }
        }
    };
};
var pA = (function () {
    var d = defer();
    setTimeout( function () {
        d.resolve(13);
    }, 1000);
    return d.promise;
}());
pA.then( function ( a ) {
    console.log( a );
});
var pC = pA.pipe( function ( a ) {
    return 8 + a;
});
pC.then( function ( c ) {
    console.log( c );
});
setTimeout( function () {
    pA.pipe( function ( a ) {
        return a - 8;
    }).then( function ( c ) {
        console.log( c );
    });
}, 2000);
var pB = (function () {
    var d = defer();
    setTimeout( function () {
        d.resolve(21);
    }, 3000);
    return d.promise;
}());
pB.then( function ( b ) {
    console.log( b );
});
pA.pipe( function ( a ) {
    return pB.pipe( function ( b ) {
        return a + b;
    });
}).then( function ( c ) {
    console.log( c );
});
pA.pipe( function ( a ) {
    return pB.pipe( function ( b ) {
        return a + b;
    });
}).then( function ( c ) {
    console.log( c );
    c.then( function ( cc ) {
        console.log( cc );
    });
});
pA.pipe( function ( a ) {
    pB.pipe( function ( b ) {
    }).then( function ( c ) {
        console.log('-'+c);
    });
})
