
1. BEST PAYMENT METHOD PRD (Recommended)
Use this flow:
Customer Clicks Pay Now → UPI Intent URL Open → Customer Selects GPay/PhonePe/Paytm → Payment Success → Return To Success Page → Admin Panel Verifies Payment
2. USE HTTPS ONLY
Vercel automatically HTTPS deta hai.
Your domain must open like:
<https://yourstore.com>
NOT:
http://
Otherwise UPI apps security warning dikha sakta hai.
3. USE CUSTOM DOMAIN (IMPORTANT)
Vercel subdomain avoid kariye.
BAD:
yourshop.vercel.app
GOOD:
<https://yourshop.com>
Domain trusted lagta hai.
4. UPI PAYMENT URL FORMAT
Use this:
upi://pay?pa=YOUR_UPI_ID&pn=YOUR_STORE_NAME&am=100&cu=INR&tn=Order123
Example:
upi://pay?pa=yourbusiness@okaxis&pn=MyStore&am=499&cu=INR&tn=ORDER_1023
5. NODE.JS PAYMENT BUTTON CODE
Frontend:
const payNow = () => { const upiUrl = "upi://pay?pa=yourbusiness@okaxis&pn=MyStore&am=499&cu=INR&tn=ORDER_1023"; window.location.href = upiUrl; };
Button:
<button onclick="payNow()">Pay Now</button>
6. VERY IMPORTANT SETTINGS FOR MOBILE
A. Use Mobile Browser Redirect
Do NOT open payment inside iframe.
BAD:

<iframe src="upi://pay..."></iframe>
GOOD:
window.location.href = upiUrl;
B. Add User Click Trigger
UPI apps block karte hain auto-open ko.
GOOD:
button.onclick = () => { window.location.href = upiUrl; }
BAD:
setTimeout(() => { window.location.href = upiUrl; }, 1000)
7. ADMIN PANEL DATABASE STRUCTURE
Supabase table:
orders
Columns:
id customer_name mobile amount payment_status order_status upi_ref created_at
8. PAYMENT STATUS FLOW
Before payment:
payment_status = PENDING
After successful payment:
payment_status = SUCCESS
If user cancels:
payment_status = FAILED
9. BEST SUCCESS FLOW
After payment app opens:
Customer manually returns.
Then show:
Did you complete payment? [ YES ]
When YES clicked:
Call backend API.
10. PAYMENT VERIFICATION (IMPORTANT)
UPI alone auto verification difficult hota hai.
BEST OPTIONS:
OPTION 1 (Professional)
Use payment gateway:
Advantages:
Auto verify
Webhook
Fraud protection
No fake screenshot
Better success rate
Recommended.
OPTION 2 (Manual Verification)
Customer uploads screenshot.
Admin verifies manually.
Less professional.
11. RECOMMENDED PRODUCTION FLOW
Website → Create Order → Save PENDING → Open UPI App → Payment Success → Webhook/API Verify → Mark SUCCESS → Auto Confirm Order
12. VERCEL ENVIRONMENT VARIABLES
In Vercel Dashboard:
Settings → Environment Variables
Add:
SUPABASE_URL= SUPABASE_ANON_KEY= SUPABASE_SERVICE_ROLE_KEY= UPI_ID= STORE_NAME=
Production environment me add kariye.
13. SECURITY SETTINGS
NEVER expose:
SUPABASE_SERVICE_ROLE_KEY
Frontend me use mat kariye.
Only backend API.
Frontend safe variables:
If Vite:
VITE_SUPABASE_URL= VITE_SUPABASE_ANON_KEY=
If Next.js:
NEXT_PUBLIC_SUPABASE_URL= NEXT_PUBLIC_SUPABASE_ANON_KEY=
14. SUPABASE SECURITY
Enable:
Row Level Security (RLS)
Policies:
Customer only own order dekh sake
Admin only admin panel access kare
15. AVOID THESE MISTAKES
DON'T use:
iframe payment
popup blockers
HTTP website
auto redirects without click
fake success page
localStorage payment verification
16. BEST USER EXPERIENCE
After clicking pay:
Show:
Opening Google Pay... Please complete payment securely. Do not close this page.
After return:
Payment processing...
Then verify.
17. BEST MOBILE COMPATIBILITY
Test on:
Google Pay
PhonePe
Paytm
BHIM
Browsers:
Chrome Android
Samsung Browser
Safari iPhone
18. RECOMMENDED PROFESSIONAL STACK
[5/19/2026 9:58 AM] boos fr: BEST COMBINATION:
Frontend: Node.js / React / Next.js Backend: Node.js API Database: Supabase Hosting: Vercel Payments: Razorpay UPI Gateway
This gives highest success rate and least payment failures.
19. FINAL RECOMMENDATION
For real production e-commerce:
✅ Use payment gateway
✅ Use webhooks
✅ Use custom domain
✅ Use HTTPS
✅ Use order verification
✅ Store all transactions in Supabase
✅ Never trust frontend payment success alone
Useful official links:
