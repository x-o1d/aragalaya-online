// title: is an array containing the title of the column in all three languages
// icon: a string with icon classnames 
//   you can select any free icon from from https://fontawesome.com/
// height: ** will be removed, the component will determine it's height
// type: a unique string that represents the content of the column.
//   this is used by api calls to fetch and add data to the database for the column.
//   all post data is in a database collection called 'posts', the type field 
//   differentiates a particular column's data.
// data: schema of the data for this particular component
// createdOn, createdBy and createdByName is added to each data automatically
////////////////////
//   NOTE:: the actual component that's rendered in the column
//   has to be specified in:
//   1) src/routes/index.svelte COMPONENTS object 
//   specifying it here causes some cyclic reference issues and messes up SSR
//   we should see if there's a better solution.
//   https://github.com/sveltejs/svelte/issues/6702
///////////////////
export const COLUMNS = [
    {
        // START - column properties
        title: [
            'පුවත්', 
            'News', 
            'செய்தி'
        ],
        icon: 'fa-solid fa-radio',
        height: '200px',
        type: 'news',
        verified: true,
        tags: ['mainstream', 'aragala', 'economy', 'political', 'legal',
                    'international', 'energy', 'downloads', 'religion',
                    'agriculture', 'elections', 'education'],
        // END - column properties
        // START - input form field properties
        data: {
            title: {
                type: 'text',
                maxlength: 100,
                placeholder: [
                    'ශීර්ෂය',
                    'title',
                    'தலைப்பு'
                ],
                required: true,
                translate: true,
            },
            description: {
                type: 'html',
                maxlength: 100,
                placeholder: [
                    'සවිස්තරාත්මක දැන්වීම ',
                    'details',
                    'விவரங்கள்'
                ],
                required: true,
                translate: true,
            }
        },
        // END - input form field properties
        // START - input form properties
        dataFormTitle: [
            'පුවතක් ඇතුල් කරන්න',
            'Create a news article',
            'ஒரு செய்தி கட்டுரையை உருவாக்கவும்'
        ],
        submitButton: [
            'ඇතුල් කරන්න',
            'create',
            'உருவாக்க'
        ],
        cancelButton: [
            'අවලංගු කරන්න',
            'cancel',
            'ரத்து செய்'
        ],
        // END - input form properties
    },
    {
        title: [
            'සාකච්ඡා', 
            'Discussions', 
            'விவாதங்கள்'
        ],
        icon: 'fa-solid fa-comments',
        height: '310px',
        type: 'video',
        verified: true,
        tags: ['economy', 'political', 'legal', 'international', 'energy', 
                    'philosophy', 'english', 'discussion',  'religion',
                    'agriculture', 'elections', 'education'],
        // START - input form field properties
        data: {
            youtubeURL: {
                type: 'text',
                maxlength: 100,
                placeholder: [
                    'https://www.youtube.com/watch?v=ueYFyWW8e5I',
                    'https://www.youtube.com/watch?v=ueYFyWW8e5I',
                    'https://www.youtube.com/watch?v=ueYFyWW8e5I'
                ],
                required: true,
                editable: false,
                validate: (val) => { // mock custom validation function
                    var videoIdRegexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
                    let result = videoIdRegexp.exec(val);
                    return !result[1];
                },
                process: (val, data) => { // mock post process function
                    var videoIdRegexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
                    let result = videoIdRegexp.exec(val);
                    data.youtubeURL_videoId = result[1];
                    return val;
                },
            },
            title: {
                type: 'text',
                maxlength: 300,
                placeholder: [
                    'මාතෘකාව',
                    'title',
                    'தலைப்பு'
                ],
                required: true,
                translate: true,
            },
            shortDescription: {
                type: 'text',
                maxlength: 300,
                placeholder: [
                    'කෙටි විස්තරය',
                    'short description',
                    'குறுகிய விளக்கம்'
                ],
                required: true,
                translate: true,
            }
        },
        // END - input form field properties
        // START - input form properties
        dataFormTitle: [
            'වීඩියෝවක් එක් කරන්න',
            'Add a video',
            'ஒரு வீடியோவைச் சேர்க்கவும்'
        ],
        submitButton: [
            'ඇතුල් කරන්න',
            'submit',
            'உருவாக்க'
        ],
        cancelButton: [
            'අවලංගු කරන්න',
            'cancel',
            'ரத்து செய்'
        ]
        // END - input form properties
    },
    {
        title: [
            'දැන්වීම්', 
            'Notices', 
            'அறிவிப்புகள்'
        ],
        icon: 'fa-solid fa-calendar-days',
        height: '300px',
        type: 'bulletin',
        verified: true,
        tags: ['mainstream', 'aragala', 'economy', 'political', 'legal',
                    'international', 'energy', 'downloads', 'religion',
                    'agriculture', 'elections', 'education'],
        // START - input form field properties
        data: {
            title: {
                type: 'text',
                maxlength: 100,
                placeholder: [
                    'ශීර්ෂය',
                    'title',
                    'தலைப்பு'
                ],
                required: true,
                translate: true,
            },
            description: {
                type: 'html',
                maxlength: 100,
                placeholder: [
                    'සවිස්තරාත්මක දැන්වීම ',
                    'details',
                    'விவரங்கள்'
                ],
                required: true,
                translate: true,
            }
        },
        // END - input form field properties
        // START - input form properties
        dataFormTitle: [
            'දැන්වීමක් ඇතුල් කරන්න',
            'Create a bulletin',
            'ஒரு புல்லட்டின் உருவாக்கவும்'
        ],
        submitButton: [
            'ඇතුල් කරන්න',
            'create',
            'உருவாக்க'
        ],
        cancelButton: [
            'අවලංගු කරන්න',
            'cancel',
            'ரத்து செய்'
        ],
        // END - input form properties
    },
    {
        title: [
            'මහජන අදහස් සඳහා යෝජනා', 
            'Proposals for public comments', 
            'பொது கருத்துகளுக்கான முன்மொழிவுகள்'
        ],
        icon: 'fa-solid fa-file-lines',
        height: '400px',
        type: 'proposal',
        verified: true,
        tags: ['mainstream', 'aragala', 'economy', 'political', 'legal',
                    'international', 'energy', 'downloads', 'religion',
                    'agriculture', 'elections', 'education'],
        // START - input form field properties
        data: {
            organization: {
                type: 'text',
                maxlength: 100,
                placeholder: [
                    'ආයතනය',
                    'organization',
                    'அமைப்பு'
                ],
                required: true,
                translate: true,
            },
            motive: {
                type: 'text',
                maxlength: 300,
                placeholder: [
                    'ආයතනයේ අරමුණ',
                    'organization\'s motive',
                    'அமைப்பின் நோக்கம்'
                ],
                required: true,
                translate: true,
            },
            proposal: {
                type: 'html',
                maxlength: 1000,
                placeholder: [
                    'සවිස්තරාත්මකව යෝජනාව',
                    'proposal in detail',
                    'விரிவான முன்மொழிவு'
                ],
                required: true,
                translate: true,
            }
        },
        // END - input form field properties
        // START - input form properties
        dataFormTitle: [
            'දැන්වීමක් ඇතුල් කරන්න',
            'Create a bulletin',
            'ஒரு புல்லட்டின் உருவாக்கவும்'
        ],
        submitButton: [
            'ඇතුල් කරන්න',
            'create',
            'உருவாக்க'
        ],
        cancelButton: [
            'අවලංගු කරන්න',
            'cancel',
            'ரத்து செய்'
        ],
        // END - input form properties
    },
    {
        title: [
            'මත විමසීම්',
            'Opinion polls',
            'கருத்துக் கணிப்புகள்'
        ],
        icon: 'fa-solid fa-check-to-slot',
        height: '500px',
        type: 'static',
        static: [{
            type: 'wip',
            service: [
                `ඡන්ද විමසීම් මගින් ඕනෑම කෙනෙකුට පොදු මත විමසුමක් නිර්මාණය කිරීමට සහ මිනිසුන්ට ඒ සඳහා ඡන්දය ප්‍රකාශ කිරීමට ඉඩ ලබා දේ. අරගලයේ දිශානතිය ගැන ප්‍රජාතන්ත්‍රවාදීව තීරණ ගැනීමට මෙය යොදාගත හැක.`,
                `polls will allow anyone to create a public poll and allow anyone to create and vote for suggestions. this can be used to make democratic decisions about the direction of aragalaya.`,
                `வாக்கெடுப்புகள் யாரையும் பொது வாக்கெடுப்பை உருவாக்க அனுமதிக்கும் மற்றும் மக்கள் அதற்கு வாக்களிக்க அனுமதிக்கும். அரகலயாவின் திசையைப் பற்றி ஜனநாயக முடிவுகளை எடுக்க இதைப் பயன்படுத்தலாம்.`
            ],
            releaseDate: '29/08/2022'
        }]
    },
    {
        title: [
            'සාමුහික ලේඛන',
            'Collaborative documents',
            'கூட்டு ஆவணங்கள்'
        ],
        icon: 'fa-solid fa-file-signature',
        height: '500px',
        type: 'static',
        static: [{
            type: 'wip',
            service: [
                `මෙම සේවාව මගින් සාමුහිකව ලේඛන නිර්මාණය කල හැකි අතර, එහිදී ඇතිවන ගැටුම් චන්දයක් මගින් විසඳීමට ඉඩ සලසයි. මෙය අරගල ප්‍රඥප්තියක් නිර්මාණය කිරීමට හා නව ව්‍යවස්ථාවක් පවා ප්‍රජාතන්ත්‍රවාදිව නිර්මාණය කිරීමට භාවිතා කල හැක.`,
                `this service will allow to create collaborative documents with conflicts resolved through voting. this can be used to create an aragala manifesto, or even a new constitution.`,
                `இந்தச் சேவையானது வாக்குப்பதிவு மூலம் தீர்க்கப்படும் முரண்பாடுகளுடன் கூட்டு ஆவணங்களை உருவாக்க அனுமதிக்கும். அரகல பிரகடனத்தை அல்லது புதிய அரசியலமைப்பை உருவாக்க இதைப் பயன்படுத்தலாம்.`
            ],
            releaseDate: '29/09/2022'
        }]
    },
    {
        title: [
            'විවුර්ත අයවැය', 
            'Open budgets', 
            'திறந்த பட்ஜெட்'
        ],
        icon: 'fa-solid fa-coins',
        height: '410px',
        type: 'budget',
        type: 'static',
        static: [{
            type: 'wip',
            service: [
                `විනිවිද පෙනෙන අයවැය මඟින් ඕනෑම අරගලය ව්‍යාපෘතියක් සඳහා විවෘත අයවැයක් නිර්මාණය කිරීමට ඉඩ සැලසේ. පළමු පියවර ලෙස අපි aragalaya.online ව්‍යාපෘතිය සඳහා අයවැය නිර්මාණය කිරීම සඳහා මෙය භාවිතා කිරීමට සැලසුම් කරමු.`,
                `transparent budgets will allow to create open budgets for any of the aragalaya projects. as first step we're planning to use this for creating the budget for the aragalaya.online project.`,
                `வெளிப்படையான வரவுசெலவுத்திட்டங்கள் எந்தவொரு அரகலயா திட்டங்களுக்கும் திறந்த வரவு செலவுத் திட்டங்களை உருவாக்க அனுமதிக்கும். முதல் கட்டமாக அரகலயா.ஆன்லைன் திட்டத்திற்கான பட்ஜெட்டை உருவாக்க இதைப் பயன்படுத்த திட்டமிட்டுள்ளோம்.`
            ],
            releaseDate: '29/09/2022'
        }]
    },
    // {
    //     title: [
    //         'ගැලරිය', 
    //         'Gallery', 
    //         'கேலரி'
    //     ],
    //     icon: 'fa-solid fa-camera-retro',
    //     height: '290px',
    //     type: 'photo'
    // }
];

export const COLUMN_COUNT = COLUMNS.length;