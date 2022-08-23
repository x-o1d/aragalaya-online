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
    ],
    downloads: [
        'බාගත කිරීම්',
        'downloads',
        'பதிவிறக்கங்கள்'
    ],
    religion: [
        'ආගම',
        'religion',
        'மதம்'
    ],
    agriculture: [
        'කෘෂිකර්මය',
        'agriculture',
        'வேளாண்மை'
    ],
    elections: [
        'මැතිවරණ',
        'elections',
        'தேர்தல்கள்'
    ],
    education: [
        'අධ්‍යාපන',
        'education',
        'கல்வி'
    ]
};

const colors = chroma.scale(['#c1f437', '#00e0ff', '#ff6161', '#ffca99', '#ff58d3'])
    .colors(Object.keys(tagConfig).length);

export const TAGS = Object.keys(tagConfig).reduce((object, key, _i) => { 
    object[key] = {
        name: key,
        strings: tagConfig[key],
        color: chroma(colors[_i]).luminance(0.4).hex()
    }
    return object;
}, {});
