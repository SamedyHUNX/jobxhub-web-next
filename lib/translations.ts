export const translations = (formT: any) => ({
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
      yearly: formT("options.wageIntervals.yearly"),
      hourly: formT("options.wageIntervals.hourly"),
      monthly: formT("options.wageIntervals.monthly"),
    },
    locationRequirements: {
      "in-office": formT("options.locationRequirements.inOffice"),
      remote: formT("options.locationRequirements.remote"),
      hybrid: formT("options.locationRequirements.hybrid"),
    },
    jobTypes: {
      "full-time": formT("options.jobTypes.fullTime"),
      "part-time": formT("options.jobTypes.partTime"),
      internship: formT("options.jobTypes.internship"),
      contract: formT("options.jobTypes.contract"),
      freelance: formT("options.jobTypes.freelance"),
    },
    experienceLevels: {
      junior: formT("options.experienceLevels.junior"),
      mid: formT("options.experienceLevels.mid"),
      senior: formT("options.experienceLevels.senior"),
      lead: formT("options.experienceLevels.lead"),
      manager: formT("options.experienceLevels.manager"),
      ceo: formT("options.experienceLevels.ceo"),
      director: formT("options.experienceLevels.director"),
    },
  },
  buttons: {
    update: formT("buttons.updateText"),
    submit: formT("buttons.submitText"),
    submitting: formT("buttons.submittingText"),
  },
});
