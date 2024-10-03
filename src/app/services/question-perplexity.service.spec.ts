import { TestBed } from '@angular/core/testing';

import { QuestionPerplexityService } from './question-perplexity.service';

describe('QuestionPerplexityService', () => {
  let service: QuestionPerplexityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionPerplexityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
