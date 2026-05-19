 Product Requirements Document (PRD)
Project Name: kitchenproduct

1. Project Overview
kitchenproduct is a modern multi-device E-commerce platform inspired by the shopping experience of Flipkart.
The platform will include:
Customer Website
Admin Panel
Merchant UPI Payment System
Product & Category Management
Order Management
Responsive UI for:
Desktop
Tablet
Android
iPhone/iPad
Backend will use:
Node.js
Supabase
Frontend recommendation:
React.js / Next.js
Tailwind CSS
PWA support
2. Main Goals
The platform must:
Work smoothly on all devices
Support unlimited product uploads
Handle all categories from admin panel
Support secure UPI payments
Support all UPI apps
Provide fast product browsing
Be scalable for future growth
Prevent payment fraud and fake orders
3. Technology Stack
Frontend
TechnologyPurposeReact.js / Next.jsUI DevelopmentTailwind CSSResponsive DesignRedux / ZustandState ManagementAxiosAPI CallsPWAMobile App-like Experience
Backend
TechnologyPurposeNode.jsBackend ServerExpress.jsREST APISupabase PostgreSQLDatabaseSupabase StorageProduct ImagesJWT AuthenticationLogin SecurityRedis (Optional)Caching
4. User Roles
4.1 Customer
Customer can:
Register/Login
Browse products
Search products
Filter products
Add to cart
Wishlist
Place orders
Pay with UPI
Track orders
Download invoice
4.2 Admin
Admin can:
Manage categories
Manage products
Upload unlimited images
Manage banners
Manage orders
Manage users
Manage inventory
View sales analytics
Manage coupons
Change UPI merchant details
Manage delivery charges
5. Responsive Design Requirements
Desktop
Full-width layout
Mega menu
Multiple banners
Grid product display
Tablet
Adaptive layout
Medium product cards
Touch-friendly UI
Mobile (Android & iOS)
Bottom navigation
Mobile search bar
Swipe banners
Fast loading
PWA install support
6. Homepage Features
Homepage includes:
Top banners
Categories slider
Featured products
Trending products
Flash sales
Offer section
Recommended products
Search bar
Cart icon
User account menu
7. Product Management
Admin Product Features
Admin can:
Add unlimited products
Upload unlimited product images
Add product videos
Add multiple variants
Add stock quantity
Add SKU
Add discount price
Add offer tags
Add SEO metadata
Product Fields
FieldTypeProduct NameTextSlugTextDescriptionRich TextCategoryDropdownBrandTextImagesMultiple UploadPriceNumberOffer PriceNumberStockNumberSKUTextWeightNumberUPI EligibleBoolean
8. Category Management
Admin can:
Create categories
Create subcategories
Upload category icons
Enable/disable categories
Reorder categories
Example:
Fashion
Electronics
Grocery
Mobiles
Beauty
Home Appliances
9. Search System
Features:
Instant search suggestions
Product filters
Category filter
Price filter
Brand filter
Rating filter
Trending search keywords
10. Shopping Cart System
Features:
Add/remove items
Quantity update
Save for later
Auto cart sync
Guest cart support
11. Order Management
Order Status
Pending
Paid
Processing
Shipped
Delivered
Cancelled
Refunded
Admin can:
Update order status
Print invoices
Generate reports
Export CSV
12. UPI Payment System Guidelines & Verification Flow
- Customer Clicks Pay Now → UPI Intent URL Open → Customer Selects GPay/PhonePe/Paytm → Payment Success → Return To Success Page → Admin Panel Verifies Payment
- Use HTTPS only for production domains to avoid security warnings.
- Use custom trusted domains rather than Vercel default subdomains to build credibility.
- UPI Payment URL Format: `upi://pay?pa=YOUR_UPI_ID&pn=YOUR_STORE_NAME&am=AMOUNT&cu=INR&tn=ORDER_ID`
- Node.js Payment Button Logic (Direct Redirect on User Click Trigger): `window.location.href = upiUrl` are used instead of iframe open requests. Strict click trigger is enforced to prevent browser blocks.
- Orders database schema: `id`, `customer_name`, `mobile`, `amount`, `payment_status`, `order_status`, `upi_ref`, `created_at`.
- Payment status flow: `PENDING` -> `SUCCESS` or `FAILED`.
- Best manual verification flow: Customer completes payment, manually returns to checkout, enters their 12-digit UTR (or uploads screenshot), and the transaction is securely marked as `processing` until the admin manually confirms the receipt of funds in the bank account via the Admin panel. Option 1 (Payment Gateway integration) is completely removed.
- Production environment configurations configured securely inside Vercel Environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `UPI_ID`, `STORE_NAME`.
- Frontend safe environment keys are strictly decoupled from sensitive `SUPABASE_SERVICE_ROLE_KEY` keys.
- Row Level Security (RLS) is enabled to protect order and user information database leaks.
- Mobile compatibility tested thoroughly across GPay, PhonePe, Paytm, and BHIM apps on Chrome Android and iPhone Safari.
Dynamic QR support
14. Admin Dashboard Features
Dashboard includes:
Total sales
Daily orders
Revenue analytics
User statistics
Best-selling products
Inventory alerts
Payment reports
15. Image Upload System
Requirements
Unlimited uploads
Drag & drop upload
Multiple image support
Image compression
WebP conversion
CDN delivery
Use:
Supabase Storage
Cloudflare CDN
16. Performance Requirements
Speed
Page load under 3 seconds
Optimized images
Lazy loading
API caching
Scalability
System should support:
100K+ products
10K+ daily users
High traffic sale events
17. SEO Requirements
Features:
SEO-friendly URLs
Meta tags
Sitemap.xml
Robots.txt
Structured schema
Product indexing
18. Notification System
Customer Notifications
Order placed
Payment success
Shipping updates
Delivery updates
Channels:
Email
SMS
Push notifications
19. Analytics & Reports
Admin can view:
Revenue reports
Product performance
User growth
Conversion rates
Payment analytics
20. Database Structure (High-Level)
Main Tables
users
products
categories
orders
order_items
payments
addresses
coupons
banners
reviews
wishlists
21. Recommended Folder Structure
project/ │ ├── client/ ├── admin/ ├── server/ │ ├── routes/ │ ├── controllers/ │ ├── middleware/ │ ├── services/ │ ├── utils/ │ └── uploads/ │ ├── database/ └── docs/
22. Deployment Requirements
Frontend
Deploy on:
Vercel
OR
Netlify
Backend
Deploy on:
Railway
OR
Render
Database
Use:
Supabase PostgreSQL
23. Future Features
Future upgrades:
Multi-vendor system
AI product recommendations
Voice search
Live shopping
Affiliate system
Wallet system
COD support
Subscription products
24. Final Requirements Summary
Must Have
✅ Responsive UI
✅ Admin panel
✅ Unlimited product uploads
✅ All category management
✅ Secure UPI payment support
✅ All UPI apps supported
✅ Fraud protection
✅ Mobile optimized
✅ Fast loading
✅ SEO optimized
✅ Secure backend
✅ Scalable architecture
25. Recommended Architecture Flow
User App ↓ Frontend (React/Next.js) ↓ Node.js API Server ↓ Supabase Database ↓ Payment Gateway ↓ UPI Apps
26. Security Checklist
SecurityStatusHTTPSRequiredJWT AuthRequiredRate LimitRequiredPayment VerificationRequiredWebhook ValidationRequiredAdmin RBACRequiredEncrypted TokensRequiredRLS PoliciesRequired
27. Success Criteria
Project will be successful if:
Website works on all devices
Payments are secure
Orders process correctly
Admin can fully manage store
Site handles large traffic
Product upload works smoothly
Users can pay using any UPI app
No fake payment confirmation occurs
[5/11/2026 11:06 AM] boos fr: E-Commerce Admin Dashboard Product Management Settings (PRD)
Product Management Module
Admin dashboard me product upload aur multiple product images handle karne ke liye niche diye gaye settings aur features banana chahiye.
28. Product Basic Information Settings
Product Details Form
Admin product add/edit karte time:
Product Name
Product Slug (Auto Generate)
Short Description
Full Description
Product SKU
Brand Name
Product Tags
Product Type
Physical
Digital
Product Status
Draft
Published
Hidden
Featured Product Toggle
New Arrival Toggle
Best Seller Toggle
29. Product Category Settings
Category Management
Admin panel se:
Main Category Create
Sub Category Create
Nested Category Support
Category Image Upload
Category SEO Meta
Product Category Assignment
Ek product ko:
Single Category
Multiple Categories
assign kar sake.
30. Product Pricing Settings
Pricing Fields
Regular Price
Sale Price
Discount Percentage
Cost Price
Tax Included Toggle
GST Percentage
Currency Selection
Advanced Pricing
Flash Sale Price
Bulk Price
Wholesale Price
Offer Start Date
Offer End Date
31. Product Inventory Settings
Stock Management
Stock Quantity
Unlimited Stock Toggle
Low Stock Alert
Out of Stock Visibility
Minimum Order Quantity
Maximum Order Quantity
SKU Settings
Auto SKU Generator
Manual SKU Support
Barcode Support
32. Product Image Upload Settings
Multiple Image Upload System
Admin ek product ke liye:
Unlimited Images Upload
Drag & Drop Upload
Multi Select Upload
Image Reorder
Image Delete
Image Replace
kar sake.
Product Image Features
Supported Formats
JPG
PNG
WEBP
Upload Limits
Max Image Size
5MB
10MB configurable
Max Number of Images configurable
Auto Features
Auto Image Compression
Auto Resize
Thumbnail Generate
Lazy Loading Support
WebP Conversion
Product Gallery Settings
Admin:
Main Featured Image Select
Gallery Images Select
Hover Image Select
Zoom Image Enable
360° Product Images Upload
kar sake.
33. Product Variant Settings
Variant Types
Size
Color
Weight
Storage
RAM
Material
Variant Features
Each variant ke liye:
Separate Price
Separate SKU
Separate Stock
Separate Images
support hona chahiye.
34. SEO Settings
Admin product ke liye:
SEO Title
Meta Description
Meta Keywords
Canonical URL
Open Graph Image
Search Engine Visibility
manage kar sake.
35. Shipping Settings
Shipping Information
Product Weight
Length
Width
Height
Shipping Class
Free Shipping Toggle
COD Availability
36. Product Visibility Settings
Visibility Control
Public
Private
Hidden
Scheduled Publish
User Restrictions
Logged-in Users Only
Wholesale Customers Only
Region Based Visibility
37. Product Media Storage Settings
Storage System
Recommended:
Supabase Storage
AWS S3
Cloudflare R2
Folder Structure
/products/ /product-id/ featured/ gallery/ variants/
38. Security Settings
Upload Security
File Type Validation
Malware Scan
Duplicate File Detection
Secure File Name Generate
Admin Permission
Super Admin
Product Manager
Editor
39. Product Review Settings
Admin control:
Review Approval
Review Delete
Fake Review Detection
Rating Visibility
40. Product Search & Filter Settings
Admin dashboard me:
Search by Name
Search by SKU
Search by Category
Search by Brand
Filter by Stock
Filter by Status
41. Product Import & Export Settings
Bulk Upload
CSV Upload
Excel Upload
Bulk Image Upload
ZIP Product Upload
Export
CSV Export
Excel Export
Inventory Export
42. Auto Save & Draft System
Auto Draft Save
Restore Previous Version
Product Revision History
43. Analytics Settings
Admin dekh sake:
Product Views
Sales Count
Conversion Rate
Most Viewed Products
Low Selling Products
44. Recommended Database Tables
Tables
products product_images product_variants product_variant_images categories brands product_reviews inventory_logs
45. Recommended Image Upload Workflow
Admin Upload Images ↓ Image Validation ↓ Compression ↓ Thumbnail Generate ↓ Store in Supabase Storage ↓ Save URL in Database ↓ Display in Product Gallery
[5/11/2026 11:06 AM] boos fr: 19. Recommended Frontend Features
Product Page
Image Slider
Zoom Effect
Thumbnail Gallery
Variant Image Change
Lazy Load Images
Mobile Swipe Support
46. Recommended Tech Stack
Backend
Node.js
Express.js
Supabase
Upload Libraries
Multer
Sharp
Storage
Supabase Storage
Image Optimization
Sharp Compression
WebP Conversion
