import { render } from '@testing-library/react';

import Calendars from './calendars';

describe('Calendars', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Calendars />);
    expect(baseElement).toBeTruthy();
  });
});
