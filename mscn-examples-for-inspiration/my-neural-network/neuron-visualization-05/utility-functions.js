// Utility functions
function random(min, max) {
    return Math.random() * (max - min) + min;
}

function getColorFromXY(x, y) {
    let hue = Math.atan2(y, x) / (2 * Math.PI);
    let saturation = 1.0;
    let lightness = 0.5;
    let rgb = HslToRgb(hue, saturation, lightness);
    //return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    return rgb;
}

function getRandomColorRGB(min, max) {
    let r = Math.floor(random(min, max));
    let g = Math.floor(random(min, max));
    let b = Math.floor(random(min, max));
    return {r: r, g: g, b: b};
}

function getRandomColorHSL() {
    let h = Math.floor(Math.random() * 360);
    let s = Math.floor(Math.random() * 100);
    let l = Math.floor(Math.random() * 100);
    return {h: h, s: s, l: l};
}

function RgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; 
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

function HslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = HueToRgb(p, q, h + 1 / 3);
        g = HueToRgb(p, q, h);
        b = HueToRgb(p, q, h - 1 / 3);
    }

    return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
}

function HueToRgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}