import chroma from "chroma-js";

const tagConfig = {
    mainstream: [
        'ප්‍රධාන ධාරාවේ පුවත්',
        'mainstream news',
        'முக்கிய செய்தி'
    ],
    aragala: [
        'අරගල පුවත්',
        'aragala news',
        'அரகல செய்தி'
    ],
    economy: [
        'ආර්ථික',
        'economy',
        'பொருளாதாரம்'
    ],
    political: [
        'දේශපාලන',
        'political',
        'அரசியல்'
    ],
    legal: [
        'අධිකරණ',
        'judicial',
        'நீதித்துறை'
    ],
    international: [
        'ජාත්‍යන්තර',
        'international',
        'சர்வதேச'
    ],
    energy: [
        'බලශක්ති',
        'power & energy',
        'ஆற்றல்'
    ],
    philosophy: [
        'දර්ශනය',
        'philosophy',
        'தத்துவம்'
    ],
    english: [
        'ඉංග්‍රීසි',
        'english',
        'ஆங்கிலம்'
    ],
    discussion: [
        'සාකච්ඡා',
        'discussion',
        'விவாதம்'
    ]
};

const colors = chroma.scale(['#6f3dc0', '#d22fa4', '#ff4d7e', '#ff875d', '#ffc152', '#f9f871'])
    .colors(Object.keys(tagConfig).length);

export const TAGS = Object.keys(tagConfig).reduce((object, key, _i) => { 
    object[key] = {
        name: key,
        strings: tagConfig[key],
        color: chroma(colors[_i]).luminance(0.4).hex()
    }
    return object;
}, {});
