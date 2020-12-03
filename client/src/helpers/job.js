function jobArtifactHelper (job, type) {
  if (job && job.artifacts) {
    const artifactId = `${job.id}/output.${type}`
    const artifact = job.artifacts.find(artifact => artifact.id === artifactId)

    return artifact === undefined ? null : artifact
  } else {
    return null
  }
}

function jobColorHelper (job) {
  switch (job.phase) {
    case 'Error':
      return 'negative'
    case 'Failed':
      return 'negative'
    case 'Omitted':
      return 'blue-grey-7'
    case 'Pending':
      return 'light-blue-6'
    case 'Running':
      return 'light-blue-6'
    case 'Skipped':
      return 'blue-grey-7'
    case 'Succeeded':
      return 'positive'
    default:
      return ''
  }
}

function jobFindingHelper (job, id) {
  const artifact = jobArtifactHelper(job, 'json')

  if (artifact) {
    const json = JSON.parse(artifact.content)
    const finding = json.find(item => item.id === id).finding

    return finding === undefined ? null : finding
  } else {
    return null
  }
}

function jobGradeColorHelper (grade) {
  if (grade[0] === 'A') {
    return 'positive'
  } else if (grade[0] === 'B' || grade[0] === 'C') {
    return 'warning'
  } else {
    return 'negative'
  }
}

function jobIconHelper (job) {
  switch (job.phase) {
    case 'Error':
      return 'fas fa-times-circle'
    case 'Failed':
      return 'fas fa-times-circle'
    case 'Omitted':
      return 'fas fa-clock'
    case 'Pending':
      return 'fas fa-clock'
    case 'Running':
      return 'fas fa-circle-notch'
    case 'Skipped':
      return 'fas fa-clock'
    case 'Succeeded':
      return 'fas fa-check-circle'
    default:
      return ''
  }
}

function jobParameterHelper (job, name) {
  if (job) {
    const parameter = job.parameters.find(parameter => parameter.name === name)

    return parameter === undefined ? null : parameter.value
  } else {
    return null
  }
}

function jobScoreColorHelper (score) {
  if (score >= 80) {
    return 'positive'
  } else if (score >= 50) {
    return 'warning'
  } else {
    return 'negative'
  }
}

export { jobArtifactHelper, jobColorHelper, jobFindingHelper, jobGradeColorHelper, jobIconHelper, jobParameterHelper, jobScoreColorHelper }
