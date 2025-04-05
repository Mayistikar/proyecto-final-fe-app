import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage: string = 'es';

  constructor(public translate: TranslateService) {}

  switchLanguage() {
    if (this.currentLanguage === 'en') {
      this.currentLanguage = 'es';
    } else {
      this.currentLanguage = 'en';
    }

    this.translate.use(this.currentLanguage);
  }
}
