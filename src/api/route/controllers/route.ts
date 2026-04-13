/**
 * route controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::route.route', {
    async create(ctx) {
        const result = await super.create(ctx);
        return result;
    },

    async find(ctx) {
        const body = ctx.request.body ?? {};
        const query = ctx.query ?? {};

        const page = Number(body.page ?? query.page ?? 1);
        const pageSize = Number(body.pageSize ?? query.pageSize ?? 20);

        const routes = await strapi.documents('api::route.route').findMany({
            populate: { bus: true, stops: true },
            orderBy: {
                bus: {
                    name: 'ASC'
                }
            },
        });

        const grouped = new Map<string, typeof routes>();
        for (const route of routes) {
            const busName = route.bus?.name ?? 'unknown';
            if (!grouped.has(busName)) grouped.set(busName, []);
            grouped.get(busName)!.push(route);
        }

        const merged = [];
        for (const [, group] of grouped) {
            if (group.length === 1) {
                merged.push(group[0]);
            } else {
                const allStops = group.flatMap(r =>
                    (r.stops ?? []).map(stop => ({ ...stop, direction: r.direction }))
                );
                merged.push({ ...group[0], stops: allStops });
            }
        }

        const total = merged.length;
        const paginated = merged.slice((page - 1) * pageSize, page * pageSize);

        return {
            data: paginated,
            meta: {
                page,
                pageSize,
                total,
                pageCount: Math.ceil(total / pageSize)
            }
        };
    },

    async findOne(ctx) {
        const { id } = ctx.params;

        const route = await strapi.documents('api::route.route').findOne({
            documentId: id,
            populate: { bus: true, stops: true },
        });

        return { data: route };
    },

    async update(ctx) {
        const { id } = ctx.params;
        const { coordinates, direction, bus, stops } = ctx.request.body;

        const updateData: any = {};
        if (coordinates !== undefined) updateData.coordinates = coordinates;
        if (direction !== undefined) updateData.direction = direction;
        if (bus !== undefined) updateData.bus = { id: bus };
        if (Array.isArray(stops)) updateData.stops = stops.map((stopId) => ({ id: stopId }));

        const route = await strapi.documents('api::route.route').update({
            documentId: id,
            data: updateData,
            populate: { bus: true, stops: true }
        });

        return { data: route };
    },

    async delete(ctx) {
        const { id } = ctx.params;

        const route = await strapi.documents('api::route.route').findOne({
            documentId: id,
            populate: { stops: true }
        });

        if (!route) {
            return ctx.notFound('Ruta no encontrada');
        }

        for (const stop of (route.stops ?? [])) {
            await strapi.documents('api::stop.stop').delete({
                documentId: stop.documentId
            });
        }

        await strapi.documents('api::route.route').delete({
            documentId: id
        });

        return { message: 'Ruta eliminada correctamente' };
    },
    
    async findByBus(ctx) {
        const { page = 1, pageSize = 20, name } = ctx.request.body;

        const routes = await strapi.documents('api::route.route').findMany({
            filters: {
                bus: {
                    name: {
                        $contains: name
                    }
                }
            },
            populate: { bus: true, stops: true },
            orderBy: {
                bus: {
                    name: 'ASC'
                }
            },
        });

        const grouped = new Map<string, typeof routes>();
        for (const route of routes) {
            const busName = route.bus?.name ?? 'unknown';
            if (!grouped.has(busName)) grouped.set(busName, []);
            grouped.get(busName)!.push(route);
        }

        const merged = [];
        for (const [, group] of grouped) {
            if (group.length === 1) {
                merged.push(group[0]);
            } else {
                const allStops = group.flatMap(r =>
                    (r.stops ?? []).map(stop => ({ ...stop, direction: r.direction }))
                );
                merged.push({ ...group[0], stops: allStops });
            }
        }

        const total = merged.length;
        const paginated = merged.slice((page - 1) * pageSize, page * pageSize);

        return {
            data: paginated,
            meta: {
                page,
                pageSize,
                total,
                pageCount: Math.ceil(total / pageSize)
            }
        };
    },

    async count() {
        const total = await strapi.documents('api::route.route').count({});
        return { data: { total } };
    }
});