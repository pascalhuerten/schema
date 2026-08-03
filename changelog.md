# MOOChub v4 Changelog

## Course

- Old attributes subsection now flattened into top level properties.
- all iri formats changed to uri format for better compatibility with amb and
  ajv validation.
- url property now references amb
  [ID](https://w3id.org/kim/amb/20231019/schemas/id.json) restricting the format
  from iri to uri.
- type property removed. Restriction to single enum value "Course" offered no
  value. When converted to AMB, the type may automatically be set to
  ["LearningResource", "Course"].
- learningResourceType property removed. Only "https://w3id.org/kim/hcrt/course"
  was allowed. So like type this adds no value. When converted to AMB, the
  learningResourceType may automatically be set to
  ["https://w3id.org/kim/hcrt/course"].
- a course, image or video now only accepts a single license object instead of
  an array of licenses.
- amb conditionsOfAccess added
- isBasedOn, hasPart, isPartOf taken from amb
- amd asesses added
- uses amb isAccessibleForFree intead of Moochub access. This only allows true
  or false, mapping to "free" or "paid" in the old moochub access defition.
  Courses only accessible with student enrollements or other special
  requirements can be indicated with amb conditionsOfAccess, either requireing a
  login or no login, and an additon prefLable, that can add extra non standard
  description of the access condition, like "Login mit Studierendenkonto der THL
  benötigt"
- added amb interactivityType

## Differences of v4 to amb 20231019

- learningResourceType preoperty is not used by a Moochub v4 course.
  When converted to amb, the learningResourceType may automatically
  be set to ["https://w3id.org/kim/hcrt/course"].
- amb mainEntityOfPage not used
- amb encoding not used
- amb caption not used
- statt about wird die hochschulfächersystematik und die schulfächersystematik über educationalAlignment angegeben.
