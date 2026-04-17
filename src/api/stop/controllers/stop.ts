import { factories } from '@strapi/strapi';
import { ID, DocumentID } from '@strapi/types/dist/data';
import { DateTimeValue } from '@strapi/types/dist/schema/attribute';
import { JSONValue } from '@strapi/types/dist/utils';

export default factories.createCoreController('api::stop.stop', {
    async create(ctx) {
        const result = await super.create(ctx);
        return result;
    },

    async findAll() {
        const stops = await strapi.documents('api::stop.stop').findMany({
            populate: {
                routes: true
            },
            orderBy: { name: 'ASC' },
        });

        return { data: stops };
    },

    async find(ctx) {
        const body = ctx.request.body ?? {};
        const query = ctx.query ?? {};

        const page = Number(body.page ?? query.page ?? 1);
        const pageSize = Number(body.pageSize ?? query.pageSize ?? 20);

        const stops = await strapi.documents('api::stop.stop').findMany({
            populate: { routes: true },
            orderBy: { name: 'ASC' },
            limit: pageSize,
            offset: (page - 1) * pageSize
        });

        const total = await strapi.documents('api::stop.stop').count({});

        return {
            data: stops,
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

        const route = await strapi.documents('api::stop.stop').findOne({
            documentId: id,
            populate: { routes: true },
        });

        return { data: route };
    },

    async update(ctx) {
        const { id } = ctx.params;
        const { name, latitude, longitude, order, description, route } = ctx.request.body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (latitude !== undefined) updateData.latitude = latitude;
        if (longitude !== undefined) updateData.longitude = longitude;
        if (order !== undefined) updateData.order = order;
        if (description !== undefined) updateData.description = description;
        if (route !== undefined) updateData.route = { id: route };

        const stop = await strapi.documents('api::stop.stop').update({
            documentId: id,
            data: updateData,
            populate: { routes: true }
        });

        return { data: stop };
    },

    async delete(ctx) {
        const { id } = ctx.params;

        const stop = await strapi.documents('api::stop.stop').findOne({
            documentId: id,
        });

        if (!stop) {
            return ctx.notFound('Parada no encontrada');
        }

        await strapi.documents('api::stop.stop').delete({
            documentId: id
        });

        return { message: 'Parada eliminada correctamente' };
    },

    async findByName(ctx) {
        const { page = 1, pageSize = 20, name } = ctx.request.body;

        const stops = await strapi.documents('api::stop.stop').findMany({
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

        const total = await strapi.documents('api::stop.stop').count({
            filters: {
                name: {
                    $contains: name
                }
            },
        });

        return {
            data: stops,
            meta: {
                page,
                pageSize,
                total,
                pageCount: Math.ceil(total / pageSize)
            }
        };
    },

});