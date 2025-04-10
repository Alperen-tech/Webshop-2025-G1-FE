# FRONTEND ÖVERLÄMNING

> This is a fork of [Original Github Repository](https://github.com/Nackademin-BE-1-Admin/Webshop-2025-G1-FE)  
>
> [Current Github Repository](https://github.com/Alperen-tech/Webshop-2025-G1-FE)


## Code Structure

### API
In the `api.js` file, all API call functions are defined. Currently, there are 6 functions.

### General JavaScript
Each HTML file corresponds to its own `.js` file. Every JavaScript file uses `type="module"` to enable `import` and `export` functionality. 

- If a function is reused across different JavaScript files, it is placed in `functions.js` and exported.
- Other `.js` files import this shared functionality at the top of the document.

### Styling
All styling is handled in a single stylesheet, `style.css`. The styles are based on standard CSS, with classes and IDs used to avoid global styling conflicts.

## Setup and Installation

### Live Server
It's recommended to use **Live Server** to view local changes in real time. Install link: [Here](https://marketplace.visualstudio.com/items/?itemName=ritwickdey.LiveServer).

## Codelibrary & Technology
There is 1 font compiler: [Font Link](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css). It is used in HTML's.

##Improvment areas
- Alot of classes and ID's have confusing and overlapping names between sites. A naming "rule" would be good to apply.
- Aformentioned name problem exists for variables aswell. Rule would be good here aswell.
- Very little comments about the code. The code has very little comments that explains things. This might make it hard if you are not part of the creation of the code.
- More distinction between what an admin should see and the user.
- Changes between english and swedish in varying places. Choose one language and stick to it globally

## Help functions
### API - api.js
- **getBaseUrl**: Used to receieve the URL of the API. If API domain changes this needs to change aswell.
- **fetchProducts**: Fetches all products from the API.
- **addProducts**: Adds products to the API.
- **getCategories**: Fetches all categories from the API.
- **buyItems**: "Buys" items by using their ID to place an order on the API.
- **updateProduct**: Edits a pre-existing product.
- **checkAdmin**: Checks if user is admin. Returns true of user is admin, false if user is not admin.
### Other global functions - functions.js
- **updateLoginLink** If logged in, log in text gets switched with log out. Makes it possible to log out on different sites.
- **cartBalanceUpdate** Updates the cart on header to show current value of items in users cart.

