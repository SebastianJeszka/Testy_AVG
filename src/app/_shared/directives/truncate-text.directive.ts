import { Directive, OnInit, ViewContainerRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[truncate][showMore][maxLength]'
})
export class TruncateTextDirective implements OnInit {
  @Input() showMore: boolean = true; // can also like a input for text for btn
  @Input() maxLength: number = null;
  @Input() showMoreAfter: boolean = false; // show btn "show more" after element, on next line/row

  private _element;
  private _fullText: string = '';
  private _showedText: string = '';
  private _showMoreText = 'przeczytaj całość  ';
  private _showLessText = 'zwiń  ';
  private _showMoreButton = null;
  private _ifShowedText: boolean = false;
  private _setupedListener: boolean = false;

  constructor(private viewContainerRef: ViewContainerRef, private renderer: Renderer2) {}

  ngOnInit() {
    setTimeout(() => {
      this._element = this.viewContainerRef.element.nativeElement;
      this._fullText = this._element.innerHTML;
      this.generateBtn();
      this.truncateText();
    });
  }

  truncateText() {
    if (this.maxLength && this._fullText.length > this.maxLength) {
      this.addTruncatedText();
    }
  }

  prepareTruncatedText() {
    const maxLengthString = this._fullText.valueOf().slice(0, this.maxLength);
    let text = maxLengthString.slice(0, maxLengthString.lastIndexOf(' '));
    return text + '...';
  }

  generateBtn() {
    if (this.showMore) {
      this._showMoreButton = this.renderer.createElement('a');
    }
  }

  addTruncatedText() {
    this._element.innerHTML = '';
    const showText = this._ifShowedText ? this._fullText : this.prepareTruncatedText();

    this._showedText = showText;

    this._element.innerHTML = this._showedText;
    this.addShowMoreBtn();
  }

  addShowMoreBtn() {
    if (this.showMore) {
      this._showMoreButton.innerHTML = '';
      this.renderer.appendChild(
        this._showMoreButton,
        this.renderer.createText(this._ifShowedText ? this._showLessText : this._showMoreText)
      );
      this.renderer.addClass(this._showMoreButton, 'btn-show-more');
      this.renderer.addClass(this._showMoreButton, 'btn-link');

      // styles
      if (this.showMoreAfter) {
        this.renderer.setStyle(this._showMoreButton, 'display', 'block');
      }

      this.renderer.setStyle(this._showMoreButton, 'max-width', this._ifShowedText ? '80px' : '150px');

      // listner
      if (!this._setupedListener) {
        this._setupedListener = true;
        this.renderer.listen(this._showMoreButton, 'click', (e) => this.onShowMore(e));
      }
      this.renderer.appendChild(this._showMoreButton, this.IconElement);
      this.renderer.appendChild(this._element, this._showMoreButton);
    }
  }

  get IconElement() {
    const el = this.renderer.createElement('i');
    this.renderer.addClass(el, 'gov-icon');
    this.renderer.addClass(el, this._ifShowedText ? 'gov-icon--arrow-up' : 'gov-icon--arrow-down');
    return el;
  }

  onShowMore(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this._ifShowedText = !this._ifShowedText;

    this.addTruncatedText();
  }
}
