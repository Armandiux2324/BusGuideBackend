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
                route: true
            },
            orderBy: { name: 'ASC' },
        });

        const routes = await strapi.documents('api::route.route').findMany({
            populate: {
                bus: true,
                stops: true
            }
        });

        routes.forEach(route => {
            console.log(
                route.bus?.name,
                route.stops?.map((s: any) => s.documentId)
            );
        });

        return stops.map(stop => {
            const routesForStop = routes.filter(route =>
                route.stops?.some((s: any) =>
                    s.documentId === stop.documentId
                )
            );

            return {
                ...stop,
                routes: routesForStop
            };
        });
    },

    async find(ctx) {
        const body = ctx.request.body ?? {};
        const query = ctx.query ?? {};

        const page = Number(body.page ?? query.page ?? 1);
        const pageSize = Number(body.pageSize ?? query.pageSize ?? 20);

        const stops = await strapi.documents('api::stop.stop').findMany({
            populate: { route: true },
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
            populate: { route: true },
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
            populate: { route: true }
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
            populate: { route: true },
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

function attachRoutesToStops(stops: { id: ID; documentId: DocumentID; route?: { id: ID; documentId: DocumentID; bus?: { id: ID; documentId: DocumentID; locale?: string; createdAt?: DateTimeValue; createdBy?: { id: ID; documentId: DocumentID; locale?: string; email?: string; password?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; localizations?: /*elided*/ any[]; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; roles?: { id: ID; documentId: DocumentID; locale?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; description?: string; localizations?: /*elided*/ any[]; name?: string; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; permissions?: { id: ID; documentId: DocumentID; role?: /*elided*/ any; locale?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; conditions?: JSONValue; localizations?: /*elided*/ any[]; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; action?: string; actionParameters?: JSONValue; properties?: JSONValue; subject?: string; }[]; code?: string; users?: /*elided*/ any[]; }[]; blocked?: boolean; firstname?: string; isActive?: boolean; lastname?: string; preferedLanguage?: string; registrationToken?: string; resetPasswordToken?: string; username?: string; }; localizations?: /*elided*/ any[]; name?: string; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: { id: ID; documentId: DocumentID; locale?: string; email?: string; password?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; localizations?: /*elided*/ any[]; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; roles?: { id: ID; documentId: DocumentID; locale?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; description?: string; localizations?: /*elided*/ any[]; name?: string; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; permissions?: { id: ID; documentId: DocumentID; role?: /*elided*/ any; locale?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; conditions?: JSONValue; localizations?: /*elided*/ any[]; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; action?: string; actionParameters?: JSONValue; properties?: JSONValue; subject?: string; }[]; code?: string; users?: /*elided*/ any[]; }[]; blocked?: boolean; firstname?: string; isActive?: boolean; lastname?: string; preferedLanguage?: string; registrationToken?: string; resetPasswordToken?: string; username?: string; }; active?: boolean; color?: string; routes?: /*elided*/ any[]; }; locale?: string; stops?: { id: ID; documentId: DocumentID; route?: /*elided*/ any; locale?: string; createdAt?: DateTimeValue; createdBy?: { id: ID; documentId: DocumentID; locale?: string; email?: string; password?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; localizations?: /*elided*/ any[]; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; roles?: { id: ID; documentId: DocumentID; locale?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; description?: string; localizations?: /*elided*/ any[]; name?: string; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; permissions?: { id: ID; documentId: DocumentID; role?: /*elided*/ any; locale?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; conditions?: JSONValue; localizations?: /*elided*/ any[]; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; action?: string; actionParameters?: JSONValue; properties?: JSONValue; subject?: string; }[]; code?: string; users?: /*elided*/ any[]; }[]; blocked?: boolean; firstname?: string; isActive?: boolean; lastname?: string; preferedLanguage?: string; registrationToken?: string; resetPasswordToken?: string; username?: string; }; description?: string; latitude?: number; localizations?: /*elided*/ any[]; longitude?: number; name?: string; order?: number; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: { id: ID; documentId: DocumentID; locale?: string; email?: string; password?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; localizations?: /*elided*/ any[]; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; roles?: { id: ID; documentId: DocumentID; locale?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; description?: string; localizations?: /*elided*/ any[]; name?: string; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; permissions?: { id: ID; documentId: DocumentID; role?: /*elided*/ any; locale?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; conditions?: JSONValue; localizations?: /*elided*/ any[]; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; action?: string; actionParameters?: JSONValue; properties?: JSONValue; subject?: string; }[]; code?: string; users?: /*elided*/ any[]; }[]; blocked?: boolean; firstname?: string; isActive?: boolean; lastname?: string; preferedLanguage?: string; registrationToken?: string; resetPasswordToken?: string; username?: string; }; }[]; createdAt?: DateTimeValue; createdBy?: { id: ID; documentId: DocumentID; locale?: string; email?: string; password?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; localizations?: /*elided*/ any[]; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; roles?: { id: ID; documentId: DocumentID; locale?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; description?: string; localizations?: /*elided*/ any[]; name?: string; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; permissions?: { id: ID; documentId: DocumentID; role?: /*elided*/ any; locale?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; conditions?: JSONValue; localizations?: /*elided*/ any[]; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; action?: string; actionParameters?: JSONValue; properties?: JSONValue; subject?: string; }[]; code?: string; users?: /*elided*/ any[]; }[]; blocked?: boolean; firstname?: string; isActive?: boolean; lastname?: string; preferedLanguage?: string; registrationToken?: string; resetPasswordToken?: string; username?: string; }; localizations?: /*elided*/ any[]; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: { id: ID; documentId: DocumentID; locale?: string; email?: string; password?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; localizations?: /*elided*/ any[]; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; roles?: { id: ID; documentId: DocumentID; locale?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; description?: string; localizations?: /*elided*/ any[]; name?: string; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; permissions?: { id: ID; documentId: DocumentID; role?: /*elided*/ any; locale?: string; createdAt?: DateTimeValue; createdBy?: /*elided*/ any; conditions?: JSONValue; localizations?: /*elided*/ any[]; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; updatedBy?: /*elided*/ any; action?: string; actionParameters?: JSONValue; properties?: JSONValue; subject?: string; }[]; code?: string; users?: /*elided*/ any[]; }[]; blocked?: boolean; firstname?: string; isActive?: boolean; lastname?: string; preferedLanguage?: string; registrationToken?: string; resetPasswordToken?: string; username?: string; }; coordinates?: JSONValue; direction?: string; }; locale?: string; createdAt?: DateTimeValue; description?: string; latitude?: number; longitude?: number; name?: string; order?: number; publishedAt?: DateTimeValue; updatedAt?: DateTimeValue; }[]) {
    throw new Error('Function not implemented.');
}
