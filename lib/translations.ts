export const translations = (formT: any, optionsT: any) => ({
  labels: {
    title: formT("title"),
    wage: formT("wage"),
    city: formT("city"),
    stateAbbreviation: formT("state"),
    type: formT("type"),
    experienceLevel: formT("experienceLevel"),
    locationRequirement: formT("locationRequirement"),
    description: formT("description"),
  },
  descriptions: {
    description: formT("description"),
  },
  options: {
    wageIntervals: {
      yearly: optionsT("wageIntervals.yearly"),
      hourly: optionsT("wageIntervals.hourly"),
      monthly: optionsT("wageIntervals.monthly"),
    },
    locationRequirements: {
      "in-office": optionsT("locationRequirements.inOffice"),
      remote: optionsT("locationRequirements.remote"),
      hybrid: optionsT("locationRequirements.hybrid"),
    },
    jobTypes: {
      "full-time": optionsT("jobTypes.fullTime"),
      "part-time": optionsT("jobTypes.partTime"),
      internship: optionsT("jobTypes.internship"),
      contract: optionsT("jobTypes.contract"),
      freelance: optionsT("jobTypes.freelance"),
    },
    experienceLevels: {
      junior: optionsT("experienceLevels.junior"),
      mid: optionsT("experienceLevels.mid"),
      senior: optionsT("experienceLevels.senior"),
      lead: optionsT("experienceLevels.lead"),
      manager: optionsT("experienceLevels.manager"),
      ceo: optionsT("experienceLevels.ceo"),
      director: optionsT("experienceLevels.director"),
    },
  },
  buttons: {
    submit: formT("buttonText"),
    submitting: formT("creatingText"),
  },
});
