import { OptionalAuthGuard } from './optional-auth.guard';

describe('OptionalAuthGuard', () => {
  it('should be defined', () => {
    expect(new OptionalAuthGuard()).toBeDefined();
  });
});
