# GitHub Copilot Context Instructions

This file contains context instructions for GitHub Copilot when working with this project.

## Project Structure

This is a Nuxt.js/Vue.js application with the following main structure:

- `components/`: Vue.js components organized by domain
  - `common/`: Shared components like Footer and Toolbar
  - `generic/`: Reusable components like Card, ComboBox, InputText, and Modal
  - `homePage/`: Home page specific components
- `composables/`: Vue.js composables for reusable logic
- `firebase/`: Firebase configuration
- `layouts/`: Application layouts
- `pages/`: Nuxt.js route pages
- `server/`: API and backend services
- `store/`: State management store
- `types/`: TypeScript type definitions
- `utils/`: Utility functions

## Development Guidelines

### Components
- Use TypeScript for all components
- Follow the composable pattern for reusable logic
- Keep components modular with single responsibility
- Use generic components from the `generic/` folder when possible

### API and Backend
- APIs are organized in controllers under `server/api/appController/`
- Follow RESTful pattern for endpoints
- Implement error handling using types defined in `types/error.ts`
- Use service layer for business logic

### State Management
- Use store for global state management
- Organize store by functional domains
- Define TypeScript interfaces for store state

### Code Conventions
- Use camelCase for variable and function names
- Use PascalCase for component names
- Document complex functions and components
- Add TypeScript types for all props and events

### Error Handling
- Use error handling system defined in `utils/handleResult.ts`
- Implement appropriate logging for errors
- Handle UI-level errors using the `error.vue` component

### Firebase
- Use Firebase configuration from `firebase/config.ts`
- Follow Firebase security best practices

### Testing
- Write tests for critical business logic
- Test reusable components
- Implement e2e tests for main flows

## Technical Notes

### Main Dependencies
- Nuxt.js
- Vue.js
- TypeScript
- Firebase
- PrimeVue (for UI components)

### Important Commands
- `npm run dev`: Start development environment
- `npm run build`: Build for production  

## Security
- Don't expose sensitive credentials in code
- Validate all user inputs
- Implement appropriate authentication and authorization

## Performance
- Optimize resource loading
- Implement lazy loading where appropriate
- Minimize unnecessary API calls

These instructions should be used as a reference to maintain consistency and code quality throughout the project.
