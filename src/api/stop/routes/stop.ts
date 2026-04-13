/**
 * stop router
 */

export default ({
    routes: [
        {
            method: 'POST',
            path: '/stops',
            handler: 'stop.create',
        },
        {
            method: 'POST',
            path: '/stops/find',
            handler: 'stop.find',
        },
        {
            method: 'GET',
            path: '/stops/:id',
            handler: 'stop.findOne',
        },
        {
            method: 'GET',
            path: '/stops/',
            handler: 'stop.findAll',
        },
        {
            method: 'POST',
            path: '/stops/search',
            handler: 'stop.findByName',
        },
        {
            method: 'PUT',
            path: '/stops/:id',
            handler: 'stop.update',
        },
        {
            method: 'DELETE',
            path: '/stops/:id',
            handler: 'stop.delete',
        },
    ]
});