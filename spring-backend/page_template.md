# Page Template — Reusable React Components

A breakdown of the wireframe layout into small, reusable React components.  
Stack: **React + CSS Variables** (no external UI library required).

---

## Component Tree

```
<AppLayout>
  ├── <Header>
  │     ├── <AppLogo />
  │     ├── <SubMenuBar>
  │     │     └── <SubMenuTab /> × N
  │     └── <KebabMenu />
  ├── <div class="body-wrapper">
  │     ├── <Sidebar>
  │     │     └── <SidebarItem /> × N
  │     └── <MainContent />
  └── <Footer />
</AppLayout>
```

---

## 1. Design Tokens — `tokens.css`

Global CSS variables shared across all components.

```css
/* tokens.css */
:root {
  /* Colors */
  --color-bg:          #1a1d23;
  --color-surface:     #22262f;
  --color-surface-alt: #2a2f3b;
  --color-border:      #333846;
  --color-accent:      #4f8ef7;
  --color-accent-soft: rgba(79, 142, 247, 0.15);
  --color-text:        #e2e6f0;
  --color-text-muted:  #7a8299;
  --color-hover:       rgba(255, 255, 255, 0.05);
  --color-active:      rgba(79, 142, 247, 0.18);

  /* Spacing */
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  32px;

  /* Sizing */
  --header-height:  64px;
  --sidebar-width:  220px;
  --footer-height:  48px;
  --radius-sm:      6px;
  --radius-md:      10px;

  /* Typography */
  --font-sans: 'DM Sans', sans-serif;
  --font-size-sm:   13px;
  --font-size-base: 14px;
  --font-size-lg:   16px;
}
```

---

## 2. `AppLogo` Component

Displays the brand image / logo in the top-left of the header.

```jsx
// components/AppLogo.jsx
import React from 'react';

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: '0 var(--space-md)',
    minWidth: 'var(--sidebar-width)',
    height: '100%',
    borderRight: '1px solid var(--color-border)',
  },
  img: {
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-sm)',
    objectFit: 'cover',
    background: 'var(--color-surface-alt)',
  },
  name: {
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--font-size-lg)',
    fontWeight: 700,
    color: 'var(--color-text)',
    whiteSpace: 'nowrap',
  },
};

/**
 * AppLogo
 * @param {string} src   - Logo image URL (optional)
 * @param {string} name  - App / brand name
 */
export default function AppLogo({ src, name = 'App Name' }) {
  return (
    <div style={styles.wrapper}>
      {src
        ? <img src={src} alt={name} style={styles.img} />
        : <div style={{ ...styles.img, display: 'grid', placeItems: 'center' }}>🖼</div>
      }
      <span style={styles.name}>{name}</span>
    </div>
  );
}
```

---

## 3. `SubMenuTab` Component

A single clickable tab in the top sub-menu bar.

```jsx
// components/SubMenuTab.jsx
import React from 'react';

const base = {
  padding: '0 var(--space-lg)',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--font-size-base)',
  fontWeight: 500,
  color: 'var(--color-text-muted)',
  cursor: 'pointer',
  borderBottom: '2px solid transparent',
  transition: 'color 0.18s, border-color 0.18s, background 0.18s',
  whiteSpace: 'nowrap',
  userSelect: 'none',
};

const activeStyle = {
  color: 'var(--color-accent)',
  borderBottomColor: 'var(--color-accent)',
  background: 'var(--color-accent-soft)',
};

/**
 * SubMenuTab
 * @param {string}   label    - Tab label text
 * @param {boolean}  active   - Whether this tab is currently selected
 * @param {function} onClick  - Click handler
 */
export default function SubMenuTab({ label = 'Sub Menu', active = false, onClick }) {
  return (
    <div
      style={{ ...base, ...(active ? activeStyle : {}) }}
      onClick={onClick}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--color-text)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--color-text-muted)'; }}
      role="tab"
      aria-selected={active}
    >
      {label}
    </div>
  );
}
```

---

## 4. `SubMenuBar` Component

Renders a horizontal list of `SubMenuTab` items.

```jsx
// components/SubMenuBar.jsx
import React, { useState } from 'react';
import SubMenuTab from './SubMenuTab';

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'stretch',
    height: '100%',
    flex: 1,
    overflow: 'hidden',
  },
};

/**
 * SubMenuBar
 * @param {Array<{id, label}>} tabs         - Array of tab definitions
 * @param {string}             defaultTab   - ID of the initially active tab
 * @param {function}           onChange     - Called with the selected tab id
 */
export default function SubMenuBar({ tabs = [], defaultTab, onChange }) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);

  function handleClick(id) {
    setActive(id);
    onChange?.(id);
  }

  return (
    <div style={styles.wrapper} role="tablist">
      {tabs.map(tab => (
        <SubMenuTab
          key={tab.id}
          label={tab.label}
          active={active === tab.id}
          onClick={() => handleClick(tab.id)}
        />
      ))}
    </div>
  );
}
```

---

## 5. `KebabMenu` Component

Three-dot vertical menu button with a dropdown.

```jsx
// components/KebabMenu.jsx
import React, { useState, useRef, useEffect } from 'react';

const styles = {
  wrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  button: {
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    color: 'var(--color-text-muted)',
    margin: '0 var(--space-sm)',
    transition: 'background 0.15s',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: 'currentColor',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    right: 0,
    minWidth: 160,
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    zIndex: 100,
    overflow: 'hidden',
  },
  item: {
    padding: '10px var(--space-md)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text)',
    cursor: 'pointer',
    transition: 'background 0.12s',
  },
};

/**
 * KebabMenu
 * @param {Array<{label, onClick}>} items - Dropdown menu actions
 */
export default function KebabMenu({ items = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div style={styles.wrapper} ref={ref}>
      <button
        style={styles.button}
        onClick={() => setOpen(v => !v)}
        aria-label="More options"
        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-hover)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span style={styles.dot} />
        <span style={styles.dot} />
        <span style={styles.dot} />
      </button>

      {open && (
        <div style={styles.dropdown}>
          {items.map((item, i) => (
            <div
              key={i}
              style={styles.item}
              onClick={() => { item.onClick?.(); setOpen(false); }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 6. `Header` Component

Composes `AppLogo`, `SubMenuBar`, and `KebabMenu` into the top bar.

```jsx
// components/Header.jsx
import React from 'react';
import AppLogo    from './AppLogo';
import SubMenuBar from './SubMenuBar';
import KebabMenu  from './KebabMenu';

const styles = {
  header: {
    display: 'flex',
    alignItems: 'stretch',
    height: 'var(--header-height)',
    background: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
};

/**
 * Header
 * @param {string}             logoSrc       - Logo image URL
 * @param {string}             appName       - Brand name
 * @param {Array}              tabs          - SubMenuBar tab definitions
 * @param {string}             activeTab     - Currently active tab id
 * @param {function}           onTabChange   - Tab change handler
 * @param {Array}              kebabItems    - KebabMenu action items
 */
export default function Header({
  logoSrc, appName,
  tabs, onTabChange,
  kebabItems = [],
}) {
  return (
    <header style={styles.header}>
      <AppLogo src={logoSrc} name={appName} />
      <SubMenuBar tabs={tabs} onChange={onTabChange} />
      <KebabMenu items={kebabItems} />
    </header>
  );
}
```

---

## 7. `SidebarItem` Component

A single navigation item inside the sidebar.

```jsx
// components/SidebarItem.jsx
import React from 'react';

const base = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-sm)',
  padding: '10px var(--space-md)',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--font-size-base)',
  fontWeight: 500,
  color: 'var(--color-text-muted)',
  transition: 'background 0.15s, color 0.15s',
  userSelect: 'none',
};

const activeStyle = {
  color: 'var(--color-accent)',
  background: 'var(--color-active)',
};

const iconWrapper = {
  width: 32,
  height: 32,
  borderRadius: 'var(--radius-sm)',
  background: 'var(--color-surface-alt)',
  display: 'grid',
  placeItems: 'center',
  fontSize: 16,
  flexShrink: 0,
};

/**
 * SidebarItem
 * @param {ReactNode} icon    - Icon element or emoji
 * @param {string}    label   - Menu label
 * @param {boolean}   active  - Whether this item is selected
 * @param {function}  onClick - Click handler
 */
export default function SidebarItem({ icon = '👤', label = 'Menu', active = false, onClick }) {
  return (
    <div
      style={{ ...base, ...(active ? activeStyle : {}) }}
      onClick={onClick}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--color-hover)'; e.currentTarget.style.color = 'var(--color-text)'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; } }}
      role="button"
      aria-current={active ? 'page' : undefined}
    >
      <div style={iconWrapper}>{icon}</div>
      <span>{label}</span>
    </div>
  );
}
```

---

## 8. `Sidebar` Component

Left navigation panel rendering a list of `SidebarItem` elements.

```jsx
// components/Sidebar.jsx
import React, { useState } from 'react';
import SidebarItem from './SidebarItem';

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    minWidth: 'var(--sidebar-width)',
    background: 'var(--color-surface)',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    padding: 'var(--space-md) var(--space-sm)',
    gap: 'var(--space-xs)',
    overflowY: 'auto',
  },
};

/**
 * Sidebar
 * @param {Array<{id, icon, label}>} items       - Menu items to render
 * @param {string}                   defaultItem - ID of the initially active item
 * @param {function}                 onChange    - Called with selected item id
 */
export default function Sidebar({ items = [], defaultItem, onChange }) {
  const [active, setActive] = useState(defaultItem ?? items[0]?.id);

  function handleClick(id) {
    setActive(id);
    onChange?.(id);
  }

  return (
    <nav style={styles.sidebar} aria-label="Main navigation">
      {items.map(item => (
        <SidebarItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          active={active === item.id}
          onClick={() => handleClick(item.id)}
        />
      ))}
    </nav>
  );
}
```

---

## 9. `MainContent` Component

The primary content area that fills the remaining space.

```jsx
// components/MainContent.jsx
import React from 'react';

const styles = {
  main: {
    flex: 1,
    overflow: 'auto',
    padding: 'var(--space-xl)',
    background: 'var(--color-bg)',
    display: 'flex',
    flexDirection: 'column',
  },
  placeholder: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-text-muted)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--font-size-lg)',
    border: '2px dashed var(--color-border)',
    borderRadius: 'var(--radius-md)',
    minHeight: 200,
  },
};

/**
 * MainContent
 * @param {ReactNode} children     - Page content to render
 * @param {string}    placeholder  - Placeholder text when no children
 */
export default function MainContent({ children, placeholder = 'Load Data / Contents' }) {
  return (
    <main style={styles.main}>
      {children ?? <div style={styles.placeholder}>{placeholder}</div>}
    </main>
  );
}
```

---

## 10. `Footer` Component

Fixed bottom bar with optional content.

```jsx
// components/Footer.jsx
import React from 'react';

const styles = {
  footer: {
    height: 'var(--footer-height)',
    background: 'var(--color-surface)',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 var(--space-xl)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-muted)',
    flexShrink: 0,
  },
};

/**
 * Footer
 * @param {ReactNode} children - Custom footer content
 */
export default function Footer({ children }) {
  return (
    <footer style={styles.footer}>
      {children ?? <span>© {new Date().getFullYear()} Your Company</span>}
    </footer>
  );
}
```

---

## 11. `AppLayout` Component

Root layout shell — assembles every component above.

```jsx
// components/AppLayout.jsx
import React from 'react';
import Header      from './Header';
import Sidebar     from './Sidebar';
import MainContent from './MainContent';
import Footer      from './Footer';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: 'var(--color-bg)',
    overflow: 'hidden',
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
};

/**
 * AppLayout — root page shell
 *
 * @param {string}   appName      - Brand / app name shown in header
 * @param {string}   logoSrc      - Logo image URL
 * @param {Array}    subTabs      - [{id, label}] for SubMenuBar
 * @param {function} onTabChange  - Tab selection handler
 * @param {Array}    sidebarItems - [{id, icon, label}] for Sidebar
 * @param {function} onMenuChange - Sidebar item selection handler
 * @param {Array}    kebabItems   - [{label, onClick}] for KebabMenu
 * @param {ReactNode} children   - Main content
 * @param {ReactNode} footer     - Custom footer content
 */
export default function AppLayout({
  appName = 'My App',
  logoSrc,
  subTabs = [],
  onTabChange,
  sidebarItems = [],
  onMenuChange,
  kebabItems = [],
  children,
  footer,
}) {
  return (
    <div style={styles.root}>
      <Header
        appName={appName}
        logoSrc={logoSrc}
        tabs={subTabs}
        onTabChange={onTabChange}
        kebabItems={kebabItems}
      />
      <div style={styles.body}>
        <Sidebar items={sidebarItems} onChange={onMenuChange} />
        <MainContent>{children}</MainContent>
      </div>
      <Footer>{footer}</Footer>
    </div>
  );
}
```

---

## 12. Usage Example — `App.jsx`

Wire everything together in your entry point.

```jsx
// App.jsx
import React, { useState } from 'react';
import './tokens.css';          // <-- import design tokens
import AppLayout from './components/AppLayout';

const SUB_TABS = [
  { id: 'overview',  label: 'Overview'  },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings',  label: 'Settings'  },
];

const SIDEBAR_ITEMS = [
  { id: 'dashboard',  icon: '🏠', label: 'Dashboard'  },
  { id: 'users',      icon: '👥', label: 'Users'       },
  { id: 'orders',     icon: '📦', label: 'Orders'      },
  { id: 'products',   icon: '🛍️', label: 'Products'    },
  { id: 'reports',    icon: '📊', label: 'Reports'     },
  { id: 'messages',   icon: '💬', label: 'Messages'    },
  { id: 'calendar',   icon: '📅', label: 'Calendar'    },
  { id: 'settings',   icon: '⚙️', label: 'Settings'    },
];

const KEBAB_ITEMS = [
  { label: 'Profile',       onClick: () => console.log('Profile') },
  { label: 'Notifications', onClick: () => console.log('Notifications') },
  { label: 'Log out',       onClick: () => console.log('Logout') },
];

export default function App() {
  const [activeTab,  setActiveTab]  = useState(SUB_TABS[0].id);
  const [activeMenu, setActiveMenu] = useState(SIDEBAR_ITEMS[0].id);

  return (
    <AppLayout
      appName="My Dashboard"
      subTabs={SUB_TABS}
      onTabChange={setActiveTab}
      sidebarItems={SIDEBAR_ITEMS}
      onMenuChange={setActiveMenu}
      kebabItems={KEBAB_ITEMS}
    >
      {/* Render page content based on active state */}
      <div>
        <h2 style={{ color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}>
          {SIDEBAR_ITEMS.find(i => i.id === activeMenu)?.label} — {activeTab}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>
          Your content loads here.
        </p>
      </div>
    </AppLayout>
  );
}
```

---

## File Structure

```
src/
├── tokens.css
├── App.jsx
└── components/
    ├── AppLogo.jsx
    ├── SubMenuTab.jsx
    ├── SubMenuBar.jsx
    ├── KebabMenu.jsx
    ├── Header.jsx
    ├── SidebarItem.jsx
    ├── Sidebar.jsx
    ├── MainContent.jsx
    ├── Footer.jsx
    └── AppLayout.jsx
```

---

## Component Summary

| Component      | Responsibility                          | Reusable? |
|----------------|-----------------------------------------|-----------|
| `AppLogo`      | Logo image + app name                   | ✅ Yes    |
| `SubMenuTab`   | Single clickable tab                    | ✅ Yes    |
| `SubMenuBar`   | Tab group with active state             | ✅ Yes    |
| `KebabMenu`    | Three-dot menu with dropdown            | ✅ Yes    |
| `Header`       | Top bar composing logo + tabs + kebab   | ✅ Yes    |
| `SidebarItem`  | Single nav item with icon + label       | ✅ Yes    |
| `Sidebar`      | Left nav panel with item list           | ✅ Yes    |
| `MainContent`  | Scrollable content area                 | ✅ Yes    |
| `Footer`       | Bottom status / info bar                | ✅ Yes    |
| `AppLayout`    | Full-page shell combining all of above  | ✅ Yes    |