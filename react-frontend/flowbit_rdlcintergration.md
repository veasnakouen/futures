# Migrating to Flowbite React & Integrating RDLC Reports

Here is a complete guide on how to upgrade your current React app to use **Flowbite React** and how to bring your old ASP.NET Core MVC RDLC report viewer into the new frontend.

## Part 1: Adding Flowbite React

Flowbite is an excellent UI library built on top of Tailwind CSS. Since your React frontend uses Vite, here is how to install and configure it.

### 1. Install Dependencies
Stop your `npm run dev` server in the terminal and run:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install flowbite flowbite-react
```

### 2. Configure Tailwind
Open `tailwind.config.js` (create it if it doesn't exist) and add the Flowbite plugin:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}" // Add this!
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin') // Add this!
  ],
}
```

### 3. Import Tailwind in CSS
Replace the contents of `src/index.css` with the Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Now you can use Flowbite components in your React app!
```tsx
import { Button, Card } from 'flowbite-react';

// Example usage:
<Button color="blue">Click Me</Button>
```

---

## Part 2: Integrating ASP.NET Core MVC Reports

RDLC reports require a .NET backend to process the XML definition and generate the PDF or HTML. You cannot render `.rdlc` files natively in pure React. Because of this, you have two approaches to bring the reports into your new React app.

### Approach 1: The Iframe Strategy (Recommended & Fastest)
Since your old ASP.NET Core app (`future`) is still running alongside your Spring Boot and React apps, the easiest way to retain **100% of your old features** is to embed the old MVC report viewer directly into your React pages using an `iframe`.

**How to do it:**
In your `App.tsx` where we created the `ReportsPage`, replace the grid of cards with an `iframe` pointing to your ASP.NET Core application port (`5140` or `7140`).

```tsx
const ReportsPage = () => {
  // Point this to the actual URL of your MVC report viewer
  const reportUrl = "http://localhost:5140/ReportViewerEndpoint"; 

  return (
    <div style={{ height: 'calc(100vh - 4rem)', width: '100%' }}>
      <header className="header-row">
        <div>
          <h1 className="text-2xl font-bold">System Reports</h1>
          <p className="text-gray-500">Legacy RDLC Viewer</p>
        </div>
      </header>
      
      {/* Embed the ASP.NET Core App */}
      <iframe 
        src={reportUrl} 
        style={{ width: '100%', height: '100%', border: 'none', borderRadius: '0.5rem' }}
        title="RDLC Report Viewer"
      />
    </div>
  );
};
```

> [!TIP]
> **CORS & Frame Ancestors:** You may need to configure your ASP.NET Core app to allow being embedded in an iframe by adjusting the `X-Frame-Options` or `Content-Security-Policy` headers to allow `http://localhost:5173`.

### Approach 2: Using a Third-Party React Report Viewer
If your ASP.NET Core app was using a library like **BoldReports** or **FastReport**, you can install their React component wrappers into your frontend. 

For example, if using BoldReports:
1. Install the React viewer: `npm install @boldreports/react-reporting-components`
2. Configure your ASP.NET Core app to act as the Report API Endpoint.
3. Use the React component:

```tsx
import '@boldreports/javascript-reporting-controls/Scripts/bold.report-viewer.min';
import { BoldReportViewerComponent } from '@boldreports/react-reporting-components';

const ReportsPage = () => (
  <div style={{ height: '800px', width: '100%' }}>
    <BoldReportViewerComponent
      id="reportviewer_container"
      // The ASP.NET Core API Endpoint that processes the RDLC
      reportServiceUrl="http://localhost:5140/api/ReportViewer"
      reportPath="client_demographics.rdlc"
    />
  </div>
);
```

### Which should you choose?
* **Use Approach 1 (Iframe)** if you want to reuse exactly what you already have with zero rewrite of the backend C# reporting logic.
* **Use Approach 2 (React Component)** if your ASP.NET Core app exposes a dedicated Report API and you want the viewer controls to feel perfectly native within React.
