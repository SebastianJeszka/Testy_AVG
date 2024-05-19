import { FormVersionFull } from '../models/form-version.model';
import { AppGridsterItem, Tab } from '../models/tab.model';
import { getRandomNumber } from './random-number.utilits';

export function getTemporaryId(currentFormVersion: FormVersionFull) {
  const newId = 'temporary_' + getRandomNumber(10000000);

  if (!currentFormVersion) {
    return newId;
  }

  currentFormVersion.tabs.forEach((tab: Tab) => {
    if (tab.questions.some((question: AppGridsterItem) => question.field.id === newId)) {
      return getTemporaryId(currentFormVersion);
    }
  });

  currentFormVersion.flow.nodes.forEach((node) => {
    if (node.id === newId) {
      return getTemporaryId(currentFormVersion);
    }
  });
  
  return newId;
}
