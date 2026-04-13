/**
 * bus router
 */

export default ({
    routes: [
        {
            method: 'POST',
            path: '/buses',
            handler: 'bus.create',
        },
        {
            method: 'GET',
            path: '/buses',
            handler: 'bus.find',
        },
        {
            method: 'GET',
            path: '/buses/:id',
            handler: 'bus.findOne',
        },
        {
            method: 'POST',
            path: '/buses/search',
            handler: 'bus.findByName',
        },
        {
            method: 'PUT',
            path: '/buses/:id',
            handler: 'bus.update',
        },
        {
            method: 'DELETE',
            path: '/buses/:id',
            handler: 'bus.delete',
        },
    ]
});