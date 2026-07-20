const { schemas } = require("../validation/schemas");
const { badRequest, conflict } = require("../utils/http");
const { toInt } = require("../utils/numbers");

function isMissing(value) {
  if (value == null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  return false;
}

function createValidatePayload(router) {
  return function validatePayload(req, res, next) {
    const collection = req.path.replace(/^\/+/, "").split("/")[0];
    const schema = schemas[collection];

    if (!schema) {
      return next();
    }

    const body = req.body || {};

    if (req.method === "POST" && schema.requiredOnCreate) {
      const { fields, message } = schema.requiredOnCreate;
      const hasMissingField = fields.some((field) => isMissing(body[field]));
      if (hasMissingField) {
        return badRequest(res, message);
      }
    }

    if (schema.enums) {
      for (const [field, rule] of Object.entries(schema.enums)) {
        if (body[field] != null && !rule.values.has(body[field])) {
          return badRequest(res, rule.message);
        }
      }
    }

    if (schema.normalize) {
      for (const [field, normalize] of Object.entries(schema.normalize)) {
        if (body[field] != null) {
          body[field] = normalize(body[field]);
        }
      }
    }

    if (schema.unique) {
      for (const [field, rule] of Object.entries(schema.unique)) {
        if (body[field] == null) continue;

        const existing = router.db
          .get(collection)
          .find({ [field]: body[field] })
          .value();

        const routeId = toInt(req.params.id);
        if (existing && existing.id !== routeId) {
          return conflict(res, rule.message);
        }
      }
    }

    if (schema.refs) {
      for (const [field, rule] of Object.entries(schema.refs)) {
        if (body[field] == null) continue;

        const refId = Number(body[field]);
        const found = router.db
          .get(rule.collection)
          .find({ id: refId })
          .value();

        if (!found) {
          return badRequest(res, rule.message);
        }
        body[field] = refId;
      }
    }

    if (schema.numbers) {
      for (const [field, rule] of Object.entries(schema.numbers)) {
        if (body[field] == null) continue;

        const parsed = Number(body[field]);
        if (!Number.isFinite(parsed) || (rule.min != null && parsed < rule.min)) {
          return badRequest(res, rule.message);
        }
        body[field] = parsed;
      }
    }

    return next();
  };
}

module.exports = {
  createValidatePayload,
};
