import { Edge, NodePosition } from '@swimlane/ngx-graph';
import { Rule, RuleSet } from 'src/app/external-modules/query-builder/query-builder.interfaces';

export class LinkEdge implements Edge {
  id?: string;
  source: string;
  target: string;
  label?: string;
  data?: LinkData;
  points?: any;
  line?: string;
  textTransform?: string;
  textAngle?: number;
  oldLine?: any;
  oldTextPath?: string;
  textPath?: string;
  midPoint?: NodePosition;

  constructor() {
    this.data = new LinkData();
  }
}

export class LinkData {
  query: LinksQuery = new LinksQuery();
  isDefaultStep: boolean = false;
}

export class LinksQuery {
  queryName: string = '';
  queryRulesSet: AppRuleSet = new AppRuleSet();
}

export class AppRuleSet implements RuleSet {
  condition: string = 'and';
  rules: Array<RuleSet | Rule> = [];
}
