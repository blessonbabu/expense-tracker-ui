const appRoutes = {
    profile: {
        key: 'profile',
        label: 'My Profile',
        icon: 'fa-user',
        link: 'profile',
        isNav: true,
        iconProps: {
            width: 20,
        },
    },
    logout: {
        link: 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=',
    }
};

export default appRoutes;
