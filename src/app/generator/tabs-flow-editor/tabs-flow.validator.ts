import { Rule, RuleSet } from 'src/app/external-modules/query-builder/query-builder.interfaces';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { AppRuleSet, LinkEdge } from 'src/app/_shared/models/link-edge.model';
import { QueryOperator } from 'src/app/_shared/models/operators-query-builder.enum';
import { FormVersionFull } from 'src/app/_shared/models/form-version.model';
import { AppGridsterItem, Tab } from 'src/app/_shared/models/tab.model';
import { ifStringWithInterpolationBrackets } from 'src/app/_shared/utils/interpolation-brackets.utilits';

export class TabsFlowValidator {
  private currentTab: Tab;
  private questions: AppGridsterItem[] = [];
  private tabIndex: number;

  public checkCorrectLinks(formVersion: FormVersionFull, newLink: LinkEdge) {
    if (!formVersion || !newLink) return;
    console.log('___checkCorrectLinks()');
    let tabLinks: LinkEdge[] = formVersion.flow.links.filter((_link) => _link.source === newLink.source);
    const newLinkIndex = tabLinks.findIndex((_link) => _link.id === newLink.id);
    formVersion.tabs.forEach((tab) => this.questions.push(...tab.questions));
    this.currentTab = formVersion.tabs.filter((tab) => newLink.source.includes(tab.id))[0];
    this.currentTab = JSON.parse(JSON.stringify(this.currentTab));
    this.tabIndex = formVersion.tabs.findIndex((tab) => newLink.source.includes(tab.id));

    if (newLinkIndex > -1) {
      tabLinks.splice(newLinkIndex, 1, newLink);
    } else {
      tabLinks.push(newLink);
    }
 
    console.log('tabLinks: ', tabLinks, this.currentTab, this.tabIndex);
    tabLinks = tabLinks.filter((l) => l.data).filter((_link) => !_link.data.isDefaultStep);
    this.prepareAnswersForTabLinks(tabLinks);
    const correctLinks: LinkEdge[] = tabLinks.filter((link) =>
      this.checkIfRuleSetCorrect(link.data.query.queryRulesSet)
    );
    console.log('RESULT! number of correct links (before reverse answers): ', correctLinks);
    this.prepareAnswersForTabLinks(tabLinks.reverse());
    const reverseCorrectLinks: LinkEdge[] = tabLinks.filter((link) =>
      this.checkIfRuleSetCorrect(link.data.query.queryRulesSet)
    );
    console.log('RESULT! number of correct links (AFter reverse answers): ', reverseCorrectLinks);

    this.currentTab = null;
    this.tabIndex = null;
    return correctLinks.length > reverseCorrectLinks.length ? correctLinks : reverseCorrectLinks;
  }

  private prepareAnswersForTabLinks(tabLinks: LinkEdge[]) {
    tabLinks.forEach((link) => {
      const ruleSet: AppRuleSet = link.data.query.queryRulesSet;
      if (ruleSet) {
        if (ruleSet.condition) {
          this.setAnswers(ruleSet.rules);
        } else if (!ruleSet.condition && ruleSet.rules.length) {
          // when 1 rule
          const rules: Rule[] = ruleSet.rules.filter((r: Rule) => r.field) as Rule[];
          this.setAnswers(rules); // check first rule when no condition
        }
      }
    });
    // TODO multilevel queries
    // console.log('answers: ', this.currentTab.questions);
  }

  private setAnswers(rules) {
    rules.forEach((rule: Rule | RuleSet) => {
      if ((rule as Rule).field) {
        const item = this.questions.filter((q) => q.field.id === (rule as Rule).field)[0];
        item.field.__userAnswer = this.anilyzeRuleAndSetAnswer(rule as Rule);
        // console.log('RULE and answer: ', rule, item.field.__userAnswer);
      } else if ((rule as RuleSet).condition && (rule as RuleSet).rules) {
        this.setAnswers((rule as RuleSet).rules);
      }
    });
  }

  private anilyzeRuleAndSetAnswer(rule: Rule) {
    if (!rule) return;
    switch (rule.operator) {
      case QueryOperator.NOT_IN:
        if (rule.value && Array.isArray(rule.value)) {
          return rule.value.map((val) => val + '+');
        }
        return rule.value;

      case QueryOperator.LESS:
      case QueryOperator.LESS_EQUAL:
        if (rule.value && Number(rule.value)) {
          return Number(rule.value) - 1;
        }
        if (rule.value && Date.parse(rule.value)) {
          return this.setNewDateAnswer(rule.value, false);
        }
        return rule.value;

      case QueryOperator.MORE:
      case QueryOperator.MORE_EQUAL:
        if (rule.value && Number(rule.value)) {
          return Number(rule.value) + 1;
        }
        if (rule.value && Date.parse(rule.value)) {
          return this.setNewDateAnswer(rule.value, true);
        }
        return rule.value;

      case QueryOperator.NOT_EQUAL:
        if (rule.value && Date.parse(rule.value)) {
          return this.setNewDateAnswer(rule.value, true);
        }
        return rule.value + '+';

      default:
        return rule.value;
    }
  }

  private setNewDateAnswer(value: string, plus: boolean) {
    const inputDate = new Date(value);
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth() + 1;
    const days = inputDate.getDate() + (plus ? 1 : -1);
    let newDate = `${year}-${month <= 9 ? '0' + month : month}-${days <= 9 ? '0' + days : days}`;
    return newDate;
  }

  private checkIfRuleSetCorrect(ruleSet: AppRuleSet) {
    if (!ruleSet) return true;
    if (ruleSet.condition) {
      if (ruleSet.condition === 'or') {
        return ruleSet.rules.some((rule) => this.detectIfRuleOrRuleSetAndCheck(rule));
      } else if (ruleSet.condition === 'and') {
        return ruleSet.rules.every((rule) => this.detectIfRuleOrRuleSetAndCheck(rule));
      }
    } else if (!ruleSet.condition && ruleSet.rules.length) {
      // when 1 rule
      const rules: Rule[] = ruleSet.rules.filter((r: Rule) => r.field) as Rule[];
      return this.checkIfRuleIsCorrect(rules[0]); // check first rule when no condition
    } else {
      return true;
    }
  }

  private detectIfRuleOrRuleSetAndCheck(rule: Rule | AppRuleSet) {
    if ((rule as AppRuleSet).condition && (rule as AppRuleSet).rules) {
      return this.checkIfRuleSetCorrect(rule as AppRuleSet);
    } else if ((rule as Rule).field) {
      return this.checkIfRuleIsCorrect(rule as Rule);
    }
  }

  private checkIfRuleIsCorrect(rule: Rule) {
    if (
      !rule ||
      !rule.field ||
      ifStringWithInterpolationBrackets(rule.field) ||
      ifStringWithInterpolationBrackets(rule.value)
    )
      return;
    const field = this.questions.filter((question: AppGridsterItem, i) => question.field.id === rule.field)[0].field;
    const fieldValue = field.__userAnswer;

    console.log(
      'OPERRATOR: ',
      rule.operator,
      rule.field,
      ' fieldValue: ',
      fieldValue,
      ' rule value: ',
      rule.value,
      rule
    );
    if (field.type === FieldTypes.REPEATING_SECTION) {
      return this.operatorsSwitchRepeatingSection(rule, fieldValue);
    }
    switch (rule.operator) {
      case QueryOperator.IN:
        if (typeof fieldValue === 'string' && Array.isArray(rule.value)) {
          return (rule.value as string[]).indexOf(fieldValue as string) > -1;
        } else if (Array.isArray(fieldValue) && Array.isArray(rule.value)) {
          return (rule.value as string[]).some((r) => fieldValue.indexOf(r) > -1);
        }
        return;

      case QueryOperator.NOT_IN:
        if (typeof fieldValue === 'string' && Array.isArray(rule.value)) {
          return (rule.value as string[]).indexOf(fieldValue as string) === -1;
        } else if (Array.isArray(fieldValue) && Array.isArray(rule.value)) {
          return !(rule.value as string[]).some((r) => fieldValue.indexOf(r) > -1);
        }
        return;

      case QueryOperator.LESS:
        if (field.type === FieldTypes.DATEPICKER) {
          return Date.parse(rule.value) && Date.parse(fieldValue as string)
            ? new Date(rule.value) > new Date(fieldValue as string)
            : null;
        }
        return Number(fieldValue) < rule.value;

      case QueryOperator.MORE:
        if (field.type === FieldTypes.DATEPICKER) {
          return Date.parse(rule.value) && Date.parse(fieldValue as string)
            ? new Date(rule.value) < new Date(fieldValue as string)
            : null;
        }
        return Number(fieldValue) > rule.value;

      case QueryOperator.MORE_EQUAL:
        if (field.type === FieldTypes.DATEPICKER) {
          return Date.parse(rule.value) && Date.parse(fieldValue as string)
            ? new Date(rule.value) <= new Date(fieldValue as string)
            : null;
        }
        return Number(fieldValue) >= rule.value;

      case QueryOperator.LESS_EQUAL:
        if (field.type === FieldTypes.DATEPICKER) {
          return Date.parse(rule.value) && Date.parse(fieldValue as string)
            ? new Date(rule.value) >= new Date(fieldValue as string)
            : null;
        }
        return Number(fieldValue) <= rule.value;

      case QueryOperator.CONTAINS:
        return (fieldValue as string[])
          .toString()
          .toLocaleLowerCase()
          .includes(rule.value?.toString().toLocaleLowerCase());

      case QueryOperator.EQUAL:
        return rule.value?.toString().toLocaleLowerCase() === fieldValue?.toString().toLocaleLowerCase();

      case QueryOperator.NOT_EQUAL:
        return rule.value?.toString().toLocaleLowerCase() !== fieldValue?.toString().toLocaleLowerCase();

      default:
        break;
    }
  }

  private operatorsSwitchRepeatingSection(rule: Rule, fieldValue) {
    switch (rule.operator) {
      case '=':
        return Number(fieldValue) === rule.value;
      case '<':
        return Number(fieldValue) < rule.value;
      case '>':
        return Number(fieldValue) > rule.value;
      case '>=':
        return Number(fieldValue) >= rule.value;
      case '<=':
        return Number(fieldValue) <= rule.value;
      default:
        return;
    }
  }
}
