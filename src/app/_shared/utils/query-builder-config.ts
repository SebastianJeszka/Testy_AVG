import { QuestionField } from '../models/question-field.model';
import { OptionItem } from '../models/option.model';
import { AppGridsterItem, Tab } from '../models/tab.model';
import { FieldTypes } from '../models/field-types.enum';
import { QueryBuilderConfig, Option } from 'src/app/external-modules/query-builder/query-builder.interfaces';

export function buildQueryBuilderConfig(tabs: Tab[]): QueryBuilderConfig {
  const listQuestionsForBuilder = {};
  tabs.forEach((tab: Tab, loopIxPage: number) => {
    tab.questions.forEach((gridsterItem: AppGridsterItem, fieldIndex: number) => {
      const field: QuestionField = gridsterItem.field;
      const fieldConfig = addFieldObject(field, tab.title);
      if (fieldConfig) {
        listQuestionsForBuilder[gridsterItem.field.id] = fieldConfig;
      }
    });
  });
  return {
    fields: listQuestionsForBuilder
  };
}

const transformChildren: (t: OptionItem[]) => Option[] = (items: OptionItem[]) => {
  return items.map((item: OptionItem) => {
    const tOpt: Option = {
      name: item.name,
      value: item.id,
      children: item.children?.length ? transformChildren(item.children) : null
    };
    return tOpt;
  });
};

const addFieldObject = (field: QuestionField, tabName: string) => {
  if (field.type === FieldTypes.RADIO || field.type === FieldTypes.SELECT || field.type === FieldTypes.CHECKBOX) {
    const options = field.options.map((opt: OptionItem) => {
      return {
        name: opt.name,
        value: opt.id,
        children: opt.children?.length > 0 ? transformChildren(opt.children) : null
      };
    });
    return {
      name: field.techName,
      type: field.multiLevelTree ? 'multilevel' : 'category',
      operators: !field.multiple && field.type !== FieldTypes.CHECKBOX ? ['=', '!='] : ['=', '!=', 'in', 'not in'],
      options,
      tabName,
      defaultValue: !field.multiLevelTree ? () => options[0].value : null
    };
  } else if (field.type === FieldTypes.TEXT_FIELD || field.type === FieldTypes.TEXTAREA) {
    return { name: field.techName, type: 'string', operators: ['=', '!=', 'contains'], tabName, nullable: true };
  } else if (field.type === FieldTypes.DATEPICKER) {
    return {
      name: field.techName,
      type: 'date',
      tabName,
      operators: ['=', '!=', '<=', '>=', '<', '>'],
      defaultValue: () => new Date()
    };
  } else if (field.type === FieldTypes.NUMBER) {
    return { name: field.techName, type: 'number', tabName };
  } else if (field.type === FieldTypes.REPEATING_SECTION) {
    return { name: field.techName, type: 'number', operators: ['=', '<=', '>=', '<', '>'], tabName };
  } else {
    // TODO another types here if needed to be in query builder
    return null;
  }
};
