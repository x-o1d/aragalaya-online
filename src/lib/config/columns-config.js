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
export default [
    {
        title: [
            'දැන්වීම් පුවරුව', 
            'Bulletin board', 
            'அறிவிப்பு பலகை'
        ],
        icon: 'fa-solid fa-file-lines',
        height: '200px',
        type: 'bulletin',
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
                validate: (val) => {
                    return !val;
                }
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
            }
        },
        dataFormTitle: [
            'දැන්වීමක් ඇතුල් කරන්න',
            'Create a bulletin',
            'ஒரு புல்லட்டின் உருவாக்கவும்'
        ],
        submitButton: [
            'ඇතුල් කරන්න',
            'create',
            'உருவாக்க'
        ]
    },
    {
        title: [
            'මත විමසීම්', 
            'Polls', 
            'தேர்தல்கள்'
        ],
        icon: 'fa-solid fa-check-to-slot',
        height: '300px',
        type: 'poll'
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
            'පුවත් සහ සාකච්චා', 
            'News & discussions', 
            'செய்தி மற்றும் விவாதங்கள்'
        ],
        icon: 'fa-solid fa-radio',
        height: '310px',
        type: 'news'
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