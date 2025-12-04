import type { Endpoint } from "payload";
import { seedTemplateForTenant } from "../../seeders/seedTemplateForTenant";

export const seedTemplateEndpoint: Endpoint = {
    path: "/tenants/:tenantId/seed-template",
    method: "post",
    async handler(req, res, next) {
        try {
            const tenantId = req.params.tenantId;
            const templateId = req.body.templateId;

            const result = await seedTemplateForTenant({
                tenantId,
                templateId,
                overwrite: false,
            });

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    },
};
