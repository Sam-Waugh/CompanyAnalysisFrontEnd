import { TestBed } from '@angular/core/testing';
import { ChatbotPerplexityService } from './chatbot-perplexity.service';

describe('ChatbotPerplexityService', () => {
  let service: ChatbotPerplexityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatbotPerplexityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
