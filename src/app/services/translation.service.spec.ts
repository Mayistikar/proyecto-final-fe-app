import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';
import { TranslateService } from '@ngx-translate/core';

describe('TranslationService', () => {
  let service: TranslationService;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TranslateService', ['use']);
    TestBed.configureTestingModule({
      providers: [
        TranslationService,
        { provide: TranslateService, useValue: spy }
      ]
    });
    service = TestBed.inject(TranslationService);
    translateServiceSpy = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
  });

  it('should be created with default language es', () => {
    expect(service).toBeTruthy();
    // default language is set to 'es', and no language switch occurs at creation
    service.switchLanguage(); // switch from 'es' to 'en'
    expect(translateServiceSpy.use).toHaveBeenCalledWith('en');
  });

  it('should toggle language correctly', () => {
    // Initially currentLanguage is 'es'
    service.switchLanguage(); // toggles to 'en'
    expect(translateServiceSpy.use).toHaveBeenCalledWith('en');
    service.switchLanguage(); // toggles back to 'es'
    expect(translateServiceSpy.use).toHaveBeenCalledWith('es');
  });
});
