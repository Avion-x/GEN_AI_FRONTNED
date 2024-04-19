import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitConfigComponent } from './git-config.component';

describe('GitConfigComponent', () => {
  let component: GitConfigComponent;
  let fixture: ComponentFixture<GitConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GitConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GitConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
