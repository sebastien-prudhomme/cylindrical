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

export { jobColorHelper, jobIconHelper }
