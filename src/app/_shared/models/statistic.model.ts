export class StatisticDataDto {
  id: number;
  name: string;
  statisticData: StatisticData[] = [];
}

export class StatisticData {
  name: string;
  value: number;
  series: StatisticDataSerie[];
}

export class StatisticDataSerie {
  name: string;
  value: number;

  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }
}

export class StatisticOptions {
  questionFieldId: string;
  pageTitle: string;
  fieldTitle: string;
}

export class StatisticFormDto {
  statisticForm: StatisticForm[] = [];
}

export class StatisticForm {
  id: number;
  name: string;
  leftGroupingQuestionFieldId: string;
  rightGroupingQuestionFieldId: string;

  constructor(id: number) {
    this.id = id;
  }
}
