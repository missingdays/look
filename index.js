var observable = function(el){

    var callbacks = {};
    var id = 0;

    el = el || {};

    function fire(name, args){
        var callbacksNamed = callbacks[name];

        if(callbacksNamed){
            callbacksNamed.forEach(function(callback){
                if(callback){
                    callback.apply(el, args);
                }

                if(callback._isSingle){
                    el.off(name, callback);
                }
            });
        }
    }

    el.on = function(names, fn){
        var names_splt = names.split(" ");

        fn._id = id++;

        names_splt.forEach(function(name){

            if(!callbacks[name]){
                callbacks[name] = [];
            }

            callbacks[name].push(fn);
        });

        return el;
    };

    el.one = function(name, fn){
        fn._isSingle = true;

        return el.on(name, fn); 
    }

    el.off = function(names, fn){
        var names_splt = names.split(" ");

        names_splt.forEach(function(name){
            if(fn){
                var i = 0;
                while(i < callbacks[name].length){
                    var callback = callbacks[name][i];
                    if(callback._id === fn._id){
                        callbacks[name].splice(i, 1);
                    } else {
                        i++;
                    }
                }
            } else {
                callbacks[name] = [];
            }
        });

        return el;
    }

    el.trigger = function(names){
        var args = [].splice.call(arguments, 1);

        var names_splt = names.split(" ");

        names_splt.forEach(function(name){
            fire(name, args);
        });

        return el;
    }

    return el;
}

if(module && module.exports){
    module.exports.observable = observable;
} else if(define && define.amd){
    define("look-observable", observable);
} else {
    window.observable = observable;
}
