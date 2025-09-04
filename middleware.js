import { clerkMiddleware ,createRouteMatcher} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
]);
/*createRouteMatcher([...])
This is a utility function from Clerk.
It takes an array of route patterns (strings with optional regex-like syntax).
It returns a function (in your case, named isProctedRoute) that can check if a given request URL matches any of those routes.
Patterns you passed:
"/dashboard(.*)" → matches /dashboard, /dashboard/settings, /dashboard/anything...
"/resume(.*)" → matches /resume, /resume/editor, /resume/123
"/interview(.*)" → matches /interview and all its subpaths.
"/ai-cover-letter(.*)" → matches /ai-cover-letter and all subpaths.
The (.*) part is a wildcard regex → "match this path and everything under it". */

export default clerkMiddleware( async(auth,req)=>{
// we are using this auth and req for the protection of our app
const {userId}=await auth();//this will give us the logged-in user id
if(!userId &&isProtectedRoute(req))
  //req is the current route
{
  const {redirectToSignIn} = await auth()
  return redirectToSignIn()
}
return NextResponse.next();
});

/*clerkMiddleware(...)

This is Clerk’s wrapper for middleware in Next.js.
It lets you run logic before a request is handled, and decide whether to allow, block, or redirect.
async (auth, req)
Clerk passes you two helpers:
auth → a function that gives you the current authentication state.
req → the incoming request object (so you know what route is being accessed).
const { userId } = await auth();
If the user is logged in → you get their userId.
If the user is logged out → userId will be null.
if (!userId && isProctedRoute(req))
This checks:
Is the user NOT logged in?
AND are they trying to access a protected route (like /dashboard, /resume, etc.)?
If yes, then we stop them here.
redirectToSignIn()
Instead of letting them load the page, Clerk gives you this helper.
It sends them straight to your sign-in page (usually /sign-in).
 */

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};