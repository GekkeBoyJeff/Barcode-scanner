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

## User feedback on scan

![](week3errorMessage.png)

While scanning a product I often got an empty result screen because the API could not find a product. To fix this I used the status-verbose code I received upon making a fetch and added that to my if-else in my then statement.

```JS
.then((data) => {
            if (data.status_verbose == "product not found" || data.status_verbose == "no code or invalid code") {
                console.log('product not found')
                navigator.vibrate(1000);
                window.location.hash = `#search`;
                errorPopup.classList.add('active')
                setTimeout(() => {
                    errorPopup.classList.remove('active');
                }, 2000);
  
                return;            
                } else {
                errorPopup.classList.remove('active');
```

(As you can see in the code above I also added vibration for mobile users.)
So errorPopup gets a class called active. 

When the class active has been assigned, the position changes from out of view to the top of the screen. This message states that the product could not be found, thus giving feedback to the user

```CSS
header div:nth-of-type(2) {
    position: absolute;
    top: 0;
    left: 50%;
    width: auto;
    height: 2em;
    padding: 1em;
    align-items: center;
    justify-content: center;
    transform: translate(-40%, -150%);
}
  
header div:nth-of-type(2) p {
    color: var(--solid-accent-color);
    filter: hue-rotate(35deg) contrast(1.5);
    font-weight: 700;
}
  
header div:nth-of-type(2).active {
    transform: translate(-50%, 0%) scale(1.2);
    display: flex;
    box-shadow: 0 0 red;
}
  
body:has(div.active) header>*:not(div:last-of-type) {
    filter: opacity(.6);
}
```

## Added nutrition score
This is one of the few things I wanted to show on the detail page. I wanted to re-create the image they use to show the nutrition score in html and css. which wasn't hard luckily. The html was simple. I added a h3 element with 5 spans surrounded by a div to contain them.
```HTML
            <h3>Nutri-score</h3>
            <div>
                <span data-value="A">A</span>
                <span data-value="B">B</span>
                <span data-value="C">C</span>
                <span data-value="D">D</span>
                <span data-value="E">E</span>
            </div>
```

I added data values so I could easily add a class to the data value from the api. 
```JS
function nutritionScore(data) {
    let nutritionScore = data.product.nutriscore_grade;
    // convert nutrutionScore to uppercase
    nutritionScore = nutritionScore.toUpperCase();
    let nutriSpan = document.querySelector(`span[data-value="${nutritionScore}"]`);
    nutriSpan.classList.add('active');
}
```
I converted them to uppercase because the data often is in either lowercase or uppercase

I had to change the flex-direction because the other data went next to the div instead of under it.
I also added some normal styling and styling when one of them has a class.
```CSS
section#product {
    flex-direction: column;
}
  
section#product>div:first-of-type {
    margin-bottom: 1em;
    display: flex;
    width: fit-content;
    border-radius: .2em;
}
  
section#product>div:first-of-type span {
    font-weight: 700;
    padding: .2em;
    width: 1.2em;
    text-align: center;
}
  
section#product>div:first-of-type span:first-of-type {
    background: darkgreen;
    border-radius: .2em 0 0 .2em;
}
  
section#product>div:first-of-type span:nth-of-type(2) {
    background: green;
}
  
section#product>div:first-of-type span:nth-of-type(3) {
    background: #efd911;
}
  
section#product>div:first-of-type span:nth-of-type(4) {
    background: orange;
}
  
section#product>div:first-of-type span:last-of-type {
    background: red;
    border-radius: 0 .2em .2em 0;
}
  
section#product>h3:first-of-type {
    margin-top: 1.5em;
    width: 8em;
}
  
span.active {
    transform: scale(1.2);
    z-index: 1;
    border-radius: .2em;
}

section#product>div:first-of-type span:not(.active) {
    opacity: .6;
    filter: grayscale(.7);
}
```

As you can see I made the inactive spans transparent and added a filter on top of it to make the active one stand out more.

## Styling the ingredient list and more
At first the ingredients were simply printed to the HTML as you can see on the left image.

| Before                   | After                   |
| ------------------------ | ----------------------- |
| ![](w3ProductBefore.png) | ![](w3ProductAfter.png) |

On the right image you can see I adjusted the style a bit more by adding some colors and placing the items next to eachother.

```HTML
            <details open>
                <summary>
                    <h3>Ingredients</h3>
                </summary>
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </details>
```

The html was simple, I added a detail tag to make it foldable. the three empty list items are there for the loading state.

There were quite a few lines of CSS needed to make this possible. I hid the original summary list-style icon and placed the ::after on the right side with justify-content:space-between.
At first I wanted to do this with position absolute but this was way cleaner. I rotate the content of the psuedo after element when details is open.

```CSS
/* Ingredients */
summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

details {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
  
details[open]>summary::after {
    content: '^';
    transform: rotate(0deg);
}
  
details>summary::after {
    content: '^';
    transform: rotate(180deg);
    transition: .5s;
}
  
details:hover {
    cursor: pointer;
}

/* Ingredients styling */
  
details ul {
    cursor: auto;
    display: flex;
    gap: .5em;
    flex-wrap: wrap;
    margin-top: 1em;
}
  
details ul li {
    background: var(--solid-accent-color);
    padding: .2em .6em;
    border-radius: .2em;
    color: #fff;
    height: 1.35em;
    min-width: 2em;
}
  
details[open] {
    background: var(--blurred-bg-color);
    padding: 1em;
    border-radius: .4em;
}
```

Everything else is basic styling.

## Loading state
The users often had to wait for their data to be shown. I made a module with 2 functions which give every item a skeleton class (except a few for styling perposes) while it is loading. Once it's done loading I remove the skeleton class.

```JS
export function showLoadingState() {
    console.log('loading aan')
    let section = document.querySelector('section:nth-of-type(3)');
    section.querySelectorAll('*').forEach(function (element) {
        if((element.tagName !== 'SPAN' || !element.closest('div')) && element.tagName !== 'H3') {
            element.classList.add('skeleton');
        }
    });
}
  
export function hideLoadingState() {
    console.log('loading uit')
    let section = document.querySelector('section:nth-of-type(3)');
    section.querySelectorAll('*').forEach(function (element) {
        element.classList.remove('skeleton');
    });
}
```

I didn't want the div and h3 to get a loading state so I excluded them. They all use the same loading animation that's on the camera.

This is actually the final state of these state functions. at first I selected every object and added a class on them. but that looked like it could've been shorter so I looked up a way to make it shorter.