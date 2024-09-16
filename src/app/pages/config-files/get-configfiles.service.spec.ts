import { TestBed } from '@angular/core/testing';

import { GetConfigfilesService } from './get-configfiles.service';

describe('GetConfigfilesService', () => {
  let service: GetConfigfilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetConfigfilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
