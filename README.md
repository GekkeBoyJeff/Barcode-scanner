# Barcode scanner
As a student following the Web Development minor I had to make a single page app that uses an API.
I chose to make a barcode scanner that uses the API from [Open Food Facts](https://world.openfoodfacts.org/).
The app is made with HTML, CSS and JS. 
By using the build-in camera of the device you can scan a barcode and get information about the product.
By using the API I can search for products by their barcode and get information about the product.


## Current Status

<a href="../../issues"> ![https://github.com/GekkeBoyJeff/Barcode-scanner/issues](https://img.shields.io/github/issues/GekkeBoyJeff/Barcode-scanner?style=for-the-badge) 
</a>
<a href="#"> ![](https://img.shields.io/badge/Not%20compatible%20with%20Firefox-red?style=for-the-badge) </a>
<a href="#"> ![](https://img.shields.io/badge/Not%20compatible%20with%20Safari-red?style=for-the-badge) </a>

## Made with

![Made with: HTML (shields.io)](https://img.shields.io/badge/Made%20with-HTML-orange?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSI0OHB4IiBoZWlnaHQ9IjQ4cHgiPjxwYXRoIGZpbGw9IiNFNjUxMDAiIGQ9Ik00MSw1SDdsMywzNGwxNCw0bDE0LTRMNDEsNUw0MSw1eiIvPjxwYXRoIGZpbGw9IiNGRjZEMDAiIGQ9Ik0yNCA4TDI0IDM5LjkgMzUuMiAzNi43IDM3LjcgOHoiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMjQsMjV2LTRoOC42bC0wLjcsMTEuNUwyNCwzNS4xdi00LjJsNC4xLTEuNGwwLjMtNC41SDI0eiBNMzIuOSwxN2wwLjMtNEgyNHY0SDMyLjl6Ii8+PHBhdGggZmlsbD0iI0VFRSIgZD0iTTI0LDMwLjl2NC4ybC03LjktMi42TDE1LjcsMjdoNGwwLjIsMi41TDI0LDMwLjl6IE0xOS4xLDE3SDI0di00aC05LjFsMC43LDEySDI0di00aC00LjZMMTkuMSwxN3oiLz48L3N2Zz4=)  ![Made with: CSS (shields.io)](https://img.shields.io/badge/Styled%20with-CSS-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSI0OHB4IiBoZWlnaHQ9IjQ4cHgiPjxwYXRoIGZpbGw9IiMwMjc3QkQiIGQ9Ik00MSw1SDdsMywzNGwxNCw0bDE0LTRMNDEsNUw0MSw1eiIvPjxwYXRoIGZpbGw9IiMwMzlCRTUiIGQ9Ik0yNCA4TDI0IDM5LjkgMzUuMiAzNi43IDM3LjcgOHoiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMzMuMSAxM0wyNCAxMyAyNCAxNyAyOC45IDE3IDI4LjYgMjEgMjQgMjEgMjQgMjUgMjguNCAyNSAyOC4xIDI5LjUgMjQgMzAuOSAyNCAzNS4xIDMxLjkgMzIuNSAzMi42IDIxIDMyLjYgMjF6Ii8+PHBhdGggZmlsbD0iI0VFRSIgZD0iTTI0LDEzdjRoLTguOWwtMC4zLTRIMjR6IE0xOS40LDIxbDAuMiw0SDI0di00SDE5LjR6IE0xOS44LDI3aC00bDAuMyw1LjVsNy45LDIuNnYtNC4ybC00LjEtMS40TDE5LjgsMjd6Ii8+PC9zdmc+)  ![Made with: JS (shields.io)](https://img.shields.io/badge/Coded%20with-JS-yellow?style=for-the-badge&logo=Javascript) 


## Feedback week 2

I had a lot of feedback this week. Instead of using buttons and giving them an eventListener I was told to use an a tag instead. I did not want to agree with it though. Since this is a one-page application and I only simulate new 'pages' by hiding sections I thought buttons would semanticly be better. 
However, I do agree that it looks horrible in the javascript file.
```JS

document.querySelector('section:first-of-type > button:first-of-type').addEventListener('click', () => { /* Go to profile page */
    window.location.hash = '#profile';
})

document.querySelector('section:first-of-type > button:last-of-type').addEventListener('click', () => { /* Go to scan page */
    window.location.hash = '#scan';
})

document.querySelector('footer > button:first-of-type').addEventListener('click', () => { /* Go to profile page */
    window.location.hash = '#home';
})

document.querySelector('footer > button:nth-of-type(2)').addEventListener('click', () => { /* Go to profile page */
    window.location.hash = '#scan';
})
document.querySelector('footer > button:last-of-type').addEventListener('click', () => { /* Go to profile page */
    window.location.hash = '#profile';
})
```

To remove this all I had to make a few adjustments. 

I had to swap my buttons to a elements as shown below (there are more but im showing this one as an example )
```HTML
            <a href="#profile">
                Profile
            </a>
            <a href="#search">
                Search
            </a>
```

I had to give my sections an id to make them targetable
```HTML
 <section id="search">
```

And I had to change my css styling for the buttons to my newly made 'a' elements.
I had to do it for the ones in the main section and footer
I also had to give my sections a default display of none. Once a section has been targeted by the 'a' element I tell it to show itself by giving it a display flex.

```CSS
footer>a {
    width: 33%;
    height: 10dvh;
}
  
footer>a:hover {
    box-shadow: 0 4px var(--accent-color);
    font-weight: bold;
    font-size: 1.05em;
}
section {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1em;
    overflow-y: scroll;
    display: none;
}
  
section:target {
    display: flex;
}

section>a,
section>button {
    flex: 1 1 10em;
    background: var(--accent-color);
    height: 3em;
    border-radius: .5em;
    color: var(--text-color);
}
```

By doing this I could delete one of the modules since I don't need to use the function I wrote anymore.

