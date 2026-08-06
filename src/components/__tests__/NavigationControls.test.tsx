import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavigationControls } from '@/components/NavigationControls';

const defaultProps = {
  onPrevious: vi.fn(),
  onNext: vi.fn(),
  onGoTo: vi.fn(),
};

describe('NavigationControls', () => {
  it('renders the current index and total count', () => {
    render(<NavigationControls currentIndex={1} totalCount={3} {...defaultProps} />);
    expect(screen.getByText('Rótulo')).toBeInTheDocument();
    expect(screen.getByText('de 3')).toBeInTheDocument();
    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('2');
  });

  it('disables the previous button at the start', () => {
    render(<NavigationControls currentIndex={0} totalCount={3} {...defaultProps} />);
    expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled();
  });

  it('disables the next button at the end', () => {
    render(<NavigationControls currentIndex={2} totalCount={3} {...defaultProps} />);
    expect(screen.getByRole('button', { name: /siguiente/i })).toBeDisabled();
  });

  it('calls onPrevious and onNext when the buttons are clicked', () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    render(
      <NavigationControls
        currentIndex={1}
        totalCount={3}
        {...defaultProps}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /anterior/i }));
    expect(onPrevious).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('renders nothing when there are no items', () => {
    const { container } = render(
      <NavigationControls currentIndex={0} totalCount={0} {...defaultProps} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
