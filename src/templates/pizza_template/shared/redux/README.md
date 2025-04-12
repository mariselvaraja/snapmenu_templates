# Redux and Redux Saga Setup

This directory contains the Redux and Redux Saga setup for the application.

## Directory Structure

```
src/shared/
├── config/
│   └── endpoints.ts         # API endpoint configuration
├── redux/
│   ├── slices/              # Redux slices (reducers + actions)
│   │   ├── cartSlice.ts
│   │   ├── menuSlice.ts
│   │   └── siteContentSlice.ts
│   ├── sagas/               # Redux Sagas
│   │   ├── cartSaga.ts
│   │   ├── menuSaga.ts
│   │   └── siteContentSaga.ts
│   ├── rootReducer.ts       # Root reducer
│   ├── rootSaga.ts          # Root saga
│   ├── configureStore.ts    # Store configuration
│   ├── hooks.ts             # Custom hooks for Redux
│   └── index.ts             # Exports
├── services/                # API services
│   ├── api.ts               # Base API service
│   ├── cartService.ts       # Cart service
│   ├── menuService.ts       # Menu service
│   ├── siteContentService.ts # Site content service
│   └── index.ts             # Exports
└── index.ts                 # Exports
```

## Environment Configuration

The application uses environment variables for configuration. The following environment files are available:

- `.env.dev`: Development environment configuration
- `.env.test`: Test environment configuration
- `.env.production`: Production environment configuration

## Redux Setup

The Redux setup uses Redux Toolkit for creating slices and configuring the store. Each slice contains:

- State interface
- Initial state
- Reducers
- Actions

## Redux Saga Setup

Redux Saga is used for handling side effects. Each saga corresponds to a slice and handles:

- API calls
- Local storage operations
- Other side effects

## Services

The services directory contains API services for interacting with the backend. Each service corresponds to a slice and provides methods for:

- Fetching data
- Creating data
- Updating data
- Deleting data

## Usage

### Using Redux State

```tsx
import { useAppSelector } from '../shared/redux';

const MyComponent = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  
  return (
    <div>
      {cartItems.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

### Dispatching Actions

```tsx
import { useAppDispatch, addItem } from '../shared/redux';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  
  const handleAddToCart = (item) => {
    dispatch(addItem(item));
  };
  
  return (
    <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
  );
};
```

### Running with Different Environments

```bash
# Development
npm run dev

# Test
npm run dev:test

# Production
npm run dev:prod
```

### Building for Different Environments

```bash
# Development
npm run build:dev

# Test
npm run build:test

# Production
npm run build
```
