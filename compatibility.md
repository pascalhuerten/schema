# Compatibility

The MOOChub draft course profile is aligned with the AMB release published at
`https://w3id.org/kim/amb/20231019/`.

All reused AMB JSON Schemas are referenced at their immutable `20231019` URLs.
The MOOChub JSON-LD context is published separately at
`https://w3id.org/moochub/draft/context.jsonld`; it imports the pinned AMB
context and adds MOOChub terms. This keeps the transport profile identifiable
without introducing a second vocabulary for shared schema.org properties.

## Course code

`courseCode` follows [schema.org/courseCode](https://schema.org/courseCode). It
is an optional, single string containing the code assigned to the course by its
provider, such as `CS101`, `6.001`, or `DIGITAL-TRAINER`. It is not the course's
JSON-LD `id` and does not need to be globally unique. If a provider uses several
codes for the same course, it should choose the code used for course discovery
and display in MOOChub; additional code systems are not currently modeled.

## Entity identity

For a person or organization, `id` is the JSON-LD node identity. Because the
MOOChub context maps `id` to JSON-LD `@id`, it must be an IRI. Providers should
use a stable URI that they control and repeat it whenever the same entity
appears in another role or course. It does not need to be a public webpage.

`sameAs` is an array of URIs that the provider asserts identify the same entity.
It may contain verified social-media profiles, a personal homepage, ORCID,
ROR, or Wikidata. Do not put a link there merely because it is related to the
person; use it only when it represents that person or organization. The profile
does not use `url` for persons or organizations, avoiding a single-value field
that overlaps with `sameAs`.

These fields are optional; a name is sufficient for the minimum profile, but a
stable `id` is strongly recommended whenever an entity can occur repeatedly.
