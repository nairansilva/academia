import { TestBed } from '@angular/core/testing';

import { TreinosService } from './treinos.service';

describe('TreinosService', () => {
  let service: TreinosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreinosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
