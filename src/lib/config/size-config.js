// layout header height
const layoutHeaderHeight = 50

// width of a column in the layout in a desktop browser
// in mobile it would revert to 100% viewport width
const columnWidth = 500;

// column header height
const columnHeaderHeight = 50;

// separation of the cards in columns:
// this property sets the perceived separation of cards in the column layout
// in a desktop browser in pixels.
// NOTE:: in a mobile browser it should be half because only a single
// column is visible
const cardSeparation = 12;

// padding inside a card
const cardPadding = 10;

// previewHeight
const previewHeight = 250;

export const _getSizeConfig = () => {
    
    // NOTE:: make sure _getSizeConfig is called from inside an onMount() hook
    // window isn't available for SSR
    let devicePixelRatio = window? window.devicePixelRatio: 1;

    // these parameters are automatically added as css variables in __layout.svelte
    // ex: --config-layoutheaderheight
    return {
        layoutHeaderHeight: layoutHeaderHeight/devicePixelRatio,
        columnWidth: columnWidth/devicePixelRatio,
        columnHeaderHeight: columnHeaderHeight/devicePixelRatio,
        cardSeparation: cardSeparation/devicePixelRatio,
        // card seperation half is added because it is typically used as a padding
        // to achieve the specified card seperation
        cardSeparationHalf: cardSeparation/2/devicePixelRatio,
        cardPadding: cardPadding/devicePixelRatio,
        previewHeight: previewHeight/devicePixelRatio,
    }
}