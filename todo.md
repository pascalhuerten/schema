- [ ] Check wether person or organization or license schemas can extend amb
      schemas instead of overwriting them. This would allow easier conversion to
      amb.
- [ ] amb isPartOf kann ein Kurs sein aber type lässt nicht etwas wie ein
      Kursprogramm zu. Hier braucht es also eine erweiterung.
- [ ] hastPart könnte auf eine komplette amb LearningRessource erweitert wreden,
      anstatt nur id, type, name zulassen. Moochub hat hier zusätzlich noch
      duration und competencyRequired genannt.
- [ ] amb assesses, teaches, competencyRequired are not on par with moochubs
      skill definition. Misses more information about the framework like ESCO,
      and does not allow to specify an edicationalLevel per skill.
- [ ] Noch fehlende Moochub Werte, die nichts vergleichbares im AMB haben: //
      courseMode, workload, educationalAlignment (similar to amb
      about), educationalLevel, accessMode, contentLocation, offer,
      numberOfCredits, educationalCredentialsAwarded, applicationStartDate,
      applicationDeadline, startDate, endDate, expires, repeatFrequency,
      hollandCode
- [ ] Maybe update license property for better compatability with amb license,
      maybe look at other license implementations. Consider allowing other
      licenses like amb not from spdx, but allow creativecommons and
      opernsource.org urls. Moochub currently suggests to use spdx license urls.
- [ ] Do we need want ambs about property? Hochschulfächer und Schulfächer ist
      nur hilfreich wenn es sich um einen klassicschen Schul/Hochschulkurs
      handelt.
