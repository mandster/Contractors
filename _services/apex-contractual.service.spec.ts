import { TestBed } from '@angular/core/testing';

import { ApexContractualService } from './apex-contractual.service';

describe('ApexContractualService', () => {
  let service: ApexContractualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApexContractualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
