# A2_iOS_[YourFirstName]_[YourStudentID]

iOS Core Data Product Catalog — Lab Assignment 2
qqqqqq
---

## Project Setup Instructions

### 1. Create the Xcode Project

1. Open Xcode → **Create a new Xcode project**
2. Choose **App** under iOS
3. Fill in:
   - **Product Name:** `A2_iOS_firstName_studentID`
   - **Interface:** Storyboard *(we'll delete Main.storyboard)*
   - **Language:** Swift
   - **✅ Use Core Data:** **UNCHECK** (we manage Core Data programmatically)
4. Click **Next** → choose a location → **Create**

---

### 2. Add Source Files

Copy all `.swift` files from this folder into your Xcode project:

| File | Purpose |
|------|---------|
| `AppDelegate.swift` | App entry point, triggers data seeding |
| `SceneDelegate.swift` | Sets up the TabBarController programmatically |
| `CoreDataStack.swift` | Core Data persistent container (no .xcdatamodeld needed) |
| `Product.swift` | `NSManagedObject` subclass for the Product entity |
| `DataSeeder.swift` | Seeds 10 sample products on first launch |
| `BrowseViewController.swift` | Tab 1 — Browse with Prev / Next navigation |
| `ProductListViewController.swift` | Tab 2 — Full product list (name + description) |
| `ProductDetailViewController.swift` | Pushed detail view from list or search |
| `SearchViewController.swift` | Tab 3 — Search by name or description |
| `AddProductViewController.swift` | Tab 4 — Add new product form |

> **Replace** the existing `AppDelegate.swift` and `SceneDelegate.swift`
> with the ones provided here when prompted by Xcode.

---

### 3. Remove the Storyboard

1. Delete **Main.storyboard** from the project navigator (Move to Trash)
2. Open `Info.plist` → Find `UIMainStoryboardFile` → **Delete that row**
3. Also remove `NSStoryboardName` inside `Application Scene Manifest` →
   `Scene Configuration` → `Application Session Role` → `Item 0`

---

### 4. Build & Run

- Select any iPhone simulator (iOS 16+)
- Press **⌘R** to build and run
- The app auto-seeds 10 products on first launch

---

## App Features

| Feature | Location |
|---------|----------|
| Auto-display first product on launch | Browse tab |
| Navigate all products (Prev / Next) | Browse tab |
| View full product list (name + description) | Products tab |
| Tap product for full detail | Products & Search tabs |
| Search by name or description | Search tab |
| Add new product | Add tab |
| Core Data persistence | All tabs |

---

## Notes

- **No `.xcdatamodeld` file is required** — the Core Data model is built programmatically in `CoreDataStack.swift`
- Products are sorted by Product ID
- Adding a new product auto-assigns the next available ID
- All navigation is programmatic (no storyboard)