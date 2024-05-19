import { getItemByTestId } from 'cypress/utils';

export class FetchResultsPopup {
  private _fetchResultsFileName: string;

  public get fetchResultsFileName(): string {
    return this._fetchResultsFileName;
  }
  public set fetchResultsFileName(value: string) {
    this._fetchResultsFileName = value;
  }

  getHeader() {
    return getItemByTestId('fetchResultsHeader');
  }

  getEnableSendingResultsButton() {
    return getItemByTestId('enableSendingResultsButton');
  }

  getPopupCloseButton() {
    return getItemByTestId('fetchResultsClosePopupButton');
  }

  getForAllCheckbox() {
    return cy.get('label[for=dateFromNow]');
  }

  getFetchResultsMenuItem() {
    return getItemByTestId('fetchResultsMenuItem');
  }

  getDownloadButton() {
    return getItemByTestId('fetchResultsDownloadButton');
  }

  getFormattedInputDateValue(date: Date) {
    return date.toLocaleDateString('en-GB');
  }

  getFormattedDateYesterday() {
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    this.setFormattedResultsFetchFileName(yesterday, today);
    return this.getFormattedInputDateValue(yesterday);
  }

  getFormattedDateNow() {
    const dateFrom = new Date();
    this.setFormattedResultsFetchFileName(dateFrom, dateFrom);
    return this.getFormattedInputDateValue(dateFrom);
  }

  getDownloadedFetchResultsFileName() {
    return this.fetchResultsFileName;
  }

  getMinDateInput() {
    return cy.get('#minDate');
  }

  getMaxDateInput() {
    return cy.get('#maxDate');
  }

  getMinDateValidationErrorInfo() {
    return cy.get('#minDate-describedby');
  }

  getMaxDateValidationErrorInfo() {
    return cy.get('#maxDate-describedby');
  }

  setFormattedResultsFetchFileName(fromDate: Date, toDate?: Date) {
    const reportFrom = fromDate.toLocaleDateString('en-GB'); //.replaceAll('/', '-');
    const reportTo = toDate && toDate.toLocaleDateString('en-GB'); //.replaceAll('/', '-');

    const localeDateInfo = fromDate.toLocaleString('en-GB');
    const dateArrInfo = localeDateInfo.split(',');
    const timeArrInfo = dateArrInfo[1].split(':');

    const formattedDate = dateArrInfo[0];//.replaceAll('/', '-');
    const formattedTime = `${timeArrInfo[0].trim()}_${timeArrInfo[1]}`;

    this.fetchResultsFileName = reportTo
      ? `wyniki-${formattedDate}T${formattedTime}od${reportFrom}do${reportTo}.csv`
      : `wyniki-${formattedDate}T${formattedTime}.csv`;
  }
}
