export default defineNuxtRouteMiddleware((to, _from) => {
    const user = useSupabaseUser();
    // If the user is not logged in, the app returns it to the login page
    if (!user.value && to.path.startsWith('/app')) {
        return navigateTo('/login');
    }
});