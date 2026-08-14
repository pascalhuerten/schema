# MOOChub v4 Catalog Feed

MOOChub providers expose one canonical, paginated catalog endpoint, for example
`GET /api/v4/catalog`. The response MUST use the media type
`application/vnd.api+json` and be a JSON:API 1.1 document that
conforms to [`draft/schemas/api/catalogFeed.json`](draft/schemas/api/catalogFeed.json).

## Catalog resources

The feed's `data` array MAY contain these JSON:API resource types:

- `courses`: a MOOChub course in `attributes`, conforming to
  [`draft/schemas/course.json`](draft/schemas/course.json)
- `programs`: an educational program in `attributes`, conforming to
  [`draft/schemas/program.json`](draft/schemas/program.json)
- `credentials`: an educational or occupational credential in
  `attributes`, conforming to [`draft/schemas/educationalOccupationalCredential.json`](draft/schemas/educationalOccupationalCredential.json)
- `persons`: a person in `attributes`, conforming to
  [`draft/schemas/person.json`](draft/schemas/person.json)
- `organizations`: an organization in `attributes`, conforming to
  [`draft/schemas/organization.json`](draft/schemas/organization.json)
- `locations`: a location in `attributes`, conforming to
  [`draft/schemas/location.json`](draft/schemas/location.json)

Each independently harvestable JSON-LD object MUST have a stable `id` and a
corresponding `type`. Publishing these resource types independently is optional; providers
may remain focused on courses.

The MOOChub JSON Schemas do not require `@context`. Providers MAY include it
in JSON:API attributes and embedded objects. A provider publishing an object as
a standalone JSON-LD document SHOULD include a compatible context at the
document root. The context MAY extend or replace the default MOOChub context,
provided that the meaning of MOOChub-defined properties is preserved.

The JSON:API resource `id` is a non-empty, provider-local string used to address
the resource through the API, for example `GET /courses/5234`. The semantic
resource in `attributes` has its own stable JSON-LD `id` URI. These identifiers
serve different layers and are not required to be equal.

## Pagination

The canonical query parameters are:

- `page[number]`: one-based page number; defaults to `1`.
- `page[size]`: requested page size; providers MAY cap it at a documented
  maximum and MUST return the effective page through the pagination links.
- `filter[type]`: optional comma-separated resource types, currently `courses`
  and `programs`.

Providers MUST return a stable ordering across a harvesting run. The default
ordering SHOULD be deterministic by resource type and provider-local ID unless
the provider documents another ordering. `links.self` is required. Providers
SHOULD supply `first`, `last`, `next`, and `prev` where applicable. `next` and
`prev` are `null` at the corresponding end of the result set. `meta.total`, when
supplied, is the total number of available catalog resources after filtering.

The endpoint MUST return `200 OK` for a valid request, including an empty page.
Malformed pagination or filter parameters MUST return `400 Bad Request` using
the JSON:API error document format. Unsupported resource filters SHOULD return
`400 Bad Request` rather than silently changing the result set.

The API MUST expose stable resource URLs that can be used to retrieve an
individual resource, for example `GET /courses/5234` or `GET /programs/42`.
Unknown resource IDs SHOULD return `404 Not Found`. A provider MAY expose
`410 Gone` for a deliberately retired resource when that distinction is useful
to harvesters.

## Harvesting

The JSON:API resource ID MUST remain stable for the lifetime of a resource and
MUST NOT be reused for another resource. The JSON-LD `attributes.id` URI SHOULD
also remain stable; changing it represents a new semantic resource to
harvesters.

Providers SHOULD update `attributes.dateModified` whenever the published
representation of that resource changes. `dateModified` is optional for all
independently harvestable resource types. For courses, it is the established
incremental harvesting signal. If a provider supplies it, the value MUST
change when the resource itself changes. If it is absent, harvesters MUST
treat the resource as potentially changed rather than assuming that it is
unchanged.

When embedded data changes, providers SHOULD also update the containing
resource's `dateModified` if the embedded object is not independently
harvestable or does not provide its own `dateModified`. If the embedded object
is independently harvestable and supplies its own `dateModified`, each
resource's timestamp SHOULD change only when that respective resource changes.

Harvester identity is the pair `(type, attributes.id)`. A compact reference
with only `id`, `type`, and optionally `name` identifies the same entity as a
full representation. References MUST NOT erase properties already stored from
a full representation. Harvesters SHOULD merge non-empty representations and
prefer a representation with the newest `dateModified` when available.

Harvesters SHOULD use the catalog's stable ordering and resource IDs to detect
changes, and SHOULD retain resources that disappear from one page until the
provider's complete catalog has been harvested again. A provider MAY publish a
deletion marker or return `410 Gone` for a retired resource, but the behavior
MUST be documented by the provider.

See [`examples/catalog/valid/catalog.json`](examples/catalog/valid/catalog.json)
for a paginated feed containing both a course and a program.
