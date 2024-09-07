import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ['/'],
    afterAuth(auth, req, evt) {
      // Handle users who aren't authenticated
      if (!auth.userId && !auth.isPublicRoute) {
        return redirectToSignIn({ returnBackUrl: req.url });
      }
      // Redirect logged in users to /dashboard if they're on the home page
      if (auth.userId && req.nextUrl.pathname === '/') {
        return Response.redirect(new URL('/dashboard', req.url));
      }
    },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};