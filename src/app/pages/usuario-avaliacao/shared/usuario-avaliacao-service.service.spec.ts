import { TestBed } from '@angular/core/testing';

import { UsuarioAvaliacaoServiceService } from './usuario-avaliacao-service.service';

describe('UsuarioAvaliacaoServiceService', () => {
  let service: UsuarioAvaliacaoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioAvaliacaoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
