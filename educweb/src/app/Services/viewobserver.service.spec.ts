import { TestBed } from '@angular/core/testing';

import { ViewobserverService } from './viewobserver.service';

describe('ViewobserverService', () => {
  let service: ViewobserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewobserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
