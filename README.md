# InvestLink Frontend

Welcome to the frontend repository of InvestLink, a stock management application. This frontend is built using [React](https://reactjs.org/) and [Redux](https://redux.js.org/) for state management.

## Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/jeffev/investlik_frontend
   cd investlink-frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the development server:**
   ```sh
   npm start
   ```

4. **Build the project for production:**
   ```sh
   npm run build
   ```

### Environment Variables

The following environment variables are used in the project:

- **REACT_APP_API_BASE_URL:** The base URL of the backend API.

Create a `.env` file in the root of the project and add the following:

   ```
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```

### Folder Structure

The project structure is as follows:

- **`public/`:** Contains the public assets of the application.
- **`src/`:** Contains the source code of the application.
   - **`assets/`:** Contains static assets like images, fonts, etc.
   - **`components/`:** Contains React components.
   - **`pages/`:** Contains the main pages of the application.
   - **`services/`:** Contains API service functions.

## Features

- **Dark and Light Theme:** Toggle between dark and light themes.
- **Save Layout:** Allows users to save the layout of the stocks and FII lists.
- **Filterable Lists:** Filter stocks and FIIs based on various criteria.
- **Favorites:** Add stocks and FIIs to a favorites list, with options to set target and ceiling prices that change color based on current prices.
- **Market Sentiment Analysis:** Planned feature to analyze market sentiment using machine learning on recent news.
- **ML-based Price Prediction:** Planned feature to display if an stocks is cheap, expensive, or neutral based on a machine learning model.