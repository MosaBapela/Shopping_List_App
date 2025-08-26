# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


## PLANNING OF THE PROJECT
# Moodboard
Color Palette:
=> Primary Color: #4CAF50 (Green)
=> Secondary Color: #FF9800 (Orange)
=> Background Color: #F5F5F5 (Light Gray)
=> Text Color: #212121 (Dark Gray)

Typography:
=> Headings: 'Roboto', sans-serif
=> Body: 'Arial', sans-serif
=> Component Layout:

Component Layout:
=> Header: Navigation bar with links to Home, Profile, and Login/Register.
=> Main Area: Display the shopping list, add item form, and filter buttons.
=> Footer: Basic information and links.

# Step-by-Step Planning
1. Feature Identification:
=> User authentication (login/register)
=> Shopping list management (add, remove, filter items)
=> Shareable lists

2. Task Breakdown:
=> Implement user authentication:
  * Create login and registration forms.
  * Set up Redux slices for authentication.
=> Implement shopping list features:
  * Create components for adding and displaying items.
  * Implement filtering functionality.
=> Implement sharing functionality:
  * Create a shareable link for lists.

3. Assign Responsibilities:
  * Frontend: Implement UI components and integrate with Redux.
  * Backend (if applicable): Set up API endpoints for user authentication and list management.

# Pseudocode
// User Authentication Flow
function login(username, password) {
    if (validateCredentials(username, password)) {
        store.user = fetchUserData(username);
        redirectToHomePage();
    } else {
        showError("Invalid credentials");
    }
}

function register(username, password) {
    if (isUsernameAvailable(username)) {
        createUser(username, password);
        redirectToLoginPage();
    } else {
        showError("Username already taken");
    }
}

// Shopping List Management
function addItem(item) {
    if (item.isValid()) {
        store.shoppingList.push(item);
        updateUI();
    } else {
        showError("Invalid item");
    }
}

function removeItem(itemId) {
    store.shoppingList = store.shoppingList.filter(item => item.id !== itemId);
    updateUI();
}

function filterItems(criteria) {
    return store.shoppingList.filter(item => item.matches(criteria));
}
