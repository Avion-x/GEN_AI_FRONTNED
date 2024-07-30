import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigFilesDetailsComponent } from './config-files-details.component';

describe('ConfigFilesDetailsComponent', () => {
  let component: ConfigFilesDetailsComponent;
  let fixture: ComponentFixture<ConfigFilesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigFilesDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigFilesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
