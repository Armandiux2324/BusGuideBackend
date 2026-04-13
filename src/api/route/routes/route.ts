/**
 * route router
 */

export default ({
    routes: [
        {
            method: 'POST',
            path: '/routes',
            handler: 'route.create',
        },
        {
            method: 'POST',
            path: '/routes/find',
            handler: 'route.find',
        },
        {
            method: 'GET',
            path: '/routes/count',
            handler: 'route.count',
        },
        {
            method: 'GET',
            path: '/routes/:id',
            handler: 'route.findOne',
        },
        {
            method: 'POST',
            path: '/routes/search',
            handler: 'route.findByBus',
        },
        {
            method: 'PUT',
            path: '/routes/:id',
            handler: 'route.update',
        },
        {
            method: 'DELETE',
            path: '/routes/:id',
            handler: 'route.delete',
        },
    ]
});