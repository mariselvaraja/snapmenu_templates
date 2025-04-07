# System Patterns

## System Architecture
The Snapmenu templates follow a component-based architecture, using React for the frontend. The project now includes a unified routing system that integrates all template routes.

### Common Components
- **Layout Components:** Components responsible for structuring the overall page layout (e.g., header, footer, navigation).
- **Page Components:** Components representing different pages of the application (e.g., Home, Menu, Contact).
- **UI Components:** Reusable UI elements (e.g., buttons, icons, forms, modals).
- **Context Providers:** Components that manage and provide application-wide state (e.g., CartContext, MenuContext).

### Design Patterns
- **Component Composition:** Building complex UIs by composing smaller, reusable components.
- **Context API:** Using React's Context API for state management.
- **Redux:** Some templates (like the pizza template) use Redux for state management.
- **Responsive Design:** Templates implement responsive design principles to adapt to different screen sizes.
- **Data Fetching:** Templates fetch data from JSON files or APIs.

### Routing System
The project now implements a unified routing system that integrates all template routes:

- **Namespaced Routes:** Each template's routes are prefixed with a unique namespace (e.g., `/casual-dining`, `/culinary-journey`, `/pizza`) to avoid conflicts.
- **Template Selection:** The root route (`/`) displays a template selection page that allows users to choose which template to view.
- **Context Preservation:** Each template's routes are wrapped in their respective context providers to preserve functionality.
- **State Management:** Templates with Redux state management have their components wrapped in Redux Providers.
- **Nested Routes:** More complex templates use nested routes for features like admin sections.
- **Wildcard Routes:** Templates with their own router setup use wildcard routes with nested Routes components.
- **Route Extraction:** Routes are extracted into separate files (e.g., `route.jsx`) for better organization and maintainability.

## Component Relationships
- Page components use layout components to structure the page.
- Page components and UI components consume data from context providers.
- UI components are used within page components and layout components.
- The Router component orchestrates the routing between different templates and their pages.

## Further Analysis
Further analysis is needed to confirm these patterns and identify template-specific patterns. The unified routing system will need to be tested to ensure all template routes work correctly.
