import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::bus.bus', {

    async create(ctx) {
        const result = await super.create(ctx);
        return result;
    },

    async find(ctx) {
        const buses = await strapi.documents('api::bus.bus').findMany({
            populate: { routes: true },
            orderBy: { name: 'ASC' },
        });

        return { data: buses };
    },

    async findOne(ctx) {
        const { id } = ctx.params;

        const route = await strapi.documents('api::bus.bus').findOne({
            documentId: id,
            populate: { routes: true },
        });

        return { data: route };
    },

    async update(ctx) {
        const { id } = ctx.params;
        const { name, active, color, routes } = ctx.request.body;

        const updateData: any = {};
        if (name !== undefined)   updateData.name   = name;
        if (active !== undefined) updateData.active = active;
        if (color !== undefined)  updateData.color  = color;
        if (Array.isArray(routes)) {
            updateData.routes = routes.map((routeId) => ({ id: routeId }));
        }

        const bus = await strapi.documents('api::bus.bus').update({
            documentId: id,
            data: updateData,
            populate: { routes: true }
        });

        return { data: bus };
    },

    async delete(ctx) {
        const { id } = ctx.params;

        await strapi.documents('api::bus.bus').delete({
            documentId: id
        });

        return { message: 'Bus eliminado correctamente' };
    },

    async findByName(ctx) {
        const { page = 1, pageSize = 20, name } = ctx.request.body;

        const buses = await strapi.documents('api::bus.bus').findMany({
            filters: {
                name: {
                    $contains: name
                }
            },
            populate: { routes: true },
            orderBy: { name: 'ASC' },
            limit: pageSize,
            offset: (page - 1) * pageSize
        });

        const total = await strapi.documents('api::bus.bus').count({
            filters: {
                name: {
                    $contains: name
                }
            },
        });

        return {
            data: buses,
            meta: {
                page,
                pageSize,
                total,
                pageCount: Math.ceil(total / pageSize)
            }
        };
    }
});