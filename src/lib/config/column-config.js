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
//   has to be specified in the src/routes/index.svelte (line 20) COMPONENTS object 
//   specifying it here causes some cyclic reference issues and messes up SSR
//   we should see if there's a better solution.
//   https://github.com/sveltejs/svelte/issues/6702
///////////////////
export const COLUMNS = [
    {
        // START - column properties
        title: [
            'දැන්වීම් පුවරුව', 
            'Bulletin board', 
            'அறிவிப்பு பலகை'
        ],
        icon: 'fa-solid fa-file-lines',
        height: '200px',
        type: 'bulletin',
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
        // START - filter properties
        filter: {
            verified: true,
            tags: [{
                name: 'mainstream',
                strings: [
                    'ප්‍රධාන ධාරාවේ පුවත්',
                    'mainstream news',
                    'முக்கிய செய்தி'
                ],
                color: '#ffd492'
            },{
                name: 'aragala',
                strings: [
                    'අරගල පුවත්',
                    'aragala news',
                    'அரகல செய்தி'
                ],
                color: '#3cc1ff'
            },{
                name: 'economy',
                strings: [
                    'ආර්ථිකය',
                    'economy',
                    'பொருளாதாரம்'
                ],
                color: '#c57dff'
            }]
        }
        // END - filter properties
    },
    {
        title: [
            'පුවත් සහ සාකච්චා', 
            'News & discussions', 
            'செய்தி மற்றும் விவாதங்கள்'
        ],
        icon: 'fa-solid fa-radio',
        height: '310px',
        type: 'newsx',
        // START - input form field properties
        data: {
            videoId: {
                type: 'text',
                maxlength: 100,
                placeholder: [
                    'https://www.youtube.com/watch?v=ueYFyWW8e5I',
                    'https://www.youtube.com/watch?v=ueYFyWW8e5I',
                    'https://www.youtube.com/watch?v=ueYFyWW8e5I'
                ],
                required: true,
                validate: (val) => { // mock custom validation function
                    var videoIdRegexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
                    let result = videoIdRegexp.exec(val);
                    return !result[1];
                },
                process: (val) => { // mock post process function
                    var videoIdRegexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
                    let result = videoIdRegexp.exec(val);
                    
                    return result[1];
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
            'මත විමසීම්', 
            'Polls', 
            'தேர்தல்கள்'
        ],
        icon: 'fa-solid fa-check-to-slot',
        height: '300px',
        type: 'poll',
    },
    {
        title: [
            'මහජන අදහස් සඳහා යෝජනා', 
            'Proposals for public comments', 
            'பொது கருத்துகளுக்கான முன்மொழிவுகள்'
        ],
        icon: 'fa-solid fa-comments',
        height: '400px',
        type: 'proposal'
    },
    {
        title: [
            'සාමුහික ලේඛන',
            'Collaborative documents',
            'கூட்டு ஆவணங்கள்'
        ],
        icon: 'fa-solid fa-file-signature',
        height: '500px',
        type: ''
    },
    {
        title: [
            'විවුර්ත අයවැය', 
            'Open budgets', 
            'திறந்த பட்ஜெட்'
        ],
        icon: 'fa-solid fa-coins',
        height: '410px',
        type: 'budget'
    },
    {
        title: [
            'ගැලරිය', 
            'Gallery', 
            'கேலரி'
        ],
        icon: 'fa-solid fa-camera-retro',
        height: '290px',
        type: 'photo'
    }
];

export const COLUMN_COUNT = COLUMNS.length;