import tinycolor from "tinycolor2";

// Define your themes
export const themes = {
    default: '#333333',
    green: '#001000',
    blue: '#00051a',
    yellow: '#402800',
    red: '#330606',
    pink: '#2c0519',
    brown: '#230f07',
    purple: '#290029',
};

// Function to generate shades of a color
export const generateShades = (color, count) => {
    const shades = [];
    for (let i = 1; i <= count; i++) {
        const shade = tinycolor(color).lighten(i * 10).toString();
        shades.push(shade);
    }
    return shades;
};
