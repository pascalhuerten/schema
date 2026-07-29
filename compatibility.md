# Compatibility

The MOOChub draft course profile is aligned with the AMB release published at
`https://w3id.org/kim/amb/20231019/`.

All reused AMB JSON Schemas are referenced at their immutable `20231019` URLs.
The MOOChub JSON-LD context is published separately at
`https://w3id.org/moochub/draft/context.jsonld`; it imports the pinned AMB
context and adds MOOChub terms. This keeps the transport profile identifiable
without introducing a second vocabulary for shared schema.org properties.

Every MOOChub course must contain `type: ["LearningResource", "Course"]`.
This is required by the AMB type contract and identifies the resource as a
schema.org Course. The value is explicit in the JSON-LD data; a JSON Schema
`default` is not used because defaults are annotations and do not populate
serialized data.

## Course code

`courseCode` follows [schema.org/courseCode](https://schema.org/courseCode). It
is an optional, single string containing the code assigned to the course by its
provider, such as `CS101`, `6.001`, or `DIGITAL-TRAINER`. It is not the course's
JSON-LD `id` and does not need to be globally unique. If a provider uses several
codes for the same course, it should choose the code used for course discovery
and display in MOOChub; additional code systems are not currently modeled.

## Course instances

`hasCourseInstance` follows
[schema.org/hasCourseInstance](https://schema.org/hasCourseInstance). It is an
optional list of `CourseInstance` offerings for a course. A course does not need
an instance when it is self-paced, continuously available, or has no published
offering details.

An instance is required to have a stable URI `id` and type `CourseInstance`.
It may specify its own `courseMode`, application dates, dates, and instructors.
`courseMode` is an array restricted to `online`,
`onsite`, `blended`, `synchronous`, and `asynchronous`. It can contain more than
one value when, for example, a blended course is also synchronous.

`startDate` and `endDate` on a course instance may define its overall offering
range, for example the semester or enrollment period. They do not define its
course events. Event dates are instead defined by each `subEvent`.

`subEvent` follows [schema.org/subEvent](https://schema.org/subEvent). It is an
array of `Event` course events or phases. A one-off event supplies its own
`startDate` and `endDate`. A recurring phase supplies an `eventSchedule`,
which contains its days, times, repeat frequency, time zone, and date range.
Each course event or phase may have its own location and instructors. Use
multiple events for irregular dates, pauses, or a change of location.
`timeRequired` remains a course-level property because it normally describes
the learning commitment for every offering.

## Course effort, accessibility, and offers

`timeRequired` follows [schema.org/timeRequired](https://schema.org/timeRequired)
and replaces the old v3 `workload` object. It is an ISO 8601 duration such as
`PT42H` or `P6W`, describing the approximate total time required for the
course. `numberOfCredits` follows
[schema.org/numberOfCredits](https://schema.org/numberOfCredits). MOOChub
allows non-negative fractional numbers so values such as `3.5` ECTS can be
represented.

`accessMode` follows [schema.org/accessMode](https://schema.org/accessMode)
and uses the approved values `auditory`, `tactile`, `textual`, and `visual`.
It describes the sensory or cognitive modes through which the course content
can be perceived; it does not by itself describe whether the course is free or
whether a learner can control the interface.

## Concepts, levels, and alignments

`educationalLevel` uses the MOOChub concept reference shape. A concept must
provide a stable URI `id` and may provide the SKOS metadata `type: "Concept"`,
`prefLabel`, localized `description`, and `inScheme`. MOOChub intentionally
permits concepts from any stable, published, or provider-controlled scheme.
This allows formal KIM educational levels and DigComp proficiency levels to be
represented without requiring MOOChub to publish or proxy a vocabulary.

`teaches`, `assesses`, and `competencyRequired` use the MOOChub skill shape,
which extends a concept with an optional `educationalLevel`. For example, a
DigComp competence may carry the proficiency level at which it is taught,
assessed, or required. Generic concepts cannot carry an educational level.

`educationalAlignment` follows
[schema.org/educationalAlignment](https://schema.org/educationalAlignment) and
contains schema.org `AlignmentObject` values. An alignment object describes the
relationship between the course and a framework target using
`educationalFramework`, `targetUrl`, and optional target metadata. Use it for
subject, discipline, or other framework concepts that are not better expressed
by direct properties, such as an ISCED-F knowledge area.

## Educational credentials

`educationalCredentialAwarded` follows
[schema.org/educationalCredentialAwarded](https://schema.org/educationalCredentialAwarded)
and describes a credential that can be achieved by successfully completing the
course. A credential's `credentialCategory` is a SKOS `Concept` from the
European Digital Credentials credential vocabulary:
`http://data.europa.eu/snb/credential/25831c2`. The draft profile currently
supports these categories:

- Learning Activity:
	`http://data.europa.eu/snb/credential/48b514e72a`
- Diploma Supplement:
	`http://data.europa.eu/snb/credential/6dff8a0f87`
- Learning Entitlement:
	`http://data.europa.eu/snb/credential/bdc47cb449`
- Generic:
	`http://data.europa.eu/snb/credential/e34929035b`

`credentialCategory` extends the generic MOOChub concept profile. Its `id` is
restricted to the supported category URIs and its `inScheme` must identify the
European Digital Credentials credential vocabulary. The URI is authoritative;
optional concept labels and descriptions are convenience metadata and should
use the preferred label and definition from the EU vocabulary.
Use `Learning Activity` when the credential primarily records participation in
or completion of a learning activity, `Diploma Supplement` for the European
higher-education diploma supplement credential, and `Learning Entitlement` for
a right to access learning. Use `Generic` for assessed competency credentials
and other credentials not covered by those categories.

The credential-level `competencyRequired` property describes the
competencies asserted by the credential and therefore the outcome a learner can
expect to gain if the credential is awarded. The course-level property `assesses` remains useful on the course because a course may evaluate additional competencies that are not part of every credential it awards, while `competencyRequired` communicates the credential's learner-facing value.

`offers` follows [schema.org/offers](https://schema.org/offers) and may be
provided on both the course and a specific course instance. Course-level offers
describe generally available pricing. Instance-level offers describe the
specific dated offering and should be used when pricing, availability, or
enrollment differs between instances. An offer's `url` can point to the
instance-specific booking, checkout, enrollment, or access page. `category`
retains the MOOChub distinction between the course fee, certification fee, and
the combined price. `paymentFrequency` is retained as a MOOChub extension
because schema.org does not define it as an Offer property. Every offer has
the explicit JSON-LD type `Offer`.

The imported AMB context supplies schema.org's default vocabulary for shared
properties such as `name`, `description`, `image`, `license`, `byDay`,
`startTime`, and `endTime`. MOOChub's context declares the local schedule terms
`repeatFrequency` and `scheduleTimezone` explicitly because they are used by
the MOOChub course-event schedule and map to schema.org properties.

## Licenses

MOOChub licenses require a readable `identifier` and an `id` field. The
`identifier` is intended for display and for expressing rights states, for
example `CC BY 4.0`, `CC0 1.0 Universal`, `Proprietary`, or `All rights
reserved`. The `id` is the URI of the license document or license terms. It
maps to JSON-LD `@id` and matches AMB's license shape when it contains a URI.

The `id` value may be `null`. This is intentional and means that the rights
state is known but no public license document is available. It is appropriate
for proprietary or all-rights-reserved content. A missing `license` object has
a different meaning: the provider has not supplied the required rights
metadata, so clients must not silently infer that the item is proprietary.

The URI may point to a Creative Commons, SPDX, Open Source Initiative, or
provider-hosted license document. MOOChub does not distinguish between a
general license URL and a separate `contentUrl`; one canonical URI is
sufficient. A proprietary or all-rights-reserved item should provide a
provider-hosted terms or rights page when available; that URI can be placed in
`id` instead of using `null`.

## Course media

`image` is a licensed `ImageObject` used as the course cover. Its `contentUrl`
is the URI that a client can display or embed, and its `description` can serve
as alternative text. This is compatible with
[schema.org/image](https://schema.org/image), whose value may be an
`ImageObject` or URL. AMB models its corresponding `image` value as only a URI;
an AMB export can therefore use the MOOChub image's `contentUrl` while retaining
the complete licensed object in the MOOChub representation.

`trailer` is a licensed `VideoObject` teaser. It follows AMB's media contract:
it must provide either `contentUrl` for the video resource or `embedUrl` for a
player, and may include `encodingFormat`, `contentSize`, `sha256`, and
`bitrate`. MOOChub restricts the AMB choice to `VideoObject`, since the profile
uses trailer media to market courses and does not define an audio-trailer
representation. The required license applies to the video itself and must be
preserved whenever the trailer is redistributed or embedded.

MOOChub feeds may include expired instances. Clients can use dates to present
current offerings while retaining past offerings as evidence that the course is
likely to recur and may be bookmarked for a future instance.

`applicationStartDate` and `applicationDeadline` reuse the corresponding
schema.org properties from `EducationalOccupationalProgram`. MOOChub also uses
them on `CourseInstance`, where they describe the application window for that
specific offering. Both values are ISO 8601 calendar dates.

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
