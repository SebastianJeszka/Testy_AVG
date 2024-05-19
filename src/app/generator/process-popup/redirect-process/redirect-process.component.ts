import { Component, Input, OnInit } from '@angular/core';
import { AppProcess, RedirectType } from 'src/app/_shared/models/process-of-node.model';
import { getProtocolFromUrl, getUrlWithoutProtocol } from 'src/app/_shared/utils/link-url.utilits';
import { FormService } from '../../../_shared/services/form.service';
import { List } from '../../../_shared/models/list.model';
import { Form } from '../../../_shared/models/form.model';

@Component({
  selector: 'redirect-process',
  templateUrl: './redirect-process.component.html'
})
export class RedirectProcessComponent implements OnInit {
  @Input() process: AppProcess = null;
  @Input() processExecuteTime: 'before' | 'after' = null;
  @Input() disableState: boolean = false;

  protocolsList: string[] = ['http://', 'https://'];
  protocolOfRedirectUrl: string = '';
  redirectUrl: string = '';
  redirectType: RedirectType;
  redirectTypeEnum = RedirectType;
  forms: Form[];
  formId: string;

  constructor(private formService: FormService) {}

  ngOnInit(): void {
    this.initRedirectProcValues();
    this.formService.getFormsList().subscribe((formList: List<Form>) => {
      this.forms = formList.items;
      if (this.process.redirectProcessData.formId) {
        this.redirectType = RedirectType.INTERNAL;
        this.formId = this.process.redirectProcessData.formId;
      } else {
        this.redirectType = RedirectType.EXTERNAL;
      }
    });
  }

  initRedirectProcValues() {
    if (this.process.redirectProcessData?.urlForRedirect) {
      this.protocolOfRedirectUrl = getProtocolFromUrl(this.process.redirectProcessData.urlForRedirect);
      this.redirectUrl = getUrlWithoutProtocol(this.process.redirectProcessData.urlForRedirect);
    }
  }

  onChangeUrl() {
    this.process.redirectProcessData.urlForRedirect = this.protocolOfRedirectUrl + this.redirectUrl;
  }

  onChangeForm() {
    this.process.redirectProcessData.formId = this.formId;
  }

  onPasteRedirectUrl(e: ClipboardEvent) {
    const pastedUrl = (e.clipboardData || (window as any).clipboardData).getData('text');
    this.protocolOfRedirectUrl = getProtocolFromUrl(pastedUrl);
    this.redirectUrl = null;
    setTimeout(() => (this.redirectUrl = getUrlWithoutProtocol(pastedUrl)));
  }
}
