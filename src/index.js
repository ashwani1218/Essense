export const poll = ( fn,timeout, interval) => {
    var endtime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    var checkCondition = function(resolve, reject) {
        // If the condition is met, we're done! 
        var result = fn();
        if(result) {
            resolve(result);
        }
        // If the condition isn't met but the timeout hasn't elapsed, go again
        else if (Number(new Date()) < endTime) {
            setTimeout(checkCondition, interval, resolve, reject);
        }
        // Didn't match and too much time, reject!
        else {
            reject(new Error('timed out for ' + fn + ': ' + arguments));
        }
    };

    return new Promise(checkCondition);
},

export const once = () => {
        var result;
    
        return function() { 
            if(fn) {
                result = fn.apply(context || this, arguments);
                fn = null;
            }
    
            return result;
        };
},

export const absoluteURL= () => {
    var a;
    return (url) => {
        if(!a) a = document.createElement('a');
        a.href = url;
        return a.href;
    };
},

export const deBounce= (func , wait, immediate) => {
    var timeout;
    return () => {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
},

export const isNative = (value) => {
        // Used to resolve the internal `[[Class]]` of values
    var toString = Object.prototype.toString;
    
    // Used to resolve the decompiled source of functions
    var fnToString = Function.prototype.toString;
    
    // Used to detect host constructors (Safari > 4; really typed array specific)
    var reHostCtor = /^\[object .+?Constructor\]$/;

    // Compile a regexp using a common native method as a template.
    // We chose `Object#toString` because there's a good chance it is not being mucked with.
    var reNative = RegExp('^' +
        // Coerce `Object#toString` to a string
        String(toString)
        // Escape any special regexp characters
        .replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')
        // Replace mentions of `toString` with `.*?` to keep the template generic.
        // Replace thing like `for ...` to support environments like Rhino which add extra info
        // such as method arity.
        .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );
        
    var type = typeof value;
    return type == 'function'
    // Use `Function#toString` to bypass the value's own `toString` method
    // and avoid being faked out.
    ? reNative.test(fnToString.call(value))
    // Fallback to a host object check because some environments will represent
    // things like typed arrays as DOM methods which may not conform to the
    // normal native pattern.
    : (value && type == 'object' && reHostCtor.test(toString.call(value))) || false;
},

export const matchesSelector =  (el, selector) =>{
    var p = Element.prototype;
    var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
        return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
    };
    return f.call(el, selector);
},

export const ligthenDarkenColor = (color, amount) => {
    var usePound = false;

    if (color[0] == "#") {
    color = color.slice(1);
    usePound = true;
    }
    var num = parseInt(color, 16);
    
    var r = (num >> 16) + amount;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amount;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amount;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}