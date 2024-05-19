import { Rule, RuleSet } from 'src/app/external-modules/query-builder/query-builder.interfaces';
import { GraphNode } from 'src/app/_shared/models/graph-node.model';
import { AppRuleSet, LinkEdge } from 'src/app/_shared/models/link-edge.model';
import { AppGridsterItem, Tab } from 'src/app/_shared/models/tab.model';
import { getOriginalTabIdFromNode } from './tabs-flow-graph.controller';
import { TabsFlowComponent } from './tabs-flow.component';

export class GraphTooltipController {
  constructor(private c: TabsFlowComponent) {}

  setLinkTooltipContent(link: LinkEdge) {
    let queries;
    if (link.data?.query && link.data.query.queryRulesSet) {
      queries = this.prepareQuerySentences(link.data.query.queryRulesSet);
    }
    return `${link.data?.query?.queryName} ${queries ? 'Warunki: \n' + queries : ''}`;
  }

  prepareQuerySentences(ruleSet: AppRuleSet) {
    if (!ruleSet) return;
    if (ruleSet.condition) {
      return this.printListOfRules(ruleSet.rules, ruleSet.condition);
    } else if (!ruleSet.condition && ruleSet.rules.length) {
      // when 1 rule
      const rules: Rule[] = ruleSet.rules.filter((r: Rule) => r.field) as Rule[];
      return this.printOneRule(rules[0]); // check first rule when no condition
    }
  }

  printListOfRules(rules: (RuleSet | Rule)[], condition: string) {
    let listString = '';
    rules.forEach((rule: AppRuleSet | Rule, index) => {
      if ((rule as AppRuleSet).condition && (rule as AppRuleSet).rules) {
        listString += this.printListOfRules((rule as AppRuleSet).rules, condition);
      } else if ((rule as Rule).field) {
        listString +=
          `${this.printOneRule(rule as Rule)} \n` +
          `${index !== rules.length - 1 ? condition.toLowerCase() + '\n' : ''} `;
      }
    });
    return listString;
  }

  printOneRule(rule: Rule) {
    let fieldName = rule.field;
    let tabName = '';
    if (this.c.currentQueryConfig) {
      Object.keys(this.c.currentQueryConfig.fields).forEach((key) => {
        if (rule.field === key) {
          fieldName = this.c.currentQueryConfig.fields[key].name;
          tabName = this.c.currentQueryConfig.fields[key].tabName;
        }
      });
    }
    return `"${tabName}" ${fieldName} ${rule.operator} ${rule.value}`;
  }

  setNodeTooltipContent(node: GraphNode) {
    if (node.hiddenFields?.length) {
      const nodeId = getOriginalTabIdFromNode(node);
      const fieldsNames = this.c.formVersion.tabs
        .find((tab: Tab) => tab.id === nodeId)
        ?.questions.filter((item: AppGridsterItem) => node.hiddenFields.includes(item.field.id))
        .map((item: AppGridsterItem) => ` - ${item.field.techName}`)
        .join('\r\n');
      return `${node.label} \n Ukryte pola: \n ${fieldsNames}`;
    }
    return node.label;
  }
}
